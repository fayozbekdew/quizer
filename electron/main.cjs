const path = require('node:path')
const fs = require('node:fs')
const { app, BrowserWindow, Menu, Notification, Tray, ipcMain, nativeImage } = require('electron')

let mainWindow = null
let tray = null
let isQuitting = false
let session = null

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function shuffleQuestions(questions) {
  const shuffled = [...questions]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function nextRandomQuestion() {
  if (!session) return null
  if (!session.questionPool.length) {
    session.questionPool = shuffleQuestions(session.questions)
  }
  return session.questionPool.shift()
}

function localScoreAnswer(question, referenceAnswer, userAnswer) {
  const referenceWords = new Set(normalizeText(referenceAnswer).split(' ').filter(Boolean))
  const userWords = new Set(normalizeText(userAnswer).split(' ').filter(Boolean))
  const matched = [...referenceWords].filter((word) => userWords.has(word))
  const score = referenceWords.size ? Math.round((matched.length / referenceWords.size) * 100) : 0
  const missing = [...referenceWords].filter((word) => !userWords.has(word)).slice(0, 8)

  return {
    score: Math.max(0, Math.min(100, score)),
    is_correct: score >= 70,
    feedback: score >= 70
      ? "Javobingiz asosiy mazmunga yaqin. Mayda tafsilotlarni to'ldirsangiz yanada yaxshi bo'ladi."
      : "Javobingizda muhim tushunchalar yetishmayapti. Etalon javobdagi asosiy kalit so'zlarni ko'proq qamrab oling.",
    better_answer: referenceAnswer,
    key_points: missing,
    source: 'local',
  }
}

function extractOutputText(data) {
  if (typeof data?.output_text === 'string') return data.output_text
  const chunks = []
  for (const item of data?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === 'string') chunks.push(content.text)
    }
  }
  return chunks.join('\n')
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index === -1) continue
    const key = trimmed.slice(0, index).trim()
    let value = trimmed.slice(index + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (key && !process.env[key]) process.env[key] = value
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 920,
    height: 760,
    minWidth: 720,
    minHeight: 560,
    title: 'MindPing',
    backgroundColor: '#080810',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.webContents.session.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === 'media' || permission === 'microphone')
  })

  mainWindow.on('close', (event) => {
    if (isQuitting) return
    event.preventDefault()
    mainWindow.hide()
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

function showWindow() {
  if (!mainWindow) createWindow()
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.show()
  mainWindow.focus()
}

function createTray() {
  const image = nativeImage.createEmpty()
  tray = new Tray(image)
  tray.setToolTip('MindPing')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'MindPingni ochish', click: showWindow },
    { label: "Sessiyani to'xtatish", click: stopSession },
    { type: 'separator' },
    {
      label: 'Chiqish',
      click: () => {
        isQuitting = true
        stopSession()
        app.quit()
      },
    },
  ]))
}

function sendToRenderer(channel, payload) {
  if (!mainWindow || mainWindow.isDestroyed()) return
  mainWindow.webContents.send(channel, payload)
}

function scheduleNext() {
  if (!session) return

  session.nextAt = Date.now() + session.delayMs
  session.timer = setTimeout(() => {
    if (!session) return

    const question = nextRandomQuestion()
    if (!question) return

    const notification = new Notification({
      title: 'MindPing - Savol!',
      body: question.question,
      silent: false,
    })

    notification.on('click', () => {
      showWindow()
      sendToRenderer('mindping:open-question', question)
    })

    notification.show()
    sendToRenderer('mindping:question-fired', question)
    scheduleNext()
  }, session.delayMs)
}

function stopSession(options = {}) {
  if (session?.timer) clearTimeout(session.timer)
  session = null
  if (!options.silent) sendToRenderer('mindping:session-stopped')
}

ipcMain.handle('mindping:start-session', (_event, payload) => {
  const delayMs = Number(payload?.delayMs)
  const questions = Array.isArray(payload?.questions) ? payload.questions : []

  if (!Number.isFinite(delayMs) || delayMs <= 0 || questions.length === 0) {
    throw new Error('Invalid session payload')
  }

  stopSession({ silent: true })
  session = {
    delayMs,
    questions,
    questionPool: shuffleQuestions(questions),
    nextAt: null,
    timer: null,
  }
  scheduleNext()
  return { ok: true, nextAt: session.nextAt }
})

