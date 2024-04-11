import { Injectable } from "@nestjs/common";
import { CategoryDto } from "src/category/dto/category.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SeedService {
  constructor(private prismaService: PrismaService) {}

  async seedDatabase(category: CategoryDto[]) {
    const existed = await this.prismaService.category.findFirst({
      where: {
        categoryName: category[0].categoryName,
      },
    });

    if (existed) {
      console.log("Existed");
      return;
    }

    const newCategory = await this.prismaService.category.createMany({
      data: category,
    });

    if (newCategory) {
      console.log("Insert Success");
    }
  }
}
