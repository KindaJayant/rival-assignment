'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import BlogCard from '@/components/BlogCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { Globe } from 'lucide-react';

interface FeedBlog {
    id: string;
    title: string;
    slug: string;
    content: string;
    summary: string | null;
    createdAt: string;
    user: { id: string; name: string; email: string };
    _count: { likes: number; comments: number };
}

export default function FeedPage() {
    const [blogs, setBlogs] = useState<FeedBlog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');

    const loadFeed = useCallback(async (pageNum: number) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.getFeed(pageNum);
            setBlogs(response.data);
            setTotalPages(response.meta.totalPages);
            setPage(response.meta.page);
        } catch {
            setError('Failed to load feed');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFeed(1);
    }, [loadFeed]);

    if (loading && blogs.length === 0) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 bg-zinc-950 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-zinc-50 tracking-tight flex items-center gap-2.5">
                    <Globe className="w-6 h-6 text-cyan-400" />
                    Public Feed
                </h1>
                <p className="text-sm text-zinc-400 mt-1">Discover stories from writers around the world.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 text-sm text-red-400">
                    {error}
                </div>
            )}

            {blogs.length === 0 && !loading ? (
                <EmptyState
                    title="No posts yet"
                    message="Be the first to publish a blog!"
                    icon={<Globe className="w-12 h-12" />}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {blogs.map((blog) => (
                            <BlogCard
                                key={blog.id}
                                {...blog}
                                author={blog.user}
                                likeCount={blog._count.likes}
                                commentCount={blog._count.comments}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-5 mt-10">
                            <button
                                onClick={() => loadFeed(page - 1)}
                                disabled={page <= 1 || loading}
                                className="text-sm font-semibold px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100 hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-zinc-500 font-medium">
                                {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => loadFeed(page + 1)}
                                disabled={page >= totalPages || loading}
                                className="text-sm font-semibold px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100 hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
