import React from 'react'

export function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(124,106,247,.06)',
      border: '1px solid rgba(124,106,247,.18)',
      borderRadius: 8, padding: '12px 15px',
      fontSize: 13, color: 'var(--dim)',
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      {children}
    </div>
  )
}
