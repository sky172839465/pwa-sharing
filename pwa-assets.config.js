import {
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
    }
  },
  images: ['public/favicon.svg']
})
