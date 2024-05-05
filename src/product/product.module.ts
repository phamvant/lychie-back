import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CartService } from "src/cart/cart.service";
import { PrismaService } from "src/prisma/prisma.service";
import { S3BucketService } from "src/s3/s3.service";
import { UserService } from "src/user/user.service";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { UserModule } from "src/user/user.module";

@Module({
  providers: [
    ProductService,
    PrismaService,
    JwtService,
    UserService,
    CartService,
    S3BucketService,
  ],
  imports: [UserModule],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
