'use client';

import React from 'react';
import { Sparkles, Shield, Zap, Film, Music, CheckCircle2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -top-24 left-1/4 w-[300px] h-[300px] bg-purple-500/15 blur-[90px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -top-24 right-1/4 w-[300px] h-[300px] bg-blue-500/15 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top SaaS Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-500/20 text-purple-300 dark:text-purple-300 light:text-purple-700 text-xs sm:text-sm font-medium mb-6 shadow-[0_0_20px_rgba(124,58,237,0.15)] animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Next-Generation Lawful Media Extraction</span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span className="text-slate-400 dark:text-slate-400 light:text-slate-500">Fast & Zero Tracking</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white dark:text-white light:text-slate-900 leading-[1.15] mb-6">
          Download Public Media from{' '}
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
            YouTube & Instagram
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 dark:text-slate-300 light:text-slate-600 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Instantly convert and download publicly accessible videos in crisp{' '}
          <strong className="text-white dark:text-white light:text-slate-900 font-semibold">1080p MP4</strong> or extract pristine{' '}
          <strong className="text-white dark:text-white light:text-slate-900 font-semibold">320kbps MP3 audio</strong>. Free, private, and fully compliant with platform terms.
        </p>

        {/* Capability Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-600">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200">
            <Film className="w-4 h-4 text-blue-400" />
            <span>MP4 up to 1080p</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200">
            <Music className="w-4 h-4 text-purple-400" />
            <span>MP3 & M4A Audio</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>No DRM Bypassing</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Direct Stream Speed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
