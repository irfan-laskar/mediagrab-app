import { NextRequest, NextResponse } from 'next/server';
import { getJobProgress, removeJob } from '@/lib/downloadJobs';
import fs from 'fs';
import { Readable } from 'stream';

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

  const job = getJobProgress(jobId);

  if (!job || job.status !== 'ready' || !job.result) {
    return NextResponse.json(
      { success: false, error: 'Media file is not ready or has expired.' },
      { status: 404 }
    );
  }

  const { result } = job;

  if (!fs.existsSync(result.filePath)) {
    return NextResponse.json(
      { success: false, error: 'Temporary media file not found on disk.' },
      { status: 404 }
    );
  }

  const nodeStream = fs.createReadStream(result.filePath);
  nodeStream.on('close', () => {
    removeJob(jobId);
  });
  nodeStream.on('error', () => {
    removeJob(jobId);
  });

  const webStream = Readable.toWeb(nodeStream);

  const headers = new Headers();
  headers.set(
    'Content-Disposition',
    `attachment; filename="${result.asciiFilename}"; filename*=UTF-8''${encodeURIComponent(
      result.filename
    )}`
  );
  headers.set('Content-Type', result.contentType);
  headers.set('Content-Length', result.fileSize.toString());
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  headers.set('X-Content-Type-Options', 'nosniff');

  return new NextResponse(webStream as unknown as BodyInit, {
    status: 200,
    headers,
  });
}
