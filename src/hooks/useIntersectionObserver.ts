import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
}

interface UseIntersectionObserverReturn {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<HTMLDivElement | null>, UseIntersectionObserverReturn] {
  const {
    root = null,
    rootMargin = '200px',
    threshold = 0.1,
    freezeOnceVisible = false,
  } = options;

  const elementRef = useRef<HTMLDivElement | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const frozen = freezeOnceVisible && isIntersecting;

  useEffect(() => {
    const element = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !element) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);
      },
      observerParams
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, frozen]);

  return [elementRef, { isIntersecting, entry }];
}