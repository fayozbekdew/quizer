import React from 'react'

export function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'var(--ok)' : score >= 40 ? 'var(--a2)' : 'var(--danger)'
  return (
    <div style={{ height: 5, borderRadius: 3, background: 'var(--bg4)', overflow: 'hidden', margin: '8px 0' }}>
      <div style={{
        height: '100%', borderRadius: 3, background: color,
        width: `${score}%`, animation: 'barGrow 1.1s cubic-bezier(.16,1,.3,1) both',
      }} />
    </div>
  )
}
