import useSWR from 'swr'
import { delay } from 'lodash-es'
import { Download,MousePointerClick, PartyPopper, X } from 'lucide-react'
import { useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

import { Alert, AlertDescription,AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const SEC = 1000
const INTERVAL_MS = 10 * SEC

const useSWUpdate = (registration) => {
  useSWR(
    registration || null,
    r => {
      console.log('Periodic check by swr')
      r.update()
    },
    { refreshInterval: INTERVAL_MS, revalidateOnFocus: true }
  )
}

const ReloadPrompt = () => {
  const [registration, setRegistration] = useState()
  const [isUpdating, setIsUpdating] = useState(false)
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r) {
      if (!r) {
        return
      }

      // on page load check new sw, if exist trigger upload & refresh flow
      r.update().then(() => updateServiceWorker(true))
      setRegistration(r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    }
  })
  useSWUpdate(registration)
  console.log({ offlineReady, needRefresh, isUpdating })

  const onClose = () => {
    setNeedRefresh(false)
  }

  const onConfirm = () => {
    setOfflineReady(false)
  }

  const onUpdate = () => {
    if (!needRefresh) {
      return
    }

    setIsUpdating(true)
    updateServiceWorker(true)
    delay(() => window.location.reload(), SEC * 10)
  }

  return (
    (offlineReady || needRefresh) && (
      <div className='fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 pwa:bottom-8 px-2'>
        <Alert
          className={`
            flex items-center justify-between gap-2
            rounded-xl border border-foreground bg-background p-4 text-foreground shadow-xl
            ${(offlineReady || needRefresh) ? 'cursor-pointer' : ''}
          `}
        >
          {!isUpdating && offlineReady && (
            <div onClick={onConfirm}>
              <AlertTitle className='flex items-center gap-2'>
                <PartyPopper className='size-5' />
                <span>
                  Congratulation
                </span>
              </AlertTitle>
              <AlertDescription>
                App ready to work offline.
              </AlertDescription>
            </div>
          )}
          {!isUpdating && needRefresh && !offlineReady && (
            <>
              <div onClick={onUpdate}>
                <AlertTitle className='flex items-center gap-2'>
                  <MousePointerClick className='size-5' />
                  <span>
                    Update Available
                  </span>
                </AlertTitle>
                <AlertDescription>
                  New content available, click to update.
                </AlertDescription>
              </div>
              <div className='flex'>
                <Button size='icon' variant='ghost' onClick={onClose}>
                  <X className='size-4' />
                </Button>
              </div>
            </>
          )}
          {isUpdating && (
            <div>
              <AlertTitle className='flex items-center gap-2'>
                <Download className='size-5' />
                <span>
                  Downloading
                </span>
              </AlertTitle>
              <AlertDescription>
                {'Please waiting for new content downloaded.'.split(' ').map((word, index) => {
                  return (
                    <span
                      key={index}
                      className='animate-pulse font-medium'
                    >
                      {`${word} `}
                    </span>
                  )
                })}
              </AlertDescription>
            </div>
          )}
        </Alert>
      </div>
    )
  )
}

export default ReloadPrompt
