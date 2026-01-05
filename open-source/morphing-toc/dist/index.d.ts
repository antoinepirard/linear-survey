export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface MorphingTocColors {
  line?: {
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    default?: string;
  };
  menu?: {
    background?: string;
    border?: string;
    text?: string;
    textHover?: string;
    itemHover?: string;
  };
}

export interface MorphingTocSizes {
  lineWidth?: {
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    default?: string;
  };
  lineHeight?: string;
  lineGap?: string;
  menuWidth?: string;
}

export interface MorphingTocProps {
  className?: string;
  scrollOffset?: number;
  headingLevels?: number[];
  skipFirstH1?: boolean;
  containerSelector?: string;
  colors?: MorphingTocColors;
  sizes?: MorphingTocSizes;
}

export interface UseTocItemsOptions {
  headingLevels?: number[];
  skipFirstH1?: boolean;
  containerSelector?: string;
}

export declare function MorphingToc(props: MorphingTocProps): JSX.Element | null;
export declare function useTocItems(options?: UseTocItemsOptions): TocItem[];
export declare function scrollToSection(id: string, offset?: number): void;
