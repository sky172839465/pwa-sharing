import { Link } from "react-router-dom"
import routes from "../routes"
import { Button } from "@/components/ui/button"

const Index = () => {
  console.log(routes)
  return (
    <div className='flex justify-center items-center gap-4 h-dvh w-full'>
      {routes.filter(route => route.path !== '/').map((route, index) => {
        return (
          <Link key={index} to={route.path} viewTransition>
            <Button variant="outline">
              {route.path.replaceAll('/', '')}
            </Button>
          </Link>
        )
      })}
    </div>
  )
}

export default Index