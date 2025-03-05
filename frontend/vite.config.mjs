import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import vuetify from 'vite-plugin-vuetify';

// https://vite.dev/config/
export default defineConfig({
  plugins: [Vue(), vuetify(), eslint()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4144',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
