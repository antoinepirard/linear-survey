interface TocItem {
    id: string;
    title: string;
    level: number;
}
interface MorphingTocColors {
    /** Colors for the collapsed state (lines) */
    line?: {
        h1?: string;
        h2?: string;
        h3?: string;
        h4?: string;
        default?: string;
    };
    /** Colors for the expanded state (menu) */
    menu?: {
        background?: string;
        border?: string;
        text?: string;
        textHover?: string;
        itemHover?: string;
    };
}
interface MorphingTocSizes {
    /** Line widths for each heading level */
    lineWidth?: {
        h1?: string;
        h2?: string;
        h3?: string;
        h4?: string;
        default?: string;
    };
    /** Height of each line */
    lineHeight?: string;
    /** Spacing between lines */
    lineGap?: string;
    /** Width of the expanded menu */
    menuWidth?: string;
}
interface MorphingTocProps {
    /** CSS class name for the root container */
    className?: string;
    /** Scroll offset from top in pixels (accounts for fixed headers) */
    scrollOffset?: number;
    /** Which heading levels to include (default: [2, 3, 4]) */
    headingLevels?: number[];
    /** Whether to skip the first h1 element (typically the page title) */
    skipFirstH1?: boolean;
    /** CSS selector to scope heading search (default: searches entire document) */
    containerSelector?: string;
    /** Custom color configuration */
    colors?: MorphingTocColors;
    /** Custom size configuration */
    sizes?: MorphingTocSizes;
}
interface UseTocItemsOptions {
    headingLevels?: number[];
    skipFirstH1?: boolean;
    containerSelector?: string;
}

export type { MorphingTocProps as M, TocItem as T, UseTocItemsOptions as U, MorphingTocColors as a, MorphingTocSizes as b };
