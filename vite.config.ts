import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import { generateSW } from 'rollup-plugin-workbox'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: [
        sveltePreprocess({
          typescript: true,
        }),
      ],
    }),
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
  },
  
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  build: {
    // Tauri supports es2021
    target: "chrome105",
    // don't minify for debug builds
    minify: false,
    // produce sourcemaps for debug builds
    sourcemap: true,
  },
  define: {
    'APP_VERSION': JSON.stringify(process.env.npm_package_version),
  }
})
