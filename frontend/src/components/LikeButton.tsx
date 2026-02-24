'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
    blogId: string;
    initialLikeCount: number;
    initialLiked?: boolean;
}

export default function LikeButton({
    blogId,
    initialLikeCount,
    initialLiked = false,
}: LikeButtonProps) {
    const { isAuthenticated } = useAuth();
    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = useCallback(async () => {
        if (!isAuthenticated || isLoading) return;

        const prevLiked = liked;
        const prevCount = likeCount;
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);

        setIsLoading(true);
        try {
            const response = liked
                ? await api.unlikeBlog(blogId)
                : await api.likeBlog(blogId);
            setLiked(response.liked);
            setLikeCount(response.likeCount);
        } catch {
            setLiked(prevLiked);
            setLikeCount(prevCount);
        } finally {
            setIsLoading(false);
        }
    }, [blogId, liked, likeCount, isAuthenticated, isLoading]);

    return (
        <button
            onClick={handleToggle}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer border ${liked
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/5'
                } ${!isAuthenticated ? 'opacity-40 cursor-not-allowed' : ''}`}
            disabled={!isAuthenticated || isLoading}
            title={!isAuthenticated ? 'Login to like' : liked ? 'Unlike' : 'Like'}
        >
            <Heart
                className={`w-4 h-4 transition-transform duration-200 ${liked ? 'fill-current scale-110' : ''}`}
            />
            <span>{likeCount}</span>
        </button>
    );
}
