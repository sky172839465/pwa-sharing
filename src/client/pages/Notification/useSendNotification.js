import useSWRMutation from 'swr/mutation'

const fetcher = async (endpoint) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const result = await response.json()
  if (result.error) {
    throw new Error(result.error)
  }

  return result
}

const useSendNotification = () => {
  const { data, error, isMutating, trigger } = useSWRMutation(
    `${window.API_HOST}/api/send-notification`,
    (endpoint) => fetcher(endpoint)
  )
  return { data, error, isLoading: isMutating, trigger }
}


export default useSendNotification
