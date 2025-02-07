import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import fs from 'fs'
import { flow, filter, orderBy, map,  } from 'lodash-es'
import sizeOf from 'image-size'

const screenshotType = 'image/png'
const richInstallFolder = 'rich-install'
const directoryPath = path.resolve(__dirname, `public/${richInstallFolder}`)
const screenshots = flow(
  () => fs.readdirSync(directoryPath),
  files => filter(files, file => path.extname(file).toLowerCase() === '.png'),
  files => orderBy(files),
  files => map(files, file => {
    const filePath = path.join(directoryPath, file)
    const dimensions = sizeOf(filePath)
    return {
      src: `${richInstallFolder}/${file}`,
      label: `PWA sharing ${file.replace('.png', '')}`,
      form_factor: file.match(/\d+_d/) ? 'wide' : 'narrow',
      sizes: `${dimensions.width}x${dimensions.height}`,
      type: screenshotType
    }
  })
)()

export default VitePWA({
  strategies: 'injectManifest',
  manifest: {
    name: 'PWA sharing',
    short_name: 'PWA sharing',
    description: 'PWA sharing example code',
    screenshots,
    theme_color: '#ffffff',
    display: 'standalone',
    'icons': [
      {
        'src': 'pwa-64x64.png',
        'sizes': '64x64',
        'type': 'image/png'
      },
      {
        'src': 'pwa-192x192.png',
        'sizes': '192x192',
        'type': 'image/png'
      },
      {
        'src': 'pwa-512x512.png',
        'sizes': '512x512',
        'type': 'image/png'
      },
      {
        'src': 'maskable-icon-512x512.png',
        'sizes': '512x512',
        'type': 'image/png',
        'purpose': 'maskable'
      }
    ]
  },
  devOptions: {
    enabled: true,
    type: 'module'
  }
})
