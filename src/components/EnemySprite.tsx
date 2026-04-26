export type EnemyType = 'fat_banker' | 'waste_goblin' | 'debt_demon' | 'mortgage_dragon' | 'interest_demon'

interface Props {
  type: EnemyType
  animate?: 'idle' | 'hit' | 'defeat'
  size?: number
  hpPercent?: number
}

function FatBanker({ animate: _animate }: { animate: string }) {
  return (
    <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="60" cy="155" rx="40" ry="6" fill="rgba(0,0,0,0.4)" />

      {/* Body — big round */}
      <ellipse cx="60" cy="105" rx="45" ry="50" fill="#2d4a1e" />
      {/* Suit details */}
      <ellipse cx="60" cy="105" rx="30" ry="40" fill="#1a2e12" />
      <rect x="52" y="70" width="16" height="50" fill="#f5f0e0" rx="4" />
      {/* Gold buttons */}
      {[85, 95, 105].map(y => <circle key={y} cx="60" cy={y} r="3" fill="#ffd700" />)}

      {/* Coin bag in hand */}
      <ellipse cx="95" cy="115" rx="14" ry="18" fill="#8B6914" />
      <text x="90" y="118" fontSize="14" fill="#ffd700" fontWeight="bold">₪</text>

      {/* Coins falling */}
      {[0, 1, 2].map(i => (
        <circle key={i} cx={88 + i * 6} cy={130 + i * 5}
          r="4" fill="#ffd700"
          className="animate-[coinExplode_2s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.3}s`, '--dx': `${-10 + i * 5}px`, '--dy': `${20}px` } as React.CSSProperties}
        />
      ))}

      {/* Arms */}
      <ellipse cx="18" cy="105" rx="14" ry="22" fill="#2d4a1e" />
      <ellipse cx="95" cy="100" rx="14" ry="22" fill="#2d4a1e" />

      {/* Neck */}
      <rect x="48" y="60" width="24" height="18" rx="8" fill="#3a5a2a" />

      {/* Head — chubby */}
      <ellipse cx="60" cy="48" rx="28" ry="26" fill="#8B7355" />

      {/* Top hat */}
      <rect x="34" y="24" width="52" height="8" rx="3" fill="#111" />
      <rect x="38" y="4" width="44" height="22" rx="4" fill="#111" />
      <rect x="38" y="24" width="44" height="4" rx="2" fill="#ffd700" />

      {/* Face */}
      {/* Eyes = $ signs */}
      <text x="44" y="52" fontSize="12" fill="#ffd700" fontWeight="bold">$</text>
      <text x="58" y="52" fontSize="12" fill="#ffd700" fontWeight="bold">$</text>
      {/* Mustache */}
      <path d="M46,62 Q52,66 60,62 Q68,66 74,62" stroke="#3d2000" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Cheeks */}
      <circle cx="38" cy="56" r="8" fill="#cc6644" opacity="0.4" />
      <circle cx="82" cy="56" r="8" fill="#cc6644" opacity="0.4" />
    </svg>
  )
}

function WasteGoblin({ animate: _animate }: { animate: string }) {
  return (
    <svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="135" rx="28" ry="5" fill="rgba(0,0,0,0.3)" />

      {/* Body */}
      <ellipse cx="50" cy="95" rx="24" ry="30" fill="#4a7a35" />

      {/* Long arms */}
      <path d="M26,85 Q10,95 15,115" stroke="#3a6a25" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M74,85 Q90,95 85,115" stroke="#3a6a25" strokeWidth="12" fill="none" strokeLinecap="round" />

      {/* Clawed hands with coins */}
      <g transform="translate(12, 112)">
        {[-4, 0, 4].map((x, i) => <line key={i} x1={x} y1="0" x2={x - 2} y2="8" stroke="#2a5a15" strokeWidth="2" strokeLinecap="round" />)}
        <circle cx="0" cy="14" r="5" fill="#ffd700" />
      </g>
      <g transform="translate(88, 112)">
        {[-4, 0, 4].map((x, i) => <line key={i} x1={x} y1="0" x2={x + 2} y2="8" stroke="#2a5a15" strokeWidth="2" strokeLinecap="round" />)}
        <circle cx="0" cy="14" r="5" fill="#ffd700" />
      </g>

      {/* Legs */}
      <rect x="38" y="118" width="10" height="18" rx="4" fill="#3a6a25" />
      <rect x="52" y="118" width="10" height="18" rx="4" fill="#3a6a25" />

      {/* Head */}
      <ellipse cx="50" cy="65" rx="24" ry="22" fill="#5a8a3a" />

      {/* Big ears */}
      <ellipse cx="28" cy="62" rx="10" ry="15" fill="#4a7a2a" />
      <ellipse cx="72" cy="62" rx="10" ry="15" fill="#4a7a2a" />
      <ellipse cx="28" cy="62" rx="6" ry="10" fill="#ff9999" opacity="0.5" />
      <ellipse cx="72" cy="62" rx="6" ry="10" fill="#ff9999" opacity="0.5" />

      {/* Eyes */}
      <ellipse cx="42" cy="62" rx="5" ry="6" fill="#ffaa00" />
      <ellipse cx="58" cy="62" rx="5" ry="6" fill="#ffaa00" />
      <circle cx="43" cy="63" r="3" fill="#2d1a00" />
      <circle cx="59" cy="63" r="3" fill="#2d1a00" />

      {/* Crooked smile with teeth */}
      <path d="M38,75 Q50,82 62,75" stroke="#2a5a15" strokeWidth="2" fill="none" />
      {[42, 48, 54].map(x => <rect key={x} x={x} y="74" width="4" height="6" rx="1" fill="#f0f0e0" />)}
    </svg>
  )
}

