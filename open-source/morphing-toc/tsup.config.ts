import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    MorphingToc: 'src/MorphingToc.tsx',
    useTocItems: 'src/useTocItems.ts',
    scrollToSection: 'src/scrollToSection.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  bundle: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'motion', 'motion/react'],
  treeshake: true,
});
