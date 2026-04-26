import { heroStage } from '../store/gameStore'

interface Props {
  level: number
  animate?: 'idle' | 'attack' | 'victory' | 'hit'
  size?: number
}

// SVG Hero characters for each of the 8 stages
function StageSprite({ stage, animate = 'idle' }: { stage: number; animate?: string }) {
  const animClass = animate === 'idle' ? 'animate-[breathe_3s_ease-in-out_infinite]'
    : animate === 'attack' ? 'animate-[heroAttack_0.6s_ease]'
    : animate === 'victory' ? 'animate-[float_1.5s_ease-in-out_infinite]'
    : ''

  const colors = [
    { body: '#c4956a', armor: '#8B5E3C', accent: '#6b4226', weapon: '#8B8B8B', glow: 'none' }, // Stage 0
    { body: '#c4956a', armor: '#5C4033', accent: '#8B5E3C', weapon: '#A0A0A0', glow: 'none' }, // Stage 1
    { body: '#c4956a', armor: '#4a6741', accent: '#ffd700', weapon: '#C0C0C0', glow: 'none' }, // Stage 2
    { body: '#c4956a', armor: '#607080', accent: '#A0B0C0', weapon: '#D0D0D0', glow: 'none' }, // Stage 3
    { body: '#c4956a', armor: '#7a3030', accent: '#cc0000', weapon: '#E0E0E0', glow: 'rgba(200,0,0,0.3)' }, // Stage 4
    { body: '#d4a574', armor: '#4a2060', accent: '#a882ff', weapon: '#F0F0FF', glow: 'rgba(168,130,255,0.4)' }, // Stage 5
    { body: '#d4a574', armor: '#806000', accent: '#ffd700', weapon: '#FFD700', glow: 'rgba(255,215,0,0.5)' }, // Stage 6
    { body: '#e8c090', armor: '#203060', accent: '#60a0ff', weapon: '#FFA040', glow: 'rgba(255,160,64,0.6)' }, // Stage 7
    { body: '#fff', armor: '#e0e0ff', accent: '#80c0ff', weapon: '#80FFFF', glow: 'rgba(128,200,255,0.8)' }, // Stage 8
  ][stage] ?? { body: '#c4956a', armor: '#8B5E3C', accent: '#6b4226', weapon: '#8B8B8B', glow: 'none' }

  return (
    <svg viewBox="0 0 100 160" xmlns="http://www.w3.org/2000/svg" className={animClass} style={{ filter: colors.glow !== 'none' ? `drop-shadow(0 0 8px ${colors.glow})` : undefined }}>
      {/* Glow effect for high stages */}
      {stage >= 5 && (
        <ellipse cx="50" cy="150" rx="30" ry="6" fill={colors.glow} opacity="0.5" />
      )}

      {/* Weapon (behind body for left-hand heroes) */}
      {stage === 0 ? (
        // Stick
        <line x1="72" y1="50" x2="85" y2="130" stroke={colors.weapon} strokeWidth="3" strokeLinecap="round" />
      ) : stage <= 2 ? (
        // Short sword
        <g transform="translate(65, 50) rotate(20)">
          <rect x="-2" y="0" width="4" height="50" rx="2" fill={colors.weapon} />
          <rect x="-7" y="15" width="14" height="4" rx="2" fill={colors.accent} />
          <polygon points="0,-8 -4,0 4,0" fill={colors.weapon} />
        </g>
      ) : stage <= 4 ? (
        // Long sword
        <g transform="translate(67, 35) rotate(15)">
          <rect x="-3" y="0" width="5" height="70" rx="2" fill={colors.weapon} />
          <rect x="-10" y="20" width="20" height="5" rx="2" fill={colors.accent} />
          <polygon points="0,-10 -5,0 5,0" fill={colors.weapon} />
          <ellipse cx="0" cy="75" rx="5" ry="7" fill={colors.armor} />
        </g>
      ) : stage <= 6 ? (
        // Great sword with glow
        <g transform="translate(68, 25) rotate(10)">
          <rect x="-4" y="0" width="7" height="85" rx="3" fill={colors.weapon} />
          <rect x="-12" y="25" width="24" height="6" rx="3" fill={colors.accent} />
          <polygon points="0,-12 -6,0 6,0" fill={colors.weapon} />
          <ellipse cx="0" cy="90" rx="7" ry="9" fill={colors.armor} />
          {stage >= 6 && <rect x="-2" y="0" width="3" height="85" rx="1" fill={colors.glow} opacity="0.6" />}
        </g>
      ) : (
        // Divine weapon with flames
        <g transform="translate(68, 20) rotate(5)">
          <rect x="-4" y="0" width="7" height="90" rx="3" fill={colors.weapon} />
          <rect x="-14" y="28" width="28" height="7" rx="3" fill={colors.accent} />
          <polygon points="0,-15 -7,0 7,0" fill={colors.weapon} />
          <rect x="-2" y="0" width="3" height="90" rx="1" fill={colors.glow} opacity="0.8" />
          {[0, 30, 60].map(y => (
            <ellipse key={y} cx="1" cy={y} rx="6" ry="10" fill={colors.glow} opacity="0.4" />
          ))}
        </g>
      )}

      {/* Legs */}
      <g>
        <rect x="35" y="110" width="12" height="35" rx="5" fill={stage >= 3 ? colors.armor : colors.body} />
        <rect x="53" y="110" width="12" height="35" rx="5" fill={stage >= 3 ? colors.armor : colors.body} />
        {/* Boots */}
        <rect x="33" y="137" width="16" height="8" rx="3" fill={stage >= 2 ? '#3a2a1a' : '#5a3a1a'} />
        <rect x="51" y="137" width="16" height="8" rx="3" fill={stage >= 2 ? '#3a2a1a' : '#5a3a1a'} />
      </g>

      {/* Body / Torso */}
      <rect x="30" y="72" width="40" height="42" rx="8" fill={colors.armor} />

      {/* Armor details */}
      {stage >= 2 && (
        <g>
          <line x1="50" y1="75" x2="50" y2="110" stroke={colors.accent} strokeWidth="2" opacity="0.6" />
          {stage >= 4 && (
            <>
              <line x1="35" y1="85" x2="65" y2="85" stroke={colors.accent} strokeWidth="1.5" opacity="0.5" />
              <line x1="35" y1="98" x2="65" y2="98" stroke={colors.accent} strokeWidth="1.5" opacity="0.5" />
            </>
          )}
        </g>
      )}

      {/* Chest emblem for high stages */}
      {stage >= 5 && (
        <polygon points="50,80 54,88 62,88 56,93 58,101 50,96 42,101 44,93 38,88 46,88"
          fill={colors.accent} opacity="0.9" />
      )}

      {/* Arms */}
      {/* Left arm (shield side) */}
      <rect x="16" y="74" width="14" height="30" rx="6" fill={stage >= 1 ? colors.armor : colors.body} />
      {/* Shield */}
      {stage >= 3 && (
        <ellipse cx="18" cy="95" rx="12" ry="16" fill={colors.armor} stroke={colors.accent} strokeWidth="2" />
      )}
      {stage >= 5 && (
        <polygon points="18,83 22,95 18,107 14,95" fill={colors.accent} opacity="0.7" />
      )}

      {/* Right arm (weapon side) */}
      <rect x="70" y="74" width="14" height="28" rx="6" fill={stage >= 1 ? colors.armor : colors.body} />

      {/* Neck */}
      <rect x="44" y="62" width="12" height="14" rx="4" fill={colors.body} />

      {/* Head */}
      <ellipse cx="50" cy="48" rx="18" ry="20" fill={colors.body} />

      {/* Helmet / Crown based on stage */}
      {stage === 0 && null}
      {stage === 1 && (
        // Simple cap
        <ellipse cx="50" cy="32" rx="16" ry="8" fill={colors.armor} />
      )}
      {stage >= 2 && stage <= 3 && (
        // Leather helm
        <g>
          <path d="M32,48 Q32,28 50,28 Q68,28 68,48" fill={colors.armor} />
          <rect x="32" y="46" width="36" height="5" rx="2" fill={colors.accent} />
        </g>
      )}
      {stage >= 4 && stage <= 5 && (
        // Iron helmet with visor
        <g>
          <path d="M30,50 Q30,26 50,26 Q70,26 70,50" fill={colors.armor} />
          <rect x="30" y="48" width="40" height="6" rx="2" fill={colors.accent} />
          <rect x="38" y="44" width="24" height="8" rx="2" fill={colors.armor} stroke={colors.accent} strokeWidth="1" />
        </g>
      )}
      {stage >= 6 && stage <= 7 && (
        // Royal crown
        <g>
          <path d="M32,50 Q32,27 50,27 Q68,27 68,50" fill={colors.armor} />
          <rect x="32" y="48" width="36" height="5" rx="2" fill={colors.accent} />
          {[36, 44, 50, 56, 64].map((x, i) => (
            <line key={i} x1={x} y1="48" x2={x + (i === 2 ? 0 : i < 2 ? -2 : 2)} y2={i === 2 ? "35" : "39"}
              stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />
          ))}
          <ellipse cx="50" cy="34" rx="3" ry="3" fill={colors.glow !== 'none' ? colors.glow : '#fff'} />
        </g>
      )}
      {stage === 8 && (
        // Divine halo
        <g>
          <ellipse cx="50" cy="30" rx="25" ry="8" fill="none" stroke={colors.accent} strokeWidth="3" opacity="0.8" />
          <ellipse cx="50" cy="30" rx="22" ry="6" fill="none" stroke={colors.glow !== 'none' ? colors.glow : '#80c0ff'} strokeWidth="1" opacity="0.6" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            return <circle key={i} cx={50 + 24 * Math.cos(rad)} cy={30 + 7 * Math.sin(rad)} r="2" fill={colors.accent} opacity="0.9" />
          })}
        </g>
      )}

      {/* Face */}
      <ellipse cx="44" cy="50" rx="3" ry="3.5" fill="#fff" />
      <ellipse cx="56" cy="50" rx="3" ry="3.5" fill="#fff" />
      <ellipse cx="44" cy="51" rx="1.5" ry="2" fill="#2d1a0a" />
      <ellipse cx="56" cy="51" rx="1.5" ry="2" fill="#2d1a0a" />
      {/* Mouth */}
      {animate === 'victory'
        ? <path d="M44,60 Q50,66 56,60" stroke="#5d3a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
        : <path d="M45,60 Q50,63 55,60" stroke="#5d3a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      }

      {/* Hair */}
      {stage < 2 && (
        <path d="M33,40 Q35,25 50,24 Q65,25 67,40" fill="#3d2000" />
      )}

      {/* Stage 8 — energy aura */}
      {stage === 8 && (
        <g opacity="0.3">
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            return (
              <ellipse key={i}
                cx={50 + 40 * Math.cos(rad)} cy={80 + 50 * Math.sin(rad)}
                rx="8" ry="15"
                fill={colors.accent}
                transform={`rotate(${angle}, ${50 + 40 * Math.cos(rad)}, ${80 + 50 * Math.sin(rad)})`}
              />
            )
          })}
        </g>
      )}
    </svg>
  )
}

export function HeroSprite({ level, animate = 'idle', size = 120 }: Props) {
  const stage = heroStage(level)
  return (
    <div style={{ width: size, height: size * 1.4 }}>
      <StageSprite stage={stage} animate={animate} />
    </div>
  )
}
