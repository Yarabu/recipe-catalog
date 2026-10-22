import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const page = (file: string) => fileURLToPath(new URL(file, import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        catalog: page('./catalog.html'),
        recipe: page('./recipe.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/tests/**/*.test.ts'],
  },
});