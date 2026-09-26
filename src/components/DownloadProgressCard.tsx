'use client';

import React, { useEffect, useState } from 'react';
import {
  Clock,
  Zap,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Film,
  Music,
  X,
  Sparkles,
} from 'lucide-react';
import { DownloadProgress } from '@/lib/downloadJobs';

interface DownloadProgressCardProps {
  progress: DownloadProgress;
  onDismiss: () => void;
  onDownloadFile: (jobId: string) => void;
}

export function DownloadProgressCard({
  progress,
  onDismiss,
  onDownloadFile,
}: DownloadProgressCardProps) {
  // Client-side smooth elapsed timer ticker
  const [tickerMs, setTickerMs] = useState(progress.elapsedMs || 0);

  useEffect(() => {
    if (progress.status === 'ready' || progress.status === 'failed') {
      setTickerMs(progress.elapsedMs);
      return;
    }

    const interval = setInterval(() => {
      setTickerMs(Date.now() - progress.startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [progress.startTime, progress.status, progress.elapsedMs]);

  const formatTimer = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${tenths}s`;
  };

  const isReady = progress.status === 'ready';
  const isFailed = progress.status === 'failed';

  return (
    <div className="w-full mt-6 p-5 sm:p-6 rounded-2xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-slate-100 border border-purple-500/30 shadow-[0_8px_32px_rgba(124,58,237,0.2)] animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          {isReady ? (
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : isFailed ? (
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
              <AlertCircle className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                {progress.mediaType === 'audio' ? <Music className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                {isReady ? 'Download Ready' : isFailed ? 'Download Failed' : 'Active Download Processing'}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                {progress.formatLabel}
              </span>
            </div>
            <p className="text-sm font-semibold text-white dark:text-white light:text-slate-900 line-clamp-1 mt-0.5">
              {progress.title}
            </p>
          </div>
        </div>

        {/* Dismiss / close button */}
        {(isReady || isFailed) && (
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white text-xs transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Bar & Percentage */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span className="text-slate-300 dark:text-slate-300 light:text-slate-700 flex items-center gap-1.5">
            {!isReady && !isFailed && <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping inline-block" />}
            {progress.stage}
          </span>
          <span className="text-purple-400 font-mono font-bold text-sm">
            {progress.percentage}%
          </span>
        </div>

        {/* Bar */}
        <div className="w-full h-3 rounded-full bg-slate-950/80 overflow-hidden border border-white/[0.08] relative">
          <div
            className={`h-full transition-all duration-300 rounded-full relative ${
              isReady
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : isFailed
                ? 'bg-red-500'
                : 'bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]'
            }`}
            style={{ width: `${Math.max(5, Math.min(100, progress.percentage))}%` }}
          >
            {/* Shimmer light animation */}
            {!isReady && !isFailed && (
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Real-time stats grid: Elapsed Time, Speed, Total Size, ETA */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-white/[0.08]">
        {/* Metric 1: Elapsed Time */}
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-purple-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block uppercase font-medium tracking-wider">
              {isReady ? 'Total Time' : 'Time Elapsed'}
            </span>
            <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 font-mono">
              {formatTimer(tickerMs)}
            </span>
          </div>
        </div>

        {/* Metric 2: Speed */}
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center gap-2.5">
          <Zap className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block uppercase font-medium tracking-wider">
              Transfer Speed
            </span>
            <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 font-mono truncate block">
              {progress.speed || '--'}
            </span>
          </div>
        </div>

        {/* Metric 3: Size */}
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center gap-2.5">
          <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block uppercase font-medium tracking-wider">
              Media Size
            </span>
            <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 font-mono truncate block">
              {progress.totalSize || '--'}
            </span>
          </div>
        </div>

        {/* Metric 4: ETA or Completion */}
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center gap-2.5">
          {isReady ? (
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block uppercase font-medium tracking-wider">
              {isReady ? 'Status' : 'Est. Remaining'}
            </span>
            <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 font-mono truncate block">
              {isReady ? 'Completed' : progress.eta || 'Calculating'}
            </span>
          </div>
        </div>
      </div>

      {/* Completion or Error Action Bar */}
      {isReady && (
        <div className="mt-4 pt-3 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-500/10 p-3 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Downloaded in <strong className="font-mono text-emerald-200">{(tickerMs / 1000).toFixed(1)} seconds</strong>! Your browser is saving the file.
            </span>
          </div>

          <button
            onClick={() => onDownloadFile(progress.jobId)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
          >
            <span>Save Again</span>
          </button>
        </div>
      )}

      {isFailed && (
        <div className="mt-4 pt-3 border-t border-red-500/20 flex items-start gap-2 bg-red-500/10 p-3 rounded-xl text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Extraction Error:</span>
            <span className="font-mono text-[11px] leading-relaxed block break-words">
              {progress.error || 'Failed to complete extraction. Please verify source media is publicly accessible.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
