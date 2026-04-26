import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

const LESSONS = [
  {
    id: 0,
    icon: '🏠',
    title: 'מה זו משכנתא?',
    subtitle: 'יסודות חובה לפני הקרב',
    xp: 100,
    gold: 200,
    content: `
משכנתא היא הלוואה גדולה שאתה לוקח מהבנק כדי לקנות דירה. הבנק נותן לך את הכסף עכשיו, ואתה מחזיר אותו לאורך שנים — עם ריבית.

**מה זה ריבית?** זה "המחיר" שאתה משלם על ההלוואה. אם לקחת מיליון ₪ בריבית של 4% לשנה, אתה משלם 40,000 ₪ ריבית בשנה הראשונה — בנוסף לקרן (הסכום המקורי).

**שלושה מונחים חשובים:**
- **קרן** — הסכום המקורי שלקחת
- **ריבית** — המחיר שאתה משלם על ההלוואה
- **תקופה** — כמה שנים לוקח לך להחזיר

**דוגמה:** משכנתא של מיליון ₪ ל-25 שנה בריבית 4% = החזר חודשי של כ-5,278 ₪. בסוף תשלם סך הכל כ-1,583,000 ₪ — כלומר 583,000 ₪ ריבית!

**למה פירעון מוקדם?** כל ₪ שאתה מחזיר מוקדם חוסך לך הרבה יותר ריבית עתידית. הפקדה של 7,000 ₪ היום יכולה לחסוך 20,000-30,000 ₪ בסה"כ.
    `,
    quiz: [
      {
        q: 'מה זו ריבית במשכנתא?',
        options: ['הסכום המקורי שלקחתם', 'המחיר שמשלמים על ההלוואה', 'דמי ניהול חשבון', 'מס רכישה'],
        correct: 1,
        explanation: 'ריבית היא "מחיר הכסף" — מה שמשלמים לבנק על הזכות להשתמש בכסף שלו.',
      },
      {
        q: 'מה היתרון של פירעון מוקדם?',
        options: ['אין יתרון, עדיף לשמור בפיקדון', 'חוסך ריבית עתידית', 'מקבלים פרס מהבנק', 'מוריד את ערך הדירה'],
        correct: 1,
        explanation: 'כל ₪ שמחזירים מוקדם מקטין את הקרן ולכן גם את הריבית שמשלמים עליה בעתיד.',
      },
    ],
  },
  {
    id: 1,
    icon: '📊',
    title: 'מסלולי משכנתא',
    subtitle: 'פריים, קל"צ, צמוד מדד ועוד',
    xp: 150,
    gold: 300,
    content: `
רוב המשכנתאות בישראל מורכבות ממספר **מסלולים** (tracks) — כמו שחקנים שונים בקבוצה. כל מסלול עם ריבית אחרת וכללים אחרים.

**מסלול פריים (Prime):**
הריבית = ריבית בנק ישראל + אחוז קבוע. הריבית משתנה, אין קנסות פירעון. **זה המסלול שכדאי לפרוע ראשון אם הריבית גבוהה.**

**קל"צ (קבועה לא צמודה):**
הריבית קבועה לכל תקופת ההלוואה. יציב, ניתן לתכנן. יש קנס פירעון מוקדם (עמלה).

**צמוד מדד:**
הריבית עשויה להיות נמוכה, אבל הקרן עולה עם האינפלציה (מדד המחירים). בתקופות אינפלציה — מסלול יקר יותר ממה שנראה.

**משתנה לא צמוד:**
ריבית שמשתנה כל כמה שנים. פחות נפוץ.

**הכלל הפשוט:** ריבית גבוהה + אין עמלה = פרע ראשון. ריבית נמוכה + יש עמלה גדולה = שמור לבסוף.
    `,
    quiz: [
      {
        q: 'באיזה מסלול בדרך כלל אין קנס פירעון מוקדם?',
        options: ['קל"צ', 'פריים', 'צמוד מדד', 'כולם יש קנס'],
        correct: 1,
        explanation: 'במסלול פריים בדרך כלל אין עמלת פירעון, מה שהופך אותו לעדיף לפירעון מוקדם.',
      },
      {
        q: 'מה הסכנה במסלול צמוד מדד בתקופת אינפלציה?',
        options: ['הריבית עולה', 'הקרן עולה עם המדד', 'הבנק יכול לסגור את ההלוואה', 'אין סכנה'],
        correct: 1,
        explanation: 'כשמדד המחירים עולה, גם הקרן שחייבים עולה — כך שמחזירים יותר ממה שלקחו.',
      },
    ],
  },
  {
    id: 2,
    icon: '🗺️',
    title: 'מיפוי המשכנתא שלך',
    subtitle: 'הכנס את המסלולים האמיתיים שלך',
    xp: 200,
    gold: 400,
    content: `
עכשיו הגיע הזמן למפות את המשכנתא **שלך** — לא תיאוריה, אלא המספרים האמיתיים.

**מה צריך:**
- חוזה משכנתא / דף פירוט מהבנק
- או כניסה לאינטרנט בנקאי → "פירוט הלוואות"

**מה מחפשים לכל מסלול:**
1. שם המסלול (פריים, קל"צ, וכו')
2. יתרת חוב נוכחית
3. ריבית שנתית
4. תשלום חודשי
5. מספר תשלומים שנותרו

**הסדר המומלץ לפירעון (שלך):**
פריים+1 קודם — ריבית 7% ואין עמלה. אחרי זה — בדיקת יתר המסלולים לפי עמלות ורווחיות.

ממלאים בטאב "קרב" → "מפות מסלולים" אחרי האקדמיה.
    `,
    quiz: [
      {
        q: 'איפה אפשר למצוא את פירוט המסלולים של המשכנתא?',
        options: ['רק במשרד הבנק פיזית', 'אינטרנט בנקאי / חוזה משכנתא', 'ברשות המסים', 'לא ניתן לדעת'],
        correct: 1,
        explanation: 'הכי נוח — כניסה לאינטרנט בנקאי ובחירת "פירוט הלוואות" או "משכנתאות".',
      },
      {
        q: 'איזה מסלול כדאי לפרוע ראשון במקרה שלך?',
        options: ['הכי ישן', 'קל"צ כי יציב', 'פריים עם ריבית גבוהה ואין עמלה', 'לא משנה הסדר'],
        correct: 2,
        explanation: 'ריבית גבוהה + אין קנס = יותר כסף נחסך בפירעון מוקדם. במקרה שלך — פריים+1 ב-7%.',
      },
    ],
  },
  {
    id: 3,
    icon: '💡',
    title: 'תכנון תקציב',
    subtitle: 'איך לשחרר כסף לפירעון',
    xp: 200,
    gold: 400,
    content: `
לפרוע משכנתא מוקדם — צריך כסף פנוי. כסף פנוי = הכנסה פחות הוצאות.

**כלל 50/30/20:**
- 50% — צרכים חיוניים (אוכל, חשבונות, שכירות/משכנתא)
- 30% — רצונות (בילוי, קניות)
- 20% — חיסכון והשקעות

**במקרה שלך (20,000 ₪ הכנסה):**
- הוצאות: ~8,000 ₪ (40%)
- עודף: ~12,000 ₪
- יעד: 7,000 ₪ לפירעון + 3,000 ₪ להשקעה + 2,000 ₪ גמישות

**שלושה כלים לשחרור כסף:**
1. **מעקב הוצאות** — אתה עושה את זה באפליקציה הזו
2. **תקרות קטגוריה** — לקבוע מקסימום לכל קטגוריה
3. **אוטומציה** — להפריש לחיסכון מיד ביום המשכורת

**קרן חירום קודמת לכל!** לפני פירעון מוקדם, כדאי שיהיו 30,000 ₪ נזילים בצד.
    `,
    quiz: [
      {
        q: 'בכלל 50/30/20, כמה אחוז הולך לחיסכון?',
        options: ['50%', '30%', '20%', '10%'],
        correct: 2,
        explanation: '20% לחיסכון והשקעות — זה הבסיס לבניית עושר לאורך זמן.',
      },
      {
        q: 'מה כדאי לעשות לפני שמתחילים בפירעון מוקדם?',
        options: ['להשקיע בביטקוין', 'לבנות קרן חירום של 30,000 ₪', 'לסגור את כל ההלוואות', 'לא צריך לעשות כלום'],
        correct: 1,
        explanation: 'קרן חירום של 3-6 חודשי הוצאות מגנה עליך מהפתעות בלי להכריח אותך לקחת הלוואה חדשה.',
      },
    ],
  },
  {
    id: 4,
    icon: '🏆',
    title: 'אסטרטגיית ניצחון',
    subtitle: 'תוכנית פעולה מלאה',
    xp: 300,
    gold: 600,
    content: `
סיימת את האקדמיה! עכשיו יש לך את כל הידע. הנה תוכנית הפעולה שלך:

**שלב 1 — קרן חירום (עכשיו):**
30,000 ₪ בפיקדון/חשבון חיסכון. לא לגעת אלא בחירום אמיתי.

**שלב 2 — פירעון פריים+1 (7-12 חודשים):**
7,000 ₪/חודש ישירות לפירעון מסלול הפריים. בתוך שנה תחסוך עשרות אלפי שקלים.

**שלב 3 — השקעה מקבילה:**
3,000 ₪/חודש לקרן מחקה S&P 500. גיוון — כי לא שמים הכל בנכס אחד.

**שלב 4 — בחינת עמלות (כל שנה):**
לבדוק אם כדאי לעשות מחזור משכנתא — אולי תנאים טובים יותר.

**שלב 5 — שמור על ה-streak:**
מעקב הוצאות יומי הוא מה שיגרום לך לראות כמה כסף "בורח" — ואז לפנות יותר לפירעון.

**אתה מוכן — צא לקרב!** 🗡️
    `,
    quiz: [
      {
        q: 'מה הסדר הנכון לפי התוכנית?',
        options: [
          'פירעון → קרן חירום → השקעה',
          'השקעה → קרן חירום → פירעון',
          'קרן חירום → פירעון → השקעה מקבילה',
          'לא משנה הסדר',
        ],
        correct: 2,
        explanation: 'קרן חירום תחילה מגנה עליך. אחר כך פירעון (חיסכון מובטח) + השקעה (גיוון).',
      },
      {
        q: 'למה חשוב לשמור על מעקב הוצאות יומי?',
        options: [
          'כדי לדווח למס הכנסה',
          'כדי לראות לאן הכסף הולך ולשחרר יותר לפירעון',
          'זה לא חשוב, רק הפקדות משנות',
          'כדי לקבל XP',
        ],
        correct: 1,
        explanation: 'מעקב יוצר מודעות — כשאתה רואה 800 ₪ על בילוי, אתה מחליט אחרת בחודש הבא.',
      },
    ],
  },
]

