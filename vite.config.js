import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/flavortown-api': {
        target: 'https://flavortown.hackclub.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/flavortown-api/, '/api/v1'),
      },
      '/flavortown-images': {
        target: 'https://flavortown.hackclub.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/flavortown-images/, '/rails/active_storage/blobs/proxy'),
      },
      '/hackatime-api': {
        target: 'https://hackatime.hackclub.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hackatime-api/, '/api/v1'),
      },
    },
  },
})
