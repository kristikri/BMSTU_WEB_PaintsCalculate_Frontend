import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
    port: 3000,
    watch: { // нужно для hot-reload при использовании docker
        usePolling: true,
    }, 
    host: true, // нужно, чтобы правильно работал маппинг портов в docker-контейнере
    strictPort: true, // необязательно
  },
  plugins: [react()],
})