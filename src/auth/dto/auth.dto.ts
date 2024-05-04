import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class ReqUserPayload extends Request {
  user: {
    email: string;
    sub: {
      userid: string;
      username: string;
    };
  };
}
