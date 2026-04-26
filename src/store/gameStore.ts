import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MortgageTrack } from '../lib/finance'

export type Screen = 'setup' | 'academy' | 'battle' | 'expenses' | 'stats'
export type AcademyStep = 0 | 1 | 2 | 3 | 4

export interface Expense {
  id: string
  category: string
  amount: number
  note: string
  date: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  xp: number
  gold: number
}

export interface Toast {
  id: string
  type: 'xp' | 'gold' | 'achievement' | 'levelup' | 'damage'
  message: string
  value?: number
}

const LEVEL_XP = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000, 5000, 6200, 7600, 9200, 11000, 13200, 15600, 18400, 21600, 25000, 29000, 33600, 38800, 44700, 51300, 58700, 67000, 76200, 86500, 99999]

export function xpForLevel(level: number): number {
  return LEVEL_XP[Math.min(level, LEVEL_XP.length - 1)] ?? 99999
}

export function heroStage(level: number): number {
  if (level >= 30) return 8
  if (level >= 25) return 7
  if (level >= 20) return 6
  if (level >= 16) return 5
  if (level >= 12) return 4
  if (level >= 8) return 3
  if (level >= 5) return 2
  if (level >= 3) return 1
  return 0
}

export const HERO_TITLES = [
  'חניך כלכלי', 'שוליית האוצר', 'הרפתקן הזהב', 'אביר הכספים',
  'אדון התקציב', 'מאסטר ההשקעות', 'גיבור החיסכון', 'אלוף החופש', 'אגדה כלכלית'
]

const ACHIEVEMENTS_TEMPLATE: Achievement[] = [
  { id: 'first_deposit', title: 'הפקדה ראשונה', description: 'ביצעת את ההפקדה הראשונה למשכנתא', icon: '⚔️', xp: 50, gold: 100 },
  { id: 'first_expense', title: 'מעקב ראשון', description: 'רשמת הוצאה לראשונה', icon: '📝', xp: 25, gold: 50 },
  { id: 'academy_1', title: 'תלמיד חרוץ', description: 'סיימת את שיעור 1 באקדמיה', icon: '📚', xp: 100, gold: 200 },
  { id: 'academy_complete', title: 'בוגר האקדמיה', description: 'סיימת את כל 5 שיעורי האקדמיה', icon: '🎓', xp: 500, gold: 1000 },
  { id: 'level_5', title: 'הרפתקן', description: 'הגעת לרמה 5', icon: '⭐', xp: 200, gold: 400 },
  { id: 'level_10', title: 'לוחם מיומן', description: 'הגעת לרמה 10', icon: '🌟', xp: 400, gold: 800 },
  { id: 'level_20', title: 'גיבור', description: 'הגעת לרמה 20', icon: '💫', xp: 1000, gold: 2000 },
  { id: 'deposit_10k', title: 'עשרת אלפים', description: 'הפקדת ₪10,000 למשכנתא', icon: '💰', xp: 300, gold: 600 },
  { id: 'deposit_100k', title: 'מאה אלף מפואר', description: 'הפקדת ₪100,000 למשכנתא', icon: '🏆', xp: 2000, gold: 5000 },
  { id: 'streak_7', title: 'שבוע רצוף', description: '7 ימים ברצף עם רישום הוצאות', icon: '🔥', xp: 200, gold: 400 },
  { id: 'streak_30', title: 'חודש שלם', description: '30 ימים ברצף', icon: '💎', xp: 1000, gold: 2000 },
  { id: 'expenses_50', title: 'מאסטר מעקב', description: 'רשמת 50 הוצאות', icon: '📊', xp: 300, gold: 600 },
  { id: 'first_battle', title: 'קרב ראשון', description: 'לחמת בקרב ראשון', icon: '🗡️', xp: 150, gold: 300 },
  { id: 'enemy_defeated', title: 'שבר את הכבלים', description: 'ניצחת מסלול משכנתא', icon: '👑', xp: 1000, gold: 3000 },
  { id: 'save_1000', title: 'חיסכון ראשון', description: 'חסכת ₪1,000 בחודש', icon: '🌱', xp: 100, gold: 200 },
  { id: 'monthly_goal', title: 'עמדת ביעד', description: 'הגעת ליעד החודשי שלך', icon: '🎯', xp: 250, gold: 500 },
  { id: 'voice_input', title: 'קול הגיבור', description: 'השתמשת בקלט קולי', icon: '🎤', xp: 50, gold: 100 },
  { id: 'no_wasteful', title: 'ללא בזבוז', description: 'שבוע ללא הוצאות בידור מיותרות', icon: '🛡️', xp: 200, gold: 400 },
  { id: 'mortgage_mapped', title: 'מפת הקרב', description: 'מיפית את כל מסלולי המשכנתא', icon: '🗺️', xp: 300, gold: 600 },
  { id: 'freedom_50', title: 'חצי הדרך', description: 'פרעת 50% מהמשכנתא', icon: '🦋', xp: 5000, gold: 10000 },
]

