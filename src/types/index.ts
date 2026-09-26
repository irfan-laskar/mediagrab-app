export type MediaPlatform = 'youtube' | 'instagram' | 'unknown';

export type MediaType = 'video' | 'audio';

export interface VideoFormat {
  id: string;
  resolution: string; // e.g. "1080p", "720p", "480p", "360p"
  qualityLabel: string; // e.g. "Full HD (1080p)", "HD (720p)", "Standard (480p)"
  container: string; // "mp4"
  fileSizeApprox: string; // e.g. "45.2 MB"
  hasAudio: boolean;
  fps?: number;
  directDownloadSupported: boolean;
  downloadUrl?: string;
}

export interface AudioFormat {
  id: string;
  format: string; // "mp3" or "m4a"
  bitrate: string; // e.g. "320 kbps", "256 kbps", "192 kbps", "128 kbps"
  qualityLabel: string; // e.g. "Studio Quality (320kbps)", "High Quality (256kbps)"
  fileSizeApprox: string; // e.g. "8.4 MB"
  directDownloadSupported: boolean;
  downloadUrl?: string;
}

export interface MediaMetadata {
  url: string;
  platform: MediaPlatform;
  title: string;
  author: string;
  authorUrl?: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  durationFormatted: string; // e.g. "04:15"
  videoFormats: VideoFormat[];
  audioFormats: AudioFormat[];
  isPublic: boolean;
  downloadNotice: string;
  directDownloadAllowed: boolean;
  restrictionReason?: string;
  backendError?: string;
  sampleDemo?: boolean;
}

export interface DownloadHistoryItem {
  id: string;
  timestamp: number;
  url: string;
  title: string;
  platform: MediaPlatform;
  thumbnailUrl: string;
  formatId: string;
  formatLabel: string;
  mediaType: MediaType;
  fileSize: string;
  timeTaken?: string;
}

export interface FetchMediaRequest {
  url: string;
}

export interface FetchMediaResponse {
  success: boolean;
  data?: MediaMetadata;
  error?: string;
  code?: string;
  details?: string;
}
