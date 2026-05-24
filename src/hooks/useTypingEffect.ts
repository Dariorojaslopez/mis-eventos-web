import { useEffect, useRef, useState } from 'react'

export function useTypingEffect(text: string, speedMs = 14) {
  const [displayed, setDisplayed] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const prevText = useRef('')

  useEffect(() => {
    if (!text) {
      prevText.current = ''
      setDisplayed('')
      setIsTyping(false)
      return
    }

    if (text === prevText.current) return

    prevText.current = text
    setIsTyping(true)
    setDisplayed('')

    let index = 0
    const interval = window.setInterval(() => {
      index += 1
      setDisplayed(text.slice(0, index))
      if (index >= text.length) {
        window.clearInterval(interval)
        setIsTyping(false)
      }
    }, speedMs)

    return () => window.clearInterval(interval)
  }, [text, speedMs])

  const reset = () => {
    prevText.current = ''
    setDisplayed('')
    setIsTyping(false)
  }

  return { displayed, isTyping, reset }
}
