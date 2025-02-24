import { Button } from "@/components/ui/button"
import { Bell, CircleCheck, Megaphone, BellDot, BellMinus } from "lucide-react"
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
      <div className='flex flex-col lg:flex-row flex-wrap justify-center gap-4 [&_button]:flex-1'>
        <Button
          onClick={registerForNotifications}
          disabled={isPending || isGranted}
        >
          {(!isRegistered || !isGranted) && (
            <>
              <Bell className='size-5' />
              Register
            </>
          )}
          {
            (isRegistered && isGranted) && (
              <>
                <CircleCheck className='size-5' />
                Registered
              </>
            )
          }
        </Button>
        {(isRegistered && isGranted) && (
          <div className='contents [&_svg]:size-5'>
            <Button
              onClick={() => subscribe(subscription)}
              disabled={isLoading || isSendMeLoading}
            >
              <BellDot />
              Send me notification
            </Button>
            <Button
              onClick={() => trigger()}
              disabled={isLoading}
            >
              <Megaphone />
              @all notification
            </Button>
            <Button
              onClick={unsubscribeNotification}
              disabled={isLoading}
            >
              <BellMinus />
              Unsubscribe notification
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
