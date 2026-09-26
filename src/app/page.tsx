'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { UrlInputSection } from '@/components/UrlInputSection';
import { MediaResultCard } from '@/components/MediaResultCard';
import { SupportedPlatforms } from '@/components/SupportedPlatforms';
import { HowItWorks } from '@/components/HowItWorks';
import { FeaturesSection } from '@/components/FeaturesSection';
import { FaqSection } from '@/components/FaqSection';
import { LegalSection } from '@/components/LegalSection';
import { Footer } from '@/components/Footer';
import { DownloadHistoryDrawer } from '@/components/DownloadHistoryDrawer';
import { DownloadHistoryItem, MediaMetadata } from '@/types';

const STORAGE_KEY_HISTORY = 'mediagrab_download_history_v1';
const STORAGE_KEY_THEME = 'mediagrab_theme_mode';

export default function Home() {
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  // Dark mode state: default true (rich dark theme)
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Download History state
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Initialize theme and history from localStorage on client mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      if (savedTheme !== null) {
        setDarkMode(savedTheme === 'dark');
      }

      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setDownloadHistory(parsed);
        }
      }
    } catch {
      // Storage unavailable or disabled
    }
    setIsThemeLoaded(true);
  }, []);

  // Update HTML class and save theme preference
  useEffect(() => {
    if (!isThemeLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY_THEME, darkMode ? 'dark' : 'light');
      if (darkMode) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } catch {
      // ignore
    }
  }, [darkMode, isThemeLoaded]);

  // Persist history changes
  const saveHistory = (items: DownloadHistoryItem[]) => {
    setDownloadHistory(items);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  // Add an item to download history
  const handleAddToHistory = (item: Omit<DownloadHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: DownloadHistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
    const updated = [newItem, ...downloadHistory.filter((h) => h.url !== item.url)].slice(0, 30);
    saveHistory(updated);
  };

  const handleRemoveHistoryItem = (id: string) => {
    const updated = downloadHistory.filter((item) => item.id !== id);
    saveHistory(updated);
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  // Fetch Media Handler
  const handleFetchMedia = async (targetUrl: string) => {
    setError(null);
    setIsLoading(true);
    setCurrentUrl(targetUrl);

    try {
      const res = await fetch('/api/fetch-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Unable to retrieve media from the provided link.');
        setMetadata(null);
      } else {
        setMetadata(data.data);
        setError(null);

        // Smooth scroll to result card
        setTimeout(() => {
          const el = document.getElementById('results-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 150);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'A network error occurred while connecting to the server.';
      setError(msg);
      setMetadata(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMetadata(null);
    setError(null);
    setCurrentUrl('');
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-[#090b10] text-[#f8fafc]' : 'light bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      {/* Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        historyCount={downloadHistory.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pb-24">
        {/* Hero Section */}
        <Hero />

        {/* Downloader Section */}
        <UrlInputSection
          onFetch={handleFetchMedia}
          isLoading={isLoading}
          error={error}
          onClear={handleClear}
          initialUrl={currentUrl}
        />

        {/* Media Preview & Formats Results Card */}
        {metadata && (
          <div id="results-section">
            <MediaResultCard
              metadata={metadata}
              onReset={handleClear}
              onAddToHistory={handleAddToHistory}
            />
          </div>
        )}

        {/* Supported Platforms */}
        <SupportedPlatforms />

        {/* How It Works (3 Steps) */}
        <HowItWorks />

        {/* Features Grid */}
        <FeaturesSection />

        {/* FAQ Accordion */}
        <FaqSection />

        {/* Legal & Compliance Notice */}
        <LegalSection />
      </main>

      {/* Local Download History Drawer */}
      <DownloadHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={downloadHistory}
        onClearHistory={handleClearHistory}
        onRemoveItem={handleRemoveHistoryItem}
        onReFetch={(url) => {
          setCurrentUrl(url);
          handleFetchMedia(url);
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
