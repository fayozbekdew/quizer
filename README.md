# 🧠 MindPing — Aqlli Takrorlash

Bildirishnomalar orqali savol-javob bilan bilimlarni mustahkamlash uchun React + TypeScript PWA.

## O'rnatish va ishga tushirish

```bash
npm install
npm run dev        # localhost:3000
npm run build      # deploy uchun
```

## Loyiha tuzilmasi

```
src/
├── App.tsx                        # Asosiy layout + tab routing
├── main.tsx                       # Entry point + SW register
├── index.css                      # Global stillar + animatsiyalar
│
├── constants/
│   ├── questions.ts               # ✏️  SAVOLLAR SHU YERDA
│   ├── config.ts                  # AI model, limit, key konstantalar
│   └── index.ts
│
├── utils/
│   ├── sw.ts                      # Service Worker postMessage helpers
│   ├── time.ts                    # Delay ↔ ms, countdown, clamp
│   ├── ai.ts                      # Claude API call + prompt
│   ├── storage.ts                 # localStorage wrapper
│   ├── voice.ts                   # Web Speech API wrapper
│   └── index.ts
│
├── hooks/
│   ├── useLocalStorage.ts         # Generic LS hook
│   ├── useSession.ts              # Sessiya boshqaruvi (schedule/stop)
│   ├── useVoice.ts                # Ovozli kiritish hook
│   └── index.ts
│
└── components/
    ├── SetupView.tsx              # Sozlash tab
    ├── QuestionsView.tsx          # Savollar ro'yxati tab
    ├── HistoryView.tsx            # Tarix va statistika tab
    ├── AnswerView.tsx             # Javob berish view
    ├── AIResultCard.tsx           # AI natija kartasi
    ├── TimePicker.tsx             # Vaqt tanlagich
    ├── index.ts
    └── ui/                        # Kichik UI komponentlar
        ├── Btn.tsx
        ├── Badge.tsx
        ├── Card.tsx
        ├── FInput.tsx
        ├── FTextarea.tsx
        ├── InfoBox.tsx
        ├── NavTab.tsx
        ├── SLabel.tsx
        ├── ScoreBar.tsx
        ├── Spinner.tsx
        └── index.ts
```

## Savol qo'shish

`src/constants/questions.ts` faylida `QUESTIONS` massivini davom ettiring:

```ts
{
  id: 11,           // unikal raqam
  question: "Savolingiz?",
  answer: "To'liq javob matni",
},
```

## Xususiyatlar

- ⏰ Delay time picker (soat : daqiqa : soniya)
- 🔔 Mac/brauzer bildirishnomalari (Service Worker)
- 🎤 Ovozli javob (Web Speech API)
- ✍️ Text ko'rinishida javob
- 🧠 Claude AI orqali tekshiruv + ideal javob + nuqtalar
- 📊 Tarix va statistika (localStorage)
- 🔄 Session ID tizimi (stop bosilsa eski notiflar bekor)

## Mac bildirishnomalari

System Settings → Notifications → [Brauzer] → Allow
