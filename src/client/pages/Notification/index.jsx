import { Button } from "@/components/ui/button"
import { Bell, CircleCheck } from "lucide-react"
import useNotification from "./useNotification"
import useSendNotification from "./useSendNotification"

const Page = () => {
  const {
    isPending,
    isRegistered,
    isGranted,
    registerForNotifications
  } = useNotification()
  const { trigger, isLoading } = useSendNotification()
  return (
    <div className='flex justify-center m-auto gap-4'>
      <Button
        onClick={registerForNotifications}
        disabled={isPending || isGranted}
      >
        {!isRegistered && (
          <>
            <Bell className='size-5' />
            Register
          </>
        )}
        {
          isRegistered && (
            <>
              <CircleCheck className='size-5' />
              Registered
            </>
          )
        }
      </Button>
      {isRegistered && (
        <Button
          onClick={() => trigger()}
          disabled={isLoading}
        >
          Send notifications
        </Button>
      )}
    </div>
  )
}

export default Page