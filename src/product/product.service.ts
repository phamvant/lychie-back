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
    private prismaService: PrismaService,
    private userService: UserService,
    private cartService: CartService,
    private s3Service: S3BucketService
  ) {}

  // async onModuleInit() {
  //   // this.test();
  // }

  async getProductByPage(page: number, size = 12) {
    console.log(page);
    const products = await this.prismaService.product.findMany({
      skip: page * size,
      take: size,
    });

    return products;
  }

  async findProductByName(productName: string) {
    const product = await this.prismaService.product.findFirst({
      where: {
        productName: productName,
      },
    });

    return product;
  }

  async createProduct(dto: CreateProductDto, req: Request) {
    const newProduct = await this.prismaService.product.create({
      data: dto,
    });

    await this.userService.updateUserProductAmount(
      req["user"]["sub"]["username"]
    );

    return newProduct.productName;
  }

  async getAllProduct() {
    const products = await this.prismaService.product.findMany();

    return products;
  }

  async getProductById(productId: string) {
    const product = await this.prismaService.product.findFirst({
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

    await this.prismaService.product.update({
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

    const deletedProduct = await this.prismaService.product.delete({
      where: { productId: productId },
    });

    return { deletedProduct };
  }

  calculateFinalPrice = (productPrice, discountType, discountAmount) => {
    let finalPrice = productPrice;
    if (discountType === "percentage") {
      finalPrice -= (productPrice * discountAmount) / 100;
    } else if (discountType === "fixed") {
      finalPrice -= discountAmount;
    }
    return finalPrice;
  };

  async applyDiscountForAllProducts(
    productDiscountType,
    productDiscountAmount
  ) {
    const products = await this.prismaService.product.findMany({
      select: {
        productFinalPrice: true,
        productDiscountType: true,
        productPrice: true,
        productDiscountAmount: true,
        productCode: true,
      },
    });

    for (const product of products) {
      let finalPrice = this.calculateFinalPrice(
        product.productPrice,
        productDiscountType,
        productDiscountAmount
      );

      await this.prismaService.product.update({
        where: {
          productCode: product.productCode,
        },
        data: {
          productDiscountType: productDiscountType,
          productDiscountAmount: productDiscountAmount,
          productFinalPrice: finalPrice,
        },
      });
    }
  }

  async removeDiscountForAllProducts() {
    const products = await this.prismaService.product.findMany({
      select: {
        productPrice: true,
        productCode: true,
      },
    });

    for (const product of products) {
      await this.prismaService.product.update({
        where: {
          productCode: product.productCode,
        },
        data: {
          productFinalPrice: product.productPrice,
          productDiscountAmount: 0,
          productDiscountType: "",
        },
      });
    }
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

  // async test() {
  //   const array = await this.prismaService.product.findMany({
  //     where: {},
  //     select: {
  //       productImages: true,
  //     },
  //   });

  //   for (const arr of array) {
  //     const data = arr.productImages.map((value) => value + ".jpg");
  //     let a = await this.prismaService.product.updateMany({
  //       where: {
  //         productImages: {
  //           has: arr.productImages[0],
  //         },
  //       },
  //       data: {
  //         productImages: data,
  //       },
  //     });
  //   }
  // }
}
