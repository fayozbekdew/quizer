import { useState, useRef, useCallback, useEffect } from 'react'
import { delayToMs, msToCountdown } from '../utils/time'
import type { Delay } from '../utils/time'
import type { Question } from '../constants'
import { QUESTIONS } from '../constants'

export interface SessionState {
  running: boolean
  sent: number
  countdown: string
}

export function useSession(delay: Delay, onQuestionFired?: (q: Question) => void) {
  const [running,   setRunning]   = useState(false)
  const [sent,      setSent]      = useState(0)
  const [countdown, setCountdown] = useState('')

  const sidRef     = useRef<string | null>(null)
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cdRef      = useRef<ReturnType<typeof setInterval> | null>(null)
  const nextIdxRef = useRef(0)
  const nextAtRef  = useRef<number | null>(null)

  // Countdown ticker
  useEffect(() => {
    if (!running) return
    cdRef.current = setInterval(() => {
      if (!nextAtRef.current) return
      const rem = Math.max(0, nextAtRef.current - Date.now())
      setCountdown(msToCountdown(rem))
    }, 500)
    return () => { if (cdRef.current) clearInterval(cdRef.current) }
  }, [running])

  const scheduleOne = useCallback(
    (sid: string, currentDelay: Delay) => {
      const ms  = delayToMs(currentDelay)
      const idx = nextIdxRef.current
      const q   = QUESTIONS[idx % QUESTIONS.length]

      nextIdxRef.current = (idx + 1) % QUESTIONS.length
      nextAtRef.current  = Date.now() + ms

      // Keep the timer in the open page; service workers may sleep before
      // long setTimeout callbacks fire.
      timerRef.current = setTimeout(() => {
        if (sidRef.current !== sid) return
        const n = new Notification('🧠 MindPing — Savol!', {
          body: q.question,
          requireInteraction: true,
        })
        n.onclick = () => {
          n.close()
          onQuestionFired?.(q)
          window.focus()
        }
        setSent((c) => c + 1)
        scheduleOne(sid, currentDelay)
      }, ms)
    },
    [onQuestionFired]
  )

  const start = useCallback(() => {
    const sid = 'sess_' + Date.now()
    sidRef.current     = sid
    nextIdxRef.current = 0
    setSent(0)
    setRunning(true)
    scheduleOne(sid, delay)
  }, [delay, scheduleOne])

  const stop = useCallback(() => {
    sidRef.current = null
    if (timerRef.current) clearTimeout(timerRef.current)
    if (cdRef.current)   clearInterval(cdRef.current)
    setRunning(false)
    setCountdown('')
    setSent(0)
    nextAtRef.current = null
  }, [])

  return { running, sent, countdown, start, stop }
}
