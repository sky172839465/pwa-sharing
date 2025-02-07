import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import path from 'path'
import fs from 'fs'
import webPush from 'web-push'
import { random } from 'lodash-es'
import { tryit } from 'radash'

const app = new Hono()

app.use('*', serveStatic({ root: './dist' }))

app.get('/', (c) => {
  return c.html(
    fs.readFileSync(path.join(process.cwd(), 'dist/index.html'), 'utf-8')
  )
})

const vapid = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'conf/vapidKeys.json'), 'utf-8')
)
// 設定 Web Push VAPID 金鑰
webPush.setVapidDetails(
  'mailto:sky172839465@gmail.com',
  vapid.publicKey,
  vapid.privateKey
)

// store user subscriptions
let subscriptions = []

const sendNotification = async (subscription) => {
  const payload = JSON.stringify({
    title: 'Hello!',
    body: `This is a push notification from server. ${new Date().toISOString()}`,
    unreadCount: random(0, 5)
  })
  const [error, result] = await tryit(() => webPush.sendNotification(subscription, payload))()
  if (error) {
    console.error('sendNotification get error', error)
    return [error]
  }

  return [undefined, result]
}

// accept user subscription
app.post('/api/subscribe', async (c) => {
  const subscription = await c.req.json()
  await sendNotification(subscription)
  return c.json({ status: true, message: 'Subscribed successfully!' })
})

// send notification to all subscribe user
app.post('/api/send-notification', async (c) => {  
  await Promise.all(subscriptions.map(sendNotification))
  return c.json({ status: true, message: 'Notification sent!' })
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