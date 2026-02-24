import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
    constructor(private readonly prisma: PrismaService) { }

    async likeBlog(userId: string, blogId: string) {
        // Verify blog exists and is published
        const blog = await this.prisma.blog.findUnique({
            where: { id: blogId },
        });

        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        try {
            await this.prisma.like.create({
                data: { userId, blogId },
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictException('You have already liked this blog');
            }
            throw error;
        }

        const likeCount = await this.prisma.like.count({
            where: { blogId },
        });

        return { liked: true, likeCount };
    }

    async unlikeBlog(userId: string, blogId: string) {
        const like = await this.prisma.like.findUnique({
            where: {
                userId_blogId: { userId, blogId },
            },
        });

        if (!like) {
            throw new NotFoundException('Like not found');
        }

        await this.prisma.like.delete({
            where: { id: like.id },
        });

        const likeCount = await this.prisma.like.count({
            where: { blogId },
        });

        return { liked: false, likeCount };
    }

    async hasUserLiked(userId: string, blogId: string): Promise<boolean> {
        const like = await this.prisma.like.findUnique({
            where: {
                userId_blogId: { userId, blogId },
            },
        });
        return !!like;
    }
}
