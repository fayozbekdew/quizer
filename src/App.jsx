import React, {
  useState, useEffect, useRef, useCallback,
} from 'react'
import { QUESTIONS } from './db.js'

// ─── tiny CSS-in-JS helper (no deps) ────────────────────────────────────────
const S = {
  // layout
  shell: {
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    background: 'var(--bg)', position: 'relative',
  },
  glow: {
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
    background: `
      radial-gradient(ellipse 55% 45% at 15% 0%,rgba(124,106,247,.08) 0%,transparent 65%),
      radial-gradient(ellipse 40% 35% at 85% 100%,rgba(106,247,200,.05) 0%,transparent 65%)`,
  },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 22px', borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(8,8,16,.9)', backdropFilter: 'blur(14px)',
  },
  logo: {
    fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700,
    color: 'var(--ac)', display: 'flex', alignItems: 'center', gap: 8,
  },
  tabs: { display: 'flex', gap: 4 },
  main: {
    flex: 1, padding: '26px 22px', maxWidth: 700,
    margin: '0 auto', width: '100%', position: 'relative', zIndex: 1,
  },
  // components
  card: (extra = {}) => ({
    background: 'var(--bg2)', border: '1px solid var(--border)',
    borderRadius: 'var(--r)', padding: 22, marginBottom: 14,
    transition: 'border-color .2s', animation: 'fadeIn .35s ease both',
    ...extra,
  }),
  sLabel: {
    fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dim)',
    textTransform: 'uppercase', letterSpacing: '.12em',
    marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
  },
  row: (extra = {}) => ({ display: 'flex', alignItems: 'center', gap: 10, ...extra }),
  col: (gap = 10) => ({ display: 'flex', flexDirection: 'column', gap }),
  input: {
    width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--text)', fontFamily: 'var(--sans)',
    fontSize: 14, padding: '10px 13px', outline: 'none',
    transition: 'border-color .2s, box-shadow .2s',
  },
}

// ─── Primitive UI ─────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}

function SLabel({ children }) {
  return (
    <div style={S.sLabel}>
      {children}
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? 'var(--bg3)' : 'transparent',
      color: active ? 'var(--text)' : 'var(--dim)',
      border: `1px solid ${active ? 'var(--bhi)' : 'transparent'}`,
      borderRadius: 8, padding: '6px 13px', fontFamily: 'var(--mono)',
      fontSize: 11, cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap',
    }}>
      {label}
    </button>
  )
}

const BTN_STYLES = {
  primary: { background:'var(--ac)', color:'#fff', boxShadow:'0 2px 14px rgba(124,106,247,.3)', border:'1px solid transparent' },
  ghost:   { background:'var(--bg3)', color:'var(--dim)', border:'1px solid var(--border)' },
  danger:  { background:'rgba(247,106,106,.1)', color:'var(--danger)', border:'1px solid rgba(247,106,106,.25)' },
  success: { background:'rgba(106,247,168,.1)', color:'var(--ok)',     border:'1px solid rgba(106,247,168,.25)' },
}
function Btn({ children, variant = 'ghost', sm, onClick, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: 6, padding: sm ? '6px 13px' : '9px 18px',
      borderRadius: 8, fontFamily: 'var(--mono)',
      fontSize: sm ? 11 : 12, fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .35 : 1,
      transition: 'all .2s', whiteSpace: 'nowrap',
      ...BTN_STYLES[variant], ...style,
    }}>
      {children}
    </button>
  )
}

function Badge({ children, color = 'purple' }) {
  const map = {
    purple: ['rgba(124,106,247,.12)', 'var(--ac)',     'rgba(124,106,247,.22)'],
    green:  ['rgba(106,247,168,.12)', 'var(--ok)',     'rgba(106,247,168,.22)'],
    orange: ['rgba(247,162,106,.12)', 'var(--a2)',     'rgba(247,162,106,.22)'],
    red:    ['rgba(247,106,106,.12)', 'var(--danger)', 'rgba(247,106,106,.22)'],
    yellow: ['rgba(247,217,106,.12)', 'var(--warn)',   'rgba(247,217,106,.22)'],
  }
  const [bg, fg, bdr] = map[color] || map.purple
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 20, fontFamily: 'var(--mono)',
      fontSize: 10, background: bg, color: fg, border: `1px solid ${bdr}`,
    }}>
      {children}
    </span>
  )
}

