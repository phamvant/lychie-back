import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { hash } from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  //////////////////////////////////
  /// createUser
  //////////////////////////////////
  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        userEmail: dto.userEmail,
      },
    });

    if (user) throw new ConflictException("email duplicated");

    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        userPassword: await hash(dto.userPassword, 10),
        userProductsAmount: 0,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userPassword, ...res } = newUser;

    console.log("created", res);
    return res;
  }

  //////////////////////////////////
  /// findByEmail
  //////////////////////////////////
  async findByEmail(email: string) {
    console.log("find email", email);
    const user = await this.prisma.user.findUnique({
      where: {
        userEmail: email,
      },
    });

    console.log("user found", user);

    if (user) return user;

    console.log("not found");
    throw new NotFoundException();
  }

  //////////////////////////////////
  /// findById
  //////////////////////////////////
  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userId: true,
        userEmail: true,
        userProductsAmount: true,
        userUsername: true,
        userPassword: false,
      },
    });

    if (user) {
      return user;
    }

    throw new NotFoundException();
  }

  //////////////////////////////////
  /// updateUserProductAmount
  //////////////////////////////////
  async updateUserProductAmount(userName: string) {
    await this.prisma.user.update({
      where: {
        userUsername: userName,
      },
      data: {
        userProductsAmount: {
          increment: 1,
        },
      },
    });
  }
}
