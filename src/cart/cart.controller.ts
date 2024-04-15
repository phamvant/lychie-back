import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { AddProductToCardDto } from "./cart.dto";

@Controller("cart")
export class CartController {
  @UseGuards(JwtGuard)
  @Post("add/:productId")
  async addProductToCart(@Body() product: AddProductToCardDto) {}
}
