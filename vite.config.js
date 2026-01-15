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
      '/hackatime-api': {
        target: 'https://hackatime.hackclub.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hackatime-api/, '/api/v1'),
      },
    },
  },
})
