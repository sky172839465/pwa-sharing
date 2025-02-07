import { Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import LoadingElement from './LoadingElement'
import ErrorElement from './ErrorElement'
import routes from './routes'
import Root from './Root'
import PWAInstallProvider from '../pages/Install/PWAInstallProvider'

const Router = () => {
  const browserRoutes = [{
    element: (
      <PWAInstallProvider>
        <Root />
      </PWAInstallProvider>
    ),
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
