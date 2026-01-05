import { useState, useEffect, useMemo } from 'react';
import type { TocItem, UseTocItemsOptions } from './types';

const defaultOptions: Required<UseTocItemsOptions> = {
  headingLevels: [2, 3, 4],
  skipFirstH1: true,
  containerSelector: '',
};

export function useTocItems(options: UseTocItemsOptions = {}): TocItem[] {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  const { headingLevels, skipFirstH1, containerSelector } = {
    ...defaultOptions,
    ...options,
  };

  // Stable reference for headingLevels to avoid unnecessary re-renders
  const headingLevelsKey = useMemo(() => headingLevels.join(','), [headingLevels]);

  useEffect(() => {
    const container = containerSelector
      ? document.querySelector(containerSelector)
      : document;

    if (!container) {
      setTocItems([]);
      return;
    }

    const selector = headingLevels.map((level) => `h${level}`).join(', ');
    const headings = container.querySelectorAll(selector);
    const items: TocItem[] = [];
    const usedIds = new Set<string>();
    let skippedFirstH1 = false;

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      const title = heading.textContent || '';

      // Skip the first h1 if configured
      if (skipFirstH1 && level === 1 && !skippedFirstH1) {
        skippedFirstH1 = true;
        return;
      }

      // Generate unique ID if heading doesn't have one
      let id = heading.id;
      if (!id) {
        const baseId = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();

        id = baseId;
        let counter = 1;
        while (usedIds.has(id)) {
          id = `${baseId}-${counter}`;
          counter++;
        }

        heading.id = id;
      }

      usedIds.add(id);

      items.push({
        id,
        title,
        level,
      });
    });

    setTocItems(items);
  }, [headingLevelsKey, skipFirstH1, containerSelector]);

  return tocItems;
}
