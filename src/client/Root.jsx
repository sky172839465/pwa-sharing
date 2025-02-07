import { lazy } from 'react'
import {
  Outlet,
  ScrollRestoration,
  useLocation
} from 'react-router-dom'
import PWAInstall from './pages/Install/PWAInstall'

const LazyNavs = lazy(() => import('./pages/index'))
const LazyReloadPrompt = lazy(() => import('./ReloadPrompt'))

const Root = () => {
  const { pathname } = useLocation()
  return (
    <>
      <div className='flex flex-col min-h-dvh w-full'>
        {pathname !== '/' && (
          <LazyNavs />
        )}
        <div className='flex grow items-center'>
          <Outlet />
        </div>
      </div>
      <PWAInstall />
      <LazyReloadPrompt />
      <ScrollRestoration />
    </>
  )
}
export default Root