import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MediaGrab - Modern Lawful Video & Audio Downloader',
  description:
    'Download and convert publicly accessible videos and audio from YouTube and Instagram in high definition MP4 (1080p, 720p) and studio MP3 (320kbps). Fast, private, and fully compliant.',
  keywords: [
    'media downloader',
    'youtube video downloader',
    'youtube audio extractor',
    'instagram reel downloader',
    'mp4 converter',
    'mp3 extractor',
    'lawful media converter',
  ],
  authors: [{ name: 'MediaGrab Team' }],
  openGraph: {
    title: 'MediaGrab - Modern Lawful Video & Audio Downloader',
    description:
      'Download and convert publicly accessible videos and audio from YouTube and Instagram in high definition MP4 and MP3.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#090b10',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.className} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-[#090b10] text-[#f8fafc] antialiased selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