function DebtDemon({ animate: _animate }: { animate: string }) {
  return (
    <svg viewBox="0 0 110 160" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="55" cy="155" rx="32" ry="5" fill="rgba(0,0,0,0.4)" />

      {/* Wings */}
      <path d="M55,80 Q20,50 10,90 Q25,85 55,100" fill="#5a0000" opacity="0.8" />
      <path d="M55,80 Q90,50 100,90 Q85,85 55,100" fill="#5a0000" opacity="0.8" />

      {/* Body */}
      <ellipse cx="55" cy="110" rx="30" ry="40" fill="#8b0000" />

      {/* % symbol on chest */}
      <text x="42" y="118" fontSize="22" fill="#ff4444" fontWeight="900" opacity="0.9">%</text>

      {/* Muscular arms */}
      <ellipse cx="25" cy="100" rx="12" ry="25" fill="#7a0000" />
      <ellipse cx="85" cy="100" rx="12" ry="25" fill="#7a0000" />

      {/* Claws */}
      {[-4, 0, 4].map(x => <line key={x} x1={25 + x} y1="122" x2={25 + x - 2} y2="132" stroke="#5a0000" strokeWidth="2" strokeLinecap="round" />)}
      {[-4, 0, 4].map(x => <line key={x} x1={85 + x} y1="122" x2={85 + x + 2} y2="132" stroke="#5a0000" strokeWidth="2" strokeLinecap="round" />)}

      {/* Legs */}
      <rect x="40" y="143" width="12" height="16" rx="4" fill="#7a0000" />
      <rect x="58" y="143" width="12" height="16" rx="4" fill="#7a0000" />
      {/* Hooves */}
      <ellipse cx="46" cy="158" rx="8" ry="4" fill="#3a0000" />
      <ellipse cx="64" cy="158" rx="8" ry="4" fill="#3a0000" />

      {/* Neck */}
      <rect x="44" y="65" width="22" height="20" rx="6" fill="#8b0000" />

      {/* Head */}
      <ellipse cx="55" cy="50" rx="26" ry="24" fill="#aa2020" />

      {/* Horns */}
      <path d="M38,35 Q30,15 35,5 Q40,18 42,35" fill="#5a0000" />
      <path d="M72,35 Q80,15 75,5 Q70,18 68,35" fill="#5a0000" />

      {/* Glowing eyes */}
      <ellipse cx="45" cy="50" rx="6" ry="7" fill="#ff0000" />
      <ellipse cx="65" cy="50" rx="6" ry="7" fill="#ff0000" />
      <ellipse cx="45" cy="50" rx="3" ry="4" fill="#fff" opacity="0.8" />
      <ellipse cx="65" cy="50" rx="3" ry="4" fill="#fff" opacity="0.8" />
      {/* Fire from nostrils */}
      <ellipse cx="51" cy="62" rx="3" ry="2" fill="#ff6600" opacity="0.7" />
      <ellipse cx="59" cy="62" rx="3" ry="2" fill="#ff6600" opacity="0.7" />
    </svg>
  )
}

