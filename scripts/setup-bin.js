const fs = require('fs');
const path = require('path');
const https = require('https');

const binDir = path.resolve(__dirname, '..', 'bin');
if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true });
}

// 1. Copy ffmpeg from ffmpeg-static if present
const ffmpegDest = path.join(binDir, process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg');
if (!fs.existsSync(ffmpegDest)) {
  try {
    const ffmpegStaticPath = require('ffmpeg-static');
    if (ffmpegStaticPath && fs.existsSync(ffmpegStaticPath)) {
      console.log('Copying ffmpeg from ffmpeg-static to bin/ ...');
      fs.copyFileSync(ffmpegStaticPath, ffmpegDest);
      if (process.platform !== 'win32') {
        fs.chmodSync(ffmpegDest, 0o755);
      }
      console.log('ffmpeg copied successfully.');
    }
  } catch (e) {
    console.warn('Could not copy ffmpeg-static:', e.message);
  }
}

// 2. Download yt-dlp standalone binary if missing
function downloadWithRedirects(sourceUrl, destination) {
  return new Promise((resolve, reject) => {
    function executeGet(url) {
      https
        .get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MediaGrab-Setup/1.0)' } }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            executeGet(res.headers.location);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`Failed to download yt-dlp: HTTP ${res.statusCode}`));
            return;
          }
          const fileStream = fs.createWriteStream(destination);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close(() => {
              if (process.platform !== 'win32') {
                try {
                  fs.chmodSync(destination, 0o755);
                } catch (e) {
                  console.warn('chmod warning:', e.message);
                }
              }
              resolve();
            });
          });
          fileStream.on('error', (err) => {
            fs.unlink(destination, () => {});
            reject(err);
          });
        })
        .on('error', (err) => {
          reject(err);
        });
    }

    executeGet(sourceUrl);
  });
}

async function main() {
  const ytDlpDest = path.join(binDir, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');
  
  // Note: On Linux, use yt-dlp_linux (standalone PyInstaller binary with bundled Python)
  // so it runs on environments without /usr/bin/python3 (e.g., Vercel / AWS Lambda microVMs)
  const url =
    process.platform === 'win32'
      ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
      : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux';

  if (!fs.existsSync(ytDlpDest) || fs.statSync(ytDlpDest).size < 1000000) {
    console.log(`Downloading standalone yt-dlp binary from ${url} ...`);
    try {
      await downloadWithRedirects(url, ytDlpDest);
      console.log(`yt-dlp binary successfully provisioned at: ${ytDlpDest} (${fs.statSync(ytDlpDest).size} bytes)`);
    } catch (err) {
      console.error('Error downloading yt-dlp:', err.message);
      // Non-fatal exit so npm install does not abort if offline
    }
  } else {
    console.log(`yt-dlp binary already present in bin/ (${fs.statSync(ytDlpDest).size} bytes).`);
  }
}

main().catch((err) => {
  console.error('setup-bin error:', err);
});
