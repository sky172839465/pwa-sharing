import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

self.skipWaiting()
clientsClaim()

// periodic check new service worker available
// after prompt click send `SKIP_WAITING` message to reload page & install new sw
// self.addEventListener('message', (event) => {
//   if (event.data && event.data.type === 'SKIP_WAITING') {
//     self.skipWaiting()
//   }
// })

const getNotificationData = (event) => {
  const stringifyData = event.data.text()
  try {
    return JSON.parse(stringifyData)
  } catch {
    return { title: stringifyData }
  }
}

self.addEventListener('push', (event) => {
  const isPermissionGranted = (
    self.Notification &&
    self.Notification.permission === 'granted'
  )
  if (!isPermissionGranted) {
    console.log('notifications aren\'t supported or permission not granted!')
    return
  }

  const data = getNotificationData(event)
  console.log(data)
  const {
    title,
    body,
    icon = '/favicon.ico',
    unreadCount = 0
  } = data
  const options = { body, icon }

  if (navigator.setAppBadge) {
    if (unreadCount > 0) {
      navigator.setAppBadge(+unreadCount)
    } else {
      navigator.clearAppBadge()
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const urlToOpen = `/home`

  const openMatchWindow = async () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
    const clientList = await self.clients.matchAll()
    // find PWA / browser page
    const matchClient = clientList.find(client => {
      return client.url.includes(self.location.origin) && 'focus' in client
    })
    // foucs matched window and redirect to path
    if (matchClient) {
      await matchClient.focus()
      // https://developer.mozilla.org/en-US/docs/Web/API/WindowClient/navigate
      return matchClient.navigate(urlToOpen)
    }

    if (!self.clients.openWindow) {
      return
    }

    // open window priority PWA > browser
    return self.clients.openWindow(urlToOpen)
  }

  event.waitUntil(openMatchWindow())
})

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)
