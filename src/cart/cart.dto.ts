import { IsNumber, IsObject, IsString } from "class-validator";

export class AddProductToCardDto {
  @IsString()
  productId: string;
  @IsObject()
  cartProductVariants: any;
  @IsNumber()
  cartProductAmount: number;
  @IsString()
  cartCustomerName: string;
}

export class ChangeCartProductAmountDto {
  @IsString()
  cartProductId: string;
  @IsNumber()
  cartProductAmount: number;
}
