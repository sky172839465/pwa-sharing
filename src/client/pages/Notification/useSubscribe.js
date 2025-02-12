import useSWRMutation from 'swr/mutation'

const fetcher = async (endpoint, body) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body || {})
  })
  const result = await response.json()
  return result
}

const useSubscribe = () => {
  const { data, error, isMutating, trigger } = useSWRMutation(
    `${window.API_HOST}/api/subscribe`,
    (endpoint, { arg: body }) => fetcher(endpoint, body)
  )
  return { data, error, isLoading: isMutating, trigger }
}


export default useSubscribe
