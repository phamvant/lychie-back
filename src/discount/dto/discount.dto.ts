import { IsNumber, IsString } from "class-validator";

export class DiscountDto {
  @IsString()
  discountCode: string;
  @IsNumber()
  discountAmount: number;
}
