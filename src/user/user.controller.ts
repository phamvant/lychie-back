import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get(":id")
  async GetUserProfile(@Param("id") userId: string) {
    return await this.userService.findById(userId);
  }
}
