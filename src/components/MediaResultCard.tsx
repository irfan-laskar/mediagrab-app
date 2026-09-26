'use client';

import React, { useState } from 'react';
import {
  Film,
  Music,
  Download,
  Copy,
  Check,
  ExternalLink,
  Clock,
  User,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Loader2,
  AlertTriangle,
  Play,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MediaMetadata, VideoFormat, AudioFormat, DownloadHistoryItem } from '@/types';

import { DownloadProgressCard } from './DownloadProgressCard';
import { DownloadProgress } from '@/lib/downloadJobs';

interface MediaResultCardProps {
  metadata: MediaMetadata;
  onReset: () => void;
  onAddToHistory: (item: Omit<DownloadHistoryItem, 'id' | 'timestamp'>) => void;
}

export function MediaResultCard({
  metadata,
  onReset,
  onAddToHistory,
}: MediaResultCardProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [activeJob, setActiveJob] = useState<DownloadProgress | null>(null);

  // Copy media link to clipboard
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(metadata.url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // ignore
    }
  };

  // Trigger file download to device from ready job
  const triggerSaveFile = (jobId: string, jobProgress: DownloadProgress) => {
    const fileUrl = `/api/download/file?jobId=${jobId}`;
    const a = document.createElement('a');
    a.href = fileUrl;
    a.setAttribute('download', '');
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 1000);

    const timeSeconds = (jobProgress.elapsedMs / 1000).toFixed(1) + 's';

    // Add to local history with duration
    onAddToHistory({
      url: metadata.url,
      title: metadata.title,
      platform: metadata.platform,
      thumbnailUrl: metadata.thumbnailUrl,
      formatId: jobProgress.formatId,
      formatLabel: jobProgress.formatLabel,
      mediaType: jobProgress.mediaType,
      fileSize: jobProgress.totalSize || '--',
      timeTaken: timeSeconds,
    });

    // Launch victory confetti
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#8b5cf6', '#3b82f6', '#10b981'],
      });
    } catch {
      // Confetti optional
    }
  };

  // Trigger media download with tracked progress
  const handleDownload = async (
    format: VideoFormat | AudioFormat,
    type: 'video' | 'audio'
  ) => {
    setDownloadError(null);
    setDownloadingId(format.id);

    const formatLabel =
      type === 'video'
        ? (format as VideoFormat).qualityLabel
        : (format as AudioFormat).qualityLabel;

    // Set immediate active progress state
    setActiveJob({
      jobId: 'pending',
      url: metadata.url,
      title: metadata.title,
      formatId: format.id,
      formatLabel,
      mediaType: type,
      status: 'starting',
      percentage: 8,
      stage: 'Connecting to source platform and resolving stream tracks...',
      speed: '--',
      eta: 'Calculating',
      totalSize: format.fileSizeApprox || '--',
      downloadedBytes: 0,
      startTime: Date.now(),
      elapsedMs: 0,
    });

    try {
      const startRes = await fetch('/api/download/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: metadata.url,
          formatId: format.id,
          mediaType: type,
          formatLabel,
        }),
      });

      if (!startRes.ok) {
        const errJson = await startRes.json().catch(() => ({}));
        throw new Error(errJson.error || `Download failed with HTTP ${startRes.status}`);
      }

      const { jobId } = await startRes.json();

      // Poll progress every 200ms
      const pollInterval = setInterval(async () => {
        try {
          const pRes = await fetch(`/api/download/progress?jobId=${jobId}`);
          if (pRes.ok) {
            const pData = await pRes.json();
            if (pData.success && pData.progress) {
              setActiveJob(pData.progress);

              if (pData.progress.status === 'ready') {
                clearInterval(pollInterval);
                setDownloadingId(null);
                triggerSaveFile(jobId, pData.progress);
              } else if (pData.progress.status === 'failed') {
                clearInterval(pollInterval);
                setDownloadingId(null);
                setDownloadError(pData.progress.error || 'Download failed during extraction.');
              }
            }
          }
        } catch {
          // Keep polling
        }
      }, 200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Download failed to start.';
      setDownloadError(msg);
      setActiveJob(null);
      setDownloadingId(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-panel rounded-3xl p-5 sm:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.5)] border border-white/[0.1] dark:border-white/[0.1] light:border-slate-200">
        {/* Top Header: Title, Platform, Duration, Reset button */}
        <div className="flex flex-col md:flex-row items-start gap-6 pb-6 border-b border-white/[0.08] dark:border-white/[0.08] light:border-slate-200">
          {/* Thumbnail / Video Preview Box */}
          <div className="relative w-full md:w-64 aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-white/[0.08] shrink-0 shadow-lg group">
            <img
              src={metadata.thumbnailUrl}
              alt={metadata.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                // Fallback image if remote thumbnail is blocked
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
              }}
            />

            {/* Platform Badge Overlay */}
            <div className="absolute top-2.5 left-2.5">
              {metadata.platform === 'youtube' ? (
                <span className="px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-[11px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                  YouTube
                </span>
              ) : metadata.platform === 'instagram' ? (
                <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                  Instagram
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-slate-700 text-white text-[11px] font-bold tracking-wider uppercase shadow-md">
                  Web Media
                </span>
              )}
            </div>

            {/* Duration Badge Overlay */}
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-white text-xs font-mono font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-300" />
              <span>{metadata.durationFormatted}</span>
            </div>

            {/* Sample Demo Pill */}
            {metadata.sampleDemo && (
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3" />
                <span>Verified Direct Stream</span>
              </div>
            )}
          </div>

          {/* Title and Metadata details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                  {metadata.platform} Media
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyUrl}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] light:bg-slate-100 light:hover:bg-slate-200 text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 text-xs transition-colors flex items-center gap-1"
                    title="Copy Source URL"
                  >
                    {copiedUrl ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                  </button>

                  <a
                    href={metadata.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] light:bg-slate-100 light:hover:bg-slate-200 text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 text-xs transition-colors flex items-center gap-1"
                    title="Open on platform"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={onReset}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] light:bg-slate-100 light:hover:bg-slate-200 text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 text-xs transition-colors flex items-center gap-1"
                    title="Fetch another media"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                    <span className="hidden sm:inline">New</span>
                  </button>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white dark:text-white light:text-slate-900 leading-snug line-clamp-2 mb-2">
                {metadata.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-4">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
                    {metadata.author}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duration: {metadata.durationFormatted}</span>
                </div>
              </div>
            </div>

            {/* Platform Policy / Compliance Status Pill */}
            {metadata.directDownloadAllowed ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Verified Direct Media Stream Available</span>
              </div>
            ) : (
              <div className="inline-flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 dark:text-amber-300 light:text-amber-700 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <span className="font-semibold block">Extractor Status: Direct Stream Unavailable</span>
                  <span className="text-amber-300/90 dark:text-amber-300/90 light:text-amber-700/90 font-mono text-[11px] mt-0.5 block break-words">
                    {metadata.backendError ||
                      metadata.restrictionReason ||
                      'Source platform restricts automated third-party downloads via DRM or authentication barriers.'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Download Restriction Alert banner if user clicked a restricted stream */}
        {downloadError && (
          <div className="mt-5 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 dark:text-amber-200 light:text-amber-800 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block mb-1">Backend Extraction Diagnostics:</span>
              <p className="leading-relaxed font-mono text-xs">{downloadError}</p>
              <p className="mt-2 text-xs text-amber-300/80 font-medium font-sans">
                Try clicking one of our verified public sample movies (such as Big Buck Bunny) in the quick-try bar to test full-speed, genuine file downloads.
              </p>
            </div>
          </div>
        )}

        {/* Real-time Download Progress Card */}
        {activeJob && (
          <DownloadProgressCard
            progress={activeJob}
            onDismiss={() => setActiveJob(null)}
            onDownloadFile={(jobId) => {
              const a = document.createElement('a');
              a.href = `/api/download/file?jobId=${jobId}`;
              a.setAttribute('download', '');
              document.body.appendChild(a);
              a.click();
              setTimeout(() => a.remove(), 1000);
            }}
          />
        )}

        {/* Tabs: Video Formats vs Audio Formats */}
        <div className="mt-6 flex items-center justify-between border-b border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-purple-600 text-white shadow-[0_0_16px_rgba(124,58,237,0.4)]'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/[0.08]'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Video (MP4)</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20">
                {metadata.videoFormats.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'audio'
                  ? 'bg-purple-600 text-white shadow-[0_0_16px_rgba(124,58,237,0.4)]'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/[0.08]'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Audio (MP3 / M4A)</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20">
                {metadata.audioFormats.length}
              </span>
            </button>
          </div>

          <span className="hidden sm:block text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium">
            Select desired resolution or bitrate
          </span>
        </div>

        {/* Format Cards List */}
        <div className="mt-6">
          {activeTab === 'video' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {metadata.videoFormats.map((format) => (
                <div
                  key={format.id}
                  className="p-4 rounded-2xl bg-white/[0.02] dark:bg-white/[0.02] light:bg-slate-50 border border-white/[0.06] dark:border-white/[0.06] light:border-slate-200 hover:border-purple-500/30 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:scale-105 transition-transform">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white dark:text-white light:text-slate-900">
                          {format.resolution}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                          {format.container}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 block">
                        Approx: {format.fileSizeApprox}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDownload(format, 'video')}
                      disabled={downloadingId === format.id}
                      className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-purple-600 hover:text-white text-slate-200 dark:text-slate-200 light:text-slate-800 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
                    >
                      {downloadingId === format.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download MP4</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`/api/download?url=${encodeURIComponent(metadata.url)}&formatId=${encodeURIComponent(format.id)}&mediaType=video`}
                      download
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-purple-300 transition-colors"
                      title="Direct download link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {metadata.audioFormats.map((format) => (
                <div
                  key={format.id}
                  className="p-4 rounded-2xl bg-white/[0.02] dark:bg-white/[0.02] light:bg-slate-50 border border-white/[0.06] dark:border-white/[0.06] light:border-slate-200 hover:border-purple-500/30 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20 group-hover:scale-105 transition-transform">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white dark:text-white light:text-slate-900">
                          {format.bitrate}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                          {format.format}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 block">
                        Approx: {format.fileSizeApprox}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDownload(format, 'audio')}
                      disabled={downloadingId === format.id}
                      className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-purple-600 hover:text-white text-slate-200 dark:text-slate-200 light:text-slate-800 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
                    >
                      {downloadingId === format.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Extracting...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Audio</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`/api/download?url=${encodeURIComponent(metadata.url)}&formatId=${encodeURIComponent(format.id)}&mediaType=audio`}
                      download
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-purple-300 transition-colors"
                      title="Direct download link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legal notice inside card */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] dark:border-white/[0.06] light:border-slate-200 flex items-center justify-between text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
          <span>{metadata.downloadNotice}</span>
          <button
            onClick={onReset}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Clear & Convert Another →
          </button>
        </div>
      </div>
    </div>
  );
}
