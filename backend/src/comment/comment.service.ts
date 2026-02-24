import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, blogId: string, dto: CreateCommentDto) {
        // Verify blog exists
        const blog = await this.prisma.blog.findUnique({
            where: { id: blogId },
        });

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        return this.prisma.comment.create({
            data: {
                userId,
                blogId,
                content: dto.content,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findByBlog(blogId: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [comments, total] = await this.prisma.$transaction([
            this.prisma.comment.findMany({
                where: { blogId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.comment.count({
                where: { blogId },
            }),
        ]);

        return {
            data: comments,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
