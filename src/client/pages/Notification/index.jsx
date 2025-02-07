import { Button } from "@/components/ui/button"
import { Bell, CircleCheck } from "lucide-react"
import useNotification from "./useNotification"
import useSendNotification from "./useSendNotification"
import useSubscribe from "./useSubscribe"

const Page = () => {
  const {
    isPending,
    isRegistered,
    isGranted,
    registerForNotifications,
    subscription
  } = useNotification()
  const { trigger: sendMe, isLoading: isSendMeLoading } = useSubscribe()
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
        <>
          <Button
            onClick={() => sendMe(subscription)}
            disabled={isLoading || isSendMeLoading}
          >
            Send me notifications
          </Button>
          <Button
            onClick={() => trigger()}
            disabled={isLoading}
          >
            @all notifications
          </Button>
        </>
      )}
    </div>
  )
}

export default Page