export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'מזון', icon: '🛒', color: '#5dcaa5' },
  { id: 'transport', label: 'תחבורה', icon: '🚗', color: '#a882ff' },
  { id: 'dining', label: 'מסעדות', icon: '🍔', color: '#ff6b9d' },
  { id: 'entertainment', label: 'בידור', icon: '🎬', color: '#ffaa00' },
  { id: 'health', label: 'בריאות', icon: '💊', color: '#5dcaa5' },
  { id: 'clothing', label: 'ביגוד', icon: '👕', color: '#a882ff' },
  { id: 'home', label: 'בית', icon: '🏠', color: '#ff6b6b' },
  { id: 'education', label: 'חינוך', icon: '📚', color: '#ffd700' },
  { id: 'subscriptions', label: 'מנויים', icon: '📱', color: '#6b9eff' },
  { id: 'gifts', label: 'מתנות', icon: '🎁', color: '#ff6b9d' },
  { id: 'other', label: 'אחר', icon: '💳', color: '#b8a8d4' },
  { id: 'savings', label: 'חיסכון', icon: '💰', color: '#ffd700' },
]

interface GameState {
  // Setup
  isSetup: boolean
  heroName: string
  monthlyIncome: number
  monthlySavingsGoal: number

  // Progression
  level: number
  xp: number
  gold: number
  totalDeposited: number

  // Mortgage
  initialMortgage: number
  currentMortgage: number
  tracks: MortgageTrack[]
  academyStep: AcademyStep
  academyCompleted: boolean

  // Expenses
  expenses: Expense[]
  monthlyExpenses: number

  // Streak
  lastActiveDate: string
  streakDays: number

  // Achievements
  achievements: Achievement[]

  // UI
  currentScreen: Screen
  toasts: Toast[]
  pendingBattle: { trackId: string; depositAmount: number } | null

  // Actions
  setupHero: (name: string, mortgage: number, income: number, goal: number) => void
  setScreen: (screen: Screen) => void
  addXP: (amount: number) => void
  addGold: (amount: number) => void
  depositToMortgage: (trackId: string, amount: number) => void
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void
  setTracks: (tracks: MortgageTrack[]) => void
  completeAcademyStep: (step: AcademyStep) => void
  unlockAchievement: (id: string) => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  triggerBattle: (trackId: string, amount: number) => void
  clearBattle: () => void
  checkStreak: () => void
  reset: () => void
}

