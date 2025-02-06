import { Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link
} from 'react-router-dom'
import LoadingElement from './LoadingElement'
import ErrorElement from './ErrorElement'
import routes from './routes'

const Root = () => {
  return (
    <div className='flex justify-center items-center h-dvh w-full'>
      <header className='fixed top-0 bg-foreground text-background w-full h-16'>
        <div className='mx-auto flex items-center content-center justify-between p-4'>
          <div>
            <Link to='/'>Home</Link>
          </div>
        </div>
      </header>
      <Outlet />
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
