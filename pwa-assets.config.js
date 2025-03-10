import {
  createAppleSplashScreens,
  defineConfig,
  minimal2023Preset as preset
} from '@vite-pwa/assets-generator/config'

// https://vite-pwa-org.netlify.app/assets-generator/cli.html
export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset: {
    ...preset,
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[48, 'favicon.ico']],
      padding: 0.3
    },
    apple: {
      sizes: [180],
      padding: 0.3
    },
    // https://vite-pwa-org.netlify.app/assets-generator/cli#ios-ipad-splash-screens
    appleSplashScreens: createAppleSplashScreens({
      padding: 0.3,
      resizeOptions: { background: '#51a2ff', fit: 'contain' },
      darkResizeOptions: { background: '#162556', fit: 'contain' },
      linkMediaOptions: {
        log: true,
        addMediaScreen: true,
        basePath: '/',
        xhtml: false
      },
      png: {
        compressionLevel: 9,
        quality: 60
      },
      name: (landscape, size, dark) => {
        return `apple-splash-${landscape ? 'landscape' : 'portrait'}-${typeof dark === 'boolean' ? (dark ? 'dark-' : 'light-') : ''}${size.width}x${size.height}.png`
      }
    })
  },
  images: ['public/favicon.svg']
})
