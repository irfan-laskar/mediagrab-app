'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is using KangarooYT legal?',
      a: 'Yes. KangarooYT is designed exclusively for accessing and converting publicly available content for personal, non-commercial use, archiving, or fair use where permitted by law. You must respect creator copyright and the Terms of Service of the respective platforms. KangarooYT explicitly blocks circumvention of DRM, password protection, and private account boundaries.',
    },
    {
      q: 'Which video resolutions and audio formats can I download?',
      a: 'For video, KangarooYT offers MP4 format in 1080p (Full HD), 720p (HD), 480p (SD), and 360p when provided by the source. For audio extraction, you can download MP3 files in 320 kbps (Studio), 256 kbps (High Quality), 192 kbps (Standard), or AAC-encoded M4A.',
    },
    {
      q: 'Why can’t I download private videos, age-gated media, or certain reels?',
      a: 'KangarooYT strictly respects digital rights and user privacy. We do not attempt to bypass DRM (Digital Rights Management), login barriers, paywalls, or private account restrictions. If a video is marked private, age-restricted, or requires user credentials, we honestly inform you rather than feigning a download.',
    },
    {
      q: 'Does KangarooYT store my downloaded media files or history on a server?',
      a: 'No. All media streams are piped in real-time directly between your browser and the content stream, and any temporary buffer data is immediately freed. Your download history is kept strictly on your local device using standard browser localStorage.',
    },
    {
      q: 'Can I use KangarooYT on mobile devices (iOS / Android)?',
      a: 'Yes! KangarooYT is fully responsive and optimized for mobile browsers including Safari on iOS and Chrome on Android. You can download MP4 videos or MP3 audio files directly into your device’s Downloads or Files app.',
    },
    {
      q: 'How does rate limiting protect the service?',
      a: 'To safeguard our infrastructure against automated abuse and spam, our backend enforces a sliding-window rate limit (up to 30 requests per minute per IP address). Normal personal use will never be interrupted.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 border-t border-white/[0.06] dark:border-white/[0.06] light:border-slate-200">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider mb-4">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight mb-4">
          Got Questions? We’ve Got Answers.
        </h2>
        <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-base">
          Find clarity on formats, platform compliance, security, and lawful usage.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`glass-panel rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'border-purple-500/40 bg-purple-950/10'
                  : 'border-white/[0.06] dark:border-white/[0.06] light:border-slate-200'
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-semibold text-base sm:text-lg text-white dark:text-white light:text-slate-900">
                  {faq.q}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen
                      ? 'rotate-180 bg-purple-600 text-white'
                      : 'bg-white/[0.04] text-slate-400'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed border-t border-white/[0.04] dark:border-white/[0.04] light:border-slate-100 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
