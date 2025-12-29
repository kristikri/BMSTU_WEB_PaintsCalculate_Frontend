import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
// import mkcert from 'vite-plugin-mkcert'
// import fs from 'fs';
// import path from 'path';

export default defineConfig({
  server: {
    // https:{
    //   key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    // },
    proxy: {
      "/api": {
        target: "http://192.168.195.207:8080",
        changeOrigin: true,
        secure:false,
      },
      "/test":{
        target: "http://192.168.195.207:9000",
        changeOrigin: true,
        secure:false,
      }
    },
    port: 3000,
    watch: { 
        usePolling: true,
    }, 
    host: true, 
    strictPort: true, 
  },
  plugins: [
    react(),
    // mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false,
      },
      manifest:{
        name: "PaintsCalculate",
        short_name: "PaintsCalculate",
        start_url: "/",
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
  base:"",
})