import { useCallback, useRef, useState } from 'react'

/**
 * Prevents double-submit on auth and mutation forms.
 * Credentials passed to submit handlers must never be logged or stored here.
 */
export function useSecureSubmit() {
  const [isPending, setIsPending] = useState(false)
  const lockRef = useRef(false)

  const run = useCallback(async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
    if (lockRef.current) return undefined

    lockRef.current = true
    setIsPending(true)

    try {
      return await fn()
    } finally {
      lockRef.current = false
      setIsPending(false)
    }
  }, [])

  return { isPending, run }
}
