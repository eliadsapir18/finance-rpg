import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { EnemySprite, ENEMY_INFO, type EnemyType } from '../components/EnemySprite'
import { TRACK_TYPE_INFO, ENEMY_FOR_TRACK, formatCurrency, formatMonths, calcMonthsToFreedom, type MortgageTrack, type TrackType } from '../lib/finance'

const QUICK_DEPOSITS = [1000, 3000, 5000, 7000]

export function BattleTabScreen() {
  const { tracks, setTracks, currentMortgage, initialMortgage, depositToMortgage, triggerBattle, totalDeposited } = useGameStore()
  const [view, setView] = useState<'battle' | 'map'>('battle')
  const [depositAmount, setDepositAmount] = useState('')
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)

  // Setup tracks view
  const [newTrack, setNewTrack] = useState({ type: 'prime' as TrackType, balance: '', rate: '', payment: '', months: '' })

  const progressPct = initialMortgage > 0 ? Math.min(100, (totalDeposited / initialMortgage) * 100) : 0
  const tower100 = Math.round(progressPct)

  function addTrack() {
    if (!newTrack.balance || !newTrack.rate) return
    const track: MortgageTrack = {
      id: Date.now().toString(),
      type: newTrack.type,
      name: TRACK_TYPE_INFO[newTrack.type].label,
      balance: Number(newTrack.balance),
      originalBalance: Number(newTrack.balance),
      interestRate: Number(newTrack.rate),
      monthlyPayment: Number(newTrack.payment) || 0,
      remainingMonths: Number(newTrack.months) || calcMonthsToFreedom(Number(newTrack.balance), Number(newTrack.payment), Number(newTrack.rate)),
      priority: tracks.length === 0 ? 1 : tracks.length === 1 ? 2 : 3,
    }
    setTracks([...tracks, track])
    setNewTrack({ type: 'prime', balance: '', rate: '', payment: '', months: '' })
  }

  function handleDeposit() {
    if (!depositAmount || !selectedTrack) return
    const amount = Number(depositAmount)
    if (amount <= 0) return
    depositToMortgage(selectedTrack, amount)
    triggerBattle(selectedTrack, amount)
    setDepositAmount('')
    setSelectedTrack(null)
  }

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      {/* Tab toggle */}
      <div className="flex rounded-2xl mb-4 overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
        {[{ id: 'battle', label: '⚔️ קרב' }, { id: 'map', label: '🗺️ מסלולים' }].map(t => (
          <button key={t.id} onClick={() => setView(t.id as 'battle' | 'map')}
            className="flex-1 py-2.5 text-sm font-semibold transition-all"
            style={{
              background: view === t.id ? 'rgba(168,130,255,0.2)' : 'transparent',
              color: view === t.id ? '#d4b8ff' : '#6b5f7d',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {view === 'battle' ? (
        <BattleView
          tracks={tracks}
          selectedTrack={selectedTrack}
          setSelectedTrack={setSelectedTrack}
          depositAmount={depositAmount}
          setDepositAmount={setDepositAmount}
          onDeposit={handleDeposit}
          tower100={tower100}
          currentMortgage={currentMortgage}
        />
      ) : (
        <MapView
          tracks={tracks}
          newTrack={newTrack}
          setNewTrack={setNewTrack}
          onAddTrack={addTrack}
        />
      )}
    </div>
  )
}

function BattleView({ tracks, selectedTrack, setSelectedTrack, depositAmount, setDepositAmount, onDeposit, tower100, currentMortgage }: {
  tracks: MortgageTrack[]
  selectedTrack: string | null
  setSelectedTrack: (id: string | null) => void
  depositAmount: string
  setDepositAmount: (v: string) => void
  onDeposit: () => void
  tower100: number
  currentMortgage: number
}) {
  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4">🗺️</p>
        <p className="font-bold mb-2" style={{ color: '#fff' }}>אין מפלצות עדיין!</p>
        <p className="text-sm mb-4" style={{ color: '#b8a8d4' }}>לחץ על "מסלולים" ומפה את המשכנתא שלך</p>
      </div>
    )
  }

  const sel = tracks.find(t => t.id === selectedTrack)
  const enemyType = sel ? ENEMY_FOR_TRACK[sel.type] as EnemyType : null

  return (
    <div className="space-y-4">
      {/* Tower visualization */}
      <div className="rounded-3xl p-4"
        style={{ background: 'linear-gradient(135deg, #2d1f3f, #1a1525)', border: '1px solid rgba(168,130,255,0.2)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold" style={{ color: '#d4b8ff' }}>🏰 מגדל החופש</p>
          <p className="text-sm font-bold" style={{ color: '#ffd700' }}>קומה {tower100}/100</p>
        </div>

        {/* Tower bar */}
        <div className="relative h-8 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="absolute inset-y-0 right-0 rounded-full transition-all duration-1000"
            style={{ width: tower100 + '%', background: 'linear-gradient(90deg, #a882ff, #ffd700)' }} />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: '#fff' }}>
            {formatCurrency(currentMortgage)} נותרו
          </div>
        </div>

        <p className="text-xs text-center" style={{ color: '#6b5f7d' }}>כל הפקדה = קומה נוספת למעלה</p>
      </div>

      {/* Monsters list */}
      <p className="text-xs font-semibold" style={{ color: '#b8a8d4' }}>המפלצות שלך — בחר להפקיד</p>

      <div className="space-y-3">
        {tracks.map(track => {
          const hp = track.originalBalance > 0 ? Math.max(0, Math.min(100, (track.balance / track.originalBalance) * 100)) : 0
          const isSelected = selectedTrack === track.id
          const enemy = ENEMY_FOR_TRACK[track.type] as EnemyType
          const monthsLeft = calcMonthsToFreedom(track.balance, track.monthlyPayment, track.interestRate)

          return (
            <button key={track.id} onClick={() => setSelectedTrack(isSelected ? null : track.id)}
              className="w-full text-right rounded-3xl p-4 transition-all active:scale-98"
              style={{
                background: isSelected ? 'rgba(168,130,255,0.15)' : 'rgba(45,31,63,0.6)',
                border: isSelected ? '2px solid #a882ff' : '1px solid rgba(168,130,255,0.15)',
                boxShadow: isSelected ? '0 0 20px rgba(168,130,255,0.2)' : 'none',
              }}>
              <div className="flex items-center gap-3">
                {/* Enemy mini */}
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
                  <EnemySprite type={enemy} size={50} hpPercent={hp} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold" style={{ color: '#fff' }}>{ENEMY_INFO[enemy].name}</p>
                    <p className="text-xs font-bold" style={{ color: '#ff6b6b' }}>
                      {track.interestRate}%
                    </p>
                  </div>
                  <p className="text-xs mb-2" style={{ color: '#b8a8d4' }}>
                    {formatCurrency(track.balance)} • {formatMonths(monthsLeft)}
                  </p>

                  {/* HP bar */}
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: hp + '%',
                        background: hp > 60 ? 'linear-gradient(90deg, #ff6b6b, #ff4444)' : hp > 30 ? 'linear-gradient(90deg, #ffaa00, #ff6b00)' : 'linear-gradient(90deg, #5dcaa5, #1d9e75)',
                      }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#6b5f7d' }}>{hp.toFixed(0)}% חיים</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Deposit section */}
      {selectedTrack && (
        <div className="rounded-3xl p-4 animate-[slideUp_0.3s_ease]"
          style={{ background: 'rgba(168,130,255,0.08)', border: '1px solid rgba(168,130,255,0.25)' }}>
          {enemyType && (
            <div className="flex justify-center mb-3">
              <EnemySprite type={enemyType} animate="idle" size={80} />
            </div>
          )}

          <p className="text-sm font-bold text-center mb-3" style={{ color: '#ffd700' }}>
            ⚔️ כמה להפקיד למסלול זה?
          </p>

          {/* Quick amounts */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {QUICK_DEPOSITS.map(a => (
              <button key={a} onClick={() => setDepositAmount(String(a))}
                className="py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{
                  background: depositAmount === String(a) ? 'rgba(255,215,0,0.2)' : 'rgba(168,130,255,0.1)',
                  color: depositAmount === String(a) ? '#ffd700' : '#d4b8ff',
                  border: depositAmount === String(a) ? '1px solid #ffd700' : '1px solid transparent',
                }}>
                ₪{a >= 1000 ? `${a / 1000}K` : a}
              </button>
            ))}
          </div>

          <div className="rounded-2xl px-4 py-3 flex items-center gap-2 mb-3"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(168,130,255,0.2)' }}>
            <span style={{ color: '#a882ff' }}>₪</span>
            <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)}
              placeholder="סכום מותאם אישית"
              className="flex-1 bg-transparent outline-none text-base"
              style={{ color: '#fff', direction: 'ltr', textAlign: 'right', caretColor: '#a882ff' }}
              inputMode="numeric" />
          </div>

          <button onClick={onDeposit} disabled={!depositAmount || Number(depositAmount) <= 0}
            className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
              color: '#1a1525',
              boxShadow: '0 4px 20px rgba(255,170,0,0.4)',
            }}>
            ⚔️ הפקד ותקיף! ₪{Number(depositAmount || 0).toLocaleString('he-IL')}
          </button>
        </div>
      )}
    </div>
  )
}

