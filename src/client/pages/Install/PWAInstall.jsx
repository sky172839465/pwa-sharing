import '@khmyznikov/pwa-install'
import usePWAInstall from './usePWAInstall'
import { useEffect } from 'react'
import { useEventListener } from 'usehooks-ts'

const PWAInstall = () => {
  const {
    installPWAWrapperRef,
    installPWARef,
    isStandaloneState,
    isDeviceStandaloneMode
  } = usePWAInstall()
  const [, setIsStandalone] = isStandaloneState

  useEffect(() => {
    if (!installPWAWrapperRef.current) {
      return
    }

    installPWARef.current = installPWAWrapperRef.current.querySelector('pwa-install')
    installPWARef.current.externalPromptEvent = window.promptEvent

    if (!isDeviceStandaloneMode) {
      return
    }
    setIsStandalone(true)
  }, [installPWARef, installPWAWrapperRef, setIsStandalone, isDeviceStandaloneMode])

  useEventListener('pwa-install-success-event', e => {
    console.log('pwa-install-success-event', e)
    setIsStandalone(true)
  }, installPWARef)

  // 預設判斷是否已經安裝 PWA
  useEventListener('pwa-install-available-event', e => {
    console.log('pwa-install-available-event', e)
    setIsStandalone(false)
  }, installPWARef)

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