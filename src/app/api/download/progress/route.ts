import { NextRequest, NextResponse } from 'next/server';
import { getJobProgress } from '@/lib/downloadJobs';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json(
      { success: false, error: 'Missing jobId parameter.' },
      { status: 400 }
    );
  }

  const progress = getJobProgress(jobId);

  if (!progress) {
    return NextResponse.json(
      { success: false, error: 'Job not found or has expired.' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    progress: {
      jobId: progress.jobId,
      url: progress.url,
      title: progress.title,
      formatId: progress.formatId,
      formatLabel: progress.formatLabel,
      mediaType: progress.mediaType,
      status: progress.status,
      percentage: progress.percentage,
      stage: progress.stage,
      speed: progress.speed,
      eta: progress.eta,
      totalSize: progress.totalSize,
      downloadedBytes: progress.downloadedBytes,
      elapsedMs: progress.elapsedMs,
      error: progress.error,
    },
  });
}
