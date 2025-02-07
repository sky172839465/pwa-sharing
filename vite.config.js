import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import mdPlugin from 'vite-plugin-markdown'
import pwaPluginConfig from './pwa.config'
import { publicKey } from './conf/vapidKeys.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pwaPluginConfig, mdPlugin.plugin({ mode: 'html' })],
  define: {
    'window.vapidPublicKey': `'${publicKey}'`
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Your backend server
        changeOrigin: true,
        secure: false
      }
    }
  }
})
