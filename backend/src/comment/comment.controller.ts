import {
    Controller,
    Post,
    Get,
    Param,
    Query,
    Body,
    UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('blogs')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post(':id/comments')
    @UseGuards(JwtAuthGuard)
    async create(
        @Param('id') blogId: string,
        @CurrentUser() user: { id: string },
        @Body() dto: CreateCommentDto,
    ) {
        return this.commentService.create(user.id, blogId, dto);
    }

    @Get(':id/comments')
    async findByBlog(
        @Param('id') blogId: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
        const limitNum = Math.min(50, Math.max(1, parseInt(limit || '20', 10) || 20));
        return this.commentService.findByBlog(blogId, pageNum, limitNum);
    }
}
