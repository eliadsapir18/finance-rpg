import { useGameStore, type Screen } from '../store/gameStore'
import { HeroCard } from '../components/HeroCard'
import { AcademyScreen } from './AcademyScreen'
import { BattleTabScreen } from './BattleTabScreen'
import { ExpensesScreen } from './ExpensesScreen'
import { StatsScreen } from './StatsScreen'

const TABS: { id: Screen; icon: string; label: string }[] = [
  { id: 'academy', icon: '📚', label: 'אקדמיה' },
  { id: 'battle', icon: '⚔️', label: 'קרב' },
  { id: 'expenses', icon: '📝', label: 'הוצאות' },
  { id: 'stats', icon: '📊', label: 'סטטס' },
]

export function MainLayout() {
  const currentScreen = useGameStore(s => s.currentScreen)
  const academyCompleted = useGameStore(s => s.academyCompleted)
  const setScreen = useGameStore(s => s.setScreen)
  const streakDays = useGameStore(s => s.streakDays)

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scroll-area pb-24"
        style={{ background: 'linear-gradient(180deg, #1a1525 0%, #251935 50%, #1a1525 100%)' }}>
        <div className="max-w-xl mx-auto px-4 pt-4">
          <HeroCard />
          {currentScreen === 'academy' && <AcademyScreen />}
          {currentScreen === 'battle' && <BattleTabScreen />}
          {currentScreen === 'expenses' && <ExpensesScreen />}
          {currentScreen === 'stats' && <StatsScreen />}
        </div>
      </div>

      {/* Tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex max-w-xl mx-auto inset-x-0"
        style={{
          background: 'rgba(26,21,37,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(168,130,255,0.15)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
        {TABS.map(tab => {
          const isLocked = !academyCompleted && tab.id !== 'academy'
          const isActive = currentScreen === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => !isLocked && setScreen(tab.id)}
              className="flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors relative"
              style={{ color: isLocked ? '#3d3550' : isActive ? '#d4b8ff' : '#6b5f7d' }}>
              <span className="text-2xl leading-none">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: '#a882ff' }} />
              )}
              {tab.id === 'expenses' && streakDays > 0 && (
                <div className="absolute top-1 right-2 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: '#ff6b9d', color: '#fff', fontSize: '9px' }}>
                  {streakDays}
                </div>
              )}
              {isLocked && (
                <div className="absolute top-2 right-3 text-xs opacity-50">🔒</div>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
