export interface Delay { h: number; m: number; s: number }

export const delayToMs = (d: Delay): number =>
  (d.h * 3600 + d.m * 60 + d.s) * 1000

export const delayToLabel = (d: Delay): string => {
  const parts: string[] = []
  if (d.h) parts.push(`${d.h} soat`)
  if (d.m) parts.push(`${d.m} daqiqa`)
  if (d.s) parts.push(`${d.s} soniya`)
  return parts.join(' ') || '0 soniya'
}

export const msToCountdown = (ms: number): string => {
  const ts = Math.ceil(ms / 1000)
  const h = Math.floor(ts / 3600)
  const m = Math.floor((ts % 3600) / 60)
  const s = ts % 60
  const parts: string[] = []
  if (h) parts.push(`${h}s`)
  if (m) parts.push(`${m}d`)
  parts.push(`${s}s`)
  return 'Keyingi savolgacha: ' + parts.join(' ')
}

export const clampUnit = (
  unit: keyof Delay,
  val: number
): number => {
  const max: Record<keyof Delay, number> = { h: 23, m: 59, s: 59 }
  return Math.max(0, Math.min(max[unit], val))
}
