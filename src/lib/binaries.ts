import path from 'path';
import fs from 'fs';
import os from 'os';
import https from 'https';

/**
 * Downloads a file following HTTP 30x redirects safely
 */
function downloadFile(sourceUrl: string, destination: string): Promise<void> {
  return new Promise((resolve, reject) => {
    function executeGet(url: string) {
      https
        .get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MediaGrab/1.0)' } }, (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            executeGet(res.headers.location);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`Failed to download binary: HTTP ${res.statusCode}`));
            return;
          }
          const fileStream = fs.createWriteStream(destination);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close(() => {
              try {
                fs.chmodSync(destination, 0o755);
              } catch {}
              resolve();
            });
          });
          fileStream.on('error', (err) => {
            fs.unlink(destination, () => {});
            reject(err);
          });
        })
        .on('error', (err) => reject(err));
    }

    executeGet(sourceUrl);
  });
}

/**
 * Resolves the path to yt-dlp binary across Windows and Linux / Serverless environments.
 * On AWS Lambda / Vercel, binaries must be placed in /tmp with executable permissions.
 */
export function getYtDlpPath(): string {
  if (process.platform === 'win32') {
    const localWin = path.resolve(process.cwd(), 'bin', 'yt-dlp.exe');
    if (fs.existsSync(localWin)) return localWin;
    const tmpWin = path.join(os.tmpdir(), 'yt-dlp.exe');
    if (fs.existsSync(tmpWin)) return tmpWin;
    return localWin;
  }

  // Linux / Serverless environment (Vercel, AWS Lambda, Render):
  const tmpBin = path.join(os.tmpdir(), 'yt-dlp');

  // Check if already in /tmp and valid
  if (fs.existsSync(tmpBin) && fs.statSync(tmpBin).size > 5000000) {
    try {
      fs.chmodSync(tmpBin, 0o755);
    } catch {}
    return tmpBin;
  }

  // Check if project bundled bin/yt-dlp
  const localBin = path.resolve(process.cwd(), 'bin', 'yt-dlp');
  if (fs.existsSync(localBin) && fs.statSync(localBin).size > 5000000) {
    try {
      fs.copyFileSync(localBin, tmpBin);
      fs.chmodSync(tmpBin, 0o755);
      return tmpBin;
    } catch (e) {
      console.warn('Could not copy yt-dlp to /tmp:', e);
      return localBin;
    }
  }

  return tmpBin;
}

/**
 * Asynchronously ensures the standalone yt-dlp binary is provisioned in /tmp before job execution
 */
export async function ensureYtDlpBinary(): Promise<string> {
  const binaryPath = getYtDlpPath();

  if (process.platform === 'win32') {
    return binaryPath;
  }

  const tmpBin = path.join(os.tmpdir(), 'yt-dlp');
  if (fs.existsSync(tmpBin) && fs.statSync(tmpBin).size > 10000000) {
    try {
      fs.chmodSync(tmpBin, 0o755);
    } catch {}
    return tmpBin;
  }

  const localBin = path.resolve(process.cwd(), 'bin', 'yt-dlp');
  if (fs.existsSync(localBin) && fs.statSync(localBin).size > 10000000) {
    try {
      fs.copyFileSync(localBin, tmpBin);
      fs.chmodSync(tmpBin, 0o755);
      return tmpBin;
    } catch {}
  }

  // Download standalone PyInstaller Linux binary on-demand into /tmp
  console.log('Downloading standalone yt-dlp_linux to /tmp ...');
  const url = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux';
  try {
    await downloadFile(url, tmpBin);
    fs.chmodSync(tmpBin, 0o755);
    console.log('yt-dlp_linux downloaded to /tmp successfully.');
    return tmpBin;
  } catch (err) {
    console.error('Failed to download yt-dlp_linux:', err);
    return binaryPath;
  }
}

/**
 * Resolves the directory containing ffmpeg binary across Windows and Linux environments
 */
export function getFfmpegDir(): string {
  if (process.platform === 'win32') {
    const localWin = path.resolve(process.cwd(), 'bin', 'ffmpeg.exe');
    if (fs.existsSync(localWin)) return path.dirname(localWin);
    return path.resolve(process.cwd(), 'bin');
  }

  // Linux: Check /tmp/ffmpeg
  const tmpFfmpeg = path.join(os.tmpdir(), 'ffmpeg');
  if (fs.existsSync(tmpFfmpeg)) {
    try {
      fs.chmodSync(tmpFfmpeg, 0o755);
    } catch {}
    return os.tmpdir();
  }

  // Check ffmpeg-static in node_modules
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ffmpegStatic = require('ffmpeg-static');
    if (ffmpegStatic && fs.existsSync(ffmpegStatic)) {
      try {
        fs.copyFileSync(ffmpegStatic, tmpFfmpeg);
        fs.chmodSync(tmpFfmpeg, 0o755);
        return os.tmpdir();
      } catch {
        return path.dirname(ffmpegStatic);
      }
    }
  } catch {}

  // Check project bin/ffmpeg
  const localFfmpeg = path.resolve(process.cwd(), 'bin', 'ffmpeg');
  if (fs.existsSync(localFfmpeg)) {
    try {
      fs.copyFileSync(localFfmpeg, tmpFfmpeg);
      fs.chmodSync(tmpFfmpeg, 0o755);
      return os.tmpdir();
    } catch {
      return path.dirname(localFfmpeg);
    }
  }

  return path.resolve(process.cwd(), 'bin');
}

/**
 * Resolves standard yt-dlp arguments for robust platform access, avoiding datacenter IP bot challenges
 */
export function getStandardYtDlpArgs(url: string): string[] {
  const args: string[] = ['--no-warnings', '--no-check-certificates'];

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    args.push('--extractor-args', 'youtube:player_client=android,ios,mweb');
  }

  // Check if cookies are supplied via environment variable (e.g. YOUTUBE_COOKIES on Vercel)
  const cookiesEnv = process.env.YOUTUBE_COOKIES;
  if (cookiesEnv) {
    const cookiesPath = path.join(os.tmpdir(), 'yt_cookies.txt');
    try {
      if (!fs.existsSync(cookiesPath) || fs.statSync(cookiesPath).size === 0) {
        fs.writeFileSync(cookiesPath, cookiesEnv, 'utf-8');
      }
      args.push('--cookies', cookiesPath);
    } catch (e) {
      console.warn('Failed to write YOUTUBE_COOKIES to /tmp:', e);
    }
  }

  return args;
}
