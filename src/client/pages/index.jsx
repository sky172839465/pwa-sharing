import { Link, useLocation } from "react-router-dom"
import routes from "../routes"
import { Button } from "@/components/ui/button"
import { isEmpty } from "lodash-es"

const Index = () => {
  const { pathname } = useLocation()
  const displayRoutes = pathname === '/' ? routes.filter(route => route.path !== '/') : routes
  return (
    <div className='space-x-4 w-full p-4 text-center sticky top-0 bg-background/30 backdrop-blur-md'>
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