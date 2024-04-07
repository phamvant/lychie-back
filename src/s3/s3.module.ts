import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { S3BucketController } from "./s3.controller";
import { S3BucketService } from "./s3.service";

@Module({
  providers: [S3BucketService, JwtService],
  controllers: [S3BucketController],
})
export class S3BucketModule {}
