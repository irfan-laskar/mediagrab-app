'use client';

import React from 'react';
import { DownloadCloud, Moon, Sun, History, ShieldCheck, Sparkles } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export function Navbar({ darkMode, setDarkMode, historyCount, onOpenHistory }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#090b10]/80 dark:bg-[#090b10]/80 light:bg-white/80 border-b border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-[0_0_24px_rgba(124,58,237,0.4)] group-hover:scale-105 transition-transform duration-300">
            <DownloadCloud className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent dark:from-white dark:to-slate-400 light:from-slate-900 light:to-slate-700">
                Media<span className="text-purple-400">Grab</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                PRO
              </span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium">
              Lawful Media Extractor
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-600">
          <a
            href="#downloader"
            className="hover:text-purple-400 dark:hover:text-purple-400 light:hover:text-purple-600 transition-colors"
          >
            Downloader
          </a>
          <a
            href="#platforms"
            className="hover:text-purple-400 dark:hover:text-purple-400 light:hover:text-purple-600 transition-colors"
          >
            Supported Platforms
          </a>
          <a
            href="#how-it-works"
            className="hover:text-purple-400 dark:hover:text-purple-400 light:hover:text-purple-600 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#features"
            className="hover:text-purple-400 dark:hover:text-purple-400 light:hover:text-purple-600 transition-colors"
          >
            Features
          </a>
          <a
            href="#faq"
            className="hover:text-purple-400 dark:hover:text-purple-400 light:hover:text-purple-600 transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Operational & Safe</span>
          </div>

          {/* Download History Button */}
          <button
            onClick={onOpenHistory}
            className="relative p-2.5 rounded-xl border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-100 hover:bg-white/[0.08] dark:hover:bg-white/[0.08] light:hover:bg-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="View Download History"
          >
            <History className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2.5 rounded-xl border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-100 hover:bg-white/[0.08] dark:hover:bg-white/[0.08] light:hover:bg-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500 hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
