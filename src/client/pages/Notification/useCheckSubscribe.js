import { get } from 'lodash-es'
import useSWR from 'swr'

const fetcher = async (subscription) => {
  const response = await fetch(`${window.API_HOST}/api/check-subscribe?endpoint=${subscription.endpoint}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const result = await response.json()
  return get(result, 'isSubscribe')
}

const useCheckSubscribe = (subscription) => {
  const { data, error, isMutating } = useSWR(subscription || null, fetcher, {
    revalidateOnFocus: false
  })
  return { data, error, isLoading: isMutating }
}


export default useCheckSubscribe
