import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import mdPlugin from 'vite-plugin-markdown'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mdPlugin.plugin({ mode: 'html' })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