const initialState = {
  isSetup: false,
  heroName: '',
  monthlyIncome: 0,
  monthlySavingsGoal: 7000,
  level: 1,
  xp: 0,
  gold: 0,
  totalDeposited: 0,
  initialMortgage: 0,
  currentMortgage: 0,
  tracks: [],
  academyStep: 0 as AcademyStep,
  academyCompleted: false,
  expenses: [],
  monthlyExpenses: 0,
  lastActiveDate: '',
  streakDays: 0,
  achievements: ACHIEVEMENTS_TEMPLATE.map(a => ({ ...a })),
  currentScreen: 'setup' as Screen,
  toasts: [],
  pendingBattle: null,
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setupHero: (name, mortgage, income, goal) => {
        set({
          isSetup: true,
          heroName: name,
          initialMortgage: mortgage,
          currentMortgage: mortgage,
          monthlyIncome: income,
          monthlySavingsGoal: goal,
          currentScreen: 'academy',
        })
      },

      setScreen: (screen) => set({ currentScreen: screen }),

      addXP: (amount) => {
        const { level, xp } = get()
        let newXP = xp + amount
        let newLevel = level
        while (newXP >= xpForLevel(newLevel + 1) && newLevel < 30) {
          newXP -= xpForLevel(newLevel + 1) - xpForLevel(newLevel)
          newLevel++
          get().addToast({ type: 'levelup', message: `עלית לרמה ${newLevel}!` })
        }
        set({ xp: newXP, level: newLevel })
      },

      addGold: (amount) => set(s => ({ gold: s.gold + amount })),

      depositToMortgage: (trackId, amount) => {
        const { tracks, currentMortgage } = get()
        const track = tracks.find(t => t.id === trackId)
        if (!track) return

        const newBalance = Math.max(0, track.balance - amount)
        const newTracks = tracks.map(t =>
          t.id === trackId ? { ...t, balance: newBalance } : t
        )
        const newMortgage = Math.max(0, currentMortgage - amount)

        set(s => ({
          tracks: newTracks,
          currentMortgage: newMortgage,
          totalDeposited: s.totalDeposited + amount,
        }))

        get().addXP(Math.round(amount / 100))
        get().addGold(Math.round(amount / 50))
        get().addToast({ type: 'damage', message: `הכית את הדרקון!`, value: amount })
      },

      addExpense: (expense) => {
        const newExpense: Expense = {
          ...expense,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        }
        set(s => ({
          expenses: [newExpense, ...s.expenses],
          monthlyExpenses: s.monthlyExpenses + expense.amount,
        }))
        get().addXP(10)
        get().addGold(5)
        get().checkStreak()
      },

      setTracks: (tracks) => set({ tracks }),

      completeAcademyStep: (step) => {
        const nextStep = Math.min(step + 1, 4) as AcademyStep
        const completed = step >= 4
        set({ academyStep: nextStep, academyCompleted: completed })
        get().addXP(100 + step * 50)
        get().addGold(200 + step * 100)
        get().unlockAchievement(`academy_${step + 1}`)
        if (completed) get().unlockAchievement('academy_complete')
      },

      unlockAchievement: (id) => {
        const { achievements } = get()
        const ach = achievements.find(a => a.id === id)
        if (!ach || ach.unlockedAt) return
        const updated = achievements.map(a =>
          a.id === id ? { ...a, unlockedAt: new Date().toISOString() } : a
        )
        set({ achievements: updated })
        get().addToast({ type: 'achievement', message: ach.title })
      },

      addToast: (toast) => {
        const id = Date.now().toString() + Math.random()
        set(s => ({ toasts: [...s.toasts, { ...toast, id }] }))
        setTimeout(() => get().removeToast(id), 3000)
      },

      removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

      triggerBattle: (trackId, amount) => set({ pendingBattle: { trackId, depositAmount: amount } }),

      clearBattle: () => set({ pendingBattle: null }),

      checkStreak: () => {
        const today = new Date().toDateString()
        const { lastActiveDate, streakDays } = get()
        if (lastActiveDate === today) return
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        const newStreak = lastActiveDate === yesterday ? streakDays + 1 : 1
        set({ lastActiveDate: today, streakDays: newStreak })
        if (newStreak === 7) get().unlockAchievement('streak_7')
        if (newStreak === 30) get().unlockAchievement('streak_30')
      },

      reset: () => set({ ...initialState }),
    }),
    {
      name: 'finance-rpg-v1',
      partialize: (state) => ({
        isSetup: state.isSetup,
        heroName: state.heroName,
        monthlyIncome: state.monthlyIncome,
        monthlySavingsGoal: state.monthlySavingsGoal,
        level: state.level,
        xp: state.xp,
        gold: state.gold,
        totalDeposited: state.totalDeposited,
        initialMortgage: state.initialMortgage,
        currentMortgage: state.currentMortgage,
        tracks: state.tracks,
        academyStep: state.academyStep,
        academyCompleted: state.academyCompleted,
        expenses: state.expenses,
        monthlyExpenses: state.monthlyExpenses,
        lastActiveDate: state.lastActiveDate,
        streakDays: state.streakDays,
        achievements: state.achievements,
      }),
    }
  )
)
