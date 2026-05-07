import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.js',
      name: 'Seeya',
      fileName: 'seeya',
      formats: ['es', 'umd']
    }
  }
});