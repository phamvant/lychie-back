import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CartService } from "src/cart/cart.service";
import { PrismaService } from "src/prisma/prisma.service";
import { ProductService } from "src/product/product.service";
import { S3BucketService } from "src/s3/s3.service";
import { UserService } from "src/user/user.service";
import { DiscountController } from "./discount.controller";
import { DiscountService } from "./discount.service";

@Module({
  providers: [
    PrismaService,
    JwtService,
    DiscountService,
    ProductService,
    S3BucketService,
    UserService,
    CartService,
  ],
  controllers: [DiscountController],
  exports: [DiscountService],
})
export class DiscountModule {}
