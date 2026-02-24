'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

interface BlogDetail {
    id: string;
    title: string;
    slug: string;
    content: string;
    summary: string | null;
    createdAt: string;
    updatedAt: string;
    user: { id: string; name: string; email: string };
    _count: { likes: number; comments: number };
}

export default function BlogDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [blog, setBlog] = useState<BlogDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!slug) return;

        api
            .getBlogBySlug(slug)
            .then(setBlog)
            .catch((err) => {
                setError(err.statusCode === 404 ? 'Post not found' : 'Failed to load post');
            })
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <LoadingSpinner />;

    if (error || !blog) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <h1 className="text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">404</h1>
                <p className="text-zinc-400 text-lg mb-8">{error || 'Post not found'}</p>
                <Link
                    href="/feed"
                    className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 transition-all duration-200 shadow-lg shadow-cyan-500/20"
                >
                    Back to Feed
                </Link>
            </div>
        );
    }

    const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <article className="max-w-3xl mx-auto px-6 py-10 bg-zinc-950 min-h-screen">
            <Link
                href="/feed"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 mb-10 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to feed
            </Link>

            <header className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-50 tracking-tight leading-tight mb-6">
                    {blog.title}
                </h1>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {blog.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <span className="block text-sm font-semibold text-zinc-200">{blog.user.name}</span>
                            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                                <Calendar className="w-3 h-3" />
                                {formattedDate}
                            </span>
                        </div>
                    </div>
                    <LikeButton blogId={blog.id} initialLikeCount={blog._count.likes} />
                </div>
            </header>

            <div className="prose-custom">
                {blog.content.split('\n').map((paragraph, i) =>
                    paragraph.trim() ? (
                        <p key={i} className="text-base text-zinc-300 leading-[1.85] mb-5">
                            {paragraph}
                        </p>
                    ) : (
                        <div key={i} className="h-4" />
                    )
                )}
            </div>

            <hr className="border-t border-zinc-800 my-10" />

            <CommentSection blogId={blog.id} />
        </article>
    );
}
