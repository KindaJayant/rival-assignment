import {
    Controller,
    Post,
    Delete,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('blogs')
@UseGuards(JwtAuthGuard)
export class LikeController {
    constructor(private readonly likeService: LikeService) { }

    @Post(':id/like')
    @HttpCode(HttpStatus.CREATED)
    async like(
        @Param('id') blogId: string,
        @CurrentUser() user: { id: string },
    ) {
        return this.likeService.likeBlog(user.id, blogId);
    }

    @Delete(':id/like')
    @HttpCode(HttpStatus.OK)
    async unlike(
        @Param('id') blogId: string,
        @CurrentUser() user: { id: string },
    ) {
        return this.likeService.unlikeBlog(user.id, blogId);
    }
}
