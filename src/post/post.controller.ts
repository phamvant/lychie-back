import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserPost(@Param('id') postId: string, @Request() req) {
    return await this.postService.getUserPost(postId, req.user);
  }
}
