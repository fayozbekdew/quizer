# 🧠 MindPing — Aqlli Takrorlash

Bildirishnomalar orqali savol-javob bilan bilimlarni mustahkamlash uchun React + Electron macOS app.

## O'rnatish va ishga tushirish

```bash
npm install
npm run electron:dev  # Vite + Electron dev
npm run electron      # production buildni Electron ichida ochish
npm run dist:mac      # macOS .app/.dmg build
```

AI tekshiruv uchun OpenAI API key kerak:

```bash
export OPENAI_API_KEY="sk-..."
export OPENAI_MODEL="gpt-5.2" # ixtiyoriy
npm run electron
```

`.app`ni Finder’dan ochsangiz, keyni `~/.mindping.env` fayliga yozing:

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.2
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

App ichida **Savollar** tabidan qo'shing yoki JSON/CSV import qiling. Savollar IndexedDB'da lokal saqlanadi.

JSON formati:

```json
[
  {
    "section": "js/engine",
    "question": "Event Loop nima?",
    "answer": "Event Loop call stack bo'shaganda task va microtasklarni bajaradi..."
  }
]
```

CSV formati:

```csv
section,question,answer
react/fiber,Fiber nima?,React Fiber rendering ishini bo'laklarga ajratadigan arxitektura...
```

## Xususiyatlar

- ⏰ Delay time picker (soat : daqiqa : soniya)
- 🔔 Mac/brauzer bildirishnomalari (Service Worker)
- 🎤 Ovozli javob (Web Speech API)
- ✍️ Text ko'rinishida javob
- 🧠 OpenAI orqali tekshiruv + foiz + ideal javob + yetishmagan nuqtalar
- 🗂 IndexedDB savollar bazasi, section/topic bo'yicha filter
- 📥 JSON/CSV import va forma orqali savol qo'shish
- 📊 Tarix va statistika (localStorage)
- 🔄 Random savollar: belgilangan intervalda faqat 1 ta savol yuboriladi

## Mac bildirishnomalari

System Settings → Notifications → MindPing → Allow
