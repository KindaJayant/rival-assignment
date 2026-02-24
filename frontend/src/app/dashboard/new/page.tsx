'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Bold, Italic, LinkIcon, List, Image, ArrowLeft } from 'lucide-react';

export default function NewBlogPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [publish, setPublish] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await api.createBlog({ title, content, isPublished: publish });
            router.push('/dashboard');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to create post';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading) return <LoadingSpinner />;
    if (!isAuthenticated) return null;

    return (
        <div className="max-w-3xl mx-auto px-6 py-10 bg-zinc-950 min-h-screen">
            <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 mb-8 transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to dashboard
            </button>

            <h1 className="text-2xl font-extrabold text-zinc-50 tracking-tight mb-8">Create new post</h1>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 text-sm text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Give your post a title..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-lg font-semibold text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Content</label>
                    <div className="border border-zinc-800 rounded-xl overflow-hidden focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all duration-200">
                        <div className="flex items-center gap-1 px-3 py-2 bg-zinc-900/80 border-b border-zinc-800">
                            <button type="button" className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/60 transition-colors cursor-pointer">
                                <Bold className="w-4 h-4" />
                            </button>
                            <button type="button" className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/60 transition-colors cursor-pointer">
                                <Italic className="w-4 h-4" />
                            </button>
                            <button type="button" className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/60 transition-colors cursor-pointer">
                                <LinkIcon className="w-4 h-4" />
                            </button>
                            <div className="w-px h-5 bg-zinc-800 mx-1" />
                            <button type="button" className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/60 transition-colors cursor-pointer">
                                <List className="w-4 h-4" />
                            </button>
                            <button type="button" className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/60 transition-colors cursor-pointer">
                                <Image className="w-4 h-4" />
                            </button>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            placeholder="Start writing your story..."
                            rows={18}
                            className="w-full bg-zinc-900/60 text-sm text-zinc-200 leading-relaxed p-4 resize-none outline-none placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        role="switch"
                        aria-checked={publish}
                        onClick={() => setPublish(!publish)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${publish ? 'bg-cyan-500' : 'bg-zinc-700'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${publish ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                    <span className="text-sm text-zinc-300 font-medium">
                        {publish ? 'Publish immediately' : 'Save as draft'}
                    </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={submitting || !title.trim() || !content.trim()}
                        className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/20 cursor-pointer"
                    >
                        {submitting ? 'Creating...' : 'Create post'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard')}
                        className="text-sm font-semibold px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100 hover:border-zinc-600 transition-all duration-200 cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
