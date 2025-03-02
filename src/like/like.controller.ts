import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { LikeService } from './like.service';

@Controller('likes')
@UseGuards(AuthGuard('jwt'))
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':productId')
  async toggleLike(
    @Param('productId') productId: number,
    @User() user: { userId: number },
  ) {
    const userId = user.userId;
    return this.likeService.toggleLike(productId, userId);
  }

  @Get(':productId/count')
  async getLikeCount(@Param('productId') productId: number) {
    return this.likeService.getLikeCount(productId);
  }
}
