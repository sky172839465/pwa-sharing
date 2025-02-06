import { Link, useLocation } from "react-router-dom"
import routes from "../routes"
import { Button } from "@/components/ui/button"
import { isEmpty } from "lodash-es"

const Index = () => {
  const { pathname } = useLocation()
  const displayRoutes = pathname === '/' ? routes.filter(route => route.path !== '/') : routes
  return (
    <div className='flex justify-center items-center gap-4 w-dvw'>
      {displayRoutes.map((route, index) => {
        const routeName = route.path.replaceAll('/', '')
        const displayRouteName = isEmpty(routeName) ? 'home' : routeName
        return (
          <Link key={index} to={route.path} viewTransition>
            <Button variant="outline" disabled={pathname === route.path}>
              {displayRouteName}
            </Button>
          </Link>
        )
      })}
    </div>
  )
}

export default Index