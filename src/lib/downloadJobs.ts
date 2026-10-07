import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { sanitizeFilename } from './security';
import { ensureYtDlpBinary, getFfmpegDir, getStandardYtDlpArgs } from './binaries';
import { DownloadResult } from './downloader';

export interface DownloadProgress {
  jobId: string;
  url: string;
  title: string;
  formatId: string;
  formatLabel: string;
  mediaType: 'video' | 'audio';
  status: 'starting' | 'downloading' | 'muxing' | 'ready' | 'failed';
  percentage: number;
  stage: string;
  speed: string;
  eta: string;
  totalSize: string;
  downloadedBytes: number;
  startTime: number;
  elapsedMs: number;
  error?: string;
  result?: DownloadResult;
}

const activeJobs = new Map<string, DownloadProgress>();

/**
 * Regex to parse yt-dlp newline progress
 */
const progressRegex = /\[download\]\s+([\d.]+)%\s+of\s+~?([^\s]+)\s+at\s+(.+?)\s+ETA\s+([^\s]+)/;

/**
 * Creates and starts a download job with real-time progress tracking
 */
export function startDownloadJob(
  url: string,
  formatId: string,
  mediaType: 'video' | 'audio',
  title: string,
  formatLabel: string
): string {
  const jobId = `mg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const startTime = Date.now();

  const progress: DownloadProgress = {
    jobId,
    url,
    title,
    formatId,
    formatLabel,
    mediaType,
    status: 'starting',
    percentage: 5,
    stage: 'Connecting to source platform and resolving stream tracks...',
    speed: '--',
    eta: '--',
    totalSize: '--',
    downloadedBytes: 0,
    startTime,
    elapsedMs: 0,
  };

  activeJobs.set(jobId, progress);

  // Run extraction in background
  executeJob(jobId, url, formatId, mediaType, title);

  return jobId;
}

/**
 * Retrieve progress for an active job
 */
export function getJobProgress(jobId: string): DownloadProgress | undefined {
  const job = activeJobs.get(jobId);
  if (job) {
    if (job.status !== 'ready' && job.status !== 'failed') {
      job.elapsedMs = Date.now() - job.startTime;
    }
  }
  return job;
}

/**
 * Internal executor using spawn to capture real-time stream output
 */
async function executeJob(
  jobId: string,
  url: string,
  formatId: string,
  mediaType: 'video' | 'audio',
  title: string
) {
  const job = activeJobs.get(jobId);
  if (!job) return;

  const ytDlpPath = await ensureYtDlpBinary();
  const ffmpegDir = getFfmpegDir();
  const standardArgs = getStandardYtDlpArgs(url);

  const tempTemplate = path.join(os.tmpdir(), `${jobId}_out.%(ext)s`);

  let args: string[] = [];
  let extension = 'mp4';
  let contentType = 'video/mp4';

  if (mediaType === 'audio') {
    if (formatId === 'audio_128k' || formatId === 'ig_audio_128k') {
      extension = 'm4a';
      contentType = 'audio/mp4';
      args = [
        ...standardArgs,
        '--ffmpeg-location',
        ffmpegDir,
        '-f',
        'ba[ext=m4a]/ba/18/b/best',
        '-x',
        '--audio-format',
        'm4a',
        '--newline',
        '-o',
        tempTemplate,
        url,
      ];
    } else {
      extension = 'mp3';
      contentType = 'audio/mpeg';
      let quality = '0';
      if (formatId === 'audio_256k') quality = '2';
      if (formatId === 'audio_192k') quality = '4';

      args = [
        ...standardArgs,
        '--ffmpeg-location',
        ffmpegDir,
        '-f',
        'ba/18/b/best',
        '-x',
        '--audio-format',
        'mp3',
        '--audio-quality',
        quality,
        '--newline',
        '-o',
        tempTemplate,
        url,
      ];
    }
  } else {
    extension = 'mp4';
    contentType = 'video/mp4';

    let height = '1080';
    if (formatId === 'video_1080p' || formatId === 'ig_video_1080p') height = '1080';
    else if (formatId === 'video_720p' || formatId === 'ig_video_720p') height = '720';
    else if (formatId === 'video_480p') height = '480';
    else if (formatId === 'video_360p') height = '360';

    const formatSelector = `bv*[height<=${height}][ext=mp4]+ba[ext=m4a]/bv*[height<=${height}]+ba/b[height<=${height}]/18/bv*+ba/b/best`;

    args = [
      ...standardArgs,
      '--ffmpeg-location',
      ffmpegDir,
      '-f',
      formatSelector,
      '--merge-output-format',
      'mp4',
      '--newline',
      '-o',
      tempTemplate,
      url,
    ];
  }

  try {
    const child = spawn(ytDlpPath, args);
    let capturedStderr = '';

    child.stdout.on('data', (data: Buffer) => {
      const lines = data.toString().split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Progress lines
        const match = trimmed.match(progressRegex);
        if (match) {
          const parsedPercent = parseFloat(match[1]);
          job.status = 'downloading';
          // Scale download percentage between 10% and 88% to leave room for starting and muxing
          job.percentage = Math.min(88, Math.max(10, Math.round(parsedPercent * 0.8 + 8)));
          job.totalSize = match[2];
          job.speed = match[3].trim();
          job.eta = match[4];
          job.stage =
            mediaType === 'audio'
              ? `Downloading high-fidelity audio stream (${match[1]}%)...`
              : `Downloading video stream chunks (${match[1]}%)...`;
          job.elapsedMs = Date.now() - job.startTime;
        } else if (trimmed.includes('[Merger]')) {
          job.status = 'muxing';
          job.percentage = 92;
          job.stage = 'Muxing high-definition video & audio with FFmpeg...';
          job.speed = 'Processing';
          job.eta = 'Finalizing';
          job.elapsedMs = Date.now() - job.startTime;
        } else if (trimmed.includes('[ExtractAudio]')) {
          job.status = 'muxing';
          job.percentage = 90;
          job.stage = 'Extracting and encoding high-fidelity audio with FFmpeg...';
          job.speed = 'Processing';
          job.eta = 'Finalizing';
          job.elapsedMs = Date.now() - job.startTime;
        } else if (trimmed.includes('Downloading webpage') || trimmed.includes('Extracting URL')) {
          job.percentage = Math.max(job.percentage, 10);
          job.stage = 'Connecting to source platform and inspecting formats...';
        }
      }
    });

    child.stderr.on('data', (data: Buffer) => {
      capturedStderr += data.toString();
    });

    child.on('error', (err: Error) => {
      job.status = 'failed';
      job.error = `Server execution error: ${err.message}`;
      job.stage = 'Download failed.';
    });

    child.on('close', async (code: number) => {
      job.elapsedMs = Date.now() - job.startTime;

      if (code !== 0) {
        job.status = 'failed';
        if (capturedStderr.includes('Private video') || capturedStderr.includes('Video unavailable')) {
          job.error = 'This video is unavailable or set to private by the creator on YouTube.';
        } else if (capturedStderr.includes('Sign in to confirm your age')) {
          job.error = 'This video is age-restricted on YouTube and requires user authentication.';
        } else if (
          capturedStderr.includes('not granting access') ||
          capturedStderr.includes('empty media response') ||
          capturedStderr.includes('login-required')
        ) {
          job.error = 'This Instagram post or reel is private, restricted, or requires an active account login.';
        } else {
          job.error = capturedStderr.split('\n')[0] || `Extraction failed with code ${code}`;
        }
        job.stage = 'Download failed.';
        return;
      }

      // Locate downloaded file in os.tmpdir()
      try {
        const tmpFiles = await fs.promises.readdir(os.tmpdir());
        const matchedFile = tmpFiles.find((f) => f.startsWith(`${jobId}_out`));

        if (!matchedFile) {
          job.status = 'failed';
          job.error = 'Processed media file was not generated by extraction engine.';
          job.stage = 'File generation failed.';
          return;
        }

        const fullFilePath = path.join(os.tmpdir(), matchedFile);
        const actualExt = path.extname(matchedFile).replace('.', '') || extension;
        const stat = await fs.promises.stat(fullFilePath);

        const safeTitle = sanitizeFilename(title, 'mediagrab_media');
        const cleanAscii = safeTitle.replace(/[^\w.-]/g, '_').substring(0, 50) || 'media';
        const asciiFilename = `${cleanAscii}-${formatId}.${actualExt}`;
        const fullFilename = `${safeTitle}-${formatId}.${actualExt}`;

        let isCleanedUp = false;
        const cleanup = async () => {
          if (isCleanedUp) return;
          isCleanedUp = true;
          try {
            if (fs.existsSync(fullFilePath)) {
              await fs.promises.unlink(fullFilePath);
            }
          } catch {
            // Ignore
          }
        };

        // 20-minute safety expiration
        setTimeout(cleanup, 20 * 60 * 1000);

        job.status = 'ready';
        job.percentage = 100;
        job.stage = `Download completed in ${(job.elapsedMs / 1000).toFixed(1)}s!`;
        job.speed = 'Done';
        job.eta = '00:00';
        job.totalSize = `${(stat.size / (1024 * 1024)).toFixed(1)} MB`;
        job.downloadedBytes = stat.size;

        job.result = {
          filePath: fullFilePath,
          filename: fullFilename,
          asciiFilename,
          contentType,
          fileSize: stat.size,
          cleanup,
        };
      } catch (err: unknown) {
        job.status = 'failed';
        job.error = err instanceof Error ? err.message : 'Failed to finalize media file.';
      }
    });
  } catch (err: unknown) {
    job.status = 'failed';
    job.error = err instanceof Error ? err.message : 'Failed to start extraction process.';
  }
}

/**
 * Remove active job from memory
 */
export function removeJob(jobId: string) {
  const job = activeJobs.get(jobId);
  if (job?.result?.cleanup) {
    job.result.cleanup().catch(() => {});
  }
  activeJobs.delete(jobId);
}
