'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTocItems } from './useTocItems';
import { scrollToSection } from './scrollToSection';
import type { MorphingTocProps, MorphingTocColors, MorphingTocSizes, TocItem } from './types';

interface MenuItemProps {
  item: TocItem;
  indent: number;
  colors: NonNullable<MorphingTocColors['menu']>;
  onClick: () => void;
}

function MenuItem({ item, indent, colors, onClick }: MenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block w-full text-left px-2 py-1 rounded text-sm cursor-pointer"
      style={{
        paddingLeft: `${8 + indent}px`,
        color: isHovered ? colors.textHover : colors.text,
        backgroundColor: isHovered ? colors.itemHover : 'transparent',
      }}
      tabIndex={-1}
    >
      <span className="block truncate">{item.title}</span>
    </button>
  );
}

const defaultColors: Required<MorphingTocColors> = {
  line: {
    h1: '#475569',
    h2: '#94a3b8',
    h3: '#cbd5e1',
    h4: '#cbd5e1',
    default: '#cbd5e1',
  },
  menu: {
    background: 'rgba(255, 255, 255, 0.95)',
    border: 'rgba(203, 213, 225, 0.3)',
    text: '#475569',
    textHover: '#0f172a',
    itemHover: '#f8fafc',
  },
};

const defaultSizes: Required<MorphingTocSizes> = {
  lineWidth: {
    h1: '1.5rem',
    h2: '1rem',
    h3: '0.75rem',
    h4: '0.5rem',
    default: '0.5rem',
  },
  lineHeight: '1px',
  lineGap: '0.5rem',
  menuWidth: '16rem',
};

function getLineColor(level: number, colors: MorphingTocColors['line'] = {}): string {
  const merged = { ...defaultColors.line, ...colors };
  switch (level) {
    case 1:
      return merged.h1!;
    case 2:
      return merged.h2!;
    case 3:
      return merged.h3!;
    case 4:
      return merged.h4!;
    default:
      return merged.default!;
  }
}

function getLineWidth(level: number, sizes: MorphingTocSizes['lineWidth'] = {}): string {
  const merged = { ...defaultSizes.lineWidth, ...sizes };
  switch (level) {
    case 1:
      return merged.h1!;
    case 2:
      return merged.h2!;
    case 3:
      return merged.h3!;
    case 4:
      return merged.h4!;
    default:
      return merged.default!;
  }
}

export function MorphingToc({
  className = '',
  scrollOffset = 80,
  headingLevels = [2, 3, 4],
  skipFirstH1 = true,
  containerSelector,
  colors = {},
  sizes = {},
}: MorphingTocProps) {
  const [isHovered, setIsHovered] = useState(false);

  const tocItems = useTocItems({
    headingLevels,
    skipFirstH1,
    containerSelector,
  });

  const mergedColors = {
    line: { ...defaultColors.line, ...colors.line },
    menu: { ...defaultColors.menu, ...colors.menu },
  };

  const mergedSizes = {
    lineWidth: { ...defaultSizes.lineWidth, ...sizes.lineWidth },
    lineHeight: sizes.lineHeight ?? defaultSizes.lineHeight,
    lineGap: sizes.lineGap ?? defaultSizes.lineGap,
    menuWidth: sizes.menuWidth ?? defaultSizes.menuWidth,
  };

  if (tocItems.length === 0) return null;

  const handleClick = (id: string) => {
    scrollToSection(id, scrollOffset);
  };

  return (
    <div className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block ${className}`}>
      {/* Invisible hover area for better UX */}
      <div
        className="absolute -left-20 top-1/2 -translate-y-1/2 w-32 h-96"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      <motion.div
        className="relative"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="pl-2 md:pl-4 lg:pl-6">
          <div className="relative">
            {/* Collapsed state: minimal lines */}
            <AnimatePresence>
              {!isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    x: 20,
                    transition: { duration: 0.15, ease: 'easeOut' },
                  }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-1/2 left-0 -translate-y-1/2"
                  style={{ display: 'flex', flexDirection: 'column', gap: mergedSizes.lineGap }}
                >
                  {tocItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleClick(item.id)}
                      className="block rounded-sm transition-opacity duration-150 hover:opacity-70"
                      style={{
                        width: getLineWidth(item.level, mergedSizes.lineWidth),
                        height: mergedSizes.lineHeight,
                        backgroundColor: getLineColor(item.level, mergedColors.line),
                      }}
                      whileTap={{ scale: 0.95 }}
                      tabIndex={-1}
                      animate={{
                        x: isHovered ? 20 : 0,
                        transition: {
                          duration: 0.15,
                          delay: index * 0.02,
                          ease: 'easeOut',
                        },
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expanded state: full menu */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{
                    opacity: 0,
                    x: -20,
                    scale: 0.9,
                    borderRadius: 0,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    borderRadius: 6,
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                    scale: 0.9,
                    transition: { duration: 0.15, ease: 'easeOut' },
                  }}
                  transition={{
                    duration: 0.2,
                    delay: 0.05,
                    ease: 'easeOut',
                  }}
                  className="absolute top-1/2 left-0 -translate-y-1/2 backdrop-blur-sm shadow-md p-3"
                  style={{
                    width: mergedSizes.menuWidth,
                    backgroundColor: mergedColors.menu.background,
                    boxShadow: `0 0 0 1px ${mergedColors.menu.border}`,
                  }}
                >
                  <nav className="space-y-0.5">
                    {tocItems.map((item) => {
                      const baseLevel = Math.min(...headingLevels);
                      const indent = (item.level - baseLevel) * 12;

                      return (
                        <MenuItem
                          key={item.id}
                          item={item}
                          indent={indent}
                          colors={mergedColors.menu}
                          onClick={() => handleClick(item.id)}
                        />
                      );
                    })}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
