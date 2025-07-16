import { useCallback, useRef } from 'react';
import { feedImages } from '@/data/feed';

interface UseFeedPrefetchOptions {
  hoverDelay?: number;
  imageCount?: number;
}

export function useFeedPrefetch(options: UseFeedPrefetchOptions = {}) {
  const { hoverDelay = 200, imageCount = 6 } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prefetchedRef = useRef<Set<string>>(new Set());

  const isMobileDevice = useCallback(() => {
    // Check for touch capability
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  const isSlowConnection = useCallback(() => {
    // Check for slow connection using Network Information API
    if ('connection' in navigator) {
      const connection = (navigator as unknown as { connection?: { effectiveType?: string } }).connection;
      return connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';
    }
    return false;
  }, []);

  const prefetchImage = useCallback((src: string) => {
    return new Promise<void>((resolve, reject) => {
      // Don't prefetch if already prefetched
      if (prefetchedRef.current.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        prefetchedRef.current.add(src);
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to prefetch image: ${src}`);
        reject(new Error(`Failed to prefetch: ${src}`));
      };
      img.src = src;
    });
  }, []);

  const prefetchFeedImages = useCallback(async () => {
    // Skip prefetching on mobile devices or slow connections
    if (isMobileDevice() || isSlowConnection()) {
      return;
    }

    // Get the first few images from the feed, prioritizing recent ones
    const sortedImages = [...feedImages].sort((a, b) => {
      const yearA = parseInt(a.date);
      const yearB = parseInt(b.date);
      return yearB - yearA;
    });

    const imagesToPrefetch = sortedImages
      .slice(0, imageCount)
      .filter(item => !prefetchedRef.current.has(item.src))
      .map(item => item.src);

    if (imagesToPrefetch.length === 0) {
      return;
    }

    // Use requestIdleCallback if available to avoid interfering with main thread
    const prefetchBatch = () => {
      const promises = imagesToPrefetch.map(src => 
        prefetchImage(src).catch(() => {
          // Silently handle errors, don't let one failed image stop others
        })
      );

      Promise.allSettled(promises).then(() => {
        console.log(`Prefetched ${imagesToPrefetch.length} feed images`);
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(prefetchBatch, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(prefetchBatch, 0);
    }
  }, [imageCount, prefetchImage, isMobileDevice, isSlowConnection]);

  const handleMouseEnter = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for delayed prefetching
    timeoutRef.current = setTimeout(() => {
      prefetchFeedImages();
    }, hoverDelay);
  }, [prefetchFeedImages, hoverDelay]);

  const handleMouseLeave = useCallback(() => {
    // Cancel prefetching if user moves away quickly
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    handleMouseEnter,
    handleMouseLeave,
    prefetchFeedImages,
    isPrefetched: (src: string) => prefetchedRef.current.has(src),
  };
} 