import React from 'react'

interface NavTabProps {
  label: string
  active: boolean
  onClick: () => void
}

export function NavTab({ label, active, onClick }: NavTabProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? 'var(--bg3)' : 'transparent',
        color: active ? 'var(--text)' : 'var(--dim)',
        border: `1px solid ${active ? 'var(--bhi)' : 'transparent'}`,
        borderRadius: 8, padding: '6px 13px',
        fontFamily: 'var(--mono)', fontSize: 11,
        cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}
