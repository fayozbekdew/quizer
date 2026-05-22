import React, { useState } from 'react'

interface FInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  style?: React.CSSProperties
}

export function FInput({ value, onChange, placeholder, onKeyDown, style = {} }: FInputProps) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', background: 'var(--bg3)',
        border: `1px solid ${focused ? 'var(--ac)' : 'var(--border)'}`,
        borderRadius: 8, color: 'var(--text)', fontFamily: 'var(--sans)',
        fontSize: 14, padding: '10px 13px', outline: 'none',
        transition: 'border-color .2s, box-shadow .2s',
        boxShadow: focused ? '0 0 0 3px var(--acg)' : 'none',
        ...style,
      }}
    />
  )
}
