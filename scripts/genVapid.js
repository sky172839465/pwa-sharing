import path from 'path'
import fs from 'fs'
import webPush from 'web-push'
import { tryit } from 'radash'

const vapidKeysPath = path.resolve('conf/vapidKeys.json')
const [error] = await tryit(() => fs.promises.access(vapidKeysPath))()
if (!error) {
  console.log(`Detect vapid: ${vapidKeysPath}`)
  process.exit(0)
}

const {
  VAPID_PUBLIC_KEY: publicKey,
  VAPID_PRIVATE_KEY: privateKey
} = process.env

const { isEnvKey, keys } = (publicKey && privateKey)
  ? { isEnvKey: true, keys: { publicKey, privateKey } }
  : { isEnvKey: false, keys: webPush.generateVAPIDKeys() }
await fs.promises.writeFile(vapidKeysPath, JSON.stringify(keys, null, 2), 'utf-8')
console.log(`Generate vapid by ${isEnvKey ? 'env' : 'web-push'}: ${vapidKeysPath}`)
