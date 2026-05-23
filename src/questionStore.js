const DB_NAME = 'mindping_questions'
const DB_VERSION = 1
const STORE = 'questions'

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('section', 'section', { unique: false })
        store.createIndex('createdAt', 'createdAt', { unique: false })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export function normalizeSection(section) {
  return String(section || 'general')
    .toLowerCase()
    .trim()
    .replace(/\\/g, '/')
    .replace(/\s+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^\/|\/$/g, '') || 'general'
}

export function normalizeQuestion(input) {
  return {
    id: input.id || `q_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    section: normalizeSection(input.section || input.topic || input.category),
    question: String(input.question || '').trim(),
    answer: String(input.answer || '').trim(),
    createdAt: input.createdAt || new Date().toISOString(),
  }
}

export async function getQuestions() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, 'readonly').objectStore(STORE).getAll()
    request.onsuccess = () => {
      resolve(request.result.sort((a, b) => a.section.localeCompare(b.section) || a.question.localeCompare(b.question)))
    }
    request.onerror = () => reject(request.error)
  })
}

export async function seedQuestions(defaultQuestions) {
  const existing = await getQuestions()
  if (existing.length) return existing

  const db = await openDB()
  const tx = db.transaction(STORE, 'readwrite')
  const store = tx.objectStore(STORE)
  defaultQuestions.forEach((q, index) => {
    store.put(normalizeQuestion({
      ...q,
      id: `seed_${q.id || index + 1}`,
      section: q.section || 'js/general',
      createdAt: new Date(0).toISOString(),
    }))
  })
  await txDone(tx)
  return getQuestions()
}

export async function addQuestion(question) {
  const clean = normalizeQuestion(question)
  if (!clean.question || !clean.answer) {
    throw new Error("Savol va javob bo'sh bo'lmasligi kerak.")
  }

  const db = await openDB()
  const tx = db.transaction(STORE, 'readwrite')
  tx.objectStore(STORE).put(clean)
  await txDone(tx)
  return clean
}

export async function addQuestions(questions) {
  const clean = questions.map(normalizeQuestion).filter((q) => q.question && q.answer)
  const db = await openDB()
  const tx = db.transaction(STORE, 'readwrite')
  const store = tx.objectStore(STORE)
  clean.forEach((q) => store.put(q))
  await txDone(tx)
  return clean.length
}

export async function deleteQuestion(id) {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readwrite')
  tx.objectStore(STORE).delete(id)
  await txDone(tx)
}
