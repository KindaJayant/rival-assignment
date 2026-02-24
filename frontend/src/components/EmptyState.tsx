import { FileText } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    message: string;
    icon?: React.ReactNode;
}

export default function EmptyState({ title, message, icon }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-zinc-600">
                {icon || <FileText className="w-12 h-12" />}
            </div>
            <h3 className="text-lg font-bold text-zinc-300 mb-1">{title}</h3>
            <p className="text-sm text-zinc-500 max-w-xs">{message}</p>
        </div>
    );
}
