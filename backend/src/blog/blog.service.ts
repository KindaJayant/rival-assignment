import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import slugify from 'slugify';

@Injectable()
export class BlogService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, dto: CreateBlogDto) {
        let slug = slugify(dto.title, { lower: true, strict: true });

        // Ensure slug uniqueness
        const existingSlug = await this.prisma.blog.findUnique({
            where: { slug },
        });

        if (existingSlug) {
            slug = `${slug}-${Date.now()}`;
        }

        return this.prisma.blog.create({
            data: {
                userId,
                title: dto.title,
                content: dto.content,
                slug,
                isPublished: dto.isPublished ?? false,
            },
            include: {
                _count: {
                    select: { likes: true, comments: true },
                },
            },
        });
    }

    async findAllByUser(userId: string) {
        return this.prisma.blog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { likes: true, comments: true },
                },
            },
        });
    }

    async findOneByUser(id: string, userId: string) {
        const blog = await this.prisma.blog.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { likes: true, comments: true },
                },
            },
        });

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        if (blog.userId !== userId) {
            throw new ForbiddenException('You can only access your own blogs');
        }

        return blog;
    }

    async update(id: string, userId: string, dto: UpdateBlogDto) {
        const blog = await this.prisma.blog.findUnique({
            where: { id },
        });

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        if (blog.userId !== userId) {
            throw new ForbiddenException('You can only edit your own blogs');
        }

        const updateData: Record<string, unknown> = {};

        if (dto.title !== undefined) {
            updateData['title'] = dto.title;
            let newSlug = slugify(dto.title, { lower: true, strict: true });

            const existingSlug = await this.prisma.blog.findFirst({
                where: { slug: newSlug, id: { not: id } },
            });

            if (existingSlug) {
                newSlug = `${newSlug}-${Date.now()}`;
            }

            updateData['slug'] = newSlug;
        }

        if (dto.content !== undefined) {
            updateData['content'] = dto.content;
        }

        if (dto.isPublished !== undefined) {
            updateData['isPublished'] = dto.isPublished;
        }

        return this.prisma.blog.update({
            where: { id },
            data: updateData,
            include: {
                _count: {
                    select: { likes: true, comments: true },
                },
            },
        });
    }

    async delete(id: string, userId: string) {
        const blog = await this.prisma.blog.findUnique({
            where: { id },
        });

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        if (blog.userId !== userId) {
            throw new ForbiddenException('You can only delete your own blogs');
        }

        await this.prisma.blog.delete({
            where: { id },
        });

        return { message: 'Blog deleted successfully' };
    }
}
