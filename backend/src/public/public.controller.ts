import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
    constructor(private readonly publicService: PublicService) { }

    @Get('feed')
    async getFeed(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
        const limitNum = Math.min(50, Math.max(1, parseInt(limit || '10', 10) || 10));
        return this.publicService.getFeed(pageNum, limitNum);
    }

    @Get('blogs/:slug')
    async getBlogBySlug(@Param('slug') slug: string) {
        return this.publicService.getBlogBySlug(slug);
    }
}
