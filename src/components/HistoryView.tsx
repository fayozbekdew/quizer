import React from 'react'
import { Card, Badge, SLabel } from './ui'
import { Btn } from './ui'
import { useLocalStorage } from '../hooks'
import { LS_HISTORY_KEY } from '../constants'
import type { HistoryEntry } from './AnswerView'

export function HistoryView() {
  const [history, saveHistory] = useLocalStorage<HistoryEntry[]>(LS_HISTORY_KEY, [])

  const total   = history.length
  const correct = history.filter((h) => h.score >= 70).length
  const avg     = total
    ? Math.round(history.reduce((s, h) => s + h.score, 0) / total)
    : 0
  const avgColor = avg >= 70 ? 'var(--ok)' : avg >= 40 ? 'var(--a2)' : 'var(--danger)'

  return (
    <div style={{ animation: 'fadeIn .35s ease both' }}>
      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        gap: 11, marginBottom: 18,
      }}>
        {[
          { val: total,     lbl: 'Jami',     color: 'var(--ac)' },
          { val: correct,   lbl: "To'g'ri",  color: 'var(--ok)' },
          { val: avg + '%', lbl: "O'rtacha", color: avgColor },
        ].map((s) => (
          <div key={s.lbl} style={{
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 'var(--r)', padding: 16, textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 700, color: s.color }}>
              {s.val}
            </div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10,
              color: 'var(--dimmer)', marginTop: 3, textTransform: 'uppercase',
            }}>
              {s.lbl}
            </div>
          </div>
        ))}
      </div>

      <SLabel>Javoblar tarixi</SLabel>

      {history.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 30, color: 'var(--dimmer)', fontFamily: 'var(--mono)', fontSize: 12 }}>
          Hali javoblar tarixi yo'q
        </Card>
      )}

      {history.map((h) => {
        const bc = h.score >= 70 ? 'green' : h.score >= 40 ? 'orange' : 'red'
        const barColor = h.score >= 70 ? 'var(--ok)' : h.score >= 40 ? 'var(--a2)' : 'var(--danger)'
        return (
          <Card key={h.id} style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ flex: 1, fontSize: 13 }}>{h.question}</div>
              <Badge c={bc as any}>{h.score}%</Badge>
            </div>
            <div style={{
              height: 4, borderRadius: 3,
              background: 'var(--bg4)', overflow: 'hidden', marginBottom: 8,
            }}>
              <div style={{
                height: '100%', width: `${h.score}%`,
                background: barColor, borderRadius: 3,
              }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 4 }}>
              Javob:{' '}
              <em>
                {(h.userAnswer ?? '').slice(0, 90)}
                {(h.userAnswer ?? '').length > 90 ? '…' : ''}
              </em>
            </div>
            {h.feedback && (
              <div style={{ fontSize: 11, color: 'var(--dimmer)', marginBottom: 4 }}>
                {h.feedback}
              </div>
            )}
            <div style={{ fontSize: 11, color: 'var(--dimmer)', fontFamily: 'var(--mono)' }}>
              {new Date(h.timestamp).toLocaleString('uz-UZ')}
            </div>
          </Card>
        )
      })}

      {history.length > 0 && (
        <Btn
          v="danger"
          sm
          onClick={() => {
            if (window.confirm("Tarixni to'liq o'chirasizmi?")) saveHistory([])
          }}
        >
          🗑 Tarixni tozalash
        </Btn>
      )}
    </div>
  )
}
