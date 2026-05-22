import React from 'react'

type BtnVariant = 'primary' | 'ghost' | 'danger' | 'success'

const STYLES: Record<BtnVariant, React.CSSProperties> = {
  primary: { background: 'var(--ac)', color: '#fff', border: '1px solid transparent', boxShadow: '0 2px 14px rgba(124,106,247,.3)' },
  ghost:   { background: 'var(--bg3)', color: 'var(--dim)', border: '1px solid var(--border)' },
  danger:  { background: 'rgba(247,106,106,.1)', color: 'var(--danger)', border: '1px solid rgba(247,106,106,.25)' },
  success: { background: 'rgba(106,247,168,.1)', color: 'var(--ok)',     border: '1px solid rgba(106,247,168,.25)' },
}

interface BtnProps {
  children: React.ReactNode
  v?: BtnVariant
  sm?: boolean
  onClick?: () => void
  disabled?: boolean
  style?: React.CSSProperties
}

export function Btn({ children, v = 'ghost', sm, onClick, disabled, style = {} }: BtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, padding: sm ? '6px 13px' : '9px 18px',
        borderRadius: 8, fontFamily: 'var(--mono)',
        fontSize: sm ? 11 : 12, fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        transition: 'all .2s', whiteSpace: 'nowrap',
        ...STYLES[v], ...style,
      }}
    >
      {children}
    </button>
  )
}
