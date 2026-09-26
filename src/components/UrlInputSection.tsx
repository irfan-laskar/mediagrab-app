'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ClipboardPaste,
  X,
  Loader2,
  AlertCircle,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { YouTubeIcon, InstagramIcon } from './BrandIcons';
import { MediaPlatform } from '@/types';

interface UrlInputSectionProps {
  onFetch: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClear: () => void;
  initialUrl?: string;
}

export function UrlInputSection({
  onFetch,
  isLoading,
  error,
  onClear,
  initialUrl = '',
}: UrlInputSectionProps) {
  const [url, setUrl] = useState(initialUrl);
  const [detectedPlatform, setDetectedPlatform] = useState<MediaPlatform>('unknown');
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-detect platform dynamically as user types or pastes
  useEffect(() => {
    const val = url.trim().toLowerCase();
    if (val.includes('youtube.com') || val.includes('youtu.be')) {
      setDetectedPlatform('youtube');
    } else if (val.includes('instagram.com') || val.includes('instagr.am')) {
      setDetectedPlatform('instagram');
    } else {
      setDetectedPlatform('unknown');
    }
  }, [url]);

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
    }
  }, [initialUrl]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    onFetch(url.trim());
  };

  // Paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        inputRef.current?.focus();
      }
    } catch {
      // Clipboard permissions denied
    }
  };

  // Clear input
  const handleReset = () => {
    setUrl('');
    setDetectedPlatform('unknown');
    onClear();
    inputRef.current?.focus();
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedText = e.dataTransfer.getData('text');
    if (droppedText) {
      setUrl(droppedText.trim());
      onFetch(droppedText.trim());
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Quick try sample links
  const sampleUrls = [
    {
      label: 'Big Buck Bunny (YouTube CC)',
      url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      platform: 'youtube',
    },
    {
      label: 'Sintel Film (YouTube 4K)',
      url: 'https://www.youtube.com/watch?v=eOrNdB2PC6k',
      platform: 'youtube',
    },
    {
      label: 'Public Nature Reel (Instagram)',
      url: 'https://www.instagram.com/reel/CUb3t7LL5_2/',
      platform: 'instagram',
    },
  ];

  return (
    <section id="downloader" className="w-full max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`glass-panel rounded-3xl p-4 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.4)] border transition-all duration-300 ${
          isDragOver
            ? 'border-purple-500 bg-purple-950/20 ring-4 ring-purple-500/20'
            : 'border-white/[0.09] dark:border-white/[0.09] light:border-slate-200'
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Input Box with Icons */}
            <div className="relative flex-1 flex items-center">
              {/* Platform Detection Indicator Icon */}
              <div className="absolute left-4.5 z-10 flex items-center pointer-events-none">
                {detectedPlatform === 'youtube' ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold animate-in fade-in zoom-in-95">
                    <YouTubeIcon className="w-4 h-4 fill-red-500" />
                    <span className="hidden sm:inline">YouTube</span>
                  </div>
                ) : detectedPlatform === 'instagram' ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 text-pink-400 border border-pink-500/30 text-xs font-semibold animate-in fade-in zoom-in-95">
                    <InstagramIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Instagram</span>
                  </div>
                ) : (
                  <Search className="w-5 h-5 text-slate-400 dark:text-slate-400 light:text-slate-500" />
                )}
              </div>

              {/* Large Input Field */}
              <input
                ref={inputRef}
                type="text"
                id="media-url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste video or reel URL here (e.g., youtube.com/watch?v=... or instagram.com/reel/...)"
                className={`w-full py-4.5 rounded-2xl bg-black/40 dark:bg-black/40 light:bg-slate-50 text-white dark:text-white light:text-slate-900 placeholder:text-slate-500 dark:placeholder:text-slate-500 light:placeholder:text-slate-400 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 text-sm sm:text-base font-normal transition-all ${
                  detectedPlatform !== 'unknown' ? 'pl-28 sm:pl-32' : 'pl-12 sm:pl-13'
                } pr-24`}
                disabled={isLoading}
              />

              {/* Input Action Buttons (Clear & Paste) */}
              <div className="absolute right-3 flex items-center gap-1">
                {url && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-800 hover:bg-white/10 transition-colors"
                    title="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePaste}
                  className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] dark:bg-white/[0.06] dark:hover:bg-white/[0.12] light:bg-slate-200 light:hover:bg-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
                  title="Paste from clipboard"
                >
                  <ClipboardPaste className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">Paste</span>
                </button>
              </div>
            </div>

            {/* Fetch Media Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              id="fetch-media-btn"
              className="px-7 py-4.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-400 text-white font-semibold text-sm sm:text-base shadow-[0_0_24px_rgba(124,58,237,0.35)] hover:shadow-[0_0_32px_rgba(124,58,237,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <span>Fetch Media</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Alert Message */}
        {error && (
          <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-300 dark:text-red-300 light:text-red-700 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{error}</p>
              <p className="text-xs text-red-400/80 dark:text-red-400/80 light:text-red-600/80 mt-1">
                Tip: Try one of the verified sample links below to test lawful stream processing instantly.
              </p>
            </div>
            <button
              onClick={onClear}
              className="text-red-400 hover:text-red-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick-Try Sample Links */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] dark:border-white/[0.06] light:border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Test Samples:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {sampleUrls.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUrl(sample.url);
                  onFetch(sample.url);
                }}
                disabled={isLoading}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-100 hover:bg-purple-500/15 dark:hover:bg-purple-500/15 light:hover:bg-purple-100 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-purple-300 transition-all font-medium flex items-center gap-1.5"
              >
                {sample.platform === 'youtube' ? (
                  <YouTubeIcon className="w-3 h-3 text-red-400" />
                ) : (
                  <InstagramIcon className="w-3 h-3 text-pink-400" />
                )}
                <span>{sample.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Legal & Compliance Notice near downloader */}
        <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-normal">
          <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span>
            Only download content you have permission to download. Respect copyright and the terms of the source platform.
          </span>
        </div>
      </div>
    </section>
  );
}
