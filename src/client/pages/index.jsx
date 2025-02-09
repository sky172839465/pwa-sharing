import { Link, useLocation } from "react-router-dom"
import routes from "../router/routes"
import { Button } from "@/components/ui/button"
import { isEmpty } from "lodash-es"

const Index = (props) => {
  const { isNav } = props
  const { pathname } = useLocation()
  const displayRoutes = pathname === '/' ? routes.filter(route => route.path !== '/') : routes
  return (
    <div className={`
      flex flex-wrap md:flex-nowrap justify-center items-center
      w-full gap-2 p-4 text-center sticky top-0 bg-background/30 backdrop-blur-md
    `}>
      {displayRoutes.map((route, index) => {
        const routeName = route.path.replaceAll('/', '')
        const displayRouteName = isEmpty(routeName) ? 'home' : routeName
        return (
          <div key={index} className={isNav ? "w-[48%] md:w-auto" : "w-full md:w-auto"}>
            <Link to={route.path} viewTransition>
              <Button className="w-full" variant="outline" disabled={pathname === route.path}>
                {displayRouteName}
              </Button>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default Index