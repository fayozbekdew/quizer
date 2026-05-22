import React from 'react'

export function Spinner() {
  return (
    <div style={{
      width: 14, height: 14,
      border: '2px solid var(--border)',
      borderTopColor: 'var(--ac)',
      borderRadius: '50%',
      animation: 'spin .65s linear infinite',
      display: 'inline-block',
    }} />
  )
}
