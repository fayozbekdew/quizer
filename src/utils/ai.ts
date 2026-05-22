import { AI_MODEL, AI_MAX_TOKENS } from '../constants'
import type { Question } from '../constants'

export interface AIResult {
  score: number
  is_correct: boolean
  feedback: string
  better_answer: string
  key_points: string[]
}

export async function checkAnswerWithAI(
  question: Question,
  userAnswer: string
): Promise<AIResult> {
  const prompt = `Sen o'quv yordamchisiszan.
Savol: "${question.question}"
To'g'ri javob (etalon): "${question.answer}"
Foydalanuvchi javobi: "${userAnswer}"

Faqat quyidagi JSON formatida javob ber, hech qanday qo'shimcha matn, izoh yoki markdown yo'q:
{"score":0,"is_correct":false,"feedback":"","better_answer":"","key_points":[]}

Qoidalar:
- score: 0-100 butun son (100=mukammal, 0=noto'g'ri)
- is_correct: score>=70 bo'lsa true
- feedback: O'zbek tilida 1-2 jumla, konstruktiv
- better_answer: Ideal to'liq javob o'zbek tilida
- key_points: O'tkazib yuborilgan muhim nuqtalar massivi (bo'sh bo'lishi mumkin)`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()
  const raw = (
    data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? '{}'
  )
    .replace(/```json|```/g, '')
    .trim()

  return JSON.parse(raw) as AIResult
}
