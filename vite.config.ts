
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/upminaa/',

  plugins: [
    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: 'Upminaa - Calculadora de Compras',
        short_name: 'Upminaa',
        description: 'Sua calculadora de compras offline',

        start_url: '/upminaa/',
        scope: '/upminaa/',

        display: 'standalone',
        orientation: 'portrait',

        background_color: '#0b0b0d',
        theme_color: '#0b0b0d',
        lang: 'pt-BR',

        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
