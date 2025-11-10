import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

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
  plugins: [
    react(),
    VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true,
    },
    manifest:{
      name: "Tile Notes",
      short_name: "Tile Notes",
      start_url: "/",
      display: "standalone",
      background_color: "#fdfdfd",
      theme_color: "#db4938",
      orientation: "portrait-primary",
      icons: [
        {
          "src": "/logo192.png",
          "type": "image/png", "sizes": "192x192"
        },
        {
          "src": "/logo512.png",
          "type": "image/png", "sizes": "512x512"
        }
      ],
    }
    })
  ],
})