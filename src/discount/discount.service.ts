import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class DiscountService {
  constructor(private prismaService: PrismaService) {}

  async getAllDiscount() {
    const discounts = await this.prismaService.discount.findMany();
    return discounts;
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
