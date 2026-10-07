'use client';

import React from 'react';
import {
  Film,
  Music,
  ShieldCheck,
  Zap,
  Smartphone,
  Sparkles,
  Lock,
  Layers,
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      title: 'Full HD 1080p Video',
      desc: 'Save videos in true 1080p, 720p, 480p, or 360p MP4 formats when permitted by the source platform.',
      icon: Film,
      gradient: 'from-blue-500/20 to-indigo-500/20',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Lossless Audio Extraction',
      desc: 'Convert any supported public video or reel directly into crystal-clear 320kbps MP3 or lightweight M4A audio files.',
      icon: Music,
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400',
    },
    {
      title: 'Zero Server Retention',
      desc: 'KangarooYT streams data directly to your client. No videos, audios, or personal identifiers are stored on our servers.',
      icon: Lock,
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Local Browser History',
      desc: 'All your past downloads and conversions are saved locally on your device via HTML5 localStorage for instant re-downloading.',
      icon: Layers,
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-400',
    },
    {
      title: 'SSRF & Abuse Shield',
      desc: 'Armed with server-side URL validation, private IP firewalling, and strict sliding-window rate limiting to prevent abuse.',
      icon: ShieldCheck,
      gradient: 'from-sky-500/20 to-blue-500/20',
      iconColor: 'text-sky-400',
    },
    {
      title: 'No Deceptive Downloads',
      desc: 'We never fake download progress. If a platform restricts automated access, we transparently explain why.',
      icon: Sparkles,
      gradient: 'from-violet-500/20 to-purple-500/20',
      iconColor: 'text-violet-400',
    },
  ];

  return (
    <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] dark:border-white/[0.06] light:border-slate-200">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold uppercase tracking-wider mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>Engineered for Excellence</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight mb-4">
          Designed for Speed, Security & Simplicity
        </h2>
        <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-base">
          Everything you need in a modern media converter, built with ethical web standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="glass-panel rounded-3xl p-6 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 hover:border-purple-500/30 transition-all duration-300 group hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.gradient} border border-white/[0.08] flex items-center justify-center ${feat.iconColor} mb-5 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 mb-2">
                {feat.title}
              </h3>

              <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
