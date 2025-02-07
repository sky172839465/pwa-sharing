import { lazy } from 'react'
import {
  Outlet,
  useLocation
} from 'react-router-dom'
import PWAInstall from './pages/Install/PWAInstall'
import PWAInstallProvider from './pages/Install/PWAInstallProvider'

const LazyNavs = lazy(() => import('./pages/index'))
const LazyReloadPrompt = lazy(() => import('./ReloadPrompt'))

const Root = () => {
  const { pathname } = useLocation()
  return (
    <PWAInstallProvider>
      <div className='flex flex-col h-dvh w-full'>
        {pathname !== '/' && (
          <LazyNavs />
        )}
        <div className='flex grow items-center'>
          <Outlet />
        </div>
      </div>
      <PWAInstall />
      <LazyReloadPrompt />
    </PWAInstallProvider>
  )
}
export default Root