function Inp({ value, onChange, placeholder, onKeyDown, style = {} }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      value={value} onChange={onChange} placeholder={placeholder}
      onKeyDown={onKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...S.input,
        borderColor: focused ? 'var(--ac)' : 'var(--border)',
        boxShadow: focused ? '0 0 0 3px var(--ac-glow)' : 'none',
        ...style,
      }}
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 3, style = {} }) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        ...S.input, resize: 'vertical', minHeight: 72,
        fontFamily: 'var(--sans)',
        borderColor: focused ? 'var(--ac)' : 'var(--border)',
        boxShadow: focused ? '0 0 0 3px var(--ac-glow)' : 'none',
        ...style,
      }}
    />
  )
}

function ScoreBar({ score }) {
  const color = score >= 70 ? 'var(--ok)' : score >= 40 ? 'var(--a2)' : 'var(--danger)'
  return (
    <div style={{ height: 5, borderRadius: 3, background: 'var(--bg4)', overflow: 'hidden', margin: '8px 0' }}>
      <div style={{
        height: '100%', borderRadius: 3, background: color,
        width: `${score}%`, animation: 'barGrow 1.1s cubic-bezier(.16,1,.3,1) both',
      }} />
    </div>
  )
}

function Spinner() {
  return (
    <div style={{
      width: 14, height: 14, border: '2px solid var(--border)',
      borderTopColor: 'var(--ac)', borderRadius: '50%',
      animation: 'spin .65s linear infinite', display: 'inline-block',
    }} />
  )
}

function StatusDot({ on }) {
  return (
    <div style={{
      width: 8, height: 8, borderRadius: '50%',
      background: on ? 'var(--ok)' : 'var(--dimmer)',
      transition: 'background .3s',
      animation: on ? 'pulsePurple 2s infinite' : 'none',
    }} />
  )
}

function InfoBox({ children }) {
  return (
    <div style={{
      background: 'rgba(124,106,247,.06)', border: '1px solid rgba(124,106,247,.18)',
      borderRadius: 8, padding: '12px 15px', fontSize: 13, color: 'var(--dim)',
      display: 'flex', alignItems: 'flex-start', gap: 10,
    }}>
      {children}
    </div>
  )
}

// ─── Time Picker ──────────────────────────────────────────────────────────────
function TimePicker({ delay, onAdjust }) {
  const units = [
    { key: 'h', label: 'soat',    max: 23 },
    { key: 'm', label: 'daqiqa',  max: 59 },
    { key: 's', label: 'soniya',  max: 59 },
  ]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'var(--bg3)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 16px', width: 'fit-content',
    }}>
      {units.map((u, i) => (
        <React.Fragment key={u.key}>
          {i > 0 && (
            <span style={{ fontFamily: 'var(--mono)', fontSize: 24, color: 'var(--dimmer)', marginTop: -4 }}>:</span>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <button onClick={() => onAdjust(u.key, 1)} style={arrowBtn}>▲</button>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 28, fontWeight: 700, color: 'var(--text)', minWidth: 46, textAlign: 'center', lineHeight: 1 }}>
              {String(delay[u.key]).padStart(2, '0')}
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--dimmer)', textTransform: 'uppercase' }}>{u.label}</span>
            <button onClick={() => onAdjust(u.key, -1)} style={arrowBtn}>▼</button>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
const arrowBtn = {
  background: 'none', border: 'none', color: 'var(--dim)', fontSize: 13,
  cursor: 'pointer', padding: '3px 8px', borderRadius: 5,
  transition: 'all .15s', lineHeight: 1, width: '100%', textAlign: 'center',
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? init } catch { return init }
  })
  const save = useCallback(v => {
    setVal(v)
    try { localStorage.setItem(key, JSON.stringify(v)) } catch {}
  }, [key])
  return [val, save]
}

// ─── Main App ─────────────────────────────────────────────────────────────────
const AI_MODEL = 'claude-sonnet-4-20250514'

