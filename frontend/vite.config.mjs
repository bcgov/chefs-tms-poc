import { defineConfig } from 'vite';
import { resolve } from 'path';
import Vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import vuetify from 'vite-plugin-vuetify';

// https://vite.dev/config/
export default defineConfig({
  preview: {
    allowedHosts: (process.env.VITE_ALLOWED_HOSTS || '').split(','),
  },
  plugins: [Vue(), vuetify(), eslint()],
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {
      VITE_BACKEND_API_URL: process.env.VITE_BACKEND_API_URL,
    },
  },
});
