import { useState, useRef } from 'react'
import { useGameStore, EXPENSE_CATEGORIES } from '../store/gameStore'

const QUICK_AMOUNTS = [50, 100, 200, 500]

export function ExpensesScreen() {
  const { expenses, addExpense, monthlyExpenses, monthlySavingsGoal, monthlyIncome, checkStreak, streakDays } = useGameStore()
  const [selectedCategory, setSelectedCategory] = useState(EXPENSE_CATEGORIES[0].id)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [recording, setRecording] = useState(false)
  const [view, setView] = useState<'add' | 'history'>('add')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  const cat = EXPENSE_CATEGORIES.find(c => c.id === selectedCategory)!
  const spentThisMonth = monthlyExpenses
  const budget = monthlyIncome - monthlySavingsGoal
  const budgetPct = Math.min(100, (spentThisMonth / budget) * 100)

  function startVoice() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('הדפדפן שלך לא תומך בקלט קולי'); return }
    const recognition = new SR()
    recognition.lang = 'he-IL'
    recognition.continuous = false
    recognition.interimResults = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript as string
      const num = text.match(/\d+/)?.[0]
      if (num) setAmount(num)
      setNote(text)
      setRecording(false)
    }
    recognition.onerror = () => setRecording(false)
    recognition.onend = () => setRecording(false)
    recognition.start()
    recognitionRef.current = recognition
    setRecording(true)
  }

  function stopVoice() {
    recognitionRef.current?.stop()
    setRecording(false)
  }

  function handleAdd() {
    if (!amount || Number(amount) <= 0) return
    addExpense({ category: selectedCategory, amount: Number(amount), note: note || cat.label })
    setAmount('')
    setNote('')
    checkStreak()
  }

  const recentExpenses = expenses.slice(0, 20)

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      {/* Header with toggle */}
      <div className="flex rounded-2xl mb-4 overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
        {['הוסף הוצאה', 'היסטוריה'].map((t, i) => (
          <button key={t} onClick={() => setView(i === 0 ? 'add' : 'history')}
            className="flex-1 py-2.5 text-sm font-semibold transition-all"
            style={{
              background: view === (i === 0 ? 'add' : 'history') ? 'rgba(168,130,255,0.2)' : 'transparent',
              color: view === (i === 0 ? 'add' : 'history') ? '#d4b8ff' : '#6b5f7d',
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Budget bar */}
      <div className="rounded-2xl p-4 mb-4"
        style={{ background: 'rgba(45,31,63,0.6)', border: '1px solid rgba(168,130,255,0.15)' }}>
        <div className="flex justify-between text-xs mb-2" style={{ color: '#b8a8d4' }}>
          <span>תקציב חודשי</span>
          <span style={{ color: budgetPct > 90 ? '#ff6b6b' : '#e8e3f0' }}>
            ₪{spentThisMonth.toLocaleString('he-IL')} / ₪{budget.toLocaleString('he-IL')}
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="h-full rounded-full transition-all"
            style={{
              width: budgetPct + '%',
              background: budgetPct > 90 ? 'linear-gradient(90deg, #ff6b6b, #ff4444)' : budgetPct > 70 ? 'linear-gradient(90deg, #ffaa00, #ff6b6b)' : 'linear-gradient(90deg, #5dcaa5, #1d9e75)',
            }} />
        </div>
        {streakDays > 0 && (
          <div className="mt-2 text-xs" style={{ color: '#ff6b9d' }}>
            🔥 {streakDays} ימים ברצף!
          </div>
        )}
      </div>

      {view === 'add' ? (
        <div className="space-y-4">
          {/* Category selector */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#b8a8d4' }}>קטגוריה</p>
            <div className="grid grid-cols-4 gap-2">
              {EXPENSE_CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setSelectedCategory(c.id)}
                  className="flex flex-col items-center gap-1 py-3 rounded-2xl transition-all active:scale-95"
                  style={{
                    background: selectedCategory === c.id ? `${c.color}20` : 'rgba(45,31,63,0.6)',
                    border: selectedCategory === c.id ? `1.5px solid ${c.color}` : '1.5px solid rgba(168,130,255,0.1)',
                  }}>
                  <span className="text-2xl leading-none">{c.icon}</span>
                  <span className="text-xs" style={{ color: selectedCategory === c.id ? c.color : '#6b5f7d' }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount input */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#b8a8d4' }}>סכום (₪)</p>
            <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{ background: 'rgba(45,31,63,0.8)', border: '1px solid rgba(168,130,255,0.25)' }}>
              <span className="text-lg font-bold" style={{ color: '#a882ff' }}>₪</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent outline-none text-2xl font-bold"
                style={{ color: '#fff', direction: 'ltr', textAlign: 'right', caretColor: '#a882ff' }}
                inputMode="numeric"
              />
              {/* Voice button */}
              <button onClick={recording ? stopVoice : startVoice}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
                style={{
                  background: recording ? 'rgba(255,107,157,0.3)' : 'rgba(168,130,255,0.15)',
                  border: recording ? '2px solid #ff6b9d' : '1px solid rgba(168,130,255,0.3)',
                  animation: recording ? 'pulse-glow 1s ease-in-out infinite' : 'none',
                }}>
                <span className="text-lg">{recording ? '⏹️' : '🎤'}</span>
              </button>
            </div>
            {recording && <p className="text-xs text-center mt-2" style={{ color: '#ff6b9d' }}>מקשיב... דבר בעברית 🎤</p>}
          </div>

          {/* Quick amounts */}
          <div className="flex gap-2">
            {QUICK_AMOUNTS.map(a => (
              <button key={a} onClick={() => setAmount(String(a))}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{ background: 'rgba(168,130,255,0.1)', color: '#d4b8ff', border: '1px solid rgba(168,130,255,0.2)' }}>
                ₪{a}
              </button>
            ))}
          </div>

          {/* Note */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#b8a8d4' }}>הערה (אופציונלי)</p>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="תיאור ההוצאה..."
              className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
              style={{
                background: 'rgba(45,31,63,0.8)',
                border: '1px solid rgba(168,130,255,0.15)',
                color: '#e8e3f0',
                caretColor: '#a882ff',
              }}
            />
          </div>

          {/* Submit */}
          <button onClick={handleAdd} disabled={!amount || Number(amount) <= 0}
            className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: amount ? `linear-gradient(135deg, ${cat.color}, ${cat.color}99)` : '#3d2950',
              color: '#fff',
              boxShadow: amount ? `0 4px 20px ${cat.color}40` : 'none',
            }}>
            {cat.icon} רשום הוצאה — ₪{amount || '0'}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {recentExpenses.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#6b5f7d' }}>
              <p className="text-4xl mb-3">📝</p>
              <p>אין הוצאות עדיין</p>
            </div>
          ) : (
            recentExpenses.map(exp => {
              const c = EXPENSE_CATEGORIES.find(c => c.id === exp.category)!
              return (
                <div key={exp.id} className="rounded-2xl px-4 py-3 flex items-center gap-3"
                  style={{ background: 'rgba(45,31,63,0.5)', border: '1px solid rgba(168,130,255,0.1)' }}>
                  <span className="text-2xl">{c?.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: '#fff' }}>{exp.note || c?.label}</p>
                    <p className="text-xs" style={{ color: '#6b5f7d' }}>
                      {new Date(exp.date).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                  <p className="font-bold" style={{ color: '#ff6b6b' }}>-₪{exp.amount.toLocaleString('he-IL')}</p>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
