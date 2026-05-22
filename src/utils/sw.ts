// Service Worker communication helpers

let swReg: ServiceWorkerRegistration | null = null

export async function initSW(): Promise<void> {
  if (!('serviceWorker' in navigator)) return
  try {
    swReg = await navigator.serviceWorker.register('/sw.js')
    await navigator.serviceWorker.ready
  } catch (err) {
    console.warn('[MindPing] SW failed:', err)
  }
}

export function swPost(msg: Record<string, unknown>): void {
  const sw = navigator.serviceWorker?.controller ?? swReg?.active
  sw?.postMessage(msg)
}

export function onSWMessage(
  handler: (e: MessageEvent) => void
): () => void {
  navigator.serviceWorker?.addEventListener('message', handler)
  return () => navigator.serviceWorker?.removeEventListener('message', handler)
}
