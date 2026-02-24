'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Feather, LogOut, Settings, User as UserIcon, ChevronDown } from 'lucide-react';

export default function Navbar() {
    const { user, logout, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
        router.push('/');
    };

    return (
        <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 text-zinc-50 font-bold text-lg tracking-tight">
                    <Feather className="w-5 h-5 text-cyan-400" />
                    <span>BlogPlatform</span>
                </Link>

                <div className="flex items-center gap-3">
                    <Link
                        href="/feed"
                        className="text-zinc-400 text-sm font-medium px-3 py-1.5 rounded-lg hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200"
                    >
                        Feed
                    </Link>

                    {!loading && (
                        <>
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-zinc-400 text-sm font-medium px-3 py-1.5 rounded-lg hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200"
                                    >
                                        Dashboard
                                    </Link>

                                    <div className="relative" ref={menuRef}>
                                        <button
                                            onClick={() => setMenuOpen(!menuOpen)}
                                            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-zinc-800/60 transition-all duration-200 group cursor-pointer"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                                        </button>

                                        {menuOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                                <div className="px-4 py-3 border-b border-zinc-800/60">
                                                    <p className="text-sm font-semibold text-zinc-100">{user?.name}</p>
                                                    <p className="text-xs text-zinc-500 mt-0.5">{user?.email}</p>
                                                </div>
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => { setMenuOpen(false); router.push('/dashboard'); }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100 transition-colors cursor-pointer"
                                                    >
                                                        <UserIcon className="w-4 h-4 text-zinc-500" />
                                                        My Dashboard
                                                    </button>
                                                    <button
                                                        onClick={() => setMenuOpen(false)}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100 transition-colors cursor-pointer"
                                                    >
                                                        <Settings className="w-4 h-4 text-zinc-500" />
                                                        Settings
                                                    </button>
                                                </div>
                                                <div className="border-t border-zinc-800/60 py-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Sign out
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-zinc-400 text-sm font-medium px-3 py-1.5 rounded-lg hover:text-zinc-100 hover:bg-zinc-800/50 transition-all duration-200"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 transition-all duration-200 shadow-lg shadow-cyan-500/20"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
