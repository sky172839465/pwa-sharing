import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import mdPlugin from 'vite-plugin-markdown'
import pwaPluginConfig from './pwa.config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pwaPluginConfig, mdPlugin.plugin({ mode: 'html' })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
