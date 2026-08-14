// vite.config.js
// NOTE: No compression plugin needed — Vercel automatically serves
// Gzip + Brotli from its CDN edge. This config handles code splitting,
// chunk optimization, and dev proxy only.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // required for Tailwind v4
  ],

  build: {
    // Code splitting — keeps initial bundle small
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
        },
      },
    },
    assetsInlineLimit: 4096,  // inline assets < 4kb as base64
    sourcemap: false,          // no source maps in production
    minify: 'esbuild',         // fast minification
    chunkSizeWarningLimit: 1000,
  },

  // Dev server proxy — avoids CORS during local development
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});