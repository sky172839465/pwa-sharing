<p align="center">
  <img src="https://raw.githubusercontent.com/sky172839465/pwa-sharing/refs/heads/main/public/pwa-192x192.png" alt="logo">
</p>
<h3 align="center">PWA sharing exmaple</h3>
<p align="center">https://pwa-sharing.pages.dev</p>

### Features
- Install to web app [How](#how-to-make-website-installable)
  - Fake install prompt
  - Rich install
- Install & update service worker [How](#how-to-install-and-update-sw)
  - No page active enter website automatic reload to install & active new service worker
  - Have active page, every 10sec detect update & show update banner click to update
  - Unregister servic worker
  - Parallel precache files
- Notifiaction [How](#how-to-implement-notification)
  - Catch notification by service worker
  - Click notification to open web app or website in browser
  - Click notification redirect to `/home` page
  - Can update installed app unreadCount
  - Unsubscribe notification

### Quick start
- Install dependencies
  > `prepare` will trigger after install finish, create vapid for notification service
  ```shell
  npm install
  ```
- Generate https certs (PWA requirement)
  > `gen:cert` will create certs under `/cert` folder
  ```shell
  npm run install:mkcert
  npm run gen:cert
  ```
- Run website on localhost
  ```shell
  npm run dev
  ```
- `Another terminal` Run service
  > notification server, allow user subscribe & send notification
  ```shell
  npm run dev:server
  ```
- Open website on `https://localhost:5173` (default, might change)
  > notification service will run on `https://localhost:8080`

### Simulate Production
- build website & using `hono` as web server & notification server
  ```shell
  npm run preview
  ```
- Open website on `https://localhost:8080`
- `Another terminal` Update client code & rebuild website to simulate production update service worker
  ```shell
  npm run build:dev
  ```

### Generate icons
- Default target icon for generate is in `pwa-assets.config.js` > `public/favicon.svg`  
  https://vite-pwa-org.netlify.app/assets-generator/
  ```shell
  npm run gen:pwa-assets
  ```

### Explain
#### How to make website installable
- Prepare web app manifests  
  - exmaple: https://pwa-sharing.pages.dev/manifest.webmanifest
  - generate from: https://github.com/sky172839465/pwa-sharing/blob/main/pwa.config.js
- Rich install
  <img width="1520" alt="Screenshot 2025-02-08 at 7 59 32 PM" src="https://github.com/user-attachments/assets/1e8fa4b7-891e-4b3b-8df7-e6f9a48316be" />
- <details>
    <summary>Fake install prompt</summary>
    <table>
      <tr>
        <td>
          <img src="https://github.com/user-attachments/assets/a69b5157-2628-4731-9d7c-011e7baffe3e" />
        </td>
        <td>
          <img src="https://github.com/user-attachments/assets/cf32e855-b392-4366-aff1-f2b8bbacdd72" />
        </td>
      </tr>
    </table>
  </details>
- ref
  - https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html#web-app-manifest
  - https://developer.mozilla.org/en-US/docs/Web/Manifest
  - https://github.com/khmyznikov/pwa-install
    > **v^0.4.0 language support zh_TW incorrect**
 
#### How to install and update sw
- Using library or follow framework suggestion to do it (**recommend**)
  - Vite + react https://vite-pwa-org.netlify.app/guide/
  - NextJS https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps
- Update strategy
  - periodically check service worker changed (**recommend**)
    > default browser 24hr check one time
    > better use `swr` `react-query` handle when reconnect or window refocus
  - automatic update
    - ref: https://vite-pwa-org.netlify.app/guide/auto-update.html
  - prompt for update
    - example
      - service worker: https://github.com/sky172839465/pwa-sharing/blob/main/public/sw.js
      - prompt: https://github.com/sky172839465/pwa-sharing/blob/main/src/client/router/ReloadPrompt.jsx
      ![IMG_5975](https://github.com/user-attachments/assets/95cd1f22-757c-4795-a333-9b11de7efeed)
- Parallel precache files
  - problem: https://github.com/GoogleChrome/workbox/issues/2880
  - implement: https://github.com/sky172839465/pwa-sharing/pull/26/files
- ref
  - https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

#### How to implement notification
- Prepare vapid `publicKey` `privateKey`
  - example: https://github.com/sky172839465/pwa-sharing/blob/main/scripts/genVapid.js
- Client frontend
  - Request notification permission from user
  - After permission granted, ask `subscription` from browser service
  - Send `subscription` to service
    > `subscription` provide endpoint & keys allow server send request to browser service make a notification
  - example: https://github.com/sky172839465/pwa-sharing/blob/main/src/client/pages/Notification/useNotification.js
- Client service worker
  - Add `push` event listener to catch notification from browser service and show notification, update web app badge unread count
    > Andriod unread count depend on it implement
    ![IMG_5977](https://github.com/user-attachments/assets/445a9aa5-84e2-4860-b834-09a8d70ead3c)
  - Add `notificationclick` event listener to close notifiction & redirect to specific web app route
    ![IMG_5976](https://github.com/user-attachments/assets/e7422ee8-8d09-4220-a5e8-75d11048c8fd)
  - example: https://github.com/sky172839465/pwa-sharing/blob/main/public/sw.js
- Server
  - Add endpoint to store `subscription`
  - Using `subscription` endpoint send notification to browser service
  - example: https://github.com/sky172839465/pwa-sharing/blob/main/src/server/index.js
- Ref
  - https://developer.mozilla.org/zh-TW/docs/Web/API/Notifications_API/Using_the_Notifications_API
  - https://github.com/web-push-libs/web-push
