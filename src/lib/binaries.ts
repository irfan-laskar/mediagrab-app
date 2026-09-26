import path from 'path';
import fs from 'fs';
import os from 'os';

/**
 * Resolves the path to yt-dlp binary across Windows and Linux environments
 */
export function getYtDlpPath(): string {
  const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
  
  // 1. Check local project bin/
  const localBin = path.resolve(process.cwd(), 'bin', binaryName);
  if (fs.existsSync(localBin)) {
    return localBin;
  }

  // 2. Check /tmp or temp directory
  const tmpBin = path.join(os.tmpdir(), binaryName);
  if (fs.existsSync(tmpBin)) {
    return tmpBin;
  }

  return localBin;
}

/**
 * Resolves the directory containing ffmpeg binary across Windows and Linux environments
 */
export function getFfmpegDir(): string {
  const binaryName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';

  // 1. Check local project bin/
  const localBin = path.resolve(process.cwd(), 'bin', binaryName);
  if (fs.existsSync(localBin)) {
    return path.dirname(localBin);
  }

  // 2. Check ffmpeg-static node_modules
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ffmpegStatic = require('ffmpeg-static');
    if (ffmpegStatic && fs.existsSync(ffmpegStatic)) {
      return path.dirname(ffmpegStatic);
    }
  } catch {
    // Ignore
  }

  return path.resolve(process.cwd(), 'bin');
}
