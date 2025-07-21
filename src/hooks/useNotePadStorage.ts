import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface UseNotePadStorageProps {
  contentKey: string;
  titleKey: string;
  widthKey: string;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
}

interface UseNotePadStorageReturn {
  title: string;
  width: number;
  isLoading: boolean;
  setTitle: (title: string) => void;
  setWidth: (width: number) => void;
  loadContent: () => string | null;
  saveContent: (content: string) => void;
}

export function useNotePadStorage({
  contentKey,
  titleKey,
  widthKey,
  defaultWidth,
  minWidth,
  maxWidth,
}: UseNotePadStorageProps): UseNotePadStorageReturn {
  const [title, setTitle] = useState('');
  const [width, setWidth] = useState(defaultWidth);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingContent, setPendingContent] = useState<string | null>(null);

  // Debounce content saves to prevent excessive localStorage writes
  const debouncedContent = useDebounce(pendingContent, 500);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedTitle = localStorage.getItem(titleKey);
      const savedWidth = localStorage.getItem(widthKey);

      if (savedTitle) {
        setTitle(savedTitle);
      }

      if (savedWidth) {
        const parsedWidth = parseInt(savedWidth, 10);
        if (parsedWidth >= minWidth && parsedWidth <= maxWidth) {
          setWidth(parsedWidth);
        }
      }
    } catch (error) {
      console.warn('Failed to load notepad settings from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, [titleKey, widthKey, minWidth, maxWidth]);

  // Save debounced content
  useEffect(() => {
    if (debouncedContent !== null && typeof window !== 'undefined') {
      try {
        localStorage.setItem(contentKey, debouncedContent);
      } catch (error) {
        console.warn('Failed to save content to localStorage:', error);
      }
    }
  }, [debouncedContent, contentKey]);

  const handleSetTitle = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(titleKey, newTitle);
      } catch (error) {
        console.warn('Failed to save title to localStorage:', error);
      }
    }
  }, [titleKey]);

  const handleSetWidth = useCallback((newWidth: number) => {
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setWidth(clampedWidth);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(widthKey, clampedWidth.toString());
      } catch (error) {
        console.warn('Failed to save width to localStorage:', error);
      }
    }
  }, [widthKey, minWidth, maxWidth]);

  const loadContent = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      return localStorage.getItem(contentKey);
    } catch (error) {
      console.warn('Failed to load content from localStorage:', error);
      return null;
    }
  }, [contentKey]);

  const saveContent = useCallback((content: string) => {
    setPendingContent(content);
  }, []);

  return {
    title,
    width,
    isLoading,
    setTitle: handleSetTitle,
    setWidth: handleSetWidth,
    loadContent,
    saveContent,
  };
}