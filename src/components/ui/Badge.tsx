import React from 'react'

type BadgeColor = 'purple' | 'green' | 'orange' | 'red' | 'yellow'

const MAP: Record<BadgeColor, [string, string, string]> = {
  purple: ['rgba(124,106,247,.12)', 'var(--ac)',     'rgba(124,106,247,.22)'],
  green:  ['rgba(106,247,168,.12)', 'var(--ok)',     'rgba(106,247,168,.22)'],
  orange: ['rgba(247,162,106,.12)', 'var(--a2)',     'rgba(247,162,106,.22)'],
  red:    ['rgba(247,106,106,.12)', 'var(--danger)', 'rgba(247,106,106,.22)'],
  yellow: ['rgba(247,217,106,.12)', 'var(--warn)',   'rgba(247,217,106,.22)'],
}

export function Badge({ children, c = 'purple' }: { children: React.ReactNode; c?: BadgeColor }) {
  const [bg, fg, bd] = MAP[c]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 20, fontFamily: 'var(--mono)',
      fontSize: 10, background: bg, color: fg, border: `1px solid ${bd}`,
    }}>
      {children}
    </span>
  )
}
