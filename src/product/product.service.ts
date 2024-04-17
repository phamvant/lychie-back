import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { CreateProductDto } from "./dto/product.dto";

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
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
