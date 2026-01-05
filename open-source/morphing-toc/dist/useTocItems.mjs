import { useState, useMemo, useEffect } from 'react';

const defaultOptions = {
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

export { useTocItems };
//# sourceMappingURL=useTocItems.mjs.map
//# sourceMappingURL=useTocItems.mjs.map