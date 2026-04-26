import { useGameStore, type Toast } from '../store/gameStore'

export function ToastLayer() {
  const toasts = useGameStore(s => s.toasts)
  const removeToast = useGameStore(s => s.removeToast)

  return (
    <div className="fixed top-4 left-4 right-4 z-[3000] flex flex-col gap-2 pointer-events-none max-w-xl mx-auto">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const config = {
    xp: { bg: 'rgba(168,130,255,0.95)', icon: '⭐', color: '#fff' },
    gold: { bg: 'rgba(255,170,0,0.95)', icon: '🪙', color: '#1a1525' },
    achievement: { bg: 'rgba(255,215,0,0.95)', icon: '🏆', color: '#1a1525' },
    levelup: { bg: 'linear-gradient(135deg, #a882ff, #ffd700)', icon: '🌟', color: '#fff' },
    damage: { bg: 'rgba(93,202,165,0.95)', icon: '⚔️', color: '#fff' },
  }[toast.type]

  return (
    <div
      className="rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl pointer-events-auto"
      style={{
        background: config.bg,
        color: config.color,
        animation: 'toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onClick={onDismiss}
    >
      <span className="text-xl">{config.icon}</span>
      <span className="text-sm font-bold flex-1">{toast.message}</span>
      {toast.value !== undefined && (
        <span className="text-sm font-black">{toast.value > 0 ? `+${toast.value}` : toast.value}</span>
      )}
    </div>
  )
}
