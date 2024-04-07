import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import configuration from "./config/configuration";
import { PrismaService } from "./prisma.service";
import { ProductModule } from "./product/product.module";
import { S3BucketModule } from "./s3/s3.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    UserModule,
    AuthModule,
    ProductModule,
    S3BucketModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
