'use client';

import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';

interface BlogCardProps {
    id: string;
    title: string;
    slug: string;
    content: string;
    summary?: string | null;
    createdAt: string;
    author?: { name: string; email: string };
    likeCount?: number;
    commentCount?: number;
    isPublished?: boolean;
    showActions?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onTogglePublish?: () => void;
}

export default function BlogCard({
    title,
    slug,
    content,
    summary,
    createdAt,
    author,
    likeCount = 0,
    commentCount = 0,
    isPublished,
    showActions = false,
    onEdit,
    onDelete,
    onTogglePublish,
}: BlogCardProps) {
    const displayText = summary || content;
    const excerpt =
        displayText.length > 180
            ? displayText.substring(0, 180) + '...'
            : displayText;

    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className="group bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-6 transition-all duration-300 hover:border-zinc-700/80 hover:shadow-lg hover:shadow-black/20 hover:bg-zinc-900/70">
            <div className="flex items-center justify-between mb-4">
                {author && (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {author.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <span className="block text-sm font-semibold text-zinc-200">{author.name}</span>
                            <span className="block text-xs text-zinc-500">{formattedDate}</span>
                        </div>
                    </div>
                )}
                {isPublished !== undefined && (
                    <span
                        className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${isPublished
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                    >
                        {isPublished ? 'Published' : 'Draft'}
                    </span>
                )}
            </div>

            <Link href={`/blog/${slug}`} className="block group/title">
                <h3 className="text-lg font-bold text-zinc-50 mb-2 leading-snug group-hover/title:text-cyan-400 transition-colors duration-200">
                    {title}
                </h3>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed mb-5">{excerpt}</p>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Heart className="w-3.5 h-3.5" />
                        {likeCount}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {commentCount}
                    </span>
                </div>

                {showActions && (
                    <div className="flex items-center gap-2">
                        {onTogglePublish && (
                            <button
                                onClick={onTogglePublish}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-all duration-200 cursor-pointer"
                            >
                                {isPublished ? 'Unpublish' : 'Publish'}
                            </button>
                        )}
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-all duration-200 cursor-pointer"
                            >
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-800/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 cursor-pointer"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
