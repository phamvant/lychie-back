import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CartService } from "src/cart/cart.service";
import { PrismaService } from "src/prisma/prisma.service";
import { S3BucketService } from "src/s3/s3.service";
import { UserService } from "src/user/user.service";
import { CreateProductDto } from "./dto/product.dto";

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private cartService: CartService,
    private s3Service: S3BucketService
  ) {}

  async findProductByName(productName: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        productName: productName,
      },
    });

    return product;
  }

  async createProduct(dto: CreateProductDto, req: Request) {
    const newProduct = await this.prisma.product.create({
      data: dto,
    });

    await this.userService.updateUserProductAmount(
      req["user"]["sub"]["username"]
    );

    return newProduct.productName;
  }

  async getAllProduct() {
    const products = await this.prisma.product.findMany();

    return products;
  }

  async getProductById(productId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        productId: productId,
      },
    });
    return product;
  }

  async modifyProduct(productId: string, updateValue: Record<string, any>) {
    const product = await this.getProductById(productId);

    if (!product) {
      throw new BadRequestException();
    }

    const updateData: any = {};
    for (const key in updateValue) {
      if (product.hasOwnProperty(key)) {
        updateData[key] = updateValue[key];
      }
    }

    await this.prisma.product.update({
      where: {
        productId: productId,
      },
      data: updateData,
    });

    return updateValue;
  }

  async deleteProduct({ productId }: { productId: string }) {
    const product = await this.getProductById(productId);

    if (!product) {
      throw new NotFoundException("No product found");
    }

    const isProductInCart =
      await this.cartService.findProductInCartById(productId);

    if (isProductInCart) {
      throw new BadRequestException("Product in cart");
    }

    const deletedImages = this.s3Service.deleteImageFolder(product.productCode);

    if (!deletedImages) {
      throw new BadRequestException("Cant delete s3 image");
    }

    const deletedProduct = await this.prisma.product.delete({
      where: { productId: productId },
    });

    return { deletedProduct };
  }

  // async updateProductImage(files) {
  //   for (let i = 0; i < files.length; i++) {
  //     if (files[i].originalname !== "blob") {
  //       let filePath = `uploads/${files[i].originalname}`; // Assuming 'uploads' directory exists
  //       await fs.promises.writeFile(filePath, files[i].buffer); // Use promises for async
  //       console.log("Image saved:", filePath);
  //     }
  //   }
  //   return "Updated";
  // }
}
