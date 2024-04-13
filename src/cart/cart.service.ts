import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AddProductToCardDto } from "./cart.dto";

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

  async addProductToCart(newPoduct: AddProductToCardDto) {}
}
