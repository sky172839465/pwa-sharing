import { useState, useEffect } from 'react'
import useSubscribe from './useSubscribe.js'
import { tryit } from 'radash'

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const vapidPublicKey = window.vapidPublicKey
const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)
const isSWExist = ('serviceWorker' in navigator && 'PushManager' in window)
const getIsGranted = permission => permission === 'granted'
const getDefaultIsGranted = isSWExist ? getIsGranted(Notification.permission) : false

const useNotification = () => {
  const [isPending, setIsPending] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isGranted, setIsGranted] = useState(getDefaultIsGranted)
  const { trigger } = useSubscribe()

  useEffect(() => {
    const checkIsRegistered = async () => {
      if (!isSWExist) {
        console.log('checkIsRegistered: sw not exist')
        return
      }

      setIsPending(true)
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      console.log({ subscription })
      if (!subscription) {
        console.log('checkIsRegistered: subscription not exist')
        setIsPending(false)
        return
      }

      setIsPending(false)
      setIsRegistered(true)
    }
    checkIsRegistered()
  }, [])

  const registerForNotifications = async () => {
    if (!isSWExist) {
      console.log('registerForNotifications: sw not exist')
      return
    }

    setIsPending(true)
    const nextIsGranted = isGranted ? true : getIsGranted(await Notification.requestPermission())
    setIsGranted(nextIsGranted)
    if (!nextIsGranted) {
      setIsPending(false)
      return
    }

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    })
    console.log({ subscription })
    const [error, result] = await tryit(() => trigger(subscription))()
    if (error) {
      console.error('Error subscribing to notifications:', error)
      setIsPending(false)
      return
    }


    console.log({ result })
    setIsPending(false)
    setIsRegistered(true)
  }

  return {
    isPending,
    isRegistered,
    isGranted,
    registerForNotifications
  }
}

export default useNotification
