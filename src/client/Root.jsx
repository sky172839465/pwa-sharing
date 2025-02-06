import { lazy } from 'react'
import {
  Outlet,
  useLocation
} from 'react-router-dom'

const LazyNavs = lazy(() => import('./pages/index'))
const LazyReloadPrompt = lazy(() => import('./ReloadPrompt'))

const Root = () => {
  const { pathname } = useLocation()
  return (
    <>
      <div className='flex flex-col h-dvh w-full'>
        {pathname !== '/' && (
          <LazyNavs />
        )}
        <div className='flex grow items-center'>
          <Outlet />
        </div>
      </div>
      <LazyReloadPrompt />
    </>
  )
}
export default Root