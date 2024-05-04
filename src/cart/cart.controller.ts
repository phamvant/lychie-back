import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { AddProductToCardDto, ChangeCartProductAmountDto } from "./cart.dto";
import { CartService } from "./cart.service";

@Controller("cart")
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtGuard)
  @Get("")
  async getAllCartProduct(@Request() req) {
    return await this.cartService.getAllCartProduct(req.user.sub.userid);
  }

  @UseGuards(JwtGuard)
  @Post("add")
  async addProductToCart(@Body() product: AddProductToCardDto) {
    return await this.cartService.addProductToCart(product);
  }

  // @UseGuards(JwtGuard)
  @Post("delete")
  async deleteCartProduct(@Body() cartProductId: { cartProductId: string }) {
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
