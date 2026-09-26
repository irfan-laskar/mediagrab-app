import React from 'react';
import { CheckCircle2, Shield, Info, Sparkles, Layers } from 'lucide-react';
import { YouTubeIcon, InstagramIcon } from './BrandIcons';

export function SupportedPlatforms() {
  return (
    <section id="platforms" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold uppercase tracking-wider mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>Platform Compatibility</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight mb-4">
          Supported Platforms & Media Types
        </h2>
        <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-base">
          MediaGrab provides dedicated extraction pipelines for public video and audio across top media networks.
        </p>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* YouTube Card */}
        <div className="glass-panel rounded-3xl p-8 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 hover:border-red-500/30 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full group-hover:scale-125 transition-transform" />

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-red-600/15 border border-red-500/30 text-red-500 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <YouTubeIcon className="w-8 h-8 fill-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
                  YouTube
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
                  VIDEOS & SHORTS
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-0.5">
                Full-length videos, Shorts, and audio extracts
              </p>
            </div>
          </div>

          <p className="text-slate-300 dark:text-slate-300 light:text-slate-600 text-sm leading-relaxed mb-6">
            Extract public standard videos and YouTube Shorts. Choose between multiple MP4 video resolutions up to 1080p Full HD or extract high-bitrate MP3/M4A sound tracks.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Standard Videos & YouTube Shorts URLs</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Resolutions: 1080p, 720p, 480p, 360p (MP4)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Audio Extractor: 320kbps, 256kbps, 192kbps MP3</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Requires public visibility (no private or age-gated videos)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Strict adherence to YouTube API guidelines and Terms of Service.</span>
          </div>
        </div>

        {/* Instagram Card */}
        <div className="glass-panel rounded-3xl p-8 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 hover:border-pink-500/30 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-3xl rounded-full group-hover:scale-125 transition-transform" />

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-amber-500/20 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
              <InstagramIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
                  Instagram
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                  REELS & POSTS
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-0.5">
                Public Reels, video posts, and audio clips
              </p>
            </div>
          </div>

          <p className="text-slate-300 dark:text-slate-300 light:text-slate-600 text-sm leading-relaxed mb-6">
            Fetch publicly accessible Instagram Reels and video posts. Download crisp vertical MP4 video or convert trending reel audio directly into MP3 sound files.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instagram Reels & Public Video Posts</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full resolution MP4 export (1080p original reel quality)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Original Reel Audio track extraction (MP3 / M4A)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Account must be public (private accounts are not accessible)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Does not bypass login sessions, paywalls, or private boundaries.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
