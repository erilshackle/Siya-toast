import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['iife'],
    globalName: 'Siya',
    outDir: 'dist',
    clean: true,
    minify: false,
    target: 'es2018'
  },

  {
    entry: ['src/index.ts'],
    format: ['iife'],
    globalName: 'Siya',
    outDir: 'dist',
    clean: false,
    minify: true,
    target: 'es2018'
  },

  {
    entry: ['src/index.ts'],
    format: ['esm'],
    outDir: 'dist',
    clean: false,
    minify: false,
    target: 'es2018'
  }
]);