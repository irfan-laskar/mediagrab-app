'use client';

import React from 'react';
import {
  X,
  Trash2,
  ExternalLink,
  RotateCcw,
  Film,
  Music,
  Clock,
  DownloadCloud,
} from 'lucide-react';
import { YouTubeIcon, InstagramIcon } from './BrandIcons';
import { DownloadHistoryItem } from '@/types';

interface DownloadHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: DownloadHistoryItem[];
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
  onReFetch: (url: string) => void;
}

export function DownloadHistoryDrawer({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRemoveItem,
  onReFetch,
}: DownloadHistoryDrawerProps) {
  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#0e121d] dark:bg-[#0e121d] light:bg-white border-l border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <DownloadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white dark:text-white light:text-slate-900">
                Download History
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
                Stored privately on your device
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs font-medium flex items-center gap-1"
                title="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-500 mb-4">
                <Clock className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h4 className="font-semibold text-white dark:text-white light:text-slate-900 mb-1">
                No downloads yet
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 max-w-xs leading-relaxed">
                Downloaded videos and extracted audio tracks will appear here for easy access.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white/[0.02] dark:bg-white/[0.02] light:bg-slate-50 border border-white/[0.06] dark:border-white/[0.06] light:border-slate-200 hover:border-purple-500/30 transition-all flex items-start gap-3 group"
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/[0.08]">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    {item.platform === 'youtube' ? (
                      <YouTubeIcon className="w-3 h-3 text-red-500 shrink-0" />
                    ) : item.platform === 'instagram' ? (
                      <InstagramIcon className="w-3 h-3 text-pink-400 shrink-0" />
                    ) : null}
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {item.platform}
                    </span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] text-slate-400">{formatDate(item.timestamp)}</span>
                  </div>

                  <h5 className="text-xs font-semibold text-white dark:text-white light:text-slate-900 truncate mb-1">
                    {item.title}
                  </h5>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.04] text-purple-300 font-medium">
                      {item.mediaType === 'video' ? (
                        <Film className="w-3 h-3" />
                      ) : (
                        <Music className="w-3 h-3" />
                      )}
                      {item.formatLabel}
                    </span>
                    <span>{item.fileSize}</span>
                    {item.timeTaken && (
                      <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        ⚡ {item.timeTaken}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={() => {
                      onReFetch(item.url);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-white/[0.06] transition-colors"
                    title="Load again"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Remove from history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/[0.08] dark:border-white/[0.08] light:border-slate-200 text-center text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
          History is stored locally in your browser storage.
        </div>
      </div>
    </div>
  );
}
