'use client';

interface CommentItemProps {
    content: string;
    createdAt: string;
    user: { name: string; email: string };
}

export default function CommentItem({ content, createdAt, user }: CommentItemProps) {
    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <span className="block text-xs font-semibold text-zinc-200">{user.name}</span>
                    <span className="block text-[10px] text-zinc-600">{formattedDate}</span>
                </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed pl-[38px]">{content}</p>
        </div>
    );
}
