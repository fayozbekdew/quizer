import React, { useState } from 'react'

interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  animate?: boolean
}

export function Card({ children, style = {}, animate = true }: CardProps) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'var(--bg2)',
        border: `1px solid ${hov ? 'var(--bhi)' : 'var(--border)'}`,
        borderRadius: 'var(--r)',
        padding: 22,
        marginBottom: 14,
        transition: 'border-color .2s',
        animation: animate ? 'fadeIn .35s ease both' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
