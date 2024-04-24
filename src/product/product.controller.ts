import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { CreateProductDto } from "./dto/product.dto";
import { ProductService } from "./product.service";

// @Controller("product")
// export class PostController {
//   constructor(private postService: PostService) {}

//   @UseGuards(JwtGuard)
//   @Get(":id")
//   async getUserPost(@Param("id") postId: string, @Request() req) {
//     return await this.postService.getUserPost(postId, req.user);
//   }
// }

@Controller("product")
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(JwtGuard)
  @Post("create")
  async createProduct(@Body() dto: CreateProductDto, @Request() req) {
    console.log(dto);
    return await this.productService.createProduct(dto, req);
  }

  @UseGuards(JwtGuard)
  @Get("")
  async getAllProduct() {
    return this.productService.getAllProduct();
  }

  @UseGuards(JwtGuard)
  @Get(":productId")
  async getProductById(@Param("productId") productId: string) {
    return this.productService.getProductById(productId);
  }

  @UseGuards(JwtGuard)
  @Put("modify/:productId")
  async modifyProduct(
    @Param("productId") productId: string,
    @Body() updateValues: Record<string, any>
  ) {
    console.log("Modify request : ", productId, "->", updateValues);
    return this.productService.modifyProduct(productId, updateValues);
  }

  @UseGuards(JwtGuard)
  @Put("delete")
  async deleteProduct(@Body() productId: { productId: string }) {
    return await this.productService.deleteProduct(productId);
  }

  @Get("page/:page")
  async getProductByPage(@Param("page") page: number) {
    return await this.productService.getProductByPage(page);
  }
}
