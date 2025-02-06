import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

// periodic check new service worker available
// after prompt click send `SKIP_WAITING` message to reload page & install new sw
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)
