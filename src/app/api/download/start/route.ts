import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, validateAndSanitizeUrl } from '@/lib/security';
import { extractMedia } from '@/lib/extractors';
import { startDownloadJob } from '@/lib/downloadJobs';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers);
    const rateLimit = checkRateLimit(clientIp, 30);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit exceeded. Please wait ${rateLimit.resetSeconds}s.`,
          code: 'RATE_LIMITED',
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { url, formatId, mediaType, formatLabel } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'Missing media URL.' },
        { status: 400 }
      );
    }

    const validation = validateAndSanitizeUrl(url);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error || 'Invalid media URL.' },
        { status: 422 }
      );
    }

    // Extract metadata
    const metadata = await extractMedia(validation.sanitizedUrl);

    // Start background job
    const jobId = startDownloadJob(
      validation.sanitizedUrl,
      formatId || 'video_720p',
      mediaType || 'video',
      metadata.title,
      formatLabel || 'Default Format'
    );

    return NextResponse.json({
      success: true,
      jobId,
      title: metadata.title,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to start download.';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