function MortgageDragon({ animate: _animate }: { animate: string }) {
  return (
    <svg viewBox="0 0 140 160" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="70" cy="155" rx="45" ry="7" fill="rgba(0,0,0,0.4)" />

      {/* Wings */}
      <path d="M70,60 Q20,20 5,60 Q30,55 70,80" fill="#7a2a10" opacity="0.85" />
      <path d="M70,60 Q120,20 135,60 Q110,55 70,80" fill="#7a2a10" opacity="0.85" />
      {/* Wing membrane lines */}
      <path d="M70,60 Q35,35 10,58" stroke="#5a1a00" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M70,60 Q105,35 130,58" stroke="#5a1a00" strokeWidth="1" fill="none" opacity="0.5" />

      {/* Long body / neck */}
      <path d="M70,80 Q85,95 80,130" stroke="#8b3a1a" strokeWidth="30" fill="none" strokeLinecap="round" />

      {/* Tail */}
      <path d="M80,130 Q100,145 110,155 Q95,148 90,155" stroke="#8b3a1a" strokeWidth="12" fill="none" strokeLinecap="round" />

      {/* Legs */}
      <ellipse cx="55" cy="130" rx="12" ry="18" fill="#7a2a10" />
      <ellipse cx="85" cy="130" rx="12" ry="18" fill="#7a2a10" />
      {/* Claws */}
      {[-4, 0, 4].map(x => <line key={x} x1={55 + x} y1="146" x2={55 + x - 2} y2="156" stroke="#5a1a00" strokeWidth="2" strokeLinecap="round" />)}
      {[-4, 0, 4].map(x => <line key={x} x1={85 + x} y1="146" x2={85 + x + 2} y2="156" stroke="#5a1a00" strokeWidth="2" strokeLinecap="round" />)}

      {/* Head */}
      <ellipse cx="70" cy="45" rx="28" ry="22" fill="#aa4422" />

      {/* Triangular head ridge */}
      <path d="M55,30 Q70,15 85,30 Q75,35 70,38 Q65,35 55,30" fill="#7a2a10" />

      {/* Eyes */}
      <ellipse cx="56" cy="42" rx="7" ry="8" fill="#ff8800" />
      <ellipse cx="84" cy="42" rx="7" ry="8" fill="#ff8800" />
      <ellipse cx="56" cy="43" rx="3" ry="5" fill="#2d0000" />
      <ellipse cx="84" cy="43" rx="3" ry="5" fill="#2d0000" />

      {/* Snout */}
      <ellipse cx="70" cy="58" rx="18" ry="12" fill="#8b3a1a" />
      {/* Nostrils */}
      <circle cx="63" cy="58" r="3" fill="#5a1a00" />
      <circle cx="77" cy="58" r="3" fill="#5a1a00" />

      {/* Fire breath */}
      <ellipse cx="70" cy="68" rx="10" ry="6" fill="#ff6600" opacity="0.6" />
      <ellipse cx="70" cy="74" rx="7" ry="5" fill="#ff4400" opacity="0.5" />
      <ellipse cx="70" cy="79" rx="5" ry="4" fill="#ffaa00" opacity="0.4" />

      {/* Scales pattern */}
      {[0, 1, 2].map(row =>
        [0, 1, 2, 3].map(col => (
          <ellipse key={`${row}-${col}`}
            cx={58 + col * 10} cy={85 + row * 12}
            rx="6" ry="4"
            fill="#7a2a10" stroke="#5a1a00" strokeWidth="0.5" opacity="0.7"
          />
        ))
      )}
    </svg>
  )
}

