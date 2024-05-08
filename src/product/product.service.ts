import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
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
    private s3Service: S3BucketService,
    private userService: UserService,
    private cartService: CartService
  ) {}

  async checkIfProductBelong(productId: string, userId: string) {
    const product = this.prismaService.product.findUnique({
      where: {
        productId: productId,
        productShopId: userId,
      },
    });

    return product;
  }

  async getProductByPage(page: number, userId: string, size = 8) {
    if (!page) {
      throw new BadRequestException();
    }

    const products = await this.prismaService.product.findMany({
      where: {
        productShopId: userId,
      },
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

  async createProduct(dto: CreateProductDto, userId: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updateData = { productShopId: user.userId, ...dto };

    const newProduct = await this.prismaService.product.create({
      data: updateData,
    });

    const updatedAmount = await this.userService.updateUserProductAmount(
      user.userUsername
    );

    return newProduct.productName;
  }

  async getAllProduct(userId: string) {
    const products = await this.prismaService.product.findMany({
      where: {
        productShopId: userId,
      },
    });

    return products;
  }

  async getProductById(productId: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        productId: productId,
      },
    });

    return product;
  }

  async getUserProductById(productId: string, userId: string) {
    const product = await this.getProductById(productId);

    if (!product) {
      throw new NotFoundException();
    }

    //TODO Security
    if (product.productShopId != userId) {
      throw new NotFoundException();
    }

    return product;
  }

  async modifyProduct(
    productId: string,
    updateValue: Record<string, any>,
    userId: string
  ) {
    const product = await this.getUserProductById(productId, userId);

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

  async deleteProduct(productId: string, userId: string) {
    const product = await this.getUserProductById(productId, userId);

    if (!product) {
      throw new NotFoundException("No product found");
    }

    const isProductInCart = await this.cartService.findProductInCartById(
      productId,
      userId
    );

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
        productId: true,
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
          productId: product.productId,
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
        productId: true,
      },
    });

    for (const product of products) {
      await this.prismaService.product.update({
        where: {
          productId: product.productId,
        },
        data: {
          productFinalPrice: product.productPrice,
          productDiscountAmount: 0,
          productDiscountType: "",
        },
      });
    }
  }

  async deleteProductImage(
    productId: string,
    imageLink: string,
    userId: string
  ) {
    const product = await this.getUserProductById(productId, userId);

    if (!product) {
      throw new NotFoundException();
    }

    const newImageArray = product.productImages.filter(
      (image) => image != imageLink
    );

    const deletedImage = await this.prismaService.product.update({
      where: {
        productId: productId,
      },
      data: {
        productImages: newImageArray,
      },
    });

    return deletedImage;
  }
}
