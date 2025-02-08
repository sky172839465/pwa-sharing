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
    const [error] = await tryit(() => {
      return Promise.all(registrations.map((item) => item.unregister()))
    })()
    setIsPending(false)
    setRegistration(null)
    if (error) {
      console.log(error)
      toast(`Unregister failed, ${error.message}`)
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
