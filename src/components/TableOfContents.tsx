'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export default function TableOfContents({ className = '' }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Generate table of contents from headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const title = heading.textContent || '';
      
      // Skip the main title (first h1)
      if (level === 1 && index === 0) return;
      
      // Create ID if it doesn't exist
      let id = heading.id;
      if (!id) {
        id = title.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
        heading.id = id;
      }

      items.push({
        id,
        title,
        level
      });
    });

    setTocItems(items);
  }, []);



  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for any fixed headers
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <motion.div
      className={`fixed left-2 md:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="relative">
        {/* Minimal lines view */}
        <AnimatePresence>
          {!isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute top-1/2 left-0 -translate-y-1/2 space-y-2"
            >
              {tocItems.map((item) => {
                // Different line lengths based on heading level
                const getLineWidth = (level: number) => {
                  switch (level) {
                    case 1: return 'w-6'; // H1 - longest (24px)
                    case 2: return 'w-4'; // H2 - medium (16px)
                    case 3: return 'w-3'; // H3 - short (12px)
                    case 4: return 'w-2'; // H4 - shorter (8px)
                    default: return 'w-2'; // H5, H6 - shortest
                  }
                };
                
                // Different colors based on heading level
                const getLineColor = (level: number) => {
                  switch (level) {
                    case 1: return 'bg-slate-600 hover:bg-slate-700'; // H1 - darkest
                    case 2: return 'bg-slate-400 hover:bg-slate-500'; // H2 - medium
                    case 3: return 'bg-slate-300 hover:bg-slate-400'; // H3 - brightest
                    case 4: return 'bg-slate-300 hover:bg-slate-400'; // H4 - bright
                    default: return 'bg-slate-300 hover:bg-slate-400'; // H5, H6 - bright
                  }
                };
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block h-px ${getLineWidth(item.level)} rounded-sm ${getLineColor(item.level)} transition-colors duration-150`}
                    whileTap={{ scale: 0.95 }}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded view on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-3 w-64"
            >
            <nav className="space-y-0.5">
              {tocItems.map((item) => {
                // Different font weights based on heading level
                const getFontWeight = (level: number) => {
                  switch (level) {
                    case 2: return 'text-slate-800'; // H2 - medium weight (main sections)
                    case 3: return 'text-slate-600'; // H3 - normal weight (subsections)
                    default: return 'text-slate-600'; // H4+ - normal weight
                  }
                };
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-2 py-1 rounded text-sm cursor-pointer hover:text-slate-900 hover:bg-slate-50 transition-all duration-150 ${getFontWeight(item.level)}`}
                    style={{
                      paddingLeft: `${8 + (item.level - 2) * 12}px`
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="block truncate">{item.title}</span>
                  </motion.button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  );
}
