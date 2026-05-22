import React from 'react'
import { SLabel, InfoBox } from './ui'
import { QUESTIONS } from '../constants'

export function QuestionsView() {
  return (
    <div style={{ animation: 'fadeIn .35s ease both' }}>
      <SLabel>Savollar ro'yxati ({QUESTIONS.length} ta)</SLabel>

      <InfoBox>
        <span>📝</span>
        <span style={{ fontSize: 12 }}>
          Savollarni{' '}
          <code style={{
            fontFamily: 'var(--mono)', color: 'var(--ac)',
            background: 'rgba(124,106,247,.1)', padding: '1px 5px', borderRadius: 4,
          }}>
            src/constants/questions.ts
          </code>
          {' '}faylida tahrirlang.
        </span>
      </InfoBox>

      <div style={{ marginTop: 14 }}>
        {QUESTIONS.map((q, i) => (
          <div
            key={q.id}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 11,
              padding: 14, background: 'var(--bg3)',
              border: '1px solid var(--border)', borderRadius: 10,
              marginBottom: 9, transition: 'border-color .2s',
              animation: 'fadeIn .3s ease both',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--bhi)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ac)',
              background: 'rgba(124,106,247,.1)', border: '1px solid rgba(124,106,247,.2)',
              borderRadius: 6, padding: '2px 7px', minWidth: 30,
              textAlign: 'center', flexShrink: 0, marginTop: 2,
            }}>
              #{i + 1}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, marginBottom: 5 }}>{q.question}</div>
              <div style={{ fontSize: 12, color: 'var(--ok)', fontFamily: 'var(--mono)' }}>
                ✓ {q.answer.slice(0, 110)}{q.answer.length > 110 ? '…' : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
