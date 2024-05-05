import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { CartService } from "src/cart/cart.service";
import { DiscountService } from "src/discount/discount.service";
import { ProductService } from "src/product/product.service";
import { S3BucketService } from "src/s3/s3.service";

@Module({
  providers: [UserService, PrismaService, JwtService, CartService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
