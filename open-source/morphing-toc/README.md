# morphing-toc

A React table of contents component that displays minimal vertical lines and morphs into a full navigation menu on hover.

## Features

- Minimal visual footprint with vertical lines
- Smooth morph animation on hover
- Auto-extracts headings from DOM
- Generates unique IDs for headings
- Smooth scrolling with configurable offset
- Fully customizable colors and sizes
- TypeScript support
- Works with any React framework

## Installation

```bash
npm install morphing-toc
```

## Peer Dependencies

This package requires the following peer dependencies:

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `motion` >= 10.0.0

## Quick Start

```tsx
import { MorphingToc } from 'morphing-toc';

function BlogPost() {
  return (
    <div>
      <MorphingToc />
      <article>
        <h1>My Blog Post</h1>
        <h2>Introduction</h2>
        <p>...</p>
        <h2>Main Content</h2>
        <h3>Subsection</h3>
        <p>...</p>
      </article>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Custom CSS class for the container |
| `scrollOffset` | `number` | `80` | Offset from top when scrolling (px) |
| `headingLevels` | `number[]` | `[2, 3, 4]` | Which heading levels to include |
| `skipFirstH1` | `boolean` | `true` | Skip the first h1 (page title) |
| `containerSelector` | `string` | `undefined` | CSS selector to scope heading search |
| `colors` | `MorphingTocColors` | See below | Custom color configuration |
| `sizes` | `MorphingTocSizes` | See below | Custom size configuration |

## Customization

### Custom Colors

```tsx
<MorphingToc
  colors={{
    line: {
      h1: '#1e40af',
      h2: '#3b82f6',
      h3: '#93c5fd',
    },
    menu: {
      background: 'rgba(30, 64, 175, 0.95)',
      border: 'rgba(59, 130, 246, 0.3)',
      text: '#ffffff',
      textHover: '#bfdbfe',
      itemHover: 'rgba(59, 130, 246, 0.2)',
    },
  }}
/>
```

### Custom Sizes

```tsx
<MorphingToc
  sizes={{
    lineWidth: {
      h1: '2rem',
      h2: '1.5rem',
      h3: '1rem',
    },
    lineHeight: '2px',
    lineGap: '0.75rem',
    menuWidth: '20rem',
  }}
/>
```

### Scoped to Container

```tsx
<MorphingToc
  containerSelector="#article-content"
  headingLevels={[2, 3]}
/>
```

## Exports

```tsx
import {
  MorphingToc,      // Main component
  useTocItems,      // Hook for heading extraction
  scrollToSection,  // Scroll utility
} from 'morphing-toc';

// Type exports
import type {
  MorphingTocProps,
  MorphingTocColors,
  MorphingTocSizes,
  TocItem,
  UseTocItemsOptions,
} from 'morphing-toc';
```

## useTocItems Hook

For custom implementations, you can use the `useTocItems` hook directly:

```tsx
import { useTocItems, scrollToSection } from 'morphing-toc';

function CustomToc() {
  const items = useTocItems({
    headingLevels: [2, 3],
    skipFirstH1: true,
    containerSelector: '#content',
  });

  return (
    <nav>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id, 80)}
        >
          {item.title}
        </button>
      ))}
    </nav>
  );
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Author

[Antoine Pirard](https://antoinepirard.com)
