import { useGameStore, xpForLevel, heroStage, HERO_TITLES } from '../store/gameStore'
import { HeroSprite } from './HeroSprite'
import { formatCurrency } from '../lib/finance'

export function HeroCard() {
  const { heroName, level, xp, gold, currentMortgage, initialMortgage, monthlySavingsGoal, totalDeposited, streakDays } = useGameStore()

  const stage = heroStage(level)
  const xpNeeded = xpForLevel(level + 1) - xpForLevel(level)
  const xpProgress = xp
  const xpPct = Math.min(100, (xpProgress / xpNeeded) * 100)
  const mortgagePct = initialMortgage > 0 ? Math.min(100, (totalDeposited / initialMortgage) * 100) : 0
  const goalPct = Math.min(100, (totalDeposited % (monthlySavingsGoal || 1)) / (monthlySavingsGoal || 1) * 100)

  return (
    <div className="rounded-3xl p-4 mb-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #2d1f3f 0%, #3d2950 100%)',
        border: '1px solid rgba(168,130,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}>

      {/* BG glow */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #a882ff, transparent)', transform: 'translate(30%, -30%)' }} />

      {/* Top row */}
      <div className="flex items-center gap-3 relative z-10">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #a882ff, #6b46c1)', boxShadow: '0 4px 16px rgba(168,130,255,0.4)' }}>
            <HeroSprite level={level} animate="idle" size={56} />
          </div>
          {streakDays >= 3 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
              style={{ background: '#ff6b9d' }}>🔥</div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-base font-bold truncate" style={{ color: '#fff' }}>{heroName}</span>
            <div className="px-2.5 py-1 rounded-xl text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #ffd700, #ffaa00)', color: '#1a1525' }}>
              רמה {level}
            </div>
          </div>
          <p className="text-xs mb-2" style={{ color: '#b8a8d4' }}>{HERO_TITLES[stage]}</p>

          {/* XP bar */}
          <div>
            <div className="flex justify-between text-xs mb-1" style={{ color: '#b8a8d4' }}>
              <span>XP</span>
              <span>{xpProgress}/{xpNeeded}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: xpPct + '%', background: 'linear-gradient(90deg, #a882ff, #d4b8ff)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mt-3 relative z-10">
        <StatMini icon="🪙" label="זהב" value={gold.toLocaleString('he-IL')} color="#ffd700" />
        <StatMini icon="🏠" label="נותר" value={formatCurrency(currentMortgage)} color="#ff6b6b" small />
        <StatMini icon="🎯" label="יעד חודשי" value={`${Math.round(goalPct)}%`} color="#5dcaa5" />
      </div>

      {/* Mortgage progress bar */}
      {initialMortgage > 0 && (
        <div className="mt-3 relative z-10">
          <div className="flex justify-between text-xs mb-1" style={{ color: '#b8a8d4' }}>
            <span>התקדמות מסע</span>
            <span>{mortgagePct.toFixed(1)}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: mortgagePct + '%', background: 'linear-gradient(90deg, #5dcaa5, #1d9e75)' }} />
          </div>
        </div>
      )}
    </div>
  )
}

function StatMini({ icon, label, value, color, small }: { icon: string; label: string; value: string; color: string; small?: boolean }) {
  return (
    <div className="rounded-2xl p-2.5 text-center"
      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(168,130,255,0.08)' }}>
      <div className="text-sm mb-0.5">{icon}</div>
      <div className={`font-bold ${small ? 'text-xs' : 'text-sm'}`} style={{ color }}>{value}</div>
      <div className="text-xs" style={{ color: '#6b5f7d' }}>{label}</div>
    </div>
  )
}
