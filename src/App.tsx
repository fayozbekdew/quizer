import React, { useState, useEffect } from 'react'
import { NavTab } from './components/ui'
import { SetupView }    from './components/SetupView'
import { QuestionsView } from './components/QuestionsView'
import { HistoryView }  from './components/HistoryView'
import { AnswerView }   from './components/AnswerView'
import { initSW, onSWMessage } from './utils/sw'
import { DEFAULT_DELAY } from './constants'
import type { Delay } from './utils/time'
import type { Question } from './constants'
import { QUESTIONS } from './constants'

type Tab = 'setup' | 'questions' | 'history' | 'answer'

export default function App() {
  const [tab, setTab]           = useState<Tab>('setup')
  const [delay, setDelay]       = useState<Delay>(DEFAULT_DELAY)
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(Notification.permission)
  const [currentQ, setCurrentQ] = useState<Question | null>(null)

  // Init Service Worker once
  useEffect(() => {
    initSW()
    const unsub = onSWMessage((e) => {
      if (e.data?.type === 'SHOW_QUESTION') {
        openAnswer(e.data.data as Question)
      }
    })
    return unsub
  }, [])

  const openAnswer = (q: Question) => {
    setCurrentQ(q)
    setTab('answer')
  }

  const closeAnswer = () => {
    setCurrentQ(null)
    setTab('setup')
  }

  const requestNotif = async () => {
    const p = await Notification.requestPermission()
    setNotifPerm(p)
  }

  const navItems: { id: Exclude<Tab, 'answer'>; label: string }[] = [
    { id: 'setup',     label: '⚙ sozlash' },
    { id: 'questions', label: `📚 savollar (${QUESTIONS.length})` },
    { id: 'history',   label: '📊 tarix' },
  ]

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      flexDirection: 'column', background: 'var(--bg)', position: 'relative',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 55% 45% at 15% 0%,rgba(124,106,247,.08) 0%,transparent 65%),
          radial-gradient(ellipse 40% 35% at 85% 100%,rgba(106,247,200,.05) 0%,transparent 65%)`,
      }} />

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 22px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(8,8,16,.9)', backdropFilter: 'blur(14px)',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700,
          color: 'var(--ac)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--dimmer)',
          }} />
          mind<span style={{ color: 'var(--dim)', fontWeight: 400 }}>ping</span>
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          {navItems.map((item) => (
            <NavTab
              key={item.id}
              label={item.label}
              active={tab === item.id}
              onClick={() => setTab(item.id)}
            />
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main style={{
        flex: 1, padding: '26px 22px',
        maxWidth: 700, margin: '0 auto',
        width: '100%', position: 'relative', zIndex: 1,
      }}>
        {tab === 'setup' && (
          <SetupView
            delay={delay}
            setDelay={setDelay}
            notifPerm={notifPerm}
            onRequestNotif={requestNotif}
            onQuestionFired={openAnswer}
          />
        )}

        {tab === 'questions' && <QuestionsView />}

        {tab === 'history' && <HistoryView />}

        {tab === 'answer' && currentQ && (
          <AnswerView question={currentQ} onClose={closeAnswer} />
        )}
      </main>
    </div>
  )
}