export default function App() {
  const [tab, setTab]           = useState('setup')
  const [delay, setDelay]       = useState({ h: 0, m: 30, s: 0 })
  const [running, setRunning]   = useState(false)
  const [sentCount, setSentCount] = useState(0)
  const [nextAt, setNextAt]     = useState(null)        // timestamp
  const [countdown, setCountdown] = useState('')
  const [notifPerm, setNotifPerm] = useState(Notification.permission)
  const [currentQ, setCurrentQ] = useState(null)
  const [userAns, setUserAns]   = useState('')
  const [aiResult, setAiResult] = useState(null)
  const [checking, setChecking] = useState(false)
  const [recording, setRecording] = useState(false)
  const [history, saveHistory]  = useLocalStorage('mp_history', [])

  const swRef        = useRef(null)   // ServiceWorkerRegistration
  const sessionRef   = useRef(null)   // current session id
  const intervalRef  = useRef(null)   // main scheduling timeout
  const countdownRef = useRef(null)   // 1-second tick
  const nextIndexRef = useRef(0)
  const recRef       = useRef(null)

  // ── Register SW ─────────────────────────────────────────────
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.ready.then(reg => { swRef.current = reg })
    const handler = e => {
      if (e.data?.type === 'SHOW_QUESTION') openAnswerView(e.data.data)
    }
    navigator.serviceWorker.addEventListener('message', handler)
    return () => navigator.serviceWorker.removeEventListener('message', handler)
  }, [])

  // ── Countdown tick ─────────────────────────────────────────
  useEffect(() => {
    if (!running || !nextAt) return
    countdownRef.current = setInterval(() => {
      const rem = Math.max(0, nextAt - Date.now())
      const ts  = Math.ceil(rem / 1000)
      const h   = Math.floor(ts / 3600)
      const m   = Math.floor((ts % 3600) / 60)
      const s   = ts % 60
      const parts = []
      if (h) parts.push(h + 's')
      if (m) parts.push(m + 'd')
      parts.push(s + 's')
      setCountdown('Keyingi savolgacha: ' + parts.join(' '))
    }, 500)
    return () => clearInterval(countdownRef.current)
  }, [running, nextAt])

  // ── Notif permission ────────────────────────────────────────
  const requestNotif = async () => {
    const p = await Notification.requestPermission()
    setNotifPerm(p)
  }

  // ── Delay helpers ───────────────────────────────────────────
  const adjustDelay = (unit, delta) => {
    const maxes = { h: 23, m: 59, s: 59 }
    setDelay(prev => ({
      ...prev,
      [unit]: Math.max(0, Math.min(maxes[unit], prev[unit] + delta)),
    }))
  }
  const delayMs = useCallback(
    (d = delay) => (d.h * 3600 + d.m * 60 + d.s) * 1000,
    [delay]
  )
  const delayLabel = () => {
    const { h, m, s } = delay
    const parts = []
    if (h) parts.push(`${h} soat`)
    if (m) parts.push(`${m} daqiqa`)
    if (s) parts.push(`${s} soniya`)
    return parts.length ? parts.join(' ') : '0 soniya'
  }
  const canStart = notifPerm === 'granted' && delayMs() > 0 && QUESTIONS.length > 0

  // ── SW postMessage helper ───────────────────────────────────
  const swPost = (msg) => {
    const sw = navigator.serviceWorker?.controller || swRef.current?.active
    if (sw) sw.postMessage(msg)
  }

  // ── Schedule one notification ───────────────────────────────
  const scheduleOne = useCallback((sessionId, currentDelay) => {
    const ms = delayMs(currentDelay)
    const idx = nextIndexRef.current
    const q   = QUESTIONS[idx % QUESTIONS.length]
    const nid = Date.now()

    swPost({ type: 'SCHEDULE', question: q, delayMs: ms, sessionId, notifId: nid })

    // Fallback if SW controller not available
    if (!navigator.serviceWorker?.controller && !swRef.current?.active) {
      setTimeout(() => {
        if (sessionRef.current !== sessionId) return
        const n = new Notification('🧠 MindPing — Savol!', {
          body: q.question, requireInteraction: true,
        })
        n.onclick = () => { n.close(); openAnswerView(q); window.focus() }
      }, ms)
    }

    nextIndexRef.current = (idx + 1) % QUESTIONS.length
    const at = Date.now() + ms
    setNextAt(at)

    // After ms, update counter and schedule the next one
    intervalRef.current = setTimeout(() => {
      if (sessionRef.current !== sessionId) return
      setSentCount(c => c + 1)
      scheduleOne(sessionId, currentDelay)
    }, ms)
  }, [delayMs])

  // ── Start session ───────────────────────────────────────────
  const startSession = useCallback(() => {
    const sid = 'sess_' + Date.now()
    sessionRef.current  = sid
    nextIndexRef.current = 0
    swPost({ type: 'SET_SESSION', sessionId: sid })
    setSentCount(0)
    setRunning(true)
    scheduleOne(sid, delay)
  }, [delay, scheduleOne])

  // ── Stop session ────────────────────────────────────────────
  const stopSession = () => {
    sessionRef.current = null
    clearTimeout(intervalRef.current)
    clearInterval(countdownRef.current)
    swPost({ type: 'STOP' })
    setRunning(false)
    setNextAt(null)
    setCountdown('')
    setSentCount(0)
  }

  // ── Answer view ─────────────────────────────────────────────
  const openAnswerView = (q) => {
    setCurrentQ(q)
    setUserAns('')
    setAiResult(null)
    setTab('answer')
  }
  const closeAnswer = () => {
    stopRecording()
    setCurrentQ(null)
    setAiResult(null)
    setUserAns('')
    setTab('setup')
  }

  // ── Voice input ─────────────────────────────────────────────
  const toggleVoice = () => {
    if (recording) { stopRecording(); return }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Brauzeringiz ovozli kiritishni qo\'llab-quvvatlamaydi'); return }
    const rec = new SR()
    rec.lang = 'uz-UZ'
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = e => {
      const t = e.results[0][0].transcript
      setUserAns(prev => (prev + ' ' + t).trim())
      stopRecording()
    }
    rec.onerror = stopRecording
    rec.onend   = stopRecording
    recRef.current = rec
    rec.start()
    setRecording(true)
  }
  const stopRecording = () => {
    try { recRef.current?.stop() } catch {}
    recRef.current = null
    setRecording(false)
  }

  // ── AI check ────────────────────────────────────────────────
  const checkAnswer = async () => {
    if (!userAns.trim() || !currentQ) return
    setChecking(true)
    setAiResult(null)

    const prompt = `Sen o'quv yordamchisiszan. Foydalanuvchi savol uchun javob berdi.

Savol: "${currentQ.question}"
To'g'ri javob (etalon): "${currentQ.answer}"
Foydalanuvchi javobi: "${userAns}"

Faqat quyidagi JSON formatida javob ber, hech qanday qo'shimcha matn, izoh yoki markdown yo'q:
{"score":0,"is_correct":false,"feedback":"","better_answer":"","key_points":[]}

Qoidalar:
- score: 0-100 (100=mukammal, 0=noto'g'ri)
- is_correct: score>=70 bo'lsa true
- feedback: O'zbek tilida 1-2 jumla, konstruktiv
- better_answer: Ideal to'liq javob o'zbek tilida
- key_points: O'tkazib yuborilgan muhim nuqtalar (bo'sh massiv bo'lishi mumkin)`

    try {
      const res  = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: AI_MODEL,
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await res.json()
      const text = (data.content?.find(b => b.type === 'text')?.text || '{}')
        .replace(/```json|```/g, '').trim()
      const r = JSON.parse(text)
      setAiResult(r)

      // save to history
      saveHistory([
        {
          id: Date.now(),
          question: currentQ.question,
          userAnswer: userAns,
          score: r.score,
          feedback: r.feedback,
          timestamp: new Date().toISOString(),
        },
        ...history,
      ].slice(0, 200))
    } catch {
      setAiResult({
        score: 0, is_correct: false,
        feedback: 'AI bilan bog\'lanishda xato. Internet aloqasini tekshiring.',
        better_answer: currentQ.answer,
        key_points: [],
      })
    }
    setChecking(false)
  }

  // ── History stats ────────────────────────────────────────────
  const statsTotal   = history.length
  const statsCorrect = history.filter(h => h.score >= 70).length
  const statsAvg     = statsTotal
    ? Math.round(history.reduce((s, h) => s + h.score, 0) / statsTotal)
    : 0

  // ════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════
  return (
    <div style={S.shell}>
      <div style={S.glow} />

      {/* ── NAV ── */}
      <nav style={S.nav}>
        <div style={S.logo}>
          <StatusDot on={running} />
          mind<span style={{ color: 'var(--dim)', fontWeight: 400 }}>ping</span>
        </div>
        <div style={S.tabs}>
          <Tab label="⚙ sozlash"             active={tab === 'setup'}     onClick={() => setTab('setup')} />
          <Tab label={`📚 savollar (${QUESTIONS.length})`} active={tab === 'questions'} onClick={() => setTab('questions')} />
          <Tab label="📊 tarix"              active={tab === 'history'}   onClick={() => setTab('history')} />
        </div>
      </nav>

      <main style={S.main}>

        {/* ══════════ SETUP TAB ══════════ */}
        {tab === 'setup' && (
          <div style={{ animation: 'fadeIn .35s ease both' }}>

            {/* Notif permission */}
            <SLabel>Bildirishnoma ruxsati</SLabel>
            <div style={S.card()} onMouseEnter={e => e.currentTarget.style.borderColor='var(--bhi)'}
                 onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
              <div style={S.row()}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, marginBottom: 6 }}>
                    {notifPerm === 'granted' && <span style={{ color: 'var(--ok)' }}>✅ Ruxsat berilgan</span>}
                    {notifPerm === 'denied'  && <span style={{ color: 'var(--danger)' }}>❌ Ruxsat rad etilgan — brauzer sozlamalaridan o'zgartiring</span>}
                    {notifPerm === 'default' && <span style={{ color: 'var(--dim)' }}>⏳ Ruxsat so'ralmagan</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--dim)' }}>
                    Fon rejimida ishlashi uchun bildirishnoma ruxsati kerak
                  </div>
                </div>
                {notifPerm === 'default' && (
                  <Btn variant="primary" sm onClick={requestNotif}>Ruxsat berish</Btn>
                )}
              </div>
            </div>

            {/* Time picker */}
            <SLabel>Vaqt oraligi</SLabel>
            <div style={S.card()}>
              <label style={{ fontSize: 11, color: 'var(--dim)', fontFamily: 'var(--mono)', display: 'block', marginBottom: 10 }}>
                Har necha vaqtda savol yuborilsin:
              </label>
              <TimePicker delay={delay} onAdjust={adjustDelay} />
              <div style={{ fontSize: 12, color: 'var(--dim)', marginTop: 10 }}>
                Jami: <strong style={{ color: 'var(--ac)' }}>{delayLabel()}</strong>
              </div>
            </div>

            {/* Session */}
            <SLabel>Sessiyani boshqarish</SLabel>
            <div style={S.card()}>
              {!running ? (
                <>
                  <InfoBox>
                    <span>ℹ️</span>
                    <span style={{ fontSize: 13 }}>
                      Sessiya boshlaganda, har{' '}
                      <strong style={{ color: 'var(--ac)' }}>{delayLabel()}</strong>
                      {' '}da <strong style={{ color: 'var(--ac)' }}>{QUESTIONS.length}</strong> ta savol
                      navbat bilan bildirishnoma orqali yuboriladi.
                    </span>
                  </InfoBox>
                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Btn variant="primary" onClick={startSession} disabled={!canStart}>
                      ▶ Sessiyani boshlash
                    </Btn>
                    {!canStart && (
                      <span style={{ fontSize: 12, color: 'var(--danger)' }}>
                        {notifPerm !== 'granted' ? 'Ruxsat berilmagan' : delayMs() === 0 ? 'Delay 0' : ''}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div style={S.row()}>
                  <div style={{ flex: 1 }}>
                    <Badge color="green">● Sessiya faol</Badge>
                    <div style={{ fontSize: 12, color: 'var(--dim)', marginTop: 8 }}>
                      {sentCount} ta bildirishnoma yuborildi
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--dimmer)', marginTop: 4, fontFamily: 'var(--mono)' }}>
                      {countdown}
                    </div>
                  </div>
                  <Btn variant="danger" onClick={stopSession}>■ To'xtatish</Btn>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ QUESTIONS TAB ══════════ */}
        {tab === 'questions' && (
          <div style={{ animation: 'fadeIn .35s ease both' }}>
            <SLabel>Savollar ro'yxati ({QUESTIONS.length} ta)</SLabel>
            <InfoBox>
              <span>📝</span>
              <span style={{ fontSize: 12 }}>
                Savollarni <code style={{ fontFamily: 'var(--mono)', color: 'var(--ac)', background: 'rgba(124,106,247,.1)', padding: '1px 5px', borderRadius: 4 }}>src/db.js</code> faylida tahrirlang.
              </span>
            </InfoBox>
            <div style={{ marginTop: 14 }}>
              {QUESTIONS.map((q, i) => (
                <div key={q.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 11,
                  padding: 14, background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: 10, marginBottom: 9, transition: 'border-color .2s',
                  animation: 'fadeIn .3s ease both',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='var(--bhi)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
                >
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ac)',
                    background: 'rgba(124,106,247,.1)', border: '1px solid rgba(124,106,247,.2)',
                    borderRadius: 6, padding: '2px 7px', minWidth: 30, textAlign: 'center',
                    flexShrink: 0, marginTop: 2,
                  }}>#{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, marginBottom: 5 }}>{q.question}</div>
                    <div style={{ fontSize: 12, color: 'var(--ok)', fontFamily: 'var(--mono)' }}>
                      ✓ {q.answer.slice(0, 120)}{q.answer.length > 120 ? '…' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ HISTORY TAB ══════════ */}
        {tab === 'history' && (
          <div style={{ animation: 'fadeIn .35s ease both' }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 11, marginBottom: 18 }}>
              {[
                { val: statsTotal,   lbl: 'Jami',     col: 'var(--ac)' },
                { val: statsCorrect, lbl: "To'g'ri",  col: 'var(--ok)' },
                { val: statsAvg + '%', lbl: "O'rtacha", col: statsAvg >= 70 ? 'var(--ok)' : statsAvg >= 40 ? 'var(--a2)' : 'var(--danger)' },
              ].map(s => (
                <div key={s.lbl} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 16, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 700, color: s.col }}>{s.val}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--dimmer)', marginTop: 3, textTransform: 'uppercase' }}>{s.lbl}</div>
                </div>
              ))}
            </div>

            <SLabel>Javoblar tarixi</SLabel>

            {history.length === 0 && (
              <div style={S.card({ textAlign: 'center', padding: 30, color: 'var(--dimmer)', fontFamily: 'var(--mono)', fontSize: 12 })}>
                Hali javoblar tarixi yo'q
              </div>
            )}

            {history.map(h => {
              const col = h.score >= 70 ? 'green' : h.score >= 40 ? 'orange' : 'red'
              const barCol = h.score >= 70 ? 'var(--ok)' : h.score >= 40 ? 'var(--a2)' : 'var(--danger)'
              return (
                <div key={h.id} style={S.card({ padding: 14 })}>
                  <div style={S.row({ marginBottom: 6 })}>
                    <div style={{ flex: 1, fontSize: 13 }}>{h.question}</div>
                    <Badge color={col}>{h.score}%</Badge>
                  </div>
                  <div style={{ height: 4, borderRadius: 3, background: 'var(--bg4)', overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ height: '100%', width: `${h.score}%`, background: barCol, borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 4 }}>
                    Javob: <em>{h.userAnswer?.slice(0, 90)}{(h.userAnswer?.length ?? 0) > 90 ? '…' : ''}</em>
                  </div>
                  {h.feedback && (
                    <div style={{ fontSize: 11, color: 'var(--dimmer)', marginBottom: 4 }}>{h.feedback}</div>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--dimmer)', fontFamily: 'var(--mono)' }}>
                    {new Date(h.timestamp).toLocaleString('uz-UZ')}
                  </div>
                </div>
              )
            })}

            {history.length > 0 && (
              <Btn variant="danger" sm onClick={() => { if (window.confirm("Tarixni o'chirasizmi?")) saveHistory([]) }}>
                🗑 Tarixni tozalash
              </Btn>
            )}
          </div>
        )}

        {/* ══════════ ANSWER VIEW ══════════ */}
        {tab === 'answer' && currentQ && (
          <div style={{ animation: 'slideUp .4s cubic-bezier(.16,1,.3,1) both' }}>
            <div style={S.card()}>
              {/* Header */}
              <div style={{ ...S.row(), marginBottom: 18 }}>
                <Badge>Savol</Badge>
                <div style={{ flex: 1 }} />
                <Btn variant="ghost" sm onClick={closeAnswer}>✕ Yopish</Btn>
              </div>

              {/* Question */}
              <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.45, marginBottom: 20 }}>
                {currentQ.question}
              </div>

              {/* Answer input */}
              <label style={{ fontSize: 11, color: 'var(--dim)', fontFamily: 'var(--mono)', display: 'block', marginBottom: 6 }}>
                Javobingiz
              </label>
              <div style={{ ...S.row({ alignItems: 'flex-start' }), marginBottom: 12 }}>
                <Textarea
                  value={userAns}
                  onChange={e => setUserAns(e.target.value)}
                  placeholder="Javobingizni yozing yoki 🎤 tugmasini bosing..."
                  style={{ flex: 1 }}
                />
                {/* Voice button */}
                <button onClick={toggleVoice} style={{
                  width: 42, height: 42, borderRadius: '50%',
                  border: `2px solid ${recording ? 'var(--danger)' : 'var(--bhi)'}`,
                  background: recording ? 'rgba(247,106,106,.12)' : 'var(--bg3)',
                  color: recording ? 'var(--danger)' : 'var(--dim)',
                  fontSize: 17, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all .2s',
                  animation: recording ? 'pulseRed 1s infinite' : 'none',
                }}>
                  {recording ? '⏹' : '🎤'}
                </button>
              </div>

              {recording && (
                <div style={{ fontSize: 12, color: 'var(--danger)', fontFamily: 'var(--mono)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ animation: 'blink 1s infinite', display: 'inline-block' }}>●</span>
                  Gapiring... (qayta bosing = to'xtatish)
                </div>
              )}

              <div style={S.row()}>
                <Btn variant="primary" onClick={checkAnswer} disabled={!userAns.trim() || checking}>
                  {checking ? <><Spinner /> Tekshirilmoqda…</> : '🧠 AI bilan tekshirish'}
                </Btn>
                {userAns && !checking && (
                  <Btn variant="ghost" sm onClick={() => setUserAns('')}>Tozalash</Btn>
                )}
              </div>

              {/* AI Result */}
              {aiResult && <AIResultCard result={aiResult} onDone={closeAnswer} onRetry={() => { setAiResult(null); setUserAns('') }} />}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

// ─── AI Result Card ────────────────────────────────────────────────────────────
function AIResultCard({ result, onDone, onRetry }) {
  const { score = 0, is_correct, feedback, better_answer, key_points = [] } = result
  const col = score >= 70 ? 'var(--ok)' : score >= 40 ? 'var(--a2)' : 'var(--danger)'
  const badgeColor = (is_correct || score >= 70) ? 'green' : score >= 40 ? 'orange' : 'red'
  const badgeLabel = (is_correct || score >= 70) ? "✓ To'g'ri" : score >= 40 ? '~ Qisman' : "✗ Noto'g'ri"

  return (
    <div style={{
      background: 'linear-gradient(135deg,rgba(124,106,247,.07) 0%,rgba(106,247,200,.04) 100%)',
      border: '1px solid rgba(124,106,247,.22)',
      borderRadius: 'var(--r)', padding: 18, marginTop: 16,
      animation: 'slideUp .4s cubic-bezier(.16,1,.3,1) both',
    }}>
      {/* Score row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>
          Ball: <strong style={{ fontSize: 22, color: col }}>{score}%</strong>
        </div>
        <Badge color={badgeColor}>{badgeLabel}</Badge>
      </div>

      <ScoreBar score={score} />

      {/* Feedback */}
      {feedback && (
        <div style={{ fontSize: 13, color: 'var(--dim)', marginTop: 10, marginBottom: 14 }}>
          {feedback}
        </div>
      )}

      {/* Better answer */}
      {better_answer && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ac)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em' }}>
            💡 Ideal javob
          </div>
          <div style={{
            background: 'rgba(124,106,247,.07)', border: '1px solid rgba(124,106,247,.15)',
            borderRadius: 8, padding: '11px 14px', fontSize: 13, lineHeight: 1.65,
          }}>
            {better_answer}
          </div>
        </div>
      )}

      {/* Key points */}
      {key_points.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--a2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em' }}>
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
        <Btn variant="success" sm onClick={onDone}>✓ Bajarildi</Btn>
        <Btn variant="ghost"   sm onClick={onRetry}>↺ Qayta urinish</Btn>
      </div>
    </div>
  )
}
