import { useState, useEffect, useCallback } from 'react'
import { tryit } from 'radash'
import useSubscribe from './useSubscribe.js'
import useCheckSubscribe from './useCheckSubscribe.js'
import useUnsubscribe from './useUnsubscribe.js'

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
const getDefaultIsGranted = () => isSWExist ? getIsGranted(Notification.permission) : false

const useNotification = () => {
  const [isPending, setIsPending] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isGranted, setIsGranted] = useState(getDefaultIsGranted)
  const [subscription, setSubscription] = useState()
  const { trigger: subscribe } = useSubscribe()
  const { trigger: unsubscribe } = useUnsubscribe()
  const { data: isSubscribe, isLoading } = useCheckSubscribe(subscription)

  useEffect(() => {
    const checkIsRegistered = async () => {
      if (!isSWExist) {
        console.log('checkIsRegistered: sw not exist')
        return
      }

      setIsPending(true)
      const registration = await navigator.serviceWorker.ready
      const newSubscription = await registration.pushManager.getSubscription()
      setSubscription(newSubscription)
      setIsGranted(!!newSubscription)
      console.log({ subscription: newSubscription })
      if (!newSubscription) {
        console.log('checkIsRegistered: subscription not exist')
        setIsPending(false)
        return
      }

      setIsPending(false)
      setIsRegistered(true)
    }
    checkIsRegistered()
  }, [])

  const unsubscribeNotification = useCallback(() => {
    subscription.unsubscribe()
    unsubscribe(subscription)
    setIsRegistered(false)
    setIsGranted(false)
    setSubscription()
  }, [subscription, unsubscribe, setIsRegistered, setSubscription, setIsGranted])

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
    setSubscription(subscription)
    const [error, result] = await tryit(() => subscribe(subscription))()
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
    isSubscribe,
    subscription,
    registerForNotifications,
    unsubscribeNotification
  }
}

export default useNotification
