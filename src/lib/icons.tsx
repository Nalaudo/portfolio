import {
  Armchair,
  CalendarClock,
  Calculator,
  Compass,
  Crown,
  Flag,
  Footprints,
  Gamepad2,
  Lock,
  Mail,
  Map as MapIcon,
  Scale,
  ShieldCheck,
  Star,
  Terminal,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { LevelId } from '../data/projects'
import type { Achievement } from '../data/achievements'

export const levelIcon: Record<LevelId, LucideIcon> = {
  mehring: Armchair,
  sbestudio: CalendarClock,
  cotizari: Scale,
  polizari: ShieldCheck,
  kontari: Calculator,
}

export const achievementIcon: Record<Achievement['icon'], LucideIcon> = {
  flag: Flag,
  compass: Compass,
  map: MapIcon,
  gamepad: Gamepad2,
  crown: Crown,
  star: Star,
  lock: Lock,
  zap: Zap,
  terminal: Terminal,
  armchair: Armchair,
  shield: ShieldCheck,
  mail: Mail,
  footprints: Footprints,
  bolt: Zap,
}

/** Marca de GitHub (lucide v1 ya no incluye logos de marcas). */
export function GithubMark({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}
