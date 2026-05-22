import { useState, useRef } from 'react'
import { startVoiceRecognition, isSpeechSupported } from '../utils/voice'
import type { VoiceController } from '../utils/voice'

export function useVoice(onTranscript: (text: string) => void) {
  const [recording, setRecording] = useState(false)
  const ctrlRef = useRef<VoiceController | null>(null)

  const toggle = () => {
    if (recording) {
      ctrlRef.current?.stop()
      ctrlRef.current = null
      setRecording(false)
      return
    }

    if (!isSpeechSupported()) {
      alert("Brauzeringiz ovozli kiritishni qo'llab-quvvatlamaydi (Chrome ishlatib ko'ring)")
      return
    }

    const ctrl = startVoiceRecognition(
      (transcript) => {
        onTranscript(transcript)
        setRecording(false)
        ctrlRef.current = null
      },
      () => {
        setRecording(false)
        ctrlRef.current = null
      }
    )

    if (ctrl) {
      ctrlRef.current = ctrl
      setRecording(true)
    }
  }

  const stop = () => {
    ctrlRef.current?.stop()
    ctrlRef.current = null
    setRecording(false)
  }

  return { recording, toggle, stop }
}
