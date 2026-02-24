import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicService {
    constructor(private readonly prisma: PrismaService) { }

    async getFeed(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [blogs, total] = await this.prisma.$transaction([
            this.prisma.blog.findMany({
                where: { isPublished: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    content: true,
                    summary: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        },
                    },
                },
            }),
            this.prisma.blog.count({
                where: { isPublished: true },
            }),
        ]);

        return {
            data: blogs,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getBlogBySlug(slug: string) {
        const blog = await this.prisma.blog.findUnique({
            where: { slug },
            select: {
                id: true,
                title: true,
                slug: true,
                content: true,
                summary: true,
                isPublished: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });

        if (!blog || !blog.isPublished) {
            throw new NotFoundException('Blog not found');
        }

        return blog;
    }
}
