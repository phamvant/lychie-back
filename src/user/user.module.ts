import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { CartService } from "src/cart/cart.service";

@Module({
  providers: [UserService, PrismaService, JwtService, CartService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