function InterestDemon({ animate: _animate }: { animate: string }) {
  return (
    <svg viewBox="0 0 140 175" xmlns="http://www.w3.org/2000/svg">
      {/* Boss — biggest, most impressive */}
      <ellipse cx="70" cy="170" rx="50" ry="7" fill="rgba(0,0,0,0.5)" />

      {/* Cape / robe */}
      <path d="M70,80 Q20,100 15,160 Q40,145 70,155 Q100,145 125,160 Q120,100 70,80" fill="#2d0050" />
      <path d="M70,80 Q35,100 30,155 Q50,140 70,150" fill="#1a0030" opacity="0.6" />

      {/* Body */}
      <ellipse cx="70" cy="115" rx="35" ry="45" fill="#4a0080" />

      {/* Large % on chest */}
      <text x="50" y="125" fontSize="30" fill="#aa00ff" fontWeight="900" opacity="0.95">%</text>

      {/* Wings */}
      <path d="M70,75 Q15,30 5,80 Q35,70 70,95" fill="#1a0040" opacity="0.9" />
      <path d="M70,75 Q125,30 135,80 Q105,70 70,95" fill="#1a0040" opacity="0.9" />
      {/* Wing bones */}
      {[0, 1, 2].map(i => (
        <path key={i} d={`M70,75 Q${20 + i * 10},${40 + i * 10} ${8 + i * 5},${70 + i * 4}`}
          stroke="#2d0050" strokeWidth="2" fill="none" opacity="0.6" />
      ))}

      {/* Scepter */}
      <line x1="100" y1="60" x2="110" y2="135" stroke="#4a1a70" strokeWidth="6" strokeLinecap="round" />
      <circle cx="100" cy="55" r="14" fill="#6600aa" />
      <circle cx="100" cy="55" r="9" fill="#aa00ff" />
      <circle cx="100" cy="55" r="4" fill="#fff" opacity="0.8" />

      {/* Arms */}
      <path d="M35,95 Q20,110 25,135" stroke="#4a0080" strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M105,95 Q120,110 108,130" stroke="#4a0080" strokeWidth="16" fill="none" strokeLinecap="round" />

      {/* Clawed hands */}
      {[-5, 0, 5].map(x => <line key={x} x1={25 + x} y1="132" x2={25 + x - 3} y2="144" stroke="#3a0060" strokeWidth="2.5" strokeLinecap="round" />)}
      {[-5, 0, 5].map(x => <line key={x} x1={108 + x} y1="128" x2={108 + x + 3} y2="140" stroke="#3a0060" strokeWidth="2.5" strokeLinecap="round" />)}

      {/* Legs */}
      <rect x="52" y="150" width="14" height="20" rx="6" fill="#4a0080" />
      <rect x="74" y="150" width="14" height="20" rx="6" fill="#4a0080" />

      {/* Crown */}
      <rect x="44" y="28" width="52" height="10" rx="4" fill="#ffd700" />
      {[48, 58, 70, 82, 92].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="28" x2={x} y2={i === 2 ? "10" : "16"} stroke="#ffd700" strokeWidth="4" strokeLinecap="round" />
          <circle cx={x} cy={i === 2 ? "8" : "14"} r={i === 2 ? "5" : "4"} fill={i === 2 ? "#ff4444" : "#ffd700"} />
        </g>
      ))}

      {/* Head */}
      <ellipse cx="70" cy="52" rx="30" ry="28" fill="#5a0090" />

      {/* Glowing red eyes */}
      <ellipse cx="57" cy="48" rx="8" ry="9" fill="#ff0000" />
      <ellipse cx="83" cy="48" rx="8" ry="9" fill="#ff0000" />
      <ellipse cx="57" cy="48" rx="4" ry="5" fill="#fff" opacity="0.9" />
      <ellipse cx="83" cy="48" rx="4" ry="5" fill="#fff" opacity="0.9" />
      {/* Eye glow */}
      <ellipse cx="57" cy="48" rx="10" ry="11" fill="#ff0000" opacity="0.2" />
      <ellipse cx="83" cy="48" rx="10" ry="11" fill="#ff0000" opacity="0.2" />

      {/* Horns — 3 of them */}
      <path d="M48,32 Q40,12 45,2 Q50,15 52,32" fill="#4a0070" />
      <path d="M92,32 Q100,12 95,2 Q90,15 88,32" fill="#4a0070" />
      <path d="M65,26 Q68,8 70,2 Q72,8 75,26" fill="#5a0090" />

      {/* Evil smile */}
      <path d="M54,65 Q70,74 86,65" stroke="#3a0060" strokeWidth="2.5" fill="none" />
      {[58, 66, 74, 82].map(x => <rect key={x} x={x} y="64" width="5" height="7" rx="1.5" fill="#f0f0f0" />)}
    </svg>
  )
}

export function EnemySprite({ type, animate = 'idle', size = 120, hpPercent = 100 }: Props) {
  const animClass = animate === 'hit'
    ? 'animate-[enemyHit_0.4s_ease]'
    : animate === 'defeat'
    ? 'animate-[enemyDefeat_1.2s_ease_forwards]'
    : type === 'interest_demon' ? 'animate-[idleFloat_3s_ease-in-out_infinite]'
    : 'animate-[breathe_4s_ease-in-out_infinite]'

  const Component = {
    fat_banker: FatBanker,
    waste_goblin: WasteGoblin,
    debt_demon: DebtDemon,
    mortgage_dragon: MortgageDragon,
    interest_demon: InterestDemon,
  }[type]

  const flashStyle = hpPercent < 25 ? { filter: 'brightness(1.3) saturate(1.5)' } : {}

  return (
    <div
      className={animClass}
      style={{
        width: size,
        height: size * 1.4,
        ...flashStyle,
      }}
    >
      <Component animate={animate} />
    </div>
  )
}

export const ENEMY_INFO: Record<EnemyType, { name: string; description: string }> = {
  fat_banker: { name: 'הבנקאי השמן', description: 'סמל הבזבוז וההרגלים הרעים' },
  waste_goblin: { name: 'שדון הבזבוז', description: 'גנב רגלי ההוצאות שלך' },
  debt_demon: { name: 'שד החובות', description: 'אויב ההתקדמות האישית' },
  mortgage_dragon: { name: 'דרקון המשכנתא', description: 'שומר המסלול הנוכחי' },
  interest_demon: { name: 'שד הריבית', description: 'הבוס הסופי — כל המשכנתא' },
}
