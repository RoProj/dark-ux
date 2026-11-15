import { defineConfig } from 'vite';

// Relative asset paths, so the built site works from any folder: a domain root, a GitHub Pages project
// page (user.github.io/repo/) or a plain static host.
// Fixed file names (no hash in them), so uploading a new build replaces the old files instead of
// leaving the old ones behind next to the new ones.
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});
