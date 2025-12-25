import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5173,
    proxy: {
      '/chat': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});

