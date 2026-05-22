import React, { useState } from 'react'

interface FTextareaProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  rows?: number
  style?: React.CSSProperties
}

export function FTextarea({ value, onChange, placeholder, rows = 3, style = {} }: FTextareaProps) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', background: 'var(--bg3)',
        border: `1px solid ${focused ? 'var(--ac)' : 'var(--border)'}`,
        borderRadius: 8, color: 'var(--text)', fontFamily: 'var(--sans)',
        fontSize: 14, padding: '10px 13px', outline: 'none',
        resize: 'vertical', minHeight: 72,
        transition: 'border-color .2s, box-shadow .2s',
        boxShadow: focused ? '0 0 0 3px var(--acg)' : 'none',
        ...style,
      }}
    />
  )
}
