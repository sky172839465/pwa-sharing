import '@khmyznikov/pwa-install'
import usePWAInstall from './usePWAInstall'
import { useEffect } from 'react'

const PWAInstall = () => {
  const { installPWAWrapperRef, installPWARef } = usePWAInstall()

  useEffect(() => {
    if (!installPWAWrapperRef.current) {
      return
    }

    installPWARef.current = installPWAWrapperRef.current.querySelector('pwa-install')
    installPWARef.current.externalPromptEvent = window.promptEvent
  }, [installPWARef, installPWAWrapperRef])

  return (
    <div ref={installPWAWrapperRef}>
      <pwa-install
        // https://github.com/khmyznikov/pwa-install?tab=readme-ov-file#supported-params
        manual-apple='true'
        manual-chrome='true'
        manifest-url='manifest.webmanifest'
      />
    </div>
  )
}

export default PWAInstall