'use client';

import React from 'react';
import { ShieldAlert, Scale, CheckSquare, AlertCircle } from 'lucide-react';

export function LegalSection() {
  return (
    <section id="legal" className="py-16 max-w-5xl mx-auto px-4 sm:px-6 border-t border-white/[0.06] dark:border-white/[0.06] light:border-slate-200">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-purple-500/20 bg-gradient-to-b from-purple-950/10 to-transparent">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white dark:text-white light:text-slate-900">
              Legal, Copyright & Compliance Commitment
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-0.5">
              Transparent terms, zero circumvention, and complete respect for creator rights
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed mb-6">
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <CheckSquare className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-white dark:text-white light:text-slate-900 font-semibold">User Responsibility:</strong>{' '}
                MediaGrab is a technical tool designed for personal backup, offline research, and permitted fair use. Users are solely responsible for ensuring they possess the appropriate rights, licenses, or permission from copyright holders before saving media.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckSquare className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-white dark:text-white light:text-slate-900 font-semibold">No Circumvention of DRM:</strong>{' '}
                MediaGrab strictly adheres to technological protection measures. We do not decrypt DRM-protected streams, paywalled content, private profiles, or password-protected files.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <CheckSquare className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-white dark:text-white light:text-slate-900 font-semibold">Zero Content Hosting:</strong>{' '}
                MediaGrab does not host, mirror, or permanently store media files on its servers. All data transfers occur transiently as passthrough streams or client-side operations.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckSquare className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-white dark:text-white light:text-slate-900 font-semibold">Platform Terms Respect:</strong>{' '}
                Use of this tool is subject to the terms and privacy conditions of YouTube, Instagram, and any respective third-party provider.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Notice: MediaGrab is an independent software tool and is not affiliated, endorsed, or associated with Google LLC, YouTube, Meta Platforms, Inc., or Instagram. All trademarks and brand assets belong to their respective owners.
          </span>
        </div>
      </div>
    </section>
  );
}
