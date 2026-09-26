import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, sanitizeFilename, validateAndSanitizeUrl } from '@/lib/security';
import { extractMedia } from '@/lib/extractors';
import { downloadMediaWithEngine } from '@/lib/downloader';
import fs from 'fs';
import { Readable } from 'stream';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers);
    const rateLimit = checkRateLimit(clientIp, 25); // 25 downloads/minute limit

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Download rate limit exceeded. Please wait ${rateLimit.resetSeconds} seconds before requesting another download.`,
          code: 'RATE_LIMITED',
        },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const mediaUrl = searchParams.get('url');
    const formatId = searchParams.get('formatId') || 'video_720p';
    const mediaType = (searchParams.get('mediaType') as 'video' | 'audio') || 'video';

    if (!mediaUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required "url" parameter.',
          code: 'MISSING_PARAM',
        },
        { status: 400 }
      );
    }

    // Server-side validation
    const validation = validateAndSanitizeUrl(mediaUrl);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error || 'Invalid media URL provided.',
          code: 'INVALID_URL',
        },
        { status: 422 }
      );
    }

    // Extract metadata
    const metadata = await extractMedia(validation.sanitizedUrl);

    // 1. If it's a verified public demo media item with a static URL, stream immediately
    if (metadata.sampleDemo) {
      let targetDownloadUrl: string | undefined;
      let extension = 'mp4';
      let contentType = 'video/mp4';
      let qualityLabel = 'media';

      if (mediaType === 'audio') {
        const audioFormat = metadata.audioFormats.find((f) => f.id === formatId) || metadata.audioFormats[0];
        if (audioFormat?.downloadUrl) {
          targetDownloadUrl = audioFormat.downloadUrl;
          extension = audioFormat.format;
          contentType = extension === 'mp3' ? 'audio/mpeg' : 'audio/mp4';
          qualityLabel = audioFormat.bitrate.replace(/\s+/g, '');
        }
      } else {
        const videoFormat = metadata.videoFormats.find((f) => f.id === formatId) || metadata.videoFormats[0];
        if (videoFormat?.downloadUrl) {
          targetDownloadUrl = videoFormat.downloadUrl;
          extension = videoFormat.container;
          contentType = 'video/mp4';
          qualityLabel = videoFormat.resolution;
        }
      }

      if (targetDownloadUrl) {
        const upstreamRes = await fetch(targetDownloadUrl, {
          headers: {
            'User-Agent': 'MediaGrab/1.0 (+https://mediagrab.app)',
          },
        });

        if (upstreamRes.ok && upstreamRes.body) {
          const safeTitle = sanitizeFilename(metadata.title, 'mediagrab_download');
          const cleanAscii = safeTitle.replace(/[^\w.-]/g, '_').substring(0, 50) || 'media';
          const asciiFilename = `${cleanAscii}-${qualityLabel}.${extension}`;
          const fullFilename = `${safeTitle}-${qualityLabel}.${extension}`;

          const headers = new Headers();
          headers.set(
            'Content-Disposition',
            `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(fullFilename)}`
          );
          headers.set('Content-Type', contentType);
          const contentLength = upstreamRes.headers.get('content-length');
          if (contentLength) {
            headers.set('Content-Length', contentLength);
          }
          headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
          headers.set('X-Content-Type-Options', 'nosniff');

          return new NextResponse(upstreamRes.body as unknown as BodyInit, {
            status: 200,
            headers,
          });
        }
      }
    }

    // 2. Process live download for user-submitted media (YouTube & Instagram) using backend engine
    const downloadResult = await downloadMediaWithEngine(
      validation.sanitizedUrl,
      formatId,
      mediaType,
      metadata.title
    );

    const nodeStream = fs.createReadStream(downloadResult.filePath);
    nodeStream.on('close', () => {
      downloadResult.cleanup().catch(() => {});
    });
    nodeStream.on('error', () => {
      downloadResult.cleanup().catch(() => {});
    });

    const webStream = Readable.toWeb(nodeStream);

    const headers = new Headers();
    headers.set(
      'Content-Disposition',
      `attachment; filename="${downloadResult.asciiFilename}"; filename*=UTF-8''${encodeURIComponent(
        downloadResult.filename
      )}`
    );
    headers.set('Content-Type', downloadResult.contentType);
    headers.set('Content-Length', downloadResult.fileSize.toString());
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    headers.set('X-Content-Type-Options', 'nosniff');

    return new NextResponse(webStream as unknown as BodyInit, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred during download.';
    return NextResponse.json(
      {
        success: false,
        error: message,
        code: 'DOWNLOAD_FAILED',
      },
      { status: 500 }
    );
  }
}

