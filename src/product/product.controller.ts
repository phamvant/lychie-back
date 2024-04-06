import {
  Controller,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { JwtGuard } from "src/auth/guards/jwt.guard";
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
  async createProduct(@Request() req) {
    return await this.productService.createProduct(req);
  }

  @UseGuards(JwtGuard)
  @Post("updateImage")
  @UseInterceptors(AnyFilesInterceptor())
  async updateProductImage(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return await this.productService.updateProductImage(files);
  }
}
