import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { S3BucketService } from "./s3.service";

@Controller("s3")
export class S3BucketController {
  constructor(private s3BucketService: S3BucketService) {}

  @UseGuards(JwtGuard)
  @Get("image-upload-url")
  async getImageUploadUrl(
    @Query("productName") productName: string,
    @Query("volume") volume: number
  ) {
    const uploadUrl = this.s3BucketService.getImageUploadUrl(
      productName,
      volume
    );

    return uploadUrl;
  }
}
