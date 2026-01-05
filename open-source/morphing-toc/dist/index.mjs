import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsxs, jsx } from 'react/jsx-runtime';

// src/MorphingToc.tsx
var defaultOptions = {
  headingLevels: [2, 3, 4],
  skipFirstH1: true,
  containerSelector: ""
};
function useTocItems(options = {}) {
  const [tocItems, setTocItems] = useState([]);
  const { headingLevels, skipFirstH1, containerSelector } = {
    ...defaultOptions,
    ...options
  };
  const headingLevelsKey = useMemo(() => headingLevels.join(","), [headingLevels]);
  useEffect(() => {
    const container = containerSelector ? document.querySelector(containerSelector) : document;
    if (!container) {
      setTocItems([]);
      return;
    }
    const selector = headingLevels.map((level) => `h${level}`).join(", ");
    const headings = container.querySelectorAll(selector);
    const items = [];
    const usedIds = /* @__PURE__ */ new Set();
    let skippedFirstH1 = false;
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      const title = heading.textContent || "";
      if (skipFirstH1 && level === 1 && !skippedFirstH1) {
        skippedFirstH1 = true;
        return;
      }
      let id = heading.id;
      if (!id) {
        const baseId = title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();
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
        level
      });
    });
    setTocItems(items);
  }, [headingLevelsKey, skipFirstH1, containerSelector]);
  return tocItems;
}

// src/scrollToSection.ts
function scrollToSection(id, offset = 80) {
  const element = document.getElementById(id);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
}
function MenuItem({ item, indent, colors, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      className: "block w-full text-left px-2 py-1 rounded text-sm cursor-pointer",
      style: {
        paddingLeft: `${8 + indent}px`,
        color: isHovered ? colors.textHover : colors.text,
        backgroundColor: isHovered ? colors.itemHover : "transparent"
      },
      tabIndex: -1,
      children: /* @__PURE__ */ jsx("span", { className: "block truncate", children: item.title })
    }
  );
}
var defaultColors = {
  line: {
    h1: "#475569",
    h2: "#94a3b8",
    h3: "#cbd5e1",
    h4: "#cbd5e1",
    default: "#cbd5e1"
  },
  menu: {
    background: "rgba(255, 255, 255, 0.95)",
    border: "rgba(203, 213, 225, 0.3)",
    text: "#475569",
    textHover: "#0f172a",
    itemHover: "#f8fafc"
  }
};
var defaultSizes = {
  lineWidth: {
    h1: "1.5rem",
    h2: "1rem",
    h3: "0.75rem",
    h4: "0.5rem",
    default: "0.5rem"
  },
  lineHeight: "1px",
  lineGap: "0.5rem",
  menuWidth: "16rem"
};
function getLineColor(level, colors = {}) {
  const merged = { ...defaultColors.line, ...colors };
  switch (level) {
    case 1:
      return merged.h1;
    case 2:
      return merged.h2;
    case 3:
      return merged.h3;
    case 4:
      return merged.h4;
    default:
      return merged.default;
  }
}
function getLineWidth(level, sizes = {}) {
  const merged = { ...defaultSizes.lineWidth, ...sizes };
  switch (level) {
    case 1:
      return merged.h1;
    case 2:
      return merged.h2;
    case 3:
      return merged.h3;
    case 4:
      return merged.h4;
    default:
      return merged.default;
  }
}
function MorphingToc({
  className = "",
  scrollOffset = 80,
  headingLevels = [2, 3, 4],
  skipFirstH1 = true,
  containerSelector,
  colors = {},
  sizes = {}
}) {
  const [isHovered, setIsHovered] = useState(false);
  const tocItems = useTocItems({
    headingLevels,
    skipFirstH1,
    containerSelector
  });
  const mergedColors = {
    line: { ...defaultColors.line, ...colors.line },
    menu: { ...defaultColors.menu, ...colors.menu }
  };
  const mergedSizes = {
    lineWidth: { ...defaultSizes.lineWidth, ...sizes.lineWidth },
    lineHeight: sizes.lineHeight ?? defaultSizes.lineHeight,
    lineGap: sizes.lineGap ?? defaultSizes.lineGap,
    menuWidth: sizes.menuWidth ?? defaultSizes.menuWidth
  };
  if (tocItems.length === 0) return null;
  const handleClick = (id) => {
    scrollToSection(id, scrollOffset);
  };
  return /* @__PURE__ */ jsxs("div", { className: `fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block ${className}`, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute -left-20 top-1/2 -translate-y-1/2 w-32 h-96",
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false)
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "relative",
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.3, delay: 0.5 },
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        children: /* @__PURE__ */ jsx("div", { className: "pl-2 md:pl-4 lg:pl-6", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(AnimatePresence, { children: !isHovered && /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: {
                opacity: 0,
                x: 20,
                transition: { duration: 0.15, ease: "easeOut" }
              },
              transition: { duration: 0.15 },
              className: "absolute top-1/2 left-0 -translate-y-1/2",
              style: { display: "flex", flexDirection: "column", gap: mergedSizes.lineGap },
              children: tocItems.map((item, index) => /* @__PURE__ */ jsx(
                motion.button,
                {
                  onClick: () => handleClick(item.id),
                  className: "block rounded-sm transition-opacity duration-150 hover:opacity-70",
                  style: {
                    width: getLineWidth(item.level, mergedSizes.lineWidth),
                    height: mergedSizes.lineHeight,
                    backgroundColor: getLineColor(item.level, mergedColors.line)
                  },
                  whileTap: { scale: 0.95 },
                  tabIndex: -1,
                  animate: {
                    x: isHovered ? 20 : 0,
                    transition: {
                      duration: 0.15,
                      delay: index * 0.02,
                      ease: "easeOut"
                    }
                  }
                },
                item.id
              ))
            }
          ) }),
          /* @__PURE__ */ jsx(AnimatePresence, { children: isHovered && /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: {
                opacity: 0,
                x: -20,
                scale: 0.9,
                borderRadius: 0
              },
              animate: {
                opacity: 1,
                x: 0,
                scale: 1,
                borderRadius: 6
              },
              exit: {
                opacity: 0,
                x: -20,
                scale: 0.9,
                transition: { duration: 0.15, ease: "easeOut" }
              },
              transition: {
                duration: 0.2,
                delay: 0.05,
                ease: "easeOut"
              },
              className: "absolute top-1/2 left-0 -translate-y-1/2 backdrop-blur-sm shadow-md p-3",
              style: {
                width: mergedSizes.menuWidth,
                backgroundColor: mergedColors.menu.background,
                boxShadow: `0 0 0 1px ${mergedColors.menu.border}`
              },
              children: /* @__PURE__ */ jsx("nav", { className: "space-y-0.5", children: tocItems.map((item) => {
                const baseLevel = Math.min(...headingLevels);
                const indent = (item.level - baseLevel) * 12;
                return /* @__PURE__ */ jsx(
                  MenuItem,
                  {
                    item,
                    indent,
                    colors: mergedColors.menu,
                    onClick: () => handleClick(item.id)
                  },
                  item.id
                );
              }) })
            }
          ) })
        ] }) })
      }
    )
  ] });
}

export { MorphingToc, scrollToSection, useTocItems };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map