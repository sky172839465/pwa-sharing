import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import mdPlugin from 'vite-plugin-markdown'
import { createHtmlPlugin } from 'vite-plugin-html'
import pwaPluginConfig from './pwa.config'
import vapidKeys from './conf/vapidKeysConf'

const { publicKey } = vapidKeys

const API_HOST = 'https://pwa-sharing.sky172839465.workers.dev'

const links = fs.readFileSync('links.html', 'utf-8')

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  return {
    plugins: [
      react(),
      pwaPluginConfig,
      mdPlugin.plugin({ mode: 'html' }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            links
          }
        }
      })
    ],
    define: {
      'window.vapidPublicKey': `'${publicKey}'`,
      'window.API_HOST': `'${isProd ? API_HOST : ''}'`
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      emptyOutDir: true
    },
    server: {
      https: isProd || {
        key: fs.readFileSync('./cert/key.pem'),
        cert: fs.readFileSync('./cert/cert.pem')
      },
      proxy: {
        '/api': {
          target: 'https://localhost:8080',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
