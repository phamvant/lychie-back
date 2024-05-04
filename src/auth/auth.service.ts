import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { UserService } from "src/user/user.service";
import { LoginDto } from "./dto/auth.dto";

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async refreshToken(user: any) {
    const payload = { email: user.email, sub: user.sub };

    return {
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: "1h",
          secret: this.configService.get("jwt.access"),
        }),
        refreshTokenKey: await this.jwtService.signAsync(payload, {
          expiresIn: "7d",
          secret: this.configService.get("jwt.refresh"),
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    const payload = {
      email: user.userEmail,
      sub: {
        username: user.userUsername,
        userid: user.userId,
      },
    };

    return {
      user,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: "1h",
          secret: this.configService.get("jwt.access"),
        }),
        refreshTokenKey: await this.jwtService.signAsync(payload, {
          expiresIn: "7d",
          secret: this.configService.get("jwt.refresh"),
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async validateUser(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (user && (await compare(dto.password, user.userPassword))) {
      const { userPassword, ...res } = user;
      return res;
    }

    throw new UnauthorizedException();
  }
}
