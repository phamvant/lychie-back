import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ProductService } from "src/product/product.service";

@Injectable()
export class DiscountService {
  constructor(
    private prismaService: PrismaService,
    private productService: ProductService
  ) {}

  async getAllDiscount() {
    const discounts = await this.prismaService.discount.findMany();
    return discounts;
  }

  async activeDiscount(discountCode: string) {
    const discount = await this.prismaService.discount.findUnique({
      where: {
        discountCode: discountCode,
      },
    });
    console.log("Active");

    if (discount.discountIsApplyAll) {
      this.productService.applyDiscountForAllProducts(
        discount.discountType,
        discount.discountAmount
      );
    }

    await this.prismaService.discount.update({
      where: {
        discountCode: discountCode,
      },
      data: {
        discountIsActive: true,
      },
    });
    console.log("Active");

    return true;
  }

  async deactiveDiscount(discountCode: string) {
    const discount = await this.prismaService.discount.findUnique({
      where: {
        discountCode: discountCode,
      },
    });

    console.log("Deactive");

    if (discount.discountIsApplyAll) {
      this.productService.removeDiscountForAllProducts();
    }

    await this.prismaService.discount.update({
      where: {
        discountCode: discountCode,
      },
      data: {
        discountIsActive: false,
      },
    });
    console.log("Deactive");

    return true;
  }

  async modifyDiscountAmount(discountCode: string, discountAmount) {
    const discount = await this.prismaService.discount.findUnique({
      where: {
        discountCode: discountCode,
      },
    });

    if (!discount) {
      throw new NotFoundException("Discount not found");
    }

    const updatedDiscount = await this.prismaService.discount.update({
      where: {
        discountCode: discountCode,
      },
      data: {
        discountAmount: discountAmount,
      },
    });

    return { updatedDiscount };
  }
}
