# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Core commands

This is a Next.js 15 app (App Router) using TypeScript and Tailwind CSS.

**Install dependencies (recommended: pnpm)**
- `pnpm install`
  - Alternative: `npm install` (a `package-lock.json` is present) but `pnpm-lock.yaml` suggests `pnpm` is preferred.

**Run the development server**
- `pnpm dev`
  - Starts `next dev --turbopack` on `http://localhost:3000`.

**Build for production**
- `pnpm build`
  - Runs `next build`.

**Run the production server locally**
- `pnpm start`
  - Serves the built app via `next start` (requires a prior `pnpm build`).

**Lint the codebase**
- `pnpm lint`
  - Runs `next lint` (ESLint with Next.js config).

**Tests**
- There is currently no `test` script configured in `package.json`; no test runner is wired up yet.

## High-level architecture

### Framework & entrypoints

- The app uses the **Next.js App Router** with the main entrypoints under `src/app`:
  - `src/app/layout.tsx`
    - Defines the global HTML shell and body.
    - Registers Google fonts (`Geist`, `Geist_Mono`, `Playfair_Display`) and exposes them via CSS variables.
    - Imports global styles from `src/app/globals.css`.
    - Mounts cross-cutting concerns:
      - `@vercel/analytics/react` (`<Analytics />`).
      - `@vercel/speed-insights/next` (`<SpeedInsights />`).
      - Global toast provider via `<Toaster />` from `@/components/ui/sonner`.
  - `src/app/page.tsx`
    - Client-side home page (`"use client"`) and primary landing experience.
    - Composes high-level sections:
      - `HeaderSection` (hero/profile intro).
      - `ProjectsGrid` and `ListItem` for “Highlights” content.
      - A “Connect” call-to-action with `Button` from `@/components/ui/button` and external links (email, X profile, Cal.com booking).
      - A dynamically loaded `FocusBanner` and `QuotesSection` for async/lazy content.
      - A `PhotoModal` for photo zoom (dynamic import, controlled via local `isModalOpen` state).
    - Uses `AnimationWrapper` (from `@/hooks/useAnimation`) plus Framer Motion (`motion`, `AnimatePresence` from `motion/react`) to orchestrate enter animations.

### Routing & pages

- **App router structure** is organized under `src/app`:
  - `src/app/page.tsx`
    - Root `/` route with the main portfolio overview, highlights, and contact info.
  - `src/app/case-studies/*/page.tsx`
    - Case-study pages live under `src/app/case-studies/<slug>/page.tsx`.
    - Example: `src/app/case-studies/chatbot-flow-builder/page.tsx` implements the “Chatbot Builder” case study.
      - Declared as a client component (`"use client"`).
      - Uses Next dynamic imports for heavier/auxiliary UI:
        - `FocusBanner` from `@/components/FocusBanner`.
        - `TableOfContents` from `@/components/TableOfContents` (lazy-loaded, fixed positioning on large screens).
      - Pulls structured content (e.g., `tabData` from `./tabData`) and passes it into `Tabs` from `@/components/ui/tabs` for the “Deep Dive” section.
      - Uses `FancyHeader` for the case-study hero section.
      - Leans heavily on motion primitives (`motion`, `AnimatePresence`) for collapsible sections, floating buttons, and scroll-based interactions.
      - Utilizes Next `<Image>` and HTML `<video>` for rich media.
      - Navigation back to the root `/` route via `next/link` links styled as pill buttons.
    - Other case studies (e.g. `fixing-our-reports`, `rasayel-big-picture`) follow the same pattern: one route folder per case study under `src/app/case-studies/`.
  - `src/app/feed/page.tsx`
    - Client route for `/feed`.
    - Imports feed data from `@/data/feed` and maps it into a **masonry-style layout**:
      - Computes responsive column count based on `window.innerWidth` (1 / 2 / 3 columns for small / medium / large screens).
      - Distributes `FeedImage` items into columns by tracking cumulative column heights and always appending to the shortest column.
      - Uses a helper (`getDefaultDimensions`) to determine image/video dimensions and aspect ratios from data, falling back to sensible defaults.
      - Wraps each item with `AnimationWrapper` for staggered entry animations.
    - Shares `HeaderSection` with the home page for visual consistency.
  - `src/app/services/page.tsx`
    - `/services` route (not shown in detail here) lives alongside `feed` and case studies; follow the same composition-first pattern when extending it.

### Shared components & UI system

- Shared UI lives under `src/components` with a focus on composition and small, reusable primitives.

#### UI primitives (`src/components/ui/*`)