ipcMain.handle('mindping:stop-session', () => {
  stopSession()
  return { ok: true }
})

ipcMain.handle('mindping:show-test-notification', () => {
  const notification = new Notification({
    title: 'MindPing',
    body: 'Bildirishnoma ishlayapti.',
  })
  notification.show()
  return { ok: true }
})

ipcMain.handle('mindping:check-answer', async (_event, payload) => {
  const question = String(payload?.question ?? '')
  const referenceAnswer = String(payload?.referenceAnswer ?? '')
  const userAnswer = String(payload?.userAnswer ?? '')

  if (!question || !referenceAnswer || !userAnswer.trim()) {
    throw new Error("Savol, etalon javob yoki foydalanuvchi javobi bo'sh.")
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return {
      ...localScoreAnswer(question, referenceAnswer, userAnswer),
      feedback: "OPENAI_API_KEY topilmadi. Hozircha oddiy lokal taqqoslash ishladi; AI baholash uchun API key kerak.",
    }
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5.2',
      instructions:
        "Siz o'zbek tilidagi o'quv javoblarini tekshiruvchi mentorsiz. " +
        "Foydalanuvchi javobini etalon javob bilan mazmunan solishtiring. " +
        "So'zma-so'z moslikni emas, tushunchalar to'g'riligi va yetarli qamrovni baholang. " +
        "Feedback qisqa, aniq va konstruktiv bo'lsin.",
      input: JSON.stringify({
        question,
        reference_answer: referenceAnswer,
        user_answer: userAnswer,
        grading_rules: [
          'score 0-100 oraligida bo‘lsin',
          '70 va undan yuqori score is_correct=true',
          'kamchilik bo‘lsa better_answer orqali to‘ldirilgan javob bering',
          'key_points ichida yetishmagan asosiy tushunchalar bo‘lsin',
        ],
      }),
      text: {
        format: {
          type: 'json_schema',
          name: 'answer_grade',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              score: { type: 'integer', minimum: 0, maximum: 100 },
              is_correct: { type: 'boolean' },
              feedback: { type: 'string' },
              better_answer: { type: 'string' },
              key_points: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            required: ['score', 'is_correct', 'feedback', 'better_answer', 'key_points'],
          },
        },
      },
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`OpenAI request failed: ${response.status} ${detail}`)
  }

  const data = await response.json()
  return { ...JSON.parse(extractOutputText(data)), source: 'openai' }
})

ipcMain.handle('mindping:transcribe-audio', async (_event, payload) => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY topilmadi.')
  }

  const bytes = payload?.audioBuffer
  if (!bytes) throw new Error('Audio maʼlumot kelmadi.')

  const mimeType = String(payload?.mimeType || 'audio/webm')
  const extension = mimeType.includes('mp4') ? 'mp4'
    : mimeType.includes('mpeg') ? 'mpeg'
    : mimeType.includes('wav') ? 'wav'
    : mimeType.includes('m4a') ? 'm4a'
    : 'webm'
  const buffer = Buffer.from(bytes)
  const form = new FormData()
  form.append('model', process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-4o-mini-transcribe')
  form.append('language', 'uz')
  form.append('response_format', 'json')
  form.append('file', new Blob([buffer], { type: mimeType }), `answer.${extension}`)

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`OpenAI transcription failed: ${response.status} ${detail}`)
  }

  const data = await response.json()
  return { text: String(data.text || '').trim() }
})

app.whenReady().then(() => {
  loadEnvFile(path.join(process.cwd(), '.env'))
  loadEnvFile(path.join(app.getPath('home'), '.mindping.env'))

  if (process.platform === 'win32') app.setAppUserModelId('com.mindping.app')
  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    showWindow()
  })
})

app.on('before-quit', () => {
  isQuitting = true
  stopSession()
})

app.on('window-all-closed', () => {
  // Keep the process alive so scheduled reminders continue after the window is closed.
})
