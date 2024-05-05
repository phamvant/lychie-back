import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
  providers: [PrismaService, CategoryService, JwtService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
