// Web Speech API wrapper

export interface VoiceController {
  stop: () => void
}

export function startVoiceRecognition(
  onResult: (transcript: string) => void,
  onEnd: () => void
): VoiceController | null {
  const SR =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition

  if (!SR) return null

  const rec = new SR()
  rec.lang = 'uz-UZ'
  rec.continuous = false
  rec.interimResults = false

  rec.onresult = (e: any) => {
    const transcript: string = e.results[0][0].transcript
    onResult(transcript)
  }
  rec.onerror = onEnd
  rec.onend   = onEnd

  rec.start()
  return { stop: () => { try { rec.stop() } catch {} } }
}

export function isSpeechSupported(): boolean {
  return !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  )
}
