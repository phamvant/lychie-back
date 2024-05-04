import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { hash } from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/user.dto";
import { CartService } from "src/cart/cart.service";

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private cartService: CartService
  ) {}

  //////////////////////////////////
  /// createUser
  //////////////////////////////////
  async create(dto: CreateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        userEmail: dto.userEmail,
      },
    });

    if (user) throw new ConflictException("email duplicated");

    const newUser = await this.prismaService.user.create({
      data: {
        ...dto,
        userPassword: await hash(dto.userPassword, 10),
        userProductsAmount: 0,
      },
    });

    const newCart = await this.cartService.createNewUserCart(newUser.userId);

    if (!newCart) {
      await this.prismaService.user.delete({
        where: {
          userId: newUser.userId,
        },
      });

      throw new ServiceUnavailableException("Cant create user");
    }

    const { userPassword, ...res } = newUser;

    return res;
  }

  //////////////////////////////////
  /// findByEmail
  //////////////////////////////////
  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        userEmail: email,
      },
    });

    if (user) return user;

    throw new NotFoundException();
  }

  //////////////////////////////////
  /// findById
  //////////////////////////////////
  async findById(userId: string) {
    const user = await this.prismaService.user.findUnique({
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

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  //////////////////////////////////
  /// updateUserProductAmount
  //////////////////////////////////
  async updateUserProductAmount(userName: string) {
    return await this.prismaService.user.update({
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
