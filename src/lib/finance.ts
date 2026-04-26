export type TrackType = 'prime' | 'fixed' | 'indexed' | 'variable'

export interface MortgageTrack {
  id: string
  type: TrackType
  name: string
  balance: number
  originalBalance: number
  interestRate: number
  monthlyPayment: number
  remainingMonths: number
  priority: 1 | 2 | 3
}

export const TRACK_TYPE_INFO: Record<TrackType, { label: string; description: string; icon: string }> = {
  prime: { label: 'פריים', description: 'ריבית משתנה צמודה לפריים הבנק', icon: '🔥' },
  fixed: { label: 'קל"צ', description: 'קבועה לא צמודה — יציבה ובטוחה', icon: '🛡️' },
  indexed: { label: 'צמוד מדד', description: 'צמוד למדד המחירים לצרכן', icon: '📈' },
  variable: { label: 'משתנה', description: 'ריבית משתנה לא צמודה', icon: '🌊' },
}

export const ENEMY_FOR_TRACK: Record<TrackType, string> = {
  prime: 'interest_demon',
  fixed: 'debt_demon',
  indexed: 'fat_banker',
  variable: 'mortgage_dragon',
}

export function calcMonthsToFreedom(
  balance: number,
  monthlyPayment: number,
  annualRate: number
): number {
  if (monthlyPayment <= 0 || balance <= 0) return 9999
  const r = annualRate / 100 / 12
  if (r === 0) return Math.ceil(balance / monthlyPayment)
  return Math.ceil(
    Math.log(monthlyPayment / (monthlyPayment - r * balance)) / Math.log(1 + r)
  )
}

export function calcTotalInterest(
  balance: number,
  monthlyPayment: number,
  annualRate: number
): number {
  const months = calcMonthsToFreedom(balance, monthlyPayment, annualRate)
  return Math.max(0, monthlyPayment * months - balance)
}

export function calcNewBalance(
  balance: number,
  payment: number,
  annualRate: number
): number {
  const r = annualRate / 100 / 12
  const interest = balance * r
  const principal = Math.max(0, payment - interest)
  return Math.max(0, balance - principal)
}

export function formatCurrency(amount: number): string {
  return '₪' + Math.round(amount).toLocaleString('he-IL')
}

export function formatMonths(months: number): string {
  if (months >= 9999) return 'לנצח'
  const years = Math.floor(months / 12)
  const m = months % 12
  if (years === 0) return `${m} חודשים`
  if (m === 0) return `${years} שנים`
  return `${years} שנים ו-${m} חודשים`
}
