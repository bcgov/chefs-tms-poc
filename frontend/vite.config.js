import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/sso': {
        target: 'https://loginproxy.gov.bc.ca',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/sso/, ''),
      },
      '/api': {
        target: 'http://localhost:4144',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    }
  },
})
