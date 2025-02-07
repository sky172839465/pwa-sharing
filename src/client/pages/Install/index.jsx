import { Button } from "@/components/ui/button"
import usePWAInstall from "./usePWAInstall"
import { CircleCheck, Download } from "lucide-react"

const Page = () => {
  const { showDialog, isStandaloneState } = usePWAInstall()
  const [isStandalone] = isStandaloneState


  return (
    <div className='flex justify-center m-auto'>
      <Button
        disabled={isStandalone}
        onClick={showDialog}
      >
        {!isStandalone && (
          <>
            <Download className='size-5' />
            <span>Install</span>
          </>
        )}
        {isStandalone && (
          <>
            <CircleCheck className='size-5' />
            <span>Installed</span>
          </>
        )}
      </Button>
    </div>
  )
}

export default Page