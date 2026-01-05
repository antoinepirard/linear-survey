import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: false,
  external: ['react', 'react-dom', 'motion', 'motion/react'],
  treeshake: true,
});
