import { Injectable } from "@nestjs/common";
import { CategoryDto } from "src/category/dto/category.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SeedService {
  constructor(private prismaService: PrismaService) {}

  async seedDatabase(category: CategoryDto[], cartId: string) {
    const existed = await this.prismaService.category.findFirst({
      where: {
        categoryName: category[0].categoryName,
      },
    });

    if (!existed) {
      const newCategory = await this.prismaService.category.createMany({
        data: category,
      });
    }
  }
}
