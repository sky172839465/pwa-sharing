import { useRef, useCallback } from 'react'
import PWAInstallContext from './PWAInstallContext'

const PWAInstallProvider = (props) => {
  const { children } = props
  const installPWAWrapperRef = useRef()
  const installPWARef = useRef()

  const getPWAInstallRef = () => {
    if (!installPWARef.current) {
      console.error('installPWARef not found', installPWARef)
      return {
        showDialog: () => {},
        hideDialog: () => {}
      }
    }

    return installPWARef.current
  }

  const showDialog = useCallback(() => {
    const target = getPWAInstallRef()
    target.showDialog(true)
  }, [])

  const hideDialog = useCallback(() => {
    const target = getPWAInstallRef()
    target.hideDialog()
  }, [])

  const value = {
    installPWARef,
    installPWAWrapperRef,
    showDialog,
    hideDialog
  }
  return (
    <PWAInstallContext.Provider value={value}>
      {children}
    </PWAInstallContext.Provider>
  )
}

export default PWAInstallProvider
