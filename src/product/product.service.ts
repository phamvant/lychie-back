import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(req) {
    console.log(req.body);
    return "res";
  }

  async updateProductImage(files) {
    for (let i = 0; i < files.length; i++) {
      if (files[i].originalname !== "blob") {
        let filePath = `uploads/${files[i].originalname}`; // Assuming 'uploads' directory exists
        await fs.promises.writeFile(filePath, files[i].buffer); // Use promises for async
        console.log("Image saved:", filePath);
      }
    }
    return "Updated";
  }
}
