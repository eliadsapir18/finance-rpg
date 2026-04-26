import { useGameStore, HERO_TITLES, heroStage, xpForLevel } from '../store/gameStore'
import { HeroSprite } from '../components/HeroSprite'
import { formatCurrency, formatMonths, calcMonthsToFreedom } from '../lib/finance'

export function StatsScreen() {
  const { heroName, level, xp, gold, totalDeposited, initialMortgage, currentMortgage, tracks, expenses, streakDays, achievements, monthlySavingsGoal, monthlyIncome, reset } = useGameStore()

  const stage = heroStage(level)
  const xpNeeded = xpForLevel(level + 1) - xpForLevel(level)
  const xpPct = Math.min(100, (xp / xpNeeded) * 100)
  const mortgagePct = initialMortgage > 0 ? (totalDeposited / initialMortgage) * 100 : 0
  const unlockedAchievements = achievements.filter(a => a.unlockedAt)
  const monthsLeft = tracks.length > 0
    ? Math.max(...tracks.map(t => calcMonthsToFreedom(t.balance, t.monthlyPayment || monthlySavingsGoal / tracks.length, t.interestRate)))
    : 0

  // Monthly expense breakdown
  const categoryTotals: Record<string, number> = {}
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount
  })
  const topCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a).slice(0, 5)

  return (
    <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
      {/* Hero profile */}
      <div className="rounded-3xl p-5"
        style={{ background: 'linear-gradient(135deg, #2d1f3f, #3d2950)', border: '1px solid rgba(168,130,255,0.2)' }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #a882ff, #6b46c1)', boxShadow: '0 4px 20px rgba(168,130,255,0.4)' }}>
            <HeroSprite level={level} animate="victory" size={70} />
          </div>
          <div>
            <p className="text-lg font-black" style={{ color: '#fff' }}>{heroName}</p>
            <p className="text-sm" style={{ color: '#b8a8d4' }}>{HERO_TITLES[stage]}</p>
            <div className="flex gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(255,215,0,0.15)', color: '#ffd700' }}>
                רמה {level}
              </span>
              <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(255,107,157,0.15)', color: '#ff6b9d' }}>
                🔥 {streakDays} ימים
              </span>
            </div>
          </div>
        </div>

        {/* XP progress */}
        <div className="mb-1">
          <div className="flex justify-between text-xs mb-1" style={{ color: '#b8a8d4' }}>
            <span>XP לרמה {level + 1}</span>
            <span>{xp}/{xpNeeded}</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="h-full rounded-full" style={{ width: xpPct + '%', background: 'linear-gradient(90deg, #a882ff, #d4b8ff)' }} />
          </div>
        </div>
      </div>

      {/* Key numbers */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="💰" label="סה״כ הופקד" value={formatCurrency(totalDeposited)} color="#5dcaa5" />
        <StatCard icon="🪙" label="זהב" value={gold.toLocaleString('he-IL')} color="#ffd700" />
        <StatCard icon="🏠" label="נותר במשכנתא" value={formatCurrency(currentMortgage)} color="#ff6b6b" />
        <StatCard icon="⏱️" label="נותרו" value={formatMonths(monthsLeft)} color="#a882ff" small />
      </div>

      {/* Freedom progress */}
      {initialMortgage > 0 && (
        <div className="rounded-3xl p-4"
          style={{ background: 'rgba(45,31,63,0.6)', border: '1px solid rgba(93,202,165,0.2)' }}>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-bold" style={{ color: '#5dcaa5' }}>🗺️ מסע החופש</p>
            <p className="text-sm font-bold" style={{ color: '#5dcaa5' }}>{mortgagePct.toFixed(1)}%</p>
          </div>
          <div className="h-4 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="h-full rounded-full relative overflow-hidden transition-all"
              style={{ width: mortgagePct + '%', background: 'linear-gradient(90deg, #5dcaa5, #1d9e75)' }}>
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
            </div>
          </div>
          <p className="text-xs" style={{ color: '#6b5f7d' }}>
            {formatCurrency(totalDeposited)} מתוך {formatCurrency(initialMortgage)} — פרעת {mortgagePct.toFixed(1)}% מהמשכנתא
          </p>
        </div>
      )}

      {/* Achievements */}
      <div className="rounded-3xl p-4"
        style={{ background: 'rgba(45,31,63,0.6)', border: '1px solid rgba(168,130,255,0.15)' }}>
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-bold" style={{ color: '#d4b8ff' }}>🏆 הישגים</p>
          <p className="text-xs" style={{ color: '#6b5f7d' }}>{unlockedAchievements.length}/{achievements.length}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {achievements.slice(0, 8).map(ach => (
            <div key={ach.id} className="rounded-xl p-3 flex items-center gap-2"
              style={{
                background: ach.unlockedAt ? 'rgba(255,215,0,0.08)' : 'rgba(0,0,0,0.2)',
                border: ach.unlockedAt ? '1px solid rgba(255,215,0,0.2)' : '1px solid transparent',
                opacity: ach.unlockedAt ? 1 : 0.4,
              }}>
              <span className="text-xl">{ach.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: ach.unlockedAt ? '#ffd700' : '#6b5f7d' }}>{ach.title}</p>
                <p className="text-xs truncate" style={{ color: '#6b5f7d' }}>+{ach.xp} XP</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top expense categories */}
      {topCategories.length > 0 && (
        <div className="rounded-3xl p-4"
          style={{ background: 'rgba(45,31,63,0.6)', border: '1px solid rgba(168,130,255,0.15)' }}>
          <p className="text-sm font-bold mb-3" style={{ color: '#d4b8ff' }}>📊 הוצאות לפי קטגוריה</p>
          <div className="space-y-2">
            {topCategories.map(([cat, total]) => {
              const pct = (total / (monthlyIncome || 1)) * 100
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1" style={{ color: '#b8a8d4' }}>
                    <span>{cat}</span>
                    <span>{formatCurrency(total)} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="h-full rounded-full" style={{ width: Math.min(100, pct) + '%', background: 'linear-gradient(90deg, #a882ff, #6b46c1)' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div className="rounded-3xl p-4"
        style={{ background: 'rgba(255,107,107,0.05)', border: '1px solid rgba(255,107,107,0.15)' }}>
        <p className="text-xs font-semibold mb-3" style={{ color: '#ff6b6b' }}>⚠️ איזור סכנה</p>
        <button onClick={() => { if (confirm('בטוח? כל הנתונים יימחקו!')) reset() }}
          className="w-full py-3 rounded-xl text-sm font-semibold"
          style={{ background: 'rgba(255,107,107,0.1)', color: '#ff7a8c', border: '1px solid rgba(255,107,107,0.2)' }}>
          אפס את כל הנתונים
        </button>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, small }: { icon: string; label: string; value: string; color: string; small?: boolean }) {
  return (
    <div className="rounded-2xl p-4"
      style={{ background: 'rgba(45,31,63,0.6)', border: '1px solid rgba(168,130,255,0.1)' }}>
      <p className="text-xl mb-1">{icon}</p>
      <p className={`font-bold ${small ? 'text-sm' : 'text-base'}`} style={{ color }}>{value}</p>
      <p className="text-xs" style={{ color: '#6b5f7d' }}>{label}</p>
    </div>
  )
}
