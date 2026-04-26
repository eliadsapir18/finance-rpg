import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { HeroSprite } from '../components/HeroSprite'
import { EnemySprite, ENEMY_INFO, type EnemyType } from '../components/EnemySprite'
import { ENEMY_FOR_TRACK } from '../lib/finance'

type Phase = 'intro' | 'hero_attack' | 'hit_pause' | 'enemy_hit' | 'slow_mo' | 'coins' | 'victory' | 'done'

const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  top: Math.random() * 70,
  left: Math.random() * 100,
  size: Math.random() * 2 + 1,
  opacity: Math.random() * 0.6 + 0.2,
  delay: Math.random() * 3,
}))

const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * 2 * Math.PI
  const dist = 60 + Math.random() * 80
  return {
    id: i,
    dx: Math.cos(angle) * dist,
    dy: Math.sin(angle) * dist - 30,
    size: 6 + Math.random() * 8,
    delay: Math.random() * 0.2,
    color: i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#ffaa00' : '#fff',
  }
})

export function BattleOverlay() {
  const { pendingBattle, tracks, level, clearBattle, heroName } = useGameStore()
  const [phase, setPhase] = useState<Phase>('intro')
  const [shaking, setShaking] = useState(false)
  const [slashVisible, setSlashVisible] = useState(false)
  const [showDamage, setShowDamage] = useState(false)
  const [showCoins, setShowCoins] = useState(false)
  const [slowMo, setSlowMo] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  const track = tracks.find(t => t.id === pendingBattle?.trackId)
  const depositAmount = pendingBattle?.depositAmount ?? 0
  const enemyType = track ? (ENEMY_FOR_TRACK[track.type] as EnemyType) : 'fat_banker'
  const enemyInfo = ENEMY_INFO[enemyType]
  const isBossKill = track && track.balance <= 0

  useEffect(() => {
    if (!pendingBattle) return
    const seq = async (delay: number, fn: () => void) =>
      new Promise<void>(res => setTimeout(() => { fn(); res() }, delay))

    ;(async () => {
      // Intro
      await seq(800, () => setPhase('hero_attack'))

      // Hero rushes
      await seq(400, () => {
        setPhase('hit_pause')
        setSlashVisible(true)
      })

      // Hit pause — freeze everything
      await seq(180, () => {
        setPhase('enemy_hit')
        setSlashVisible(false)
        setShaking(true)
        setTimeout(() => setShaking(false), 400)
      })

      // Boss kill = slow mo
      if (isBossKill) {
        await seq(200, () => { setPhase('slow_mo'); setSlowMo(true) })
        await seq(600, () => setSlowMo(false))
      }

      // Show damage number
      await seq(100, () => setShowDamage(true))

      // Coins explode
      await seq(500, () => { setShowCoins(true); setPhase('victory') })

      // Done
      await seq(2000, () => {
        setPhase('done')
        setTimeout(clearBattle, 400)
      })
    })()
  }, [pendingBattle])

  const heroAnim = phase === 'hero_attack' || phase === 'hit_pause' ? 'attack' : phase === 'victory' ? 'victory' : 'idle'
  const enemyAnim = phase === 'enemy_hit' || phase === 'slow_mo' || phase === 'coins' || phase === 'victory' ? 'hit' : 'idle'

  const stageStyle: React.CSSProperties = {
    transition: slowMo ? 'none' : undefined,
    animationDuration: slowMo ? '2s' : undefined,
  }

  return (
    <div className="battle-overlay flex items-center justify-center"
      style={{ background: '#000', zIndex: 2000 }}>
      <div ref={stageRef} className={`relative w-full max-w-xl h-full flex flex-col overflow-hidden ${shaking ? 'screen-shake' : ''}`}
        style={{ background: 'linear-gradient(180deg, #0d0818 0%, #1a0a2a 60%, #2a1008 100%)', ...stageStyle }}>

        {/* Stars */}
        {STARS.map(s => (
          <div key={s.id} className="absolute rounded-full bg-white pointer-events-none"
            style={{
              top: s.top + '%', left: s.left + '%',
              width: s.size, height: s.size,
              opacity: s.opacity,
              animation: `sparkle ${2 + s.delay}s ease-in-out infinite`,
              animationDelay: s.delay + 's',
            }} />
        ))}

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(42,16,8,0.8))' }} />

        {/* Battle banner */}
        <div className="absolute top-0 left-0 right-0 flex justify-center pt-6 z-10">
          <div className={`px-6 py-3 rounded-2xl font-bold text-base transition-all duration-500 ${phase !== 'intro' ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0'}`}
            style={{ background: 'linear-gradient(135deg, #ffd700, #ffaa00)', color: '#1a1525', boxShadow: '0 4px 20px rgba(255,170,0,0.5)' }}>
            {isBossKill ? '🏆 מסלול הושלם!' : `⚔️ הפקדת ₪${depositAmount.toLocaleString('he-IL')}`}
          </div>
        </div>

        {/* Skip button */}
        <button onClick={() => { setPhase('done'); setTimeout(clearBattle, 100) }}
          className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl text-xs"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
          דלג
        </button>

        {/* Fighters */}
        <div className="flex-1 flex items-end justify-between px-8 pb-24 relative">
          {/* Hero — right side (RTL) */}
          <div className="relative" style={{ transform: phase === 'hero_attack' || phase === 'hit_pause' ? 'translateX(-80px) scaleX(1.05)' : 'translateX(0)', transition: 'transform 0.3s ease' }}>
            <HeroSprite level={level} animate={heroAnim} size={130} />
            {/* Hero name tag */}
            <div className="absolute -top-6 right-0 left-0 flex justify-center">
              <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: 'rgba(168,130,255,0.2)', color: '#d4b8ff' }}>{heroName}</span>
            </div>
          </div>

          {/* Slash effect */}
          {slashVisible && (
            <div className="absolute"
              style={{
                top: '45%', left: '40%',
                width: 120, height: 6,
                background: 'linear-gradient(90deg, transparent, #fff, #ffd700, transparent)',
                boxShadow: '0 0 20px #ffd700, 0 0 40px #ffd700',
                borderRadius: 3,
                transform: 'rotate(-20deg)',
                animation: 'slashAnim 0.4s ease-out forwards',
              }} />
          )}

          {/* Damage number */}
          {showDamage && (
            <div className="absolute z-10"
              style={{
                top: '30%', right: '25%',
                fontSize: 36,
                fontWeight: 900,
                color: isBossKill ? '#ffd700' : '#ff6b6b',
                textShadow: `0 0 20px ${isBossKill ? '#ffd700' : '#ff0000'}`,
                animation: 'damageFloat 1.5s ease-out forwards',
              }}>
              -{depositAmount.toLocaleString('he-IL')}₪
            </div>
          )}

          {/* Coins explosion */}
          {showCoins && (
            <div className="absolute" style={{ top: '45%', right: '30%' }}>
              {PARTICLES.map(p => (
                <div key={p.id} className="absolute rounded-full"
                  style={{
                    width: p.size, height: p.size,
                    background: p.color,
                    boxShadow: `0 0 6px ${p.color}`,
                    '--dx': p.dx + 'px',
                    '--dy': p.dy + 'px',
                    animation: `coinExplode 1.2s ease-out ${p.delay}s forwards`,
                  } as React.CSSProperties} />
              ))}
            </div>
          )}

          {/* Enemy — left side */}
          <div className={`relative ${phase === 'victory' || phase === 'done' ? (isBossKill ? 'opacity-0' : '') : ''}`}
            style={{ transition: 'opacity 1s ease' }}>
            <EnemySprite type={enemyType} animate={enemyAnim} size={140} hpPercent={isBossKill ? 0 : 50} />
            {/* Enemy name tag */}
            <div className="absolute -top-6 right-0 left-0 flex justify-center">
              <span className="text-xs px-2 py-0.5 rounded-lg" style={{ background: 'rgba(255,107,107,0.2)', color: '#ff7a8c' }}>{enemyInfo.name}</span>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className={`absolute bottom-6 left-0 right-0 text-center px-6 transition-all duration-500 ${phase === 'victory' || phase === 'coins' ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-base font-bold" style={{ color: '#d4b8ff' }}>
            {isBossKill ? `🎉 ${enemyInfo.name} הובס! מסלול סגור!` : `💥 פגיעה! +${Math.round(depositAmount / 100)} XP`}
          </p>
          {isBossKill && (
            <p className="text-sm mt-1" style={{ color: '#ffd700' }}>כמה חודשים נחסכו! ⚔️</p>
          )}
        </div>

        {/* Victory flash */}
        {isBossKill && showCoins && (
          <div className="absolute inset-0 pointer-events-none animate-[fadeIn_0.1s_ease]"
            style={{ background: 'rgba(255,255,255,0.15)', animation: 'none', opacity: 0.3 }} />
        )}
      </div>
    </div>
  )
}
