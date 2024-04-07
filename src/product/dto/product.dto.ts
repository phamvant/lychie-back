import { IsArray, IsObject, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  productName: string;
  @IsString()
  productDescription: string;
  @IsString()
  productCostPrice: string;
  @IsString()
  productPrice: string;
  @IsString()
  productCategory: string;
  @IsString()
  productSubCategory: string;
  @IsObject()
  productVariants: any;
  @IsArray()
  productImages: string[];
}
