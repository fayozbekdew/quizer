import React, { useState } from 'react'
import { Card, Btn, Badge, Spinner } from './ui'
import { FTextarea } from './ui'
import { AIResultCard } from './AIResultCard'
import { useVoice } from '../hooks'
import { checkAnswerWithAI } from '../utils/ai'
import { useLocalStorage } from '../hooks'
import { LS_HISTORY_KEY, HISTORY_LIMIT } from '../constants'
import type { Question } from '../constants'
import type { AIResult } from '../utils/ai'

export interface HistoryEntry {
  id: number
  question: string
  userAnswer: string
  score: number
  feedback: string
  timestamp: string
}

interface AnswerViewProps {
  question: Question
  onClose: () => void
}

export function AnswerView({ question, onClose }: AnswerViewProps) {
  const [userAns, setUserAns]   = useState('')
  const [checking, setChecking] = useState(false)
  const [aiResult, setAiResult] = useState<AIResult | null>(null)
  const [history, saveHistory]  = useLocalStorage<HistoryEntry[]>(LS_HISTORY_KEY, [])

  const { recording, toggle: toggleVoice, stop: stopVoice } = useVoice((transcript) => {
    setUserAns((prev) => (prev + ' ' + transcript).trim())
  })

  const handleClose = () => {
    stopVoice()
    onClose()
  }

  const handleCheck = async () => {
    if (!userAns.trim()) return
    setChecking(true)
    setAiResult(null)
    try {
      const result = await checkAnswerWithAI(question, userAns)
      setAiResult(result)
      const entry: HistoryEntry = {
        id: Date.now(),
        question: question.question,
        userAnswer: userAns,
        score: result.score,
        feedback: result.feedback,
        timestamp: new Date().toISOString(),
      }
      saveHistory([entry, ...history].slice(0, HISTORY_LIMIT))
    } catch {
      setAiResult({
        score: 0,
        is_correct: false,
        feedback: "AI bilan bog'lanishda xato. Internet aloqasini tekshiring.",
        better_answer: question.answer,
        key_points: [],
      })
    }
    setChecking(false)
  }

  const handleRetry = () => {
    setAiResult(null)
    setUserAns('')
  }

  return (
    <div style={{ animation: 'slideUp .4s cubic-bezier(.16,1,.3,1) both' }}>
      <Card>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <Badge>Savol</Badge>
          <div style={{ flex: 1 }} />
          <Btn v="ghost" sm onClick={handleClose}>✕ Yopish</Btn>
        </div>

        {/* Question */}
        <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.45, marginBottom: 20 }}>
          {question.question}
        </div>

        {/* Answer Input */}
        <label style={{
          fontSize: 11, color: 'var(--dim)',
          fontFamily: 'var(--mono)', display: 'block', marginBottom: 6,
        }}>
          Javobingiz
        </label>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
          <FTextarea
            value={userAns}
            onChange={(e) => setUserAns(e.target.value)}
            placeholder="Javobingizni yozing yoki 🎤 tugmasini bosing..."
            style={{ flex: 1 }}
          />
          {/* Voice button */}
          <button
            onClick={toggleVoice}
            style={{
              width: 42, height: 42, borderRadius: '50%',
              border: `2px solid ${recording ? 'var(--danger)' : 'var(--bhi)'}`,
              background: recording ? 'rgba(247,106,106,.12)' : 'var(--bg3)',
              color: recording ? 'var(--danger)' : 'var(--dim)',
              fontSize: 17, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all .2s',
              animation: recording ? 'pulseRed 1s infinite' : 'none',
            }}
          >
            {recording ? '⏹' : '🎤'}
          </button>
        </div>

        {recording && (
          <div style={{
            fontSize: 12, color: 'var(--danger)',
            fontFamily: 'var(--mono)', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ animation: 'blink 1s infinite', display: 'inline-block' }}>●</span>
            Gapiring... (qayta bosing = to'xtatish)
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Btn v="primary" onClick={handleCheck} disabled={!userAns.trim() || checking}>
            {checking ? <><Spinner /> Tekshirilmoqda…</> : '🧠 AI bilan tekshirish'}
          </Btn>
          {userAns && !checking && (
            <Btn v="ghost" sm onClick={() => setUserAns('')}>Tozalash</Btn>
          )}
        </div>

        {/* AI Result */}
        {aiResult && (
          <AIResultCard
            result={aiResult}
            onDone={handleClose}
            onRetry={handleRetry}
          />
        )}
      </Card>
    </div>
  )
}
