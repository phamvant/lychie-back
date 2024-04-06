import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  providers: [ProductService, PrismaService, JwtService],
  controllers: [ProductController],
})
export class PostModule {}
