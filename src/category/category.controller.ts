import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { CategoryService } from "./category.service";
import { CategoryDto } from "./dto/category.dto";

@Controller("category")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(JwtGuard)
  @Get("")
  async getAllCategory() {
    const categories = await this.categoryService.getAllCategory();
    return categories;
  }

  @UseGuards(JwtGuard)
  @Post("create")
  async createCategory(@Body() dto: CategoryDto) {
    const newCategory = await this.categoryService.createCategory(dto);
    return newCategory;
  }
}