- `src/components/ui/button.tsx`
  - Central button abstraction built with **Radix Slot** (`@radix-ui/react-slot`) and **class-variance-authority** (`cva`).
  - Exports `Button` and `buttonVariants`:
    - Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`.
    - Sizes: `default`, `sm`, `lg`, `icon`.
  - Uses `cn` from `@/lib/utils` to merge class names and attach variant-specific styles.
  - Pattern: higher-level components pass `variant`, `size`, and optionally `asChild` (to render as `<a>` or other elements) rather than hardcoding classes.
- Other files in `src/components/ui/` (not exhaustively listed) wrap Radix primitives and define the design system surface:
  - `card.tsx`, `chart.tsx`, `collapsible.tsx`, `context-menu.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `popover.tsx`, `switch.tsx`, `tabs.tsx`, etc.
  - These components abstract third-party libraries (e.g., Radix UI, `sonner`) into project-specific building blocks.
  - Use these wrappers instead of using Radix/third-party primitives directly when extending the UI.

#### Charts (`src/components/charts/*`)

- `src/components/charts/RoleEvolutionChart.tsx`
  - Client component that builds on **Recharts** to display a stacked bar chart.
  - Uses `ChartContainer`, `ChartTooltip`, and `ChartTooltipContent` from `@/components/ui/chart` to:
    - Provide a consistent chart shell and theming.
    - Map semantic series keys (e.g., `strategy`, `problemDiscovery`) to CSS variables like `--color-strategy` via a `ChartConfig` object.
  - The chart data is defined inline (`roleChartData`) as a series of periods with per-role percentages.
  - Pattern for future charts:
    - Define a local `ChartConfig` that satisfies `ChartConfig` from the UI layer.
    - Wrap Recharts components in `ChartContainer` and use `ChartTooltip`/`ChartTooltipContent` for tooltips.

#### Higher-level components

- Page-level composition uses dedicated components (e.g., `HeaderSection`, `ListItem`, `ProjectsGrid`, `FocusBanner`, `QuotesSection`, `FancyHeader`, `FeedImageItem`, `TableOfContents`).
- These live in `src/components` (root, not `ui/`) and are responsible for layout, page-specific copy, and orchestrating UI primitives.
- Many of them are dynamically imported from pages to reduce initial bundle size and keep the main routes responsive.

### Data & content modules

- Static content is organized into data modules under `src/data` (inferred from imports like `@/data/staticData` and `@/data/feed`).
  - `staticHighlights` supplies the “Highlights” section on the home page.
  - `feed.ts` exports `feedImages` and the `FeedImage` type for the `/feed` route.
  - `tabData.tsx` colocates tab descriptors with the chatbot case-study route.
- Pattern: keep structured content (copy, datasets, tab definitions) in dedicated data files and import them into pages/components to avoid hardcoding large content blocks inside JSX.

### Animations & client behavior

- The project makes extensive use of motion/animation for polish and storytelling:
  - Framer Motion via `motion` and `AnimatePresence` (`motion/react`) for:
    - Enter/exit transitions, reveal animations, and modal transitions.
    - Animated sections in case studies (collapsible blocks, sticky buttons, etc.).
  - `AnimationWrapper` (`@/hooks/useAnimation`) wraps content to apply consistent fade/slide-in behavior with optional delay.
- Some components use `"use client"` at the top and dynamic imports to ensure browser-only APIs are not executed on the server (e.g., access to `window`, `navigator.clipboard`).

### Analytics & instrumentation

- Global analytics and performance instrumentation are configured in `src/app/layout.tsx`:
  - Vercel Analytics (`<Analytics />`) for traffic insights.
  - Vercel Speed Insights (`<SpeedInsights />`) for performance metrics.
- Toast notifications use `sonner` via `@/components/ui/sonner`; for example, the chatbot case study uses `toast.success` / `toast.error` for clipboard feedback.

## Notes for future Warp agents

- When adding new routes:
  - Place new pages under `src/app/<route>/page.tsx` (or nested folders for deeper routes) to stay consistent with the App Router.
  - Prefer composing existing components from `src/components` and primitives from `src/components/ui` rather than introducing ad-hoc styling.
- When adding new visualizations:
  - Follow the pattern in `src/components/charts/RoleEvolutionChart.tsx` and `@/components/ui/chart` for consistent theming and tooltip behavior.
- When extending interactive sections:
  - Reuse `AnimationWrapper` and Framer Motion for consistent animation behavior.
  - For client-only behavior (e.g., `window`, `navigator` access), ensure the component is a client component (`"use client"`) and consider dynamic imports where appropriate.
