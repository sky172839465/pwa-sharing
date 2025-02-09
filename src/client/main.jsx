import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import Router from './router/Router'
import { tryit } from 'radash'

if ('serviceWorker' in navigator) {
  const registerSW = async () => {
    const [error] = await tryit(() => navigator.serviceWorker.register('/sw.js'))()
    if (!error) {
      return
    }
    console.log('Service Worker registration failed:', error)
  }
  registerSW()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
