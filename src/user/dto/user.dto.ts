import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  userUsername: string;

  @IsEmail()
  userEmail: string;

  @IsString()
  userPassword: string;
}
