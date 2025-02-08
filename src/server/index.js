import { Hono } from 'hono'
// import webPush from 'web-push'
import { buildPushPayload } from '@block65/webcrypto-web-push'
import { filter, isEmpty, random } from 'lodash-es'
import { tryit } from 'radash'
import vapid from '../../conf/vapidKeysConf'

const app = new Hono()

// 設定 Web Push VAPID 金鑰
// webPush.setVapidDetails(
//   'mailto:sky172839465@gmail.com',
//   vapid.publicKey,
//   vapid.privateKey
// )
const vapidDetails = {
  subject: 'mailto:sky172839465@gmail.com',
  publicKey: vapid.publicKey,
  privateKey: vapid.privateKey
}

// store user subscriptions
let subscriptions = []

const ALLOWED_ORIGIN = 'https://pwa-sharing.pages.dev'

// Helper function to set CORS headers
const setCorsHeaders = (c, allowedOrigin) => {
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', '*')
  c.header('Access-Control-Allow-Origin', allowedOrigin)
}

// Middleware to handle all routes (GET, POST, etc.)
app.use('*', async (c, next) => {
  const env = c.env
  const origin = c.req.header('Origin')

  if (env.NODE_ENV === 'production') {
    // Only allow specific origin in production
    if (origin !== ALLOWED_ORIGIN) {
      return c.json({ error: 'CORS Forbidden' }, 403)
    }
    setCorsHeaders(c, ALLOWED_ORIGIN)
  } else {
    // In development, allow all origins
    setCorsHeaders(c, '*')
  }

  return next()
})

// Handle Preflight (OPTIONS) Requests
app.options('*', (c) => {
  const env = c.env
  const origin = c.req.header('Origin')

  if (env.NODE_ENV === 'production' && origin !== ALLOWED_ORIGIN) {
    return c.json({ error: 'CORS Forbidden' }, 403)
  }

  setCorsHeaders(c, env.NODE_ENV === 'production' ? ALLOWED_ORIGIN : '*')
  return c.text('', 204)
})

const sendNotification = async (subscription) => {
  const message = {
    data: JSON.stringify({
      title: 'Hello!',
      body: `This is a push notification from server. ${new Date().toISOString()}`,
      unreadCount: random(0, 5)
    })
  }
  const payload = await buildPushPayload(message, subscription, vapidDetails)
  // const [error, result] = await tryit(() => webPush.sendNotification(subscription, payload))()
  const [error, result] = await tryit(() => fetch(subscription.endpoint, payload))()
  if (error) {
    console.error('sendNotification get error', error)
    return [error]
  }

  return [undefined, result]
}

app.get('/api/status', async (c) => {
  return c.json({ status: 'ok' })
})

app.get('/api/check-subscribe', async (c) => {
  const endpoint = await c.req.query('endpoint')
  const isSubscribe = !isEmpty(filter(subscriptions, { endpoint }))
  return c.json({ status: true, isSubscribe })
})

// accept user subscription
app.post('/api/subscribe', async (c) => {
  const subscription = await c.req.json()
  subscriptions.push(subscription)
  await sendNotification(subscription)
  return c.json({ status: true, message: 'Subscribed successfully!' })
})

// send notification to all subscribe user
app.post('/api/send-notification', async (c) => { 
  await Promise.all(subscriptions.map(sendNotification))
  return c.json({ status: true, message: 'Notification sent!' })
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
