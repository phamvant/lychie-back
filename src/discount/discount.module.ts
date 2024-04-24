import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { DiscountController } from "./discount.controller";
import { DiscountService } from "./discount.service";

@Module({
  providers: [PrismaService, JwtService, DiscountService],
  controllers: [DiscountController],
})
export class DiscountModule {}
