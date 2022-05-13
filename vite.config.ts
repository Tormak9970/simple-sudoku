import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { generateSW } from 'rollup-plugin-workbox'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    generateSW({
      swDest: './dist/service-worker.js',
      globDirectory: './dist',
      globPatterns: [
        '**/*.{html,json,js,css}',
      ],
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [{
        urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 10,
          },
        },
      }, {
        urlPattern: /\.(?:js|css)$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'assets',
          expiration: {
            maxEntries: 10,
          },
        },
      }, {
        urlPattern: /\.(?:html)$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages',
          expiration: {
            maxEntries: 10,
          },
        },
      }],
    })
  ],
  optimizeDeps: {
    include: ['lodash.get', 'lodash.isequal', 'lodash.clonedeep']
  }
})
