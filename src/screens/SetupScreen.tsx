import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { HeroSprite } from '../components/HeroSprite'

export function SetupScreen() {
  const setupHero = useGameStore(s => s.setupHero)
  const [name, setName] = useState('')
  const [mortgage, setMortgage] = useState('1000000')
  const [income, setIncome] = useState('20000')
  const [goal, setGoal] = useState('7000')
  const [step, setStep] = useState(0) // 0 = welcome, 1 = form

  function handleStart() {
    if (!name.trim()) return
    setupHero(name.trim(), Number(mortgage), Number(income), Number(goal))
  }

  if (step === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center"
        style={{ background: 'linear-gradient(180deg, #0d0818 0%, #1a1525 40%, #251935 100%)' }}>

        {/* Stars background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 60 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.6 + 0.2,
                animation: `sparkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: Math.random() * 3 + 's',
              }}
            />
          ))}
        </div>

        {/* Hero preview */}
        <div className="relative mb-6 animate-[float_3s_ease-in-out_infinite]">
          <div className="absolute inset-0 rounded-full blur-2xl opacity-40"
            style={{ background: 'radial-gradient(circle, #a882ff, transparent)' }} />
          <HeroSprite level={1} animate="idle" size={110} />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black mb-2 leading-tight"
          style={{ color: '#ffd700', textShadow: '0 0 30px rgba(255,215,0,0.5)' }}>
          מסע אל החופש
        </h1>
        <p className="text-base mb-1" style={{ color: '#b8a8d4' }}>RPG פיננסי — כבוש את המשכנתא שלך</p>
        <p className="text-sm mb-10" style={{ color: '#6b5f7d' }}>כל הפקדה = מכה בדרקון</p>

        {/* Stats teaser */}
        <div className="grid grid-cols-3 gap-3 w-full mb-10">
          {[
            { icon: '⚔️', label: 'קרבות', value: '100+' },
            { icon: '🏆', label: 'הישגים', value: '20' },
            { icon: '🐉', label: 'אויבים', value: '5' },
          ].map(item => (
            <div key={item.label} className="rounded-2xl p-3 text-center"
              style={{ background: 'rgba(168,130,255,0.08)', border: '1px solid rgba(168,130,255,0.15)' }}>
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-lg font-bold" style={{ color: '#ffd700' }}>{item.value}</div>
              <div className="text-xs" style={{ color: '#6b5f7d' }}>{item.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setStep(1)}
          className="w-full py-4 rounded-2xl text-lg font-bold transition-transform active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
            color: '#1a1525',
            boxShadow: '0 4px 24px rgba(255,170,0,0.5)',
          }}>
          התחל את המסע ⚔️
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto scroll-area px-5 py-8"
      style={{ background: 'linear-gradient(180deg, #0d0818 0%, #1a1525 100%)' }}>

      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => setStep(0)} className="text-2xl opacity-60">←</button>
        <h2 className="text-xl font-bold" style={{ color: '#e8e3f0' }}>יצירת דמות</h2>
      </div>

      {/* Hero preview small */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #a882ff, #6b46c1)', boxShadow: '0 4px 20px rgba(168,130,255,0.4)' }}>
            <HeroSprite level={1} animate="idle" size={70} />
          </div>
          <div className="absolute -bottom-1 -left-1 px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: '#ffd700', color: '#1a1525' }}>רמה 1</div>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <Field label="שם הגיבור שלך" icon="⚔️">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="הכנס שם..."
            className="w-full bg-transparent outline-none text-base"
            style={{ color: '#e8e3f0', caretColor: '#a882ff' }}
            maxLength={20}
          />
        </Field>

        <Field label="יתרת משכנתא (₪)" icon="🏠">
          <input
            type="number"
            value={mortgage}
            onChange={e => setMortgage(e.target.value)}
            className="w-full bg-transparent outline-none text-base"
            style={{ color: '#e8e3f0', caretColor: '#a882ff', direction: 'ltr', textAlign: 'right' }}
            inputMode="numeric"
          />
        </Field>

        <Field label="הכנסה חודשית משותפת (₪)" icon="💰">
          <input
            type="number"
            value={income}
            onChange={e => setIncome(e.target.value)}
            className="w-full bg-transparent outline-none text-base"
            style={{ color: '#e8e3f0', caretColor: '#a882ff', direction: 'ltr', textAlign: 'right' }}
            inputMode="numeric"
          />
        </Field>

        <Field label="יעד הפקדה חודשית (₪)" icon="🎯">
          <input
            type="number"
            value={goal}
            onChange={e => setGoal(e.target.value)}
            className="w-full bg-transparent outline-none text-base"
            style={{ color: '#e8e3f0', caretColor: '#a882ff', direction: 'ltr', textAlign: 'right' }}
            inputMode="numeric"
          />
        </Field>

        {/* Tip */}
        <div className="rounded-2xl p-4 text-sm"
          style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)', color: '#b8a8d4' }}>
          💡 <span style={{ color: '#ffd700' }}>טיפ:</span> תמיד כדאי לפרוע קודם את מסלול הפריים — ריבית גבוהה ואין עמלת פירעון!
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={!name.trim()}
        className="w-full py-4 rounded-2xl text-lg font-bold mt-6 transition-all active:scale-95 disabled:opacity-40"
        style={{
          background: name.trim() ? 'linear-gradient(135deg, #ffd700, #ffaa00)' : '#3d2950',
          color: name.trim() ? '#1a1525' : '#6b5f7d',
          boxShadow: name.trim() ? '0 4px 24px rgba(255,170,0,0.4)' : 'none',
        }}>
        צא למסע! ⚔️
      </button>
    </div>
  )
}

function Field({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold mb-2 block" style={{ color: '#b8a8d4' }}>
        {icon} {label}
      </label>
      <div className="rounded-2xl px-4 py-3.5"
        style={{ background: 'rgba(45,31,63,0.8)', border: '1px solid rgba(168,130,255,0.2)' }}>
        {children}
      </div>
    </div>
  )
}
