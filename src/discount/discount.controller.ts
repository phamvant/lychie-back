import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { DiscountService } from "./discount.service";
import { DiscountDto } from "./dto/discount.dto";

@Controller("discount")
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @UseGuards(JwtGuard)
  @Get("")
  async getAllDiscount() {
    return await this.discountService.getAllDiscount();
  }

  @UseGuards(JwtGuard)
  @Put("modify")
  async modifyDiscount(@Body() { discountCode, discountAmount }: DiscountDto) {
    return await this.discountService.modifyDiscountAmount(
      discountCode,
      discountAmount
    );
  }

  @UseGuards(JwtGuard)
  @Put("active")
  async activeDiscount(@Body() { discountCode }: { discountCode: string }) {
    return this.discountService.activeDiscount(discountCode);
  }

  @UseGuards(JwtGuard)
  @Put("deactive")
  async deactiveDiscount(@Body() { discountCode }: { discountCode: string }) {
    return this.discountService.deactiveDiscount(discountCode);
  }
}
