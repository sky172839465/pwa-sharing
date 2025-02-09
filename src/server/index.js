import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
// import webPush from 'web-push'
import { buildPushPayload } from '@block65/webcrypto-web-push'
import { filter, get, random, size } from 'lodash-es'
import { tryit } from 'radash'
import vapid from '../../conf/vapidKeysConf'

const app = new Hono()

// config webPush VAPID token
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

const clearSubscriptions = () => {
  console.log('Clearing subscriptions...')
  subscriptions.length = 0
}

const ALLOWED_ORIGIN = 'https://pwa-sharing.pages.dev'

// Helper function to set CORS headers
const setCorsHeaders = (c, allowedOrigin) => {
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', '*')
  c.header('Access-Control-Allow-Origin', allowedOrigin)
}

// ⚠️ Cloudflare Workers `process.env.NODE_ENV` will be `undefined`
const isDev = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'
if (isDev) {
  app.use('/*', serveStatic({ root: './dist' }))
  app.get('*', serveStatic({ path: './dist/index.html' }))
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
      body: `Push notification from server. ${new Date().toISOString()}`,
      unreadCount: random(0, 5)
    })
  }
  const [payloadError, payload] = await tryit(() => buildPushPayload(message, subscription, vapidDetails))()
  if (payloadError) {
    console.error('buildPushPayload get error', payloadError)
    return [payloadError]
  }
  // const [error, result] = await tryit(() => webPush.sendNotification(subscription, payload))()
  const [error, response] = await tryit(() => fetch(subscription.endpoint, payload))()
  if (error) {
    console.error('sendNotification get error', error)
    return [error]
  }

  if (!response.ok) {
    // If the response is not OK (status outside 200–299)
    console.log(`response not ok, status ${response.status}, statusText: ${response.statusText}`)
    return [new Error(response.statusText)]
  }

  // console.log(`sendNotification, status ${response.status}`)

  return [undefined, response]
}

app.get('/api/status', async (c) => {
  return c.json({ status: 'ok' })
})

// accept user subscription
app.post('/api/subscribe', async (c) => {
  const subscription = await c.req.json()
  subscriptions.push(subscription)
  await sendNotification(subscription)
  return c.json({ status: true, message: 'Subscribed successfully!' })
})

// remove user subscription
app.post('/api/unsubscribe', async (c) => {
  const subscription = await c.req.json()
  const endpoint = get(subscription, 'endpoint')
  const newSubscriptions = filter(subscriptions, subscription => {
    return subscription.endpoint !== endpoint
  })
  console.log(`Unsubscribe count ${size(subscriptions) - size(newSubscriptions)}`)
  subscriptions = newSubscriptions
  return c.json({ status: true, message: 'Unsubscribed successfully!' })
})

// send notification to all subscribe user
app.post('/api/send-notification', async (c) => { 
  const env = c.env
  if (env.NODE_ENV === 'production') {
    return c.json({ error: 'Don\'t noise other people.' }, 403)
  }

  await Promise.all(subscriptions.map(sendNotification))
  return c.json({ status: true, message: 'Notification sent!' })
})

export default {
  fetch: app.fetch,
  async scheduled (event) {
    console.log("Scheduled job triggered at:", event.scheduledTime)
    clearSubscriptions()
  }
}
