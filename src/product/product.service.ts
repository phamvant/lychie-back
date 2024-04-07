import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateProductDto } from "./dto/product.dto";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findProductByName(productName: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        productName: productName,
      },
    });

    return product;
  }

  async createProduct(dto: CreateProductDto) {
    const product = await this.findProductByName(dto.productName);

    if (product) {
      throw new ConflictException("Product existed");
    }

    const newProduct = await this.prisma.product.create({
      data: dto,
    });

    return newProduct.productName;
  }

  async getAllProduct() {
    const products = await this.prisma.product.findMany();

    return products;
  }

  async getProductById(productId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        productId: productId,
      },
    });
    console.log(product);
    return product;
  }

  // async updateProductImage(files) {
  //   for (let i = 0; i < files.length; i++) {
  //     if (files[i].originalname !== "blob") {
  //       let filePath = `uploads/${files[i].originalname}`; // Assuming 'uploads' directory exists
  //       await fs.promises.writeFile(filePath, files[i].buffer); // Use promises for async
  //       console.log("Image saved:", filePath);
  //     }
  //   }
  //   return "Updated";
  // }
}
