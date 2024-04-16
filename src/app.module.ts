import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CartModule } from "./cart/cart.module";
import { CategoryController } from "./category/category.controller";
import { CategoryModule } from "./category/category.module";
import { CategoryService } from "./category/category.service";
import configuration from "./config/configuration";
import { PrismaService } from "./prisma/prisma.service";
import { ProductModule } from "./product/product.module";
import { ProductService } from "./product/product.service";
import { S3BucketModule } from "./s3/s3.module";
import { seedCart, seedData } from "./seed/seed-data";
import { SeedService } from "./seed/seed.service";
import { UserModule } from "./user/user.module";
import { UserService } from "./user/user.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    UserModule,
    AuthModule,
    ProductModule,
    S3BucketModule,
    CategoryModule,
    CartModule,
  ],
  controllers: [AppController, CategoryController],
  providers: [
    AppService,
    PrismaService,
    SeedService,
    UserService,
    CategoryService,
    ProductService,
    JwtService,
  ],
})
export class AppModule {
  constructor(private seedService: SeedService) {}
  async onModuleInit() {
    await this.seedService.seedDatabase(seedData, seedCart); // Seed the database only on first startup}
  }
}
