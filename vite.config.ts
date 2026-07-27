import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Recharts is by far the largest dependency and is used on three screens.
        // Splitting it keeps the app chunk small enough to parse quickly on the
        // first screen a reviewer opens, which is never one of those three.
        manualChunks: {
          charts: ['recharts'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
