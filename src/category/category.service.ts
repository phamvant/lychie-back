import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CategoryDto } from "./dto/category.dto";

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async getAllCategory() {
    return await this.prismaService.category.findMany();
  }

  async createCategory(category: CategoryDto) {
    const existedCategory = await this.findCategoryByName(
      category.categoryName
    );

    console.log(category);

    if (existedCategory) {
      if (
        existedCategory.categorySubName.includes(category.categorySubName[0])
      ) {
        throw new ConflictException("category existed");
      }
    }

    if (existedCategory) {
      const newCategory = await this.prismaService.category.update({
        where: {
          categoryName: existedCategory.categoryName,
        },
        data: {
          categorySubName: {
            push: category.categorySubName[0],
          },
        },
      });

      return newCategory;
    }

    const newCategory = await this.prismaService.category.create({
      data: category,
    });

    return newCategory;
  }

  async findCategoryByName(categoryName: string) {
    const existedCategory = await this.prismaService.category.findFirst({
      where: {
        categoryName: categoryName,
      },
    });

    return existedCategory;
  }
}
