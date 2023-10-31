import { useEffect, useState } from 'react'

const useFetch = <T,>(
  url: string,
  callback?: (response: T) => void
): [T | null | 'error', boolean] => {
  const [response, set_response] = useState<T | null | 'error'>(null)
  const [pending, set_pending] = useState<boolean>(false)
  useEffect(() => {
    let controller = new AbortController()
    let signal = controller.signal
    async function fetchGet(_url: string) {
      try {
        const res = await fetch(_url, { signal, cache: 'no-cache' })
        const response = await res.json()
        set_pending(false)
        set_response(response)
        if (res && callback) callback(response)
      } catch (error) {
        return set_response('error')
      }
    }
    if (url) {
      set_response(null)
      set_pending(true)
      fetchGet(url)
    }
    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])
  return [response, pending]
}
export default useFetch
