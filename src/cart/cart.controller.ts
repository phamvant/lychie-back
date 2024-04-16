import { Body, Controller, Post } from "@nestjs/common";
import { AddProductToCardDto } from "./cart.dto";
import { CartService } from "./cart.service";

@Controller("cart")
export class CartController {
  constructor(private cartService: CartService) {}

  // @UseGuards(JwtGuard)
  @Post("add")
  async addProductToCart(@Body() product: AddProductToCardDto) {
    return await this.cartService.addProductToCart(product);
  }
}
