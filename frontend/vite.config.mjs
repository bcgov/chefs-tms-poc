import { defineConfig } from 'vite';
import { resolve } from 'path';
import Vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import vuetify from 'vite-plugin-vuetify';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

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
});
