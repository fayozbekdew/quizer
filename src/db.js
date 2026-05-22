// ═══════════════════════════════════════════════════════════════
//  db.js — Barcha savollar shu yerda
//  Format: { id: number, question: string, answer: string }
//  Yangi savollar qo'shish uchun massivni davom ettiring.
// ═══════════════════════════════════════════════════════════════

/** @type {{ id: number, question: string, answer: string }[]} */
export const QUESTIONS = [
  // ── JavaScript ─────────────────────────────────────────────
  {
    id: 1,
    question: "JavaScript'da `var`, `let` va `const` o'rtasidagi asosiy farq nima?",
    answer:
      "`var` — function-scoped, hoisting bilan, qayta e'lon qilsa bo'ladi. " +
      "`let` — block-scoped, hoisting yo'q (TDZ), qayta e'lon qilib bo'lmaydi, lekin qayta tayinlash mumkin. " +
      "`const` — block-scoped, e'lon paytida tayinlanishi shart, keyin qayta tayinlab bo'lmaydi (ob'ektning ichki xossalari o'zgarishi mumkin).",
  },
  {
    id: 2,
    question: "JavaScript'da `==` va `===` operatorlari qanday farqlanadi?",
    answer:
      "`==` (loose equality) — type coercion qiladi, ya'ni turli tiplardagi qiymatlarni solishtirishdan oldin bir turga o'tkazadi. " +
      "`===` (strict equality) — hech qanday konversiya qilmaydi, qiymat ham, tur ham bir xil bo'lishi kerak. " +
      "Masalan: `0 == '0'` → true, `0 === '0'` → false.",
  },
  {
    id: 3,
    question: "Closure nima va qanday ishlaydi? Misol keltiring.",
    answer:
      "Closure — ichki funksiya tashqi funksiyaning scope'idagi o'zgaruvchilarga, tashqi funksiya bajarilgandan keyin ham murojaat qila olishi. " +
      "Misol: `function counter() { let n=0; return () => ++n; }` — qaytarilgan arrow funksiya `n` ga closure orqali kiradi. " +
      "Har safar chaqirilganda `n` qiymati saqlanib qoladi.",
  },
  {
    id: 4,
    question: "`Promise` nima? `resolve`, `reject` va `.then()`, `.catch()` qanday ishlaydi?",
    answer:
      "Promise — asinxron operatsiyaning kelajakdagi natijasini ifodalovchi ob'ekt. " +
      "Uchta holat: pending, fulfilled (resolve chaqirilganda), rejected (reject chaqirilganda). " +
      "`.then(onFulfilled)` — muvaffaqiyatli natijani tutib oladi. " +
      "`.catch(onRejected)` — xatoni ushlaydi. " +
      "`.finally()` — har ikki holatda ham ishlaydi.",
  },
  {
    id: 5,
    question: "`async/await` nima va u qanday Promise bilan bog'liq?",
    answer:
      "`async` kalit so'zi funksiyani har doim Promise qaytarishga majbur qiladi. " +
      "`await` faqat `async` funksiya ichida ishlatiladi va Promise resolve bo'lguncha kod bajarilishini to'xtatib turadi (lekin main thread bloklanmaydi). " +
      "Bu aslida Promise zanjirini (`then/catch`) yanada o'qilishi oson sintaksis bilan yozish usuli.",
  },
  {
    id: 6,
    question: "Event Loop nima? Call Stack, Web APIs va Callback Queue qanday ishlaydi?",
    answer:
      "JavaScript — single-threaded, Event Loop esa asinxronlikni ta'minlaydi. " +
      "Call Stack — sinxron kod bajariladi. " +
      "Web APIs (setTimeout, fetch va h.k.) — brauzer/Node.js tomonidan asinxron bajariladi. " +
      "Callback Queue — tayyor callbacklar navbat kutadi. " +
      "Microtask Queue (Promise'lar) — Callback Queue'dan oldin ishlanadi. " +
      "Event Loop — Call Stack bo'sh bo'lganda Microtask, so'ng Callback Queue'dan vazifalarni oladi.",
  },
  {
    id: 7,
    question:
      "Array metodlari: `map()`, `filter()`, `reduce()` farqlari va qo'llanilishi?",
    answer:
      "`map(fn)` — har elementga fn qo'llab, yangi massiv qaytaradi (uzunlik o'zgarmaydi). " +
      "`filter(fn)` — fn true qaytargan elementlardan yangi massiv yaratadi (uzunlik kamayishi mumkin). " +
      "`reduce(fn, init)` — massivni bitta qiymatga (son, ob'ekt, massiv) keltiradi; fn (accumulator, current) oladi. " +
      "Barchasi original massivni o'zgartirmaydi (immutable).",
  },
  {
    id: 8,
    question: "Prototypal inheritance nima? `__proto__` va `prototype` farqi?",
    answer:
      "JavaScript'da har ob'ektning `__proto__` (yashirin) xossasi bor — u ob'ektning prototipiga ishora qiladi. " +
      "Xossa topilmasa, `__proto__` zanjiri bo'ylab qidiriladi (prototype chain). " +
      "`prototype` — faqat funksiyalarda bor, `new` bilan yaratilgan ob'ektlarga meros bo'ladi. " +
      "`Object.create(proto)` — berilgan prototip bilan yangi ob'ekt yaratadi.",
  },
  {
    id: 9,
    question: "`this` kalit so'zi JavaScript'da qanday aniqlanadi? Arrow funksiyada farqi?",
    answer:
      "`this` — chaqirish kontekstiga qarab aniqlanadi: " +
      "oddiy funksiyada — kim chaqirgan bo'lsa o'sha ob'ekt (yoki strict mode'da undefined). " +
      "Arrow funksiyada — o'zining `this`'i yo'q, yuqori scope'ning `this`'ini meros oladi (lexical this). " +
      "`bind()`, `call()`, `apply()` — `this`'ni qo'lda belgilash uchun ishlatiladi.",
  },
  {
    id: 10,
    question: "Debounce va Throttle nima? Ularning farqi va qo'llanilishi?",
    answer:
      "Debounce — funksiyani oxirgi chaqiruvdan N ms o'tgandan keyin bir marta chaqiradi. " +
      "Qo'llanilishi: search input'da har harfdan so'ng API call qilmaslik. " +
      "Throttle — funksiya N ms ichida bir martadan ko'p chaqirilmaydi (regulyar interval). " +
      "Qo'llanilishi: scroll, resize eventlarida haddan tashqari ishlov bermaslik. " +
      "Asosiy farq: debounce 'tinchlanguncha kut', throttle 'intervalda bir marta ruxsat'.",
  },
]
