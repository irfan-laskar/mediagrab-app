'use client';

import React from 'react';
import { Copy, Sliders, Download, CheckCircle, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Copy the Media Link',
      desc: 'Browse YouTube or Instagram and copy the URL of any publicly viewable video, short, or reel from your browser bar or share button.',
      icon: Copy,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      step: '02',
      title: 'Analyze & Choose Format',
      desc: 'Paste the link into MediaGrab. Our engine detects the platform, parses metadata, and lets you choose between MP4 video resolutions or MP3 audio bitrates.',
      icon: Sliders,
      color: 'from-purple-500 to-pink-600',
    },
    {
      step: '03',
      title: 'Safe Direct Download',
      desc: 'Click your preferred format to initiate the high-speed stream. The file saves directly onto your device without any server tracking or watermarks.',
      icon: Download,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] dark:border-white/[0.06] light:border-slate-200">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider mb-4">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Simple 3-Step Workflow</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight mb-4">
          How MediaGrab Works
        </h2>
        <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-base">
          Engineered for effortless media conversion and lawful download streaming in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-panel rounded-3xl p-8 border border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 hover:border-purple-500/30 transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-4xl font-extrabold text-white/10 dark:text-white/10 light:text-slate-200 font-mono">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.05] dark:border-white/[0.05] light:border-slate-100 flex items-center text-xs font-medium text-purple-400">
                <span>Fast & Lawful Process</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
