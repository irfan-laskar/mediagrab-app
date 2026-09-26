# MediaGrab ⚡
> **Modern, Lawful Video & Audio Extractor for YouTube and Instagram**

MediaGrab is a production-grade, responsive SaaS web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. It allows users to convert and download publicly accessible videos and extract studio-quality audio from supported platforms (YouTube and Instagram), strictly subject to platform terms, fair use, copyright rules, and applicable laws.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Firfan-laskar%2FMediagrab)
&nbsp;&nbsp;
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/irfan-laskar/Mediagrab)

---

## 🌟 Key Features

- **Intuitive SaaS Interface**: Sleek charcoal/obsidian palette (`#090b10`), glassmorphism cards, glowing purple/indigo accents, and responsive layout for mobile, tablet, and desktop.
- **Dynamic Platform Detection**: Automatically detects whether a pasted link is a YouTube video, Short, or an Instagram public Reel/post in real time.
- **Real-Time Download Progress & Duration Tracking**:
  - Live ticking elapsed timer (`⏱️ 00:04.2s`) measuring exact time taken.
  - Live transfer speed (`⚡ MB/s`), ETA countdown, and animated gradient progress bar.
  - Multi-stage pipeline indicators (resolving streams, downloading chunks, FFmpeg muxing, saving to disk).
- **Multi-Resolution Video Downloads**:
  - Full HD (1080p MP4)
  - High Definition (720p MP4)
  - Standard Definition (480p MP4)
  - Data Saver (360p MP4)
- **Studio-Grade Audio Extraction**:
  - 320 kbps Studio MP3
  - 256 kbps High Quality MP3
  - 192 kbps Standard MP3
  - 128 kbps Efficient M4A / AAC
- **Zero-Deception Architecture**: We never fake download progress. If content is private, restricted, or DRM-protected, the user is provided with a transparent explanation.
- **Client-Side Download History**: Stored privately in the browser's `localStorage` with duration badges (e.g. `⚡ 5.8s`), options to re-fetch, view sizes, or clear history.
- **Dark / Light Mode**: Seamless theme switching with persistent user preference.
- **One-Click Quick Try Samples**: Pre-configured Creative Commons open movies (Big Buck Bunny, Sintel, etc.) and sample reels for instant live demonstration.

---

## 🔒 Security & Compliance Architecture

- **SSRF Protection**: Strict server-side URL validation blocking loopback and private IP ranges (`127.0.0.1`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.169.254` cloud metadata, and `localhost`).
- **Sliding-Window Rate Limiting**: In-memory token bucket limiting requests per client IP to prevent denial of service and automated scraping abuse.
- **Memory-Safe Streaming**: Direct chunked streaming pipes without loading large media files into server memory or persisting temporary files to disk.
- **DRM & Access Control Protection**: Fully respects digital access controls. MediaGrab does not bypass DRM, login sessions, paywalls, or private account restrictions.
- **Legal Notice UX**: Prominent compliance notices informing users to only download content they have legitimate permission to archive or use.

---

## 📁 Project Structure

```
mediagrab/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── download/
│   │   │   │   └── route.ts         # Secure media streaming endpoint
│   │   │   ├── fetch-media/
│   │   │   │   └── route.ts         # Server-side URL validation & metadata extraction
│   │   │   └── health/
│   │   │       └── route.ts         # Health & compliance status endpoint
│   │   ├── favicon.ico
│   │   ├── globals.css              # Glassmorphism, animations, theme tokens
│   │   ├── layout.tsx               # Root layout, metadata & viewport
│   │   └── page.tsx                 # Main application page
│   ├── components/
│   │   ├── BrandIcons.tsx           # Authentic vector SVG brand icons
│   │   ├── DownloadHistoryDrawer.tsx# LocalStorage download history manager
│   │   ├── FaqSection.tsx           # Accordion FAQ
│   │   ├── FeaturesSection.tsx      # SaaS feature grid
│   │   ├── Footer.tsx               # SaaS footer & status badge
│   │   ├── Hero.tsx                 # SaaS Hero banner & capability badges
│   │   ├── HowItWorks.tsx           # 3-step interactive visual workflow
│   │   ├── LegalSection.tsx         # Copyright & DMCA compliance section
│   │   ├── MediaResultCard.tsx      # Video/Audio download cards with progress
│   │   ├── Navbar.tsx               # Header with history & dark mode toggle
│   │   ├── SupportedPlatforms.tsx   # Detailed YouTube & Instagram guide
│   │   └── UrlInputSection.tsx      # Large rounded URL input & drag/drop zone
│   ├── lib/
│   │   ├── extractors.ts            # Public oEmbed metadata & lawful stream resolver
│   │   └── security.ts              # SSRF defense, rate limiting, sanitization
│   └── types/
│       └── index.ts                 # Full TypeScript interfaces
├── test-e2e.mjs                     # Automated verification test suite
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Installation & Running Locally
```bash
# Navigate to project directory
cd "C:\Users\IRFAN\.gemini\antigravity-ide\scratch\mediagrab"

# Install dependencies (already completed)
npm install

# Start development server
npm run dev

# Run automated end-to-end verification suite
npm run test:e2e
```

The application is accessible at: **[http://localhost:3000](http://localhost:3000)**.
