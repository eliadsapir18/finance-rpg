import { useGameStore } from './store/gameStore'
import { SetupScreen } from './screens/SetupScreen'
import { MainLayout } from './screens/MainLayout'
import { ToastLayer } from './components/ToastLayer'
import { BattleOverlay } from './screens/BattleOverlay'

export default function App() {
  const isSetup = useGameStore(s => s.isSetup)
  const pendingBattle = useGameStore(s => s.pendingBattle)

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {!isSetup ? <SetupScreen /> : <MainLayout />}
      {pendingBattle && <BattleOverlay />}
      <ToastLayer />
    </div>
  )
}
