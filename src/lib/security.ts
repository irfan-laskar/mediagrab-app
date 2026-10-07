import { MediaPlatform } from '@/types';

// Rate Limiter storage
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute

// Periodically clean up old IP records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    if (validTimestamps.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}, 5 * 60 * 1000);

/**
 * Check if client IP has exceeded the rate limit
 */
export function checkRateLimit(clientIp: string, limit = MAX_REQUESTS_PER_WINDOW): {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
} {
  const now = Date.now();
  let record = rateLimitMap.get(clientIp);

  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(clientIp, record);
  }

  // Filter out timestamps outside current window
  record.timestamps = record.timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetSeconds = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(resetSeconds, 1),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    resetSeconds: 60,
  };
}

/**
 * Extract client IP from headers safely
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

/**
 * Detect media platform from validated URL
 */
export function detectPlatform(urlStr: string): MediaPlatform {
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();

    if (
      host === 'youtube.com' ||
      host === 'www.youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtu.be' ||
      host === 'music.youtube.com'
    ) {
      return 'youtube';
    }

    if (
      host === 'instagram.com' ||
      host === 'www.instagram.com' ||
      host === 'instagr.am'
    ) {
      return 'instagram';
    }

    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Check if IP or hostname is private / loopback / internal to prevent SSRF
 */
function isPrivateOrLocalHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  // Common localhost/loopback representations
  if (
    lower === 'localhost' ||
    lower.endsWith('.localhost') ||
    lower.endsWith('.local') ||
    lower === '127.0.0.1' ||
    lower === '0.0.0.0' ||
    lower === '::1' ||
    lower === '[::1]'
  ) {
    return true;
  }

  // AWS/GCP cloud metadata endpoints
  if (lower === '169.254.169.254' || lower === 'metadata.google.internal') {
    return true;
  }

  // IPv4 regex private address checks
  // 10.0.0.0 - 10.255.255.255
  // 172.16.0.0 - 172.31.255.255
  // 192.168.0.0 - 192.168.255.255
  // 169.254.0.0 - 169.254.255.255 (Link-local)
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = lower.match(ipv4Regex);
  if (match) {
    const octet1 = parseInt(match[1], 10);
    const octet2 = parseInt(match[2], 10);

    if (octet1 === 10) return true;
    if (octet1 === 127) return true;
    if (octet1 === 169 && octet2 === 254) return true;
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return true;
    if (octet1 === 192 && octet2 === 168) return true;
    if (octet1 === 0) return true;
  }

  return false;
}

export interface UrlValidationResult {
  valid: boolean;
  sanitizedUrl: string;
  platform: MediaPlatform;
  error?: string;
}

/**
 * Validate and sanitize input URL with strict SSRF & protocol checks
 */
export function validateAndSanitizeUrl(rawInput: string): UrlValidationResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      valid: false,
      sanitizedUrl: '',
      platform: 'unknown',
      error: 'Please enter a valid URL.',
    };
  }

  // Clean and trim
  const trimmed = rawInput.trim();

  // Enforce max length
  if (trimmed.length > 2048) {
    return {
      valid: false,
      sanitizedUrl: '',
      platform: 'unknown',
      error: 'URL is too long (maximum 2048 characters).',
    };
  }

  let parsed: URL;
  try {
    // Add https:// protocol if user only typed domain/path
    let toParse = trimmed;
    if (!toParse.startsWith('http://') && !toParse.startsWith('https://')) {
      toParse = 'https://' + toParse;
    }
    parsed = new URL(toParse);
  } catch {
    return {
      valid: false,
      sanitizedUrl: '',
      platform: 'unknown',
      error: 'The format of this URL is invalid. Please check and try again.',
    };
  }

  // Restrict to http & https protocols
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      valid: false,
      sanitizedUrl: '',
      platform: 'unknown',
      error: 'Only HTTP and HTTPS protocols are permitted.',
    };
  }

  // SSRF Protection: Deny local or internal IP ranges
  if (isPrivateOrLocalHost(parsed.hostname)) {
    return {
      valid: false,
      sanitizedUrl: '',
      platform: 'unknown',
      error: 'Access to internal or local network addresses is prohibited for security reasons.',
    };
  }

  // Detect platform
  const platform = detectPlatform(parsed.href);
  if (platform === 'unknown') {
    return {
      valid: false,
      sanitizedUrl: parsed.href,
      platform: 'unknown',
      error: 'Unsupported platform. KangarooYT currently supports YouTube and Instagram URLs.',
    };
  }

  // Platform specific URL structure sanity
  if (platform === 'youtube') {
    const isYoutuBe = parsed.hostname.includes('youtu.be');
    const hasVParam = parsed.searchParams.has('v');
    const isShorts = parsed.pathname.includes('/shorts/');
    const isEmbed = parsed.pathname.includes('/embed/');

    if (!isYoutuBe && !hasVParam && !isShorts && !isEmbed) {
      return {
        valid: false,
        sanitizedUrl: parsed.href,
        platform: 'youtube',
        error: 'Please enter a valid YouTube video or Shorts URL (e.g., youtube.com/watch?v=... or youtu.be/...).',
      };
    }
  }

  if (platform === 'instagram') {
    const isPostOrReel =
      parsed.pathname.includes('/p/') ||
      parsed.pathname.includes('/reel/') ||
      parsed.pathname.includes('/tv/') ||
      parsed.pathname.includes('/reels/');

    if (!isPostOrReel) {
      return {
        valid: false,
        sanitizedUrl: parsed.href,
        platform: 'instagram',
        error: 'Please enter a valid Instagram public post or Reel URL (e.g., instagram.com/reel/... or instagram.com/p/...).',
      };
    }
  }

  return {
    valid: true,
    sanitizedUrl: parsed.href,
    platform,
  };
}

/**
 * Sanitize filename for HTTP Content-Disposition headers
 */
export function sanitizeFilename(filename: string, fallback = 'media'): string {
  if (!filename) return fallback;
  // Replace illegal filename characters
  const clean = filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .trim()
    .substring(0, 100);
  return clean || fallback;
}
