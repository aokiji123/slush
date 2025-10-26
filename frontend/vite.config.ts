import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Proxy API calls to backend (including SignalR hubs)
      '/api': {
        target: 'http://localhost:5088',
        changeOrigin: true,
        secure: false,
        ws: true, // Enable WebSocket support for SignalR
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Proxy error:', err)
          })
        },
      },
    },
  },
})
