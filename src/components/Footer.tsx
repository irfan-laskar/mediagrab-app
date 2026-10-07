'use client';

import { DownloadCloud, ShieldCheck } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 bg-[#07090e] dark:bg-[#07090e] light:bg-slate-50 transition-colors py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-white/[0.06] dark:border-white/[0.06] light:border-slate-200">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-purple-600 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(245,158,11,0.3)] select-none">
                🦘
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white dark:text-white light:text-slate-900">
                Kangaroo<span className="text-amber-400">YT</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 max-w-sm">
              The high-speed, compliant media extractor for YouTube and Instagram. Built for creator workflows and personal backup.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-300 dark:text-slate-300 light:text-slate-600">
            <a href="#downloader" className="hover:text-purple-400 transition-colors">
              Downloader
            </a>
            <a href="#platforms" className="hover:text-purple-400 transition-colors">
              Platforms
            </a>
            <a href="#how-it-works" className="hover:text-purple-400 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-purple-400 transition-colors">
              Features
            </a>
            <a href="#faq" className="hover:text-purple-400 transition-colors">
              FAQ
            </a>
            <a href="#legal" className="hover:text-purple-400 transition-colors">
              Legal & DMCA
            </a>
          </div>

          {/* Security Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted & Rate-Protected</span>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500 light:text-slate-400">
          <p>© {currentYear} KangarooYT. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Designed with precision for modern creators & archivists</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
