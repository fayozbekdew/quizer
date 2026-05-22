import React from 'react'

export function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dim)',
      textTransform: 'uppercase', letterSpacing: '.12em',
      marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}
