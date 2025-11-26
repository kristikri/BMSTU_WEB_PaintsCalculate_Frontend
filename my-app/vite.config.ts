import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs';
import path from 'path';

export default defineConfig({
  server: {
    https:{
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, "/"),
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
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest:{
        name: "PaintsCalculate",
        short_name: "PaintsCalculate",
        start_url: "/BMSTU_WEB_Frontend/",
        display: "standalone",
        background_color: "#fdfdfd",
        theme_color: "#db4938",
        orientation: "portrait-primary",
        icons: [
          {
            "src": "logo.png",
            "type": "image/png", 
            "sizes": "192x192"
          },
          {
            "src": "logo.png",
            "type": "image/png", 
            "sizes": "512x512"
          }
        ],
      }
    })
  ],
  base:"/BMSTU_WEB_Frontend",
})