function MapView({ tracks, newTrack, setNewTrack, onAddTrack }: {
  tracks: MortgageTrack[]
  newTrack: { type: TrackType; balance: string; rate: string; payment: string; months: string }
  setNewTrack: (v: typeof newTrack) => void
  onAddTrack: () => void
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs" style={{ color: '#b8a8d4' }}>
        הכנס את פרטי המסלולים מחוזה המשכנתא שלך
      </p>

      {/* Existing tracks */}
      {tracks.map(t => (
        <div key={t.id} className="rounded-2xl p-4"
          style={{ background: 'rgba(45,31,63,0.6)', border: '1px solid rgba(168,130,255,0.15)' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold" style={{ color: '#fff' }}>{t.name}</p>
              <p className="text-sm" style={{ color: '#b8a8d4' }}>יתרה: {formatCurrency(t.balance)}</p>
              <p className="text-sm" style={{ color: '#b8a8d4' }}>ריבית: {t.interestRate}%</p>
            </div>
            <div className="px-3 py-1 rounded-xl text-xs font-bold"
              style={{ background: t.priority === 1 ? 'rgba(255,107,107,0.2)' : t.priority === 2 ? 'rgba(255,170,0,0.2)' : 'rgba(168,130,255,0.2)', color: t.priority === 1 ? '#ff7a8c' : t.priority === 2 ? '#ffaa00' : '#d4b8ff' }}>
              עדיפות {t.priority}
            </div>
          </div>
        </div>
      ))}

      {/* Add track form */}
      <div className="rounded-2xl p-4"
        style={{ background: 'rgba(26,21,37,0.8)', border: '1px solid rgba(168,130,255,0.2)' }}>
        <p className="text-sm font-bold mb-4" style={{ color: '#d4b8ff' }}>➕ הוסף מסלול</p>

        <div className="space-y-3">
          {/* Track type */}
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(TRACK_TYPE_INFO) as TrackType[]).map(type => (
              <button key={type} onClick={() => setNewTrack({ ...newTrack, type })}
                className="py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: newTrack.type === type ? 'rgba(168,130,255,0.2)' : 'rgba(168,130,255,0.05)',
                  border: newTrack.type === type ? '1.5px solid #a882ff' : '1.5px solid rgba(168,130,255,0.15)',
                  color: newTrack.type === type ? '#d4b8ff' : '#6b5f7d',
                }}>
                {TRACK_TYPE_INFO[type].icon} {TRACK_TYPE_INFO[type].label}
              </button>
            ))}
          </div>

          <MapField label="יתרת חוב (₪)" value={newTrack.balance}
            onChange={v => setNewTrack({ ...newTrack, balance: v })} placeholder="למשל: 400000" />
          <MapField label="ריבית שנתית (%)" value={newTrack.rate}
            onChange={v => setNewTrack({ ...newTrack, rate: v })} placeholder="למשל: 4.5" />
          <MapField label="תשלום חודשי (₪)" value={newTrack.payment}
            onChange={v => setNewTrack({ ...newTrack, payment: v })} placeholder="למשל: 2000" />

          <button onClick={onAddTrack} disabled={!newTrack.balance || !newTrack.rate}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #a882ff, #6b46c1)', color: '#fff' }}>
            הוסף מסלול
          </button>
        </div>
      </div>
    </div>
  )
}

function MapField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <p className="text-xs mb-1" style={{ color: '#b8a8d4' }}>{label}</p>
      <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(168,130,255,0.15)', color: '#e8e3f0', direction: 'ltr', textAlign: 'right', caretColor: '#a882ff' }}
        inputMode="numeric" />
    </div>
  )
}
