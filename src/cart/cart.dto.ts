import { IsNumber, IsObject, IsString } from "class-validator";

export class AddProductToCardDto {
  @IsString()
  cartProductId: string;
  @IsString()
  cartProductName: string;
  @IsObject()
  cartProductVariant: any;
  @IsNumber()
  cartProductAmount: number;
}
