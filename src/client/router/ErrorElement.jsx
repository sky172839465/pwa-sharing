import { Button } from '@/components/ui/button'
import { Link, useRouteError } from 'react-router-dom'

const ErrorElement = () => {
  const error = useRouteError() || {}
  const {
    statusText,
    message = 'page not found'
  } = error
  console.error(error)

  return (
    <div className='flex justify-center items-center w-full'>
      <div className='max-w-md'>
        <h1 className='text-5xl font-bold'>
          Oops!
        </h1>
        <p className='py-3'>
          Sorry, an unexpected error has occurred.
        </p>
        <p className='py-3'>
          {statusText || message}
        </p>
        <div className='mt-4'>
          <Link
            to='../'
            viewTransition
          >
            <Button>
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ErrorElement