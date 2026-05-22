// ═══════════════════════════════════════════════════════════════
//  questions.ts — Barcha savollar shu yerda
//  Yangi savol qo'shish: massivni davom ettiring, id unikal bo'lsin
// ═══════════════════════════════════════════════════════════════

export interface Question {
  id: number
  question: string
  answer: string
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "JavaScript'da `var`, `let` va `const` o'rtasidagi asosiy farq nima?",
    answer:
      '`var` — function-scoped, hoisting bilan, qayta e\'lon qilsa bo\'ladi. ' +
      '`let` — block-scoped, TDZ bor, qayta e\'lon qilib bo\'lmaydi lekin qayta tayinlash mumkin. ' +
      '`const` — block-scoped, e\'lon paytida tayinlanishi shart, qayta tayinlab bo\'lmaydi (ob\'ektning ichki xossalari o\'zgarishi mumkin).',
  },
  {
    id: 2,
    question: "JavaScript'da `==` va `===` operatorlari qanday farqlanadi?",
    answer:
      '`==` (loose equality) — type coercion qiladi, turli tiplardagi qiymatlarni solishtirishdan oldin bir turga o\'tkazadi. ' +
      '`===` (strict equality) — hech qanday konversiya qilmaydi, qiymat ham, tur ham bir xil bo\'lishi kerak. ' +
      "Masalan: `0 == '0'` → true, `0 === '0'` → false.",
  },
  {
    id: 3,
    question: 'Closure nima va qanday ishlaydi?',
    answer:
      "Closure — ichki funksiya tashqi funksiyaning scope'idagi o'zgaruvchilarga, tashqi funksiya bajarilgandan keyin ham murojaat qila olishi. " +
      'Misol: `function counter() { let n=0; return () => ++n; }` — qaytarilgan arrow funksiya `n` ga closure orqali kiradi va har chaqiruvda qiymat saqlanib qoladi.',
  },
  {
    id: 4,
    question: '`Promise` nima? `resolve`, `reject`, `.then()`, `.catch()` qanday ishlaydi?',
    answer:
      'Promise — asinxron operatsiyaning kelajakdagi natijasini ifodalovchi ob\'ekt. ' +
      'Uch holat: pending, fulfilled (resolve), rejected (reject). ' +
      '`.then(fn)` — muvaffaqiyatli natijani tutadi. `.catch(fn)` — xatoni ushlaydi. `.finally(fn)` — har ikki holatda ishlaydi.',
  },
  {
    id: 5,
    question: '`async/await` nima va u Promise bilan qanday bog\'liq?',
    answer:
      '`async` funksiyani doim Promise qaytarishga majbur qiladi. ' +
      '`await` faqat `async` ichida ishlatiladi va Promise resolve bo\'lguncha kod bajarilishini to\'xtatib turadi (main thread bloklanmaydi). ' +
      'Bu Promise `.then/.catch` zanjirini oson o\'qiladigan sintaksis bilan yozish usuli.',
  },
  {
    id: 6,
    question: 'Event Loop nima? Call Stack, Web APIs va Callback Queue qanday ishlaydi?',
    answer:
      'JavaScript single-threaded, Event Loop asinxronlikni ta\'minlaydi. ' +
      'Call Stack — sinxron kod bajariladi. Web APIs (setTimeout, fetch) — brauzer tomonidan asinxron bajariladi. ' +
      'Microtask Queue (Promise) — Callback Queue\'dan oldin ishlanadi. ' +
      'Event Loop — Call Stack bo\'sh bo\'lganda Microtask, so\'ng Callback Queue\'dan oladi.',
  },
  {
    id: 7,
    question: '`map()`, `filter()`, `reduce()` metodlari farqlari va qo\'llanilishi?',
    answer:
      '`map(fn)` — har elementga fn qo\'llab yangi massiv qaytaradi (uzunlik o\'zgarmaydi). ' +
      '`filter(fn)` — fn true qaytargan elementlardan yangi massiv (uzunlik kamayishi mumkin). ' +
      '`reduce(fn, init)` — massivni bitta qiymatga keltiradi, fn (accumulator, current) oladi. ' +
      'Barchasi original massivni o\'zgartirmaydi.',
  },
  {
    id: 8,
    question: "Prototypal inheritance nima? `__proto__` va `prototype` farqi?",
    answer:
      "Har ob'ektning `__proto__` xossasi prototipiga ishora qiladi. Xossa topilmasa, prototype chain bo'ylab qidiriladi. " +
      "`prototype` — faqat funksiyalarda bor, `new` bilan yaratilgan ob'ektlarga meros bo'ladi. " +
      "`Object.create(proto)` — berilgan prototip bilan yangi ob'ekt yaratadi.",
  },
  {
    id: 9,
    question: '`this` kalit so\'zi qanday aniqlanadi? Arrow funksiyada farqi?',
    answer:
      '`this` chaqirish kontekstiga qarab aniqlanadi: oddiy funksiyada — kim chaqirsa o\'sha ob\'ekt (strict mode\'da undefined). ' +
      'Arrow funksiyada — o\'zining `this`\'i yo\'q, yuqori scope\'ning `this`\'ini meros oladi (lexical this). ' +
      '`bind()`, `call()`, `apply()` — `this`\'ni qo\'lda belgilash uchun.',
  },
  {
    id: 10,
    question: 'Debounce va Throttle nima? Farqlari va qo\'llanilishi?',
    answer:
      'Debounce — funksiyani oxirgi chaqiruvdan N ms o\'tgandan keyin bir marta chaqiradi. ' +
      'Qo\'llanilishi: search input\'da har harfdan API call qilmaslik. ' +
      'Throttle — N ms ichida bir martadan ko\'p chaqirilmaydi. Qo\'llanilishi: scroll, resize eventlarida. ' +
      "Farq: debounce 'tinchlanguncha kut', throttle 'intervalda bir marta ruxsat'.",
  },
  // ── Qo'shimcha savollar shu yerdan davom eting ──────────────
]
