import { defineConfig } from 'tsup';

export default defineConfig([
  // ESM
  {
    entry: ['src/index.ts'],

    format: ['esm'],

    outDir: 'dist',

    outExtension() {
      return {
        js: '.js'
      };
    },

    clean: true,

    target: 'es2018'
  },

  // CDN / GLOBAL
  {
    entry: ['src/index.ts'],

    format: ['iife'],

    globalName: 'Siya',

    outDir: 'dist',

    outExtension() {
      return {
        js: '.global.js'
      };
    },

    clean: false,

    minify: true,

    target: 'es2018',

    esbuildOptions(options) {
      options.footer = {
        js: `
window.Siya = Siya.default || Siya;
`
      };
    }
  }
]);