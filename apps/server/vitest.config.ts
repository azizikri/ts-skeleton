import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/db/**', 'src/**/schema/**'],
      thresholds: {
        branches: 80,
        lines: 85,
        functions: 85,
        statements: 85,
      },
    },
  },
});
