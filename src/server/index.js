import { Hono } from 'hono'
import webPush from 'web-push'
import { filter, isEmpty, random } from 'lodash-es'
import { tryit } from 'radash'
import vapid from '../../conf/vapidKeysConf'

const app = new Hono()

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

  console.log(result)
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
