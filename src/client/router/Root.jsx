import { lazy } from 'react'
import {
  Outlet,
  ScrollRestoration,
  useLocation
} from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { SWRConfig } from 'swr'
import PWAInstall from '../pages/Install/PWAInstall'

const LazyNavs = lazy(() => import('../pages/index'))
const LazyReloadPrompt = lazy(() => import('./ReloadPrompt'))

const Root = () => {
  const { pathname } = useLocation()
  return (
    <SWRConfig
      value={{
        onError: (error, key) => toast(`${key} ${error.message}, ${error.toString()}`)
      }}
    >
      <div className='flex flex-col min-h-dvh w-full'>
        {pathname !== '/' && (
          <LazyNavs />
        )}
        <div className='flex grow items-center'>
          <Outlet />
        </div>
      </div>
      <PWAInstall />
      <Toaster />
      <LazyReloadPrompt />
      <ScrollRestoration />
    </SWRConfig>
  )
}
export default Root