import React from 'react'
import { Card, Btn, Badge, SLabel, InfoBox } from './ui'
import { TimePicker } from './TimePicker'
import { useSession } from '../hooks'
import { delayToLabel, clampUnit } from '../utils/time'
import type { Delay } from '../utils/time'
import type { Question } from '../constants'
import { QUESTIONS } from '../constants'

interface SetupViewProps {
  delay: Delay
  setDelay: React.Dispatch<React.SetStateAction<Delay>>
  notifPerm: NotificationPermission
  onRequestNotif: () => void
  onQuestionFired: (q: Question) => void
}

export function SetupView({
  delay,
  setDelay,
  notifPerm,
  onRequestNotif,
  onQuestionFired,
}: SetupViewProps) {
  const { running, sent, countdown, start, stop } = useSession(delay, onQuestionFired)

  const adjustDelay = (unit: keyof Delay, delta: number) => {
    setDelay((prev) => ({ ...prev, [unit]: clampUnit(unit, prev[unit] + delta) }))
  }

  const canStart =
    notifPerm === 'granted' &&
    (delay.h * 3600 + delay.m * 60 + delay.s) > 0 &&
    QUESTIONS.length > 0

  return (
    <div style={{ animation: 'fadeIn .35s ease both' }}>
      {/* ── Notification permission ── */}
      <SLabel>Bildirishnoma ruxsati</SLabel>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, marginBottom: 6 }}>
              {notifPerm === 'granted' && (
                <span style={{ color: 'var(--ok)' }}>✅ Ruxsat berilgan</span>
              )}
              {notifPerm === 'denied' && (
                <span style={{ color: 'var(--danger)' }}>
                  ❌ Rad etilgan — brauzer sozlamalarini o'zgartiring
                </span>
              )}
              {notifPerm === 'default' && (
                <span style={{ color: 'var(--dim)' }}>⏳ Ruxsat so'ralmagan</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--dim)' }}>
              Fon rejimida ishlashi uchun bildirishnoma ruxsati kerak
            </div>
          </div>
          {notifPerm === 'default' && (
            <Btn v="primary" sm onClick={onRequestNotif}>Ruxsat berish</Btn>
          )}
        </div>
      </Card>

      {/* ── Time picker ── */}
      <SLabel>Vaqt oraligi</SLabel>
      <Card>
        <div style={{
          fontSize: 11, color: 'var(--dim)',
          fontFamily: 'var(--mono)', marginBottom: 10,
        }}>
          Har necha vaqtda savol yuborilsin:
        </div>
        <TimePicker delay={delay} onAdjust={adjustDelay} />
        <div style={{ fontSize: 12, color: 'var(--dim)', marginTop: 10 }}>
          Jami:{' '}
          <strong style={{ color: 'var(--ac)' }}>{delayToLabel(delay)}</strong>
        </div>
      </Card>

      {/* ── Session control ── */}
      <SLabel>Sessiyani boshqarish</SLabel>
      <Card>
        {!running ? (
          <>
            <InfoBox>
              <span>ℹ️</span>
              <span style={{ fontSize: 13 }}>
                Sessiya boshlaganda har{' '}
                <strong style={{ color: 'var(--ac)' }}>{delayToLabel(delay)}</strong>
                {' '}da{' '}
                <strong style={{ color: 'var(--ac)' }}>{QUESTIONS.length}</strong>
                {' '}ta savol navbat bilan bildirishnoma orqali yuboriladi.
              </span>
            </InfoBox>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Btn v="primary" onClick={start} disabled={!canStart}>
                ▶ Sessiyani boshlash
              </Btn>
              {!canStart && (
                <span style={{ fontSize: 12, color: 'var(--danger)' }}>
                  {notifPerm !== 'granted'
                    ? 'Bildirishnoma ruxsati kerak'
                    : QUESTIONS.length === 0
                    ? 'Savollar yo\'q'
                    : 'Delay 0 soniya'}
                </span>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Badge c="green">● Sessiya faol</Badge>
              <div style={{ fontSize: 12, color: 'var(--dim)', marginTop: 8 }}>
                {sent} ta bildirishnoma yuborildi
              </div>
              <div style={{
                fontSize: 11, color: 'var(--dimmer)',
                marginTop: 4, fontFamily: 'var(--mono)',
              }}>
                {countdown}
              </div>
            </div>
            <Btn v="danger" onClick={stop}>■ To'xtatish</Btn>
          </div>
        )}
      </Card>
    </div>
  )
}
