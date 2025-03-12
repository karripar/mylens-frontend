import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import {VitePWA} from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {enabled: true},
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000, // 5MB
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,svg,ttf,json, jsx}"],
      },
      includeAssets: [
        'App.css',
        'favicon.ico',
        'logo192.png',
        'logo512.png',
        'index.css',
      ],
      manifest: {
        name: 'MyLens',
        short_name: 'MyLens',
        description: 'A social media platform',
        theme_color: '#ffffff',
        icons: [
          {
              src: "icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
          },
          {
              src: "icons/icon-256x256.png",
              sizes: "256x256",
              type: "image/png",
          },
          {
              src: "icons/icon-384x384.png",
              sizes: "384x384",
              type: "image/png",
          },
          {
              src: "icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
          },
      ]
      }
    })
  ],

});
