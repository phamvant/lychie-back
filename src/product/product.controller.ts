import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { CreateProductDto } from "./dto/product.dto";
import { ProductService } from "./product.service";
import { ReqUserPayload } from "src/auth/dto/auth.dto";

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
  async createProduct(
    @Body() dto: CreateProductDto,
    @Request() req: ReqUserPayload
  ) {
    return await this.productService.createProduct(dto, req.user.sub.userid);
  }

  // @UseGuards(JwtGuard)
  // @Get("")
  // async getAllProduct(@Request() req: ReqUserPayload) {
  //   return this.productService.getAllProduct(req.user.sub.userid);
  // }

  @UseGuards(JwtGuard)
  @Get(":productId")
  async getProductById(
    @Param("productId") productId: string,
    @Request() req: ReqUserPayload
  ) {
    return this.productService.getUserProductById(
      productId,
      req.user.sub.userid
    );
  }

  @UseGuards(JwtGuard)
  @Put("modify/:productId")
  async modifyProduct(
    @Param("productId") productId: string,
    @Body() updateValues: Record<string, any>,
    @Request() req: ReqUserPayload
  ) {
    return this.productService.modifyProduct(
      productId,
      updateValues,
      req.user.sub.userid
    );
  }

  @UseGuards(JwtGuard)
  @Put("delete")
  async deleteProduct(
    @Body() { productId }: { productId: string },
    @Request() req: ReqUserPayload
  ) {
    return await this.productService.deleteProduct(
      productId,
      req.user.sub.userid
    );
  }

  @UseGuards(JwtGuard)
  @Get("")
  async getProductByPage(
    @Query("page") page: number,
    @Request() req: ReqUserPayload
  ) {
    return await this.productService.getProductByPage(
      page,
      req.user.sub.userid
    );
  }

  @UseGuards(JwtGuard)
  @Put("image/delete")
  async deleteProductImage(
    @Body()
    { productId, imageLink }: { productId: string; imageLink: string },
    @Request() req: ReqUserPayload
  ) {
    return await this.productService.deleteProductImage(
      productId,
      imageLink,
      req.user.sub.userid
    );
  }
}
