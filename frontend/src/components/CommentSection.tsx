'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Send, MessageCircle } from 'lucide-react';
import CommentItem from './CommentItem';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: { id: string; name: string; email: string };
}

interface CommentSectionProps {
    blogId: string;
    initialComments?: Comment[];
}

export default function CommentSection({
    blogId,
    initialComments = [],
}: CommentSectionProps) {
    const { isAuthenticated } = useAuth();
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(initialComments.length > 0);
    const [error, setError] = useState('');

    const loadComments = async () => {
        setIsLoading(true);
        try {
            const response = await api.getComments(blogId);
            setComments(response.data);
            setHasLoaded(true);
        } catch {
            setError('Failed to load comments');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setError('');
        try {
            const newComment = await api.createComment(blogId, {
                content: content.trim(),
            });
            setComments((prev) => [newComment, ...prev]);
            setContent('');
        } catch {
            setError('Failed to post comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-cyan-400" />
                    Comments ({comments.length})
                </h3>
                {!hasLoaded && (
                    <button
                        onClick={loadComments}
                        className="text-xs font-medium px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-all duration-200 cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Load Comments'}
                    </button>
                )}
            </div>

            {isAuthenticated && (
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all duration-200">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full bg-transparent text-zinc-100 text-sm p-4 resize-none outline-none placeholder:text-zinc-600"
                            rows={3}
                            maxLength={2000}
                        />
                        <div className="flex justify-end px-3 pb-3">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                                disabled={!content.trim() || isSubmitting}
                            >
                                <Send className="w-3.5 h-3.5" />
                                {isSubmitting ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {!isAuthenticated && (
                <div className="text-center py-4 px-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50 mb-6">
                    <p className="text-sm text-zinc-500">
                        <a href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Login</a> to leave a comment.
                    </p>
                </div>
            )}

            {error && <p className="text-sm text-red-400 mb-3">{error}</p>}

            <div className="flex flex-col gap-3">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} {...comment} />
                ))}
                {hasLoaded && comments.length === 0 && (
                    <p className="text-center text-sm text-zinc-600 py-6">No comments yet. Be the first!</p>
                )}
            </div>
        </div>
    );
}
