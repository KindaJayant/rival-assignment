'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import BlogCard from '@/components/BlogCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { Plus, FileText, Heart, Eye } from 'lucide-react';

interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    isPublished: boolean;
    createdAt: string;
    _count: { likes: number; comments: number };
}

export default function DashboardPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            api
                .getMyBlogs()
                .then(setBlogs)
                .catch(() => { })
                .finally(() => setLoading(false));
        }
    }, [isAuthenticated]);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this post? This cannot be undone.')) return;
        try {
            await api.deleteBlog(id);
            setBlogs((prev) => prev.filter((b) => b.id !== id));
        } catch { }
    };

    const handleTogglePublish = async (id: string, isPublished: boolean) => {
        try {
            await api.updateBlog(id, { isPublished: !isPublished });
            setBlogs((prev) =>
                prev.map((b) => (b.id === id ? { ...b, isPublished: !isPublished } : b))
            );
        } catch { }
    };

    if (authLoading || loading) return <LoadingSpinner />;
    if (!isAuthenticated) return null;

    const published = blogs.filter((b) => b.isPublished).length;
    const drafts = blogs.length - published;
    const totalLikes = blogs.reduce((sum, b) => sum + b._count.likes, 0);

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 bg-zinc-950 min-h-screen">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-zinc-50 tracking-tight">
                        Welcome, {user?.name}
                    </h1>
                    <p className="text-sm text-zinc-400 mt-1">Manage your content and track performance.</p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/new')}
                    className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 transition-all duration-200 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    New post
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-5 text-center">
                    <FileText className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                    <span className="block text-2xl font-extrabold text-zinc-50">{published}</span>
                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Published</span>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-5 text-center">
                    <Eye className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                    <span className="block text-2xl font-extrabold text-zinc-50">{drafts}</span>
                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Drafts</span>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-5 text-center">
                    <Heart className="w-5 h-5 text-red-400 mx-auto mb-2" />
                    <span className="block text-2xl font-extrabold text-zinc-50">{totalLikes}</span>
                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Likes</span>
                </div>
            </div>

            {blogs.length === 0 ? (
                <EmptyState
                    title="No posts yet"
                    message="Create your first post and share it with the world."
                />
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {blogs.map((blog) => (
                        <BlogCard
                            key={blog.id}
                            {...blog}
                            author={user ? { name: user.name, email: user.email } : undefined}
                            likeCount={blog._count.likes}
                            commentCount={blog._count.comments}
                            showActions
                            onEdit={() => router.push(`/dashboard/edit/${blog.id}`)}
                            onDelete={() => handleDelete(blog.id)}
                            onTogglePublish={() => handleTogglePublish(blog.id, blog.isPublished)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
