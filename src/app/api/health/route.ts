import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'KangarooYT Core API',
    version: '1.0.0',
    supportedPlatforms: ['youtube', 'instagram'],
    compliance: {
      drmBypassBlocked: true,
      privateAccountBypassBlocked: true,
      ssrfProtectionEnabled: true,
      rateLimitingEnabled: true,
    },
    timestamp: new Date().toISOString(),
  });
}
