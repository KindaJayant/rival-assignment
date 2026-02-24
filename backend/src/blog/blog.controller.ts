import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('blogs')
@UseGuards(JwtAuthGuard)
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Post()
    async create(
        @CurrentUser() user: { id: string },
        @Body() dto: CreateBlogDto,
    ) {
        return this.blogService.create(user.id, dto);
    }

    @Get()
    async findAll(@CurrentUser() user: { id: string }) {
        return this.blogService.findAllByUser(user.id);
    }

    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @CurrentUser() user: { id: string },
    ) {
        return this.blogService.findOneByUser(id, user.id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @CurrentUser() user: { id: string },
        @Body() dto: UpdateBlogDto,
    ) {
        return this.blogService.update(id, user.id, dto);
    }

    @Delete(':id')
    async delete(
        @Param('id') id: string,
        @CurrentUser() user: { id: string },
    ) {
        return this.blogService.delete(id, user.id);
    }
}
