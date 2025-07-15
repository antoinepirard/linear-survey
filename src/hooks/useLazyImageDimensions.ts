import { useEffect, useState, useCallback } from 'react';
import { getMediaDimensions, ImageDimensions } from '@/utils/imageDimensions';

interface UseLazyImageDimensionsOptions {
  src: string;
  type?: 'image' | 'gif' | 'video';
  shouldLoad?: boolean;
  fallbackWidth?: number;
  fallbackHeight?: number;
}

interface UseLazyImageDimensionsReturn {
  dimensions: ImageDimensions | null;
  isLoading: boolean;
  error: Error | null;
  aspectRatio: number;
}

// Global cache to prevent re-fetching the same image dimensions
const dimensionsCache = new Map<string, ImageDimensions>();
const loadingPromises = new Map<string, Promise<ImageDimensions>>();

export function useLazyImageDimensions({
  src,
  type = 'image',
  shouldLoad = false,
  fallbackWidth = 600,
  fallbackHeight = 600,
}: UseLazyImageDimensionsOptions): UseLazyImageDimensionsReturn {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadDimensions = useCallback(async () => {
    if (!shouldLoad || !src) return;

    // Check cache first
    const cached = dimensionsCache.get(src);
    if (cached) {
      setDimensions(cached);
      return;
    }

    // Check if already loading
    const existingPromise = loadingPromises.get(src);
    if (existingPromise) {
      try {
        const dims = await existingPromise;
        setDimensions(dims);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load dimensions'));
      }
      return;
    }

    // Start loading
    setIsLoading(true);
    setError(null);

    const promise = getMediaDimensions(src, type);
    loadingPromises.set(src, promise);

    try {
      const dims = await promise;
      dimensionsCache.set(src, dims);
      setDimensions(dims);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load dimensions');
      setError(error);
    } finally {
      setIsLoading(false);
      loadingPromises.delete(src);
    }
  }, [src, type, shouldLoad]);

  useEffect(() => {
    loadDimensions();
  }, [loadDimensions]);

  // Calculate aspect ratio
  const aspectRatio = dimensions
    ? dimensions.width / dimensions.height
    : fallbackWidth / fallbackHeight;

  return {
    dimensions,
    isLoading,
    error,
    aspectRatio,
  };
}

// Utility function to clear cache (useful for testing or memory management)
export function clearDimensionsCache(): void {
  dimensionsCache.clear();
  loadingPromises.clear();
}