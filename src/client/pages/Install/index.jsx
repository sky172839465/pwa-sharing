import { Button } from "@/components/ui/button"
import usePWAInstall from "./usePWAInstall"

const Page = () => {
  const { showDialog } = usePWAInstall()
  return (
    <div className='flex justify-center m-auto'>
      <Button className='pwa:hidden' onClick={showDialog}>Install</Button>
    </div>
  )
}

export default Page