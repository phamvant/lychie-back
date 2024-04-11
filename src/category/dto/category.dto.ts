import { IsArray, IsString } from "class-validator";

export class CategoryDto {
  @IsString()
  categoryName: string;
  @IsArray()
  categorySubName: string[];
}
