import React from 'react'
import type { Delay } from '../utils/time'

interface TimePickerProps {
  delay: Delay
  onAdjust: (unit: keyof Delay, delta: number) => void
}

const arrowBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: 'var(--dim)',
  fontSize: 13, cursor: 'pointer', padding: '3px 8px',
  borderRadius: 5, transition: 'all .15s',
  lineHeight: 1, width: '100%', textAlign: 'center',
}

const UNITS: { k: keyof Delay; l: string; max: number }[] = [
  { k: 'h', l: 'soat',   max: 23 },
  { k: 'm', l: 'daqiqa', max: 59 },
  { k: 's', l: 'soniya', max: 59 },
]

export function TimePicker({ delay, onAdjust }: TimePickerProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'var(--bg3)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 16px', width: 'fit-content',
    }}>
      {UNITS.map((u, i) => (
        <React.Fragment key={u.k}>
          {i > 0 && (
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 24,
              color: 'var(--dimmer)', marginTop: -4,
            }}>:</span>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <button style={arrowBtn} onClick={() => onAdjust(u.k, 1)}>▲</button>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 700,
              color: 'var(--text)', minWidth: 46, textAlign: 'center', lineHeight: 1,
            }}>
              {String(delay[u.k]).padStart(2, '0')}
            </span>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9,
              color: 'var(--dimmer)', textTransform: 'uppercase',
            }}>
              {u.l}
            </span>
            <button style={arrowBtn} onClick={() => onAdjust(u.k, -1)}>▼</button>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
