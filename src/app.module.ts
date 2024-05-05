import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CartModule } from "./cart/cart.module";
import { CategoryModule } from "./category/category.module";
import configuration from "./config/configuration";
import { DiscountModule } from "./discount/discount.module";
import { PrismaService } from "./prisma/prisma.service";
import { ProductModule } from "./product/product.module";
import { S3BucketModule } from "./s3/s3.module";
import { seedCart, seedData } from "./seed/seed-data";
import { SeedService } from "./seed/seed.service";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    UserModule,
    AuthModule,
    ProductModule,
    S3BucketModule,
    CategoryModule,
    CartModule,
    DiscountModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService, PrismaService],
})
export class AppModule {
  constructor(private seedService: SeedService) {}
  async onModuleInit() {
    await this.seedService.seedDatabase(seedData, seedCart); // Seed the database only on first startup}
  }
}
