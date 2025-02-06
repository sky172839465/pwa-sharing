import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import Router from './Router'
import { tryit } from 'radash'

if ('serviceWorker' in navigator) {
  const registerSW = async () => {
    const [error, result] = await tryit(
      () => navigator.serviceWorker.register('/sw.js')
    )()
    if (error) {
      console.log('Service Worker registration failed:', error)
      return
    }

    result.update()
  }
  registerSW()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
