import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  //////////////////////////////////
  /// GetUserPost
  //////////////////////////////////

  async getUserPost(postId: string, reqUser) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: reqUser.id,
      },
    });

    console.log(user);

    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post Not Found');
    }

    return post;
  }
}
