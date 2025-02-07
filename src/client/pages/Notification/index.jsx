import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

const Page = () => {
  return (
    <div className='flex justify-center m-auto'>
      <Button>
        <Bell className='size-5' />
        Register
      </Button>
    </div>
  )
}

export default Page