type LessonState = 'list' | 'lesson' | 'quiz'

export function AcademyScreen() {
  const { academyStep, completeAcademyStep, academyCompleted } = useGameStore()
  const [view, setView] = useState<LessonState>('list')
  const [activeLesson, setActiveLesson] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [lessonPage, setLessonPage] = useState(0) // 0=content, 1=quiz

  function openLesson(idx: number) {
    if (idx > academyStep) return
    setActiveLesson(idx)
    setView('lesson')
    setLessonPage(0)
    setQuizAnswers({})
    setQuizSubmitted(false)
  }

  function submitQuiz() {
    const lesson = LESSONS[activeLesson]
    const allCorrect = lesson.quiz.every((q, i) => quizAnswers[i] === q.correct)
    setQuizSubmitted(true)
    if (allCorrect && activeLesson === academyStep) {
      completeAcademyStep(activeLesson as 0 | 1 | 2 | 3 | 4)
    }
  }

  const lesson = LESSONS[activeLesson]
  const allAnswered = lesson ? lesson.quiz.every((_, i) => quizAnswers[i] !== undefined) : false
  const allCorrect = lesson && quizSubmitted
    ? lesson.quiz.every((q, i) => quizAnswers[i] === q.correct)
    : false

  if (view === 'lesson') {
    return (
      <div className="animate-[fadeIn_0.3s_ease]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setView('list')} className="text-2xl opacity-70 active:opacity-50">←</button>
          <div>
            <h2 className="text-base font-bold" style={{ color: '#fff' }}>{lesson.title}</h2>
            <p className="text-xs" style={{ color: '#b8a8d4' }}>שיעור {activeLesson + 1} מתוך 5</p>
          </div>
          <div className="mr-auto px-2.5 py-1 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(168,130,255,0.15)', color: '#a882ff' }}>
            +{lesson.xp} XP
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-2xl mb-4 overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.3)' }}>
          {['תוכן', 'מבחן'].map((t, i) => (
            <button key={t} onClick={() => setLessonPage(i)}
              className="flex-1 py-2.5 text-sm font-semibold transition-all"
              style={{
                background: lessonPage === i ? 'rgba(168,130,255,0.2)' : 'transparent',
                color: lessonPage === i ? '#d4b8ff' : '#6b5f7d',
              }}>
              {t}
            </button>
          ))}
        </div>

        {lessonPage === 0 ? (
          <LessonContent content={lesson.content} onNext={() => setLessonPage(1)} />
        ) : (
          <QuizView
            quiz={lesson.quiz}
            answers={quizAnswers}
            submitted={quizSubmitted}
            allCorrect={allCorrect}
            onAnswer={(qi, ai) => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: ai }))}
            onSubmit={submitQuiz}
            allAnswered={allAnswered}
            onBack={() => setView('list')}
          />
        )}
      </div>
    )
  }

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      {/* Banner */}
      <div className="rounded-2xl p-4 mb-4 text-center"
        style={{ background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)', boxShadow: '0 4px 20px rgba(196,69,105,0.3)' }}>
        <p className="text-base font-bold text-white">🎓 האקדמיה הפיננסית</p>
        <p className="text-sm text-white opacity-90">
          {academyCompleted ? 'סיימת את האקדמיה! 🏆' : `שיעור ${academyStep + 1}/5 — למד לפני שנלחם`}
        </p>
      </div>

      {/* Lessons list */}
      <div className="space-y-3">
        {LESSONS.map((l, i) => {
          const done = i < academyStep || academyCompleted
          const current = i === academyStep && !academyCompleted
          const locked = i > academyStep && !academyCompleted

          return (
            <button key={l.id} onClick={() => openLesson(i)}
              className="w-full text-right rounded-2xl p-4 transition-all active:scale-98"
              disabled={locked}
              style={{
                background: done
                  ? 'linear-gradient(135deg, rgba(29,158,117,0.15), rgba(45,31,63,0.8))'
                  : current
                  ? 'linear-gradient(135deg, rgba(45,31,63,0.8), rgba(61,41,80,0.8))'
                  : 'rgba(45,31,63,0.5)',
                border: done
                  ? '1px solid rgba(93,202,165,0.3)'
                  : current
                  ? '1px solid rgba(255,215,0,0.4)'
                  : '1px solid rgba(168,130,255,0.1)',
                opacity: locked ? 0.4 : 1,
                animation: current ? 'subtleGlow 3s ease-in-out infinite' : 'none',
              }}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    background: done ? 'rgba(93,202,165,0.15)'
                      : current ? 'rgba(255,215,0,0.15)'
                      : 'rgba(168,130,255,0.1)',
                  }}>
                  {done ? '✅' : locked ? '🔒' : l.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#fff' }}>{l.title}</p>
                  <p className="text-xs" style={{ color: '#b8a8d4' }}>{l.subtitle}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold"
                    style={{ color: done ? '#5dcaa5' : current ? '#ffd700' : '#6b5f7d' }}>
                    {done ? 'הושלם' : current ? 'נוכחי' : 'נעול'}
                  </div>
                  <div className="text-xs" style={{ color: '#6b5f7d' }}>+{l.xp} XP</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {academyCompleted && (
        <div className="mt-4 rounded-2xl p-4 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,170,0,0.05))', border: '1px solid rgba(255,215,0,0.3)' }}>
          <p className="text-2xl mb-1">🏆</p>
          <p className="font-bold" style={{ color: '#ffd700' }}>בוגר האקדמיה!</p>
          <p className="text-sm" style={{ color: '#b8a8d4' }}>כל המסכים נפתחו. צא לקרב!</p>
        </div>
      )}
    </div>
  )
}

function LessonContent({ content, onNext }: { content: string; onNext: () => void }) {
  const paragraphs = content.trim().split('\n\n')

  return (
    <div>
      <div className="rounded-2xl p-4 mb-4 space-y-3"
        style={{ background: 'rgba(26,21,37,0.8)', border: '1px solid rgba(168,130,255,0.1)' }}>
        {paragraphs.map((para, i) => {
          const isBold = para.startsWith('**') && para.includes(':**')
          const isHighlight = para.startsWith('**כלל') || para.startsWith('**שלושה') || para.startsWith('**שלב')

          if (isHighlight || isBold) {
            return (
              <div key={i} className="rounded-xl p-3"
                style={{ background: 'rgba(255,215,0,0.06)', borderRight: '3px solid #ffd700' }}>
                <p className="text-sm leading-relaxed" style={{ color: '#e8e3f0' }}
                  dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#d4b8ff">$1</strong>') }} />
              </div>
            )
          }
          return (
            <p key={i} className="text-sm leading-relaxed" style={{ color: '#e8e3f0' }}
              dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#d4b8ff">$1</strong>') }} />
          )
        })}
      </div>
      <button onClick={onNext}
        className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
        style={{ background: 'linear-gradient(135deg, #a882ff, #6b46c1)', color: '#fff', boxShadow: '0 4px 16px rgba(168,130,255,0.3)' }}>
        עבור למבחן ←
      </button>
    </div>
  )
}

function QuizView({ quiz, answers, submitted, allCorrect, onAnswer, onSubmit, allAnswered, onBack }: {
  quiz: typeof LESSONS[0]['quiz']
  answers: Record<number, number>
  submitted: boolean
  allCorrect: boolean
  onAnswer: (qi: number, ai: number) => void
  onSubmit: () => void
  allAnswered: boolean
  onBack: () => void
}) {
  return (
    <div className="space-y-4">
      {quiz.map((q, qi) => (
        <div key={qi} className="rounded-2xl p-4"
          style={{ background: 'rgba(45,31,63,0.6)', border: '1px solid rgba(168,130,255,0.1)' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: '#fff' }}>{q.q}</p>
          <div className="space-y-2">
            {q.options.map((opt, ai) => {
              const selected = answers[qi] === ai
              const isCorrect = ai === q.correct
              const isWrong = submitted && selected && !isCorrect
              const showCorrect = submitted && isCorrect

              return (
                <button key={ai} onClick={() => onAnswer(qi, ai)}
                  className="w-full text-right rounded-xl px-4 py-3 text-sm transition-all"
                  style={{
                    background: showCorrect ? 'rgba(93,202,165,0.2)' : isWrong ? 'rgba(255,107,107,0.15)' : selected ? 'rgba(168,130,255,0.2)' : 'rgba(168,130,255,0.06)',
                    border: showCorrect ? '1.5px solid #5dcaa5' : isWrong ? '1.5px solid #ff6b6b' : selected ? '1.5px solid #a882ff' : '1.5px solid rgba(168,130,255,0.15)',
                    color: showCorrect ? '#5dcaa5' : isWrong ? '#ff7a8c' : '#e8e3f0',
                  }}>
                  {opt}
                </button>
              )
            })}
          </div>

          {submitted && (
            <div className="mt-3 rounded-xl p-3 text-sm"
              style={{
                background: answers[qi] === q.correct ? 'rgba(93,202,165,0.1)' : 'rgba(255,107,107,0.08)',
                borderRight: `3px solid ${answers[qi] === q.correct ? '#5dcaa5' : '#ff6b6b'}`,
                color: answers[qi] === q.correct ? '#5dcaa5' : '#ffaa9a',
                paddingRight: '12px',
              }}>
              {answers[qi] === q.correct ? '✓ נכון! ' : '✗ לא נכון. '}
              {q.explanation}
            </div>
          )}
        </div>
      ))}

      {!submitted ? (
        <button onClick={onSubmit} disabled={!allAnswered}
          className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #ffd700, #ffaa00)', color: '#1a1525' }}>
          בדוק תשובות
        </button>
      ) : (
        <div className="space-y-3">
          <div className="rounded-2xl p-4 text-center"
            style={{ background: allCorrect ? 'rgba(93,202,165,0.1)' : 'rgba(255,107,107,0.08)', border: `1px solid ${allCorrect ? 'rgba(93,202,165,0.3)' : 'rgba(255,107,107,0.2)'}` }}>
            <p className="text-2xl mb-1">{allCorrect ? '🎉' : '😅'}</p>
            <p className="font-bold" style={{ color: allCorrect ? '#5dcaa5' : '#ff7a8c' }}>
              {allCorrect ? 'מצוין! שיעור הושלם!' : 'לא רע, נסה שוב'}
            </p>
          </div>
          <button onClick={onBack}
            className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={{ background: 'rgba(168,130,255,0.15)', color: '#d4b8ff', border: '1px solid rgba(168,130,255,0.3)' }}>
            חזור לרשימה
          </button>
        </div>
      )}
    </div>
  )
}
