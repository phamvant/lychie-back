import { IsArray, IsNumber, IsObject, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  productName: string;
  @IsString()
  productDescription: string;
  //-------PRICE--------//
  @IsNumber()
  productCostPrice: number;
  @IsNumber()
  productPrice: number;
  @IsNumber()
  productFinalPrice: number;
  //-------DISCOUNT-----//
  @IsString()
  productDiscountType: string;
  @IsNumber()
  productDiscountAmount?: number;
  //-------VARIANT------//
  @IsString()
  productCategory: string;
  @IsString()
  productSubCategory: string;
  @IsString()
  productMemo: string;
  @IsObject()
  productVariants: any;
  @IsArray()
  productImages: string[];
}
