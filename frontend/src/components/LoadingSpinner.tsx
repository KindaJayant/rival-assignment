export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-cyan-400 rounded-full animate-spin" />
            <p className="text-sm text-zinc-500">Loading...</p>
        </div>
    );
}
