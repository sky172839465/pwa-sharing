import { Button } from '@/components/ui/button'
import { html } from './article.md'
import useUnregister from './useUnregister'

const Page = () => {
  const { trigger, isPending, isRegistered } = useUnregister()

  return (
    <div className='flex flex-col m-auto'>
      <div className='text-center m-4'>
        <Button
          onClick={trigger}
          disabled={!isRegistered || isPending}
        >
          Unregister SW
        </Button>
      </div>
      <div className='md:max-w-xl container prose p-4'>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  )
}

export default Page