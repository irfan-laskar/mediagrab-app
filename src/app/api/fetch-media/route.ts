import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, validateAndSanitizeUrl } from '@/lib/security';
import { extractMedia } from '@/lib/extractors';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers);
    const rateLimit = checkRateLimit(clientIp, 30);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit exceeded. Please wait ${rateLimit.resetSeconds} seconds before trying again.`,
          code: 'RATE_LIMITED',
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimit.resetSeconds.toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body. Expected JSON with "url".',
          code: 'INVALID_JSON',
        },
        { status: 400 }
      );
    }

    const { url } = body;
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'A valid media URL is required.',
          code: 'MISSING_URL',
        },
        { status: 400 }
      );
    }

    // Server-side URL validation & SSRF protection
    const validation = validateAndSanitizeUrl(url);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error || 'The provided URL could not be processed.',
          code: 'INVALID_URL',
        },
        { status: 422 }
      );
    }

    // Extract metadata
    const metadata = await extractMedia(validation.sanitizedUrl);

    return NextResponse.json(
      {
        success: true,
        data: metadata,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve media metadata.';
    return NextResponse.json(
      {
        success: false,
        error: message,
        code: 'EXTRACTION_FAILED',
      },
      { status: 422 }
    );
  }
}
