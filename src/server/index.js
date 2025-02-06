import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import path from 'path'
import fs from 'fs'

const app = new Hono()

app.use('*', serveStatic({ root: './dist' }))

app.get('/', (c) => {
  return c.html(
    fs.readFileSync(path.join(process.cwd(), 'dist/index.html'), 'utf-8')
  )
})

app.all('*', (c) => {
  // Redirect 404 to '/'
  return c.html(
    fs.readFileSync(path.join(process.cwd(), 'dist/index.html'), 'utf-8')
  )
})

serve({
  fetch: app.fetch,
  port: 8080,
})