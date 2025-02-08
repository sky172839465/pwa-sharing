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
    subscription,
    registerForNotifications,
    unsubscribeNotification
  } = useNotification()
  const { trigger: subscribe, isLoading: isSendMeLoading } = useSubscribe()
  const { trigger, isLoading } = useSendNotification()

  return (
    <div className="flex flex-col gap-4 items-center m-auto">
      <p>iOS please install to web app first</p>
      <div className='flex flex-row flex-wrap justify-center gap-4 md:flex-col'>
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
              onClick={() => subscribe(subscription)}
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
            <Button
              onClick={unsubscribeNotification}
              disabled={isLoading}
            >
              Unsubscription notifications
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default Page