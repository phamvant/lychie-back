import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AddProductToCardDto } from "./cart.dto";

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

  async addProductToCart(newProduct: AddProductToCardDto) {
    const newCartProduct = await this.prismaService.cartProduct.create({
      data: { cartCartId: "661e9520d5c458cbcfcf3117", ...newProduct },
    });

    return newCartProduct;
  }
}
