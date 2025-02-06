import { VitePWA } from 'vite-plugin-pwa'

export default VitePWA({
  strategies: 'injectManifest',
  manifest: {
    name: 'PWA sharing',
    short_name: 'PWA sharing',
    description: 'PWA sharing example code',
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
