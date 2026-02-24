'use client';

import Link from 'next/link';
import { PenTool, Globe, MessageCircle, Shield, Zap, Layers } from 'lucide-react';

const features = [
  {
    icon: <PenTool className="w-6 h-6" />,
    title: 'Write with clarity',
    description: 'A distraction-free editor designed for focused, long-form writing.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Reach everyone',
    description: 'Publish instantly to a public feed. Your words, discoverable by the world.',
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Spark conversations',
    description: 'Built-in comments and likes to drive engagement around every post.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Secure by default',
    description: 'JWT authentication, rate limiting, and input validation out of the box.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Lightning fast',
    description: 'Optimized queries, pagination, and a modern frontend for blazing speed.',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Full-stack ready',
    description: 'NestJS backend with Prisma ORM. Next.js frontend. Production-grade stack.',
  },
];

export default function LandingPage() {
  return (
    <div className="bg-zinc-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <section className="pt-24 pb-20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-semibold text-cyan-400 tracking-wide uppercase mb-8">
              <Zap className="w-3.5 h-3.5" />
              Open-source blogging platform
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold text-zinc-50 tracking-tight leading-[1.1] mb-6">
              Share your ideas
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                with the world
              </span>
            </h1>

            <p className="text-lg text-zinc-300 leading-relaxed max-w-lg mx-auto mb-10">
              A production-ready platform for writers. Create, publish, and grow your audience with a stack built for scale.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 transition-all duration-200 shadow-lg shadow-cyan-500/25"
              >
                Start writing
              </Link>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100 hover:border-zinc-600 transition-all duration-200"
              >
                Explore feed
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/60"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:bg-cyan-500/15 transition-colors duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-zinc-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
