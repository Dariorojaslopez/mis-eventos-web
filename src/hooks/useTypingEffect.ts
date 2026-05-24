import { useEffect, useRef, useState } from 'react'

export function useTypingEffect(
  text: string,
  speedMs = 14,
  onComplete?: () => void,
) {
  const [displayed, setDisplayed] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const prevText = useRef('')
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (!text) {
      prevText.current = ''
      setDisplayed('')
      setIsTyping(false)
      return
    }

    // Already typed this text — ensure unlocked (fixes Strict Mode / re-render stuck state)
    if (text === prevText.current) {
      setDisplayed(text)
      setIsTyping(false)
      return
    }

    prevText.current = text
    setIsTyping(true)
    setDisplayed('')

    let index = 0
    let cancelled = false

    const interval = window.setInterval(() => {
      if (cancelled) return

      index += 1
      const next = text.slice(0, index)
      setDisplayed(next)

      if (index >= text.length) {
        window.clearInterval(interval)
        setIsTyping(false)
        onCompleteRef.current?.()
      }
    }, speedMs)

    return () => {
      cancelled = true
      window.clearInterval(interval)
      // Reset so Strict Mode remount can restart cleanly
      prevText.current = ''
    }
  }, [text, speedMs])

  return { displayed, isTyping }
}
