import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  //////////////////////////////////
  /// createUser
  //////////////////////////////////
  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) throw new ConflictException('email duplicated');

    const newUser = await this.prisma.user.create({
      data: { ...dto, password: await hash(dto.password, 10) },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...res } = newUser;

    console.log('created', res);
    return res;
  }

  //////////////////////////////////
  /// findByEmail
  //////////////////////////////////
  async findByEmail(email: string) {
    console.log('find email', email);
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    console.log('user found', user);

    if (user) return user;

    console.log('not found');
    throw new NotFoundException();
  }

  //////////////////////////////////
  /// findById
  //////////////////////////////////
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...res } = user;
      console.log('found by id', res);
      return res;
    }

    throw new NotFoundException();
  }
}
