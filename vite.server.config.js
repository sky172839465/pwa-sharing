import { defineConfig } from 'vite'
import hono from '@hono/vite-build/cloudflare-workers'
import devServer from '@hono/vite-dev-server'
import fs from 'fs'


export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  return {
    root: 'src/server',
    plugins: [
      (!isProd && devServer({ entry: 'index.js' })),
      (isProd && hono({
        entry: 'index.js',
        emptyOutDir: true,
        outputDir: '../../dist'
      }))
    ],
    publicDir: false,
    server: {
      https: isProd || {
        key: fs.readFileSync('./cert/key.pem'),
        cert: fs.readFileSync('./cert/cert.pem')
      },
      port: 8080
    }
  }
})