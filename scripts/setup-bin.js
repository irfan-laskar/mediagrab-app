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

// 2. Download yt-dlp binary if missing
const ytDlpDest = path.join(binDir, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');
if (!fs.existsSync(ytDlpDest)) {
  console.log('Downloading yt-dlp binary to bin/ ...');
  const url =
    process.platform === 'win32'
      ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
      : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

  function downloadFile(sourceUrl, destination) {
    https
      .get(sourceUrl, { headers: { 'User-Agent': 'MediaGrab-Setup' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          downloadFile(res.headers.location, destination);
          return;
        }
        if (res.statusCode !== 200) {
          console.error(`Failed to download yt-dlp: HTTP ${res.statusCode}`);
          return;
        }
        const fileStream = fs.createWriteStream(destination);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          if (process.platform !== 'win32') {
            fs.chmodSync(destination, 0o755);
          }
          console.log('yt-dlp binary downloaded successfully.');
        });
      })
      .on('error', (err) => {
        console.error('Download error:', err.message);
      });
  }

  downloadFile(url, ytDlpDest);
} else {
  console.log('yt-dlp binary already present in bin/.');
}
