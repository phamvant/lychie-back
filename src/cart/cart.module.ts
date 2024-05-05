import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";

@Module({
  providers: [CartService, PrismaService, JwtService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
