import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { AddProductToCardDto, ChangeCartProductAmountDto } from "./cart.dto";
import { CartService } from "./cart.service";

@Controller("cart")
export class CartController {
  constructor(private cartService: CartService) {}

  // @UseGuards(JwtGuard)
  @Get("")
  async getAllCartProduct() {
    return await this.cartService.getAllCartProduct();
  }

  @UseGuards(JwtGuard)
  @Post("add")
  async addProductToCart(@Body() product: AddProductToCardDto) {
    return await this.cartService.addProductToCart(product);
  }

  // @UseGuards(JwtGuard)
  @Post("delete")
  async deleteCartProduct(@Body() cartProductId: { cartProductId: string }) {
    console.log(cartProductId);
    return await this.cartService.deleteCartProduct(cartProductId);
  }

  @UseGuards(JwtGuard)
  @Post("change-amount")
  async changeProductAmount(@Body() product: ChangeCartProductAmountDto) {
    return await this.cartService.updateProductAmount(
      product.cartProductId,
      product.cartProductAmount
    );
  }
}
