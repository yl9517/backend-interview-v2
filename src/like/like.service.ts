import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async toggleLike(productId: number, userId: number): Promise<string> {
    const like = await this.likeRepository.findOne({
      where: { productId, userId },
    });

    if (like) {
      await this.likeRepository.delete(like.id);
      return 'Like removed';
    } else {
      const newLike = this.likeRepository.create({ productId, userId });
      await this.likeRepository.save(newLike);
      return 'Like added';
    }
  }

  async getLikeCount(productId: number): Promise<number> {
    return await this.likeRepository.count({ where: { productId } });
  }
}
