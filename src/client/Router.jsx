import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation
} from 'react-router-dom'
import LoadingElement from './LoadingElement'
import ErrorElement from './ErrorElement'
import routes from './routes'

const LazyNavs = lazy(() => import('./pages/index'))

const Root = () => {
  const { pathname } = useLocation()
  return (
    <div className='flex justify-center items-center h-dvh w-full'>
      <main>
        <div
          className={`
            fixed top-4 left-0
            ${pathname === '/' ? 'hidden' : ''}
          `}
        >
          <LazyNavs />
        </div>
        <Outlet />
      </main>
    </div>
  )
}

const Router = () => {
  const browserRoutes = [{
    element: <Root />,
    errorElement: <ErrorElement />,
    children: [
      ...routes.map(({ pageComponent: Page, path }) => {
        return {
          path,
          element: (
            <Suspense fallback={<LoadingElement />}>
              <Page />
            </Suspense>
          ),
          errorElement: <ErrorElement />
        }
      }),
      {
        path: '*',
        element: <ErrorElement />
      }
    ]
  }]
  const router = createBrowserRouter(browserRoutes)
  return (
    <RouterProvider
      router={router}
      fallbackElement={(
        <LoadingElement />
      )}
    />
  )
}

export default Router
