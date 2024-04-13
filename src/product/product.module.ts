import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  providers: [ProductService, PrismaService, JwtService, UserService],
  controllers: [ProductController],
})
export class ProductModule {}
