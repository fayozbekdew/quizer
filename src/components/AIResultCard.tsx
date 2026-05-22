import React from 'react'
import { Badge, Btn, ScoreBar } from './ui'
import type { AIResult } from '../utils/ai'

interface AIResultCardProps {
  result: AIResult
  onDone: () => void
  onRetry: () => void
}

export function AIResultCard({ result, onDone, onRetry }: AIResultCardProps) {
  const { score = 0, is_correct, feedback, better_answer, key_points = [] } = result
  const color      = score >= 70 ? 'var(--ok)' : score >= 40 ? 'var(--a2)' : 'var(--danger)'
  const badgeColor = (is_correct || score >= 70) ? 'green' : score >= 40 ? 'orange' : 'red'
  const badgeLabel = (is_correct || score >= 70) ? "✓ To'g'ri" : score >= 40 ? '~ Qisman' : "✗ Noto'g'ri"

  return (
    <div style={{
      background: 'linear-gradient(135deg,rgba(124,106,247,.07),rgba(106,247,200,.04))',
      border: '1px solid rgba(124,106,247,.22)',
      borderRadius: 'var(--r)', padding: 18, marginTop: 16,
      animation: 'slideUp .4s cubic-bezier(.16,1,.3,1) both',
    }}>
      {/* Score row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>
          Ball:{' '}
          <strong style={{ fontSize: 22, color }}>{score}%</strong>
        </div>
        <Badge c={badgeColor as any}>{badgeLabel}</Badge>
      </div>

      <ScoreBar score={score} />

      {/* Feedback */}
      {feedback && (
        <div style={{ fontSize: 13, color: 'var(--dim)', marginTop: 10, marginBottom: 14 }}>
          {feedback}
        </div>
      )}

      {/* Ideal answer */}
      {better_answer && (
        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ac)',
            marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em',
          }}>
            💡 Ideal javob
          </div>
          <div style={{
            background: 'rgba(124,106,247,.07)',
            border: '1px solid rgba(124,106,247,.15)',
            borderRadius: 8, padding: '11px 14px',
            fontSize: 13, lineHeight: 1.65,
          }}>
            {better_answer}
          </div>
        </div>
      )}

      {/* Key points */}
      {key_points.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--a2)',
            marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em',
          }}>
            ⚠ O'tkazib yuborilgan nuqtalar
          </div>
          {key_points.map((kp, i) => (
            <div key={i} style={{
              fontSize: 12, color: 'var(--dim)',
              paddingLeft: 12, borderLeft: '2px solid var(--a2)', marginBottom: 5,
            }}>
              {kp}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <Btn v="success" sm onClick={onDone}>✓ Bajarildi</Btn>
        <Btn v="ghost"   sm onClick={onRetry}>↺ Qayta urinish</Btn>
      </div>
    </div>
  )
}
