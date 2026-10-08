import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The atlas lives at /atlas/ behind Cloudflare Access; / is the public teaser
// in public/index.html. Its bundle (which holds the flight data) is emitted
// under atlas/assets/ so the single Access path /atlas covers all of it.
// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    assetsDir: 'atlas/assets',
    rollupOptions: {
      input: resolve(__dirname, 'atlas/index.html'),
    },
  },
});
