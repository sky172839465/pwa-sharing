import { tryit } from "radash"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const isSWExist = ('serviceWorker' in navigator)

const useUnregister = () => {
  const [registration, setRegistration] = useState(false)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    const checkIsRegistered = async () => {
      if (!isSWExist) {
        return
      }

      const registration = await navigator.serviceWorker.getRegistration()
      console.log(registration)
      setRegistration(registration)
    }
    checkIsRegistered()
  }, [])

  const trigger = async () => {
    if (!registration) {
      return
    }

    setIsPending(true)
    const registrations = await navigator.serviceWorker.getRegistrations()
    const [unregisterError] = await tryit(() => {
      return Promise.all(registrations.map((item) => item.unregister()))
    })()

    const [cleanCacheError] = await tryit(async () => {
      const cacheNames = await caches.keys()
      return Promise.all(cacheNames.map(cache => caches.delete(cache)))
    })()
  
    setIsPending(false)
    setRegistration(null)
    if (unregisterError) {
      console.log(unregisterError)
      toast(`Unregister failed, ${unregisterError.message}`)
      return
    }

    if (cleanCacheError) {
      console.log(cleanCacheError)
      toast(`cleanCache failed, ${cleanCacheError.message}`)
      return
    }

    toast('Unregister success!')
  }

  return {
    isRegistered: !!registration,
    isPending,
    trigger
  }
}

export default useUnregister
