import { useSyncExternalStore } from 'react'
import { achievementById, achievements } from '../data/achievements'
import { fx } from '../lib/fx'
import { setSoundEnabled, sfx } from './audio'

export type Persona = 'recruiter' | 'client' | 'dev'

export interface GameState {
  started: boolean
  sound: boolean
  turbo: boolean
  persona: Persona | null
  xp: number
  visited: string[]
  played: string[]
  done: string[]
  coins: string[]
  unlocked: string[]
  highScore: number
}

export interface Toast {
  id: number
  kind: 'achievement' | 'rank' | 'info'
  title: string
  text: string
  xp?: number
}

export const RANKS = [
  { min: 0, name: 'Novato' },
  { min: 100, name: 'Aprendiz' },
  { min: 300, name: 'Dev' },
  { min: 600, name: 'Senior' },
  { min: 1000, name: 'Arquitecto' },
  { min: 1500, name: 'Leyenda' },
]

export function rankFor(xp: number) {
  let i = 0
  RANKS.forEach((r, idx) => {
    if (xp >= r.min) i = idx
  })
  const cur = RANKS[i]
  const next = RANKS[i + 1]
  const progress = next ? (xp - cur.min) / (next.min - cur.min) : 1
  return { index: i, name: cur.name, next, progress, max: !next }
}

const KEY = 'nb-portfolio-v1'
const SESSION_KEY = 'nb-started'

const initial: GameState = {
  started: false,
  sound: false,
  turbo: false,
  persona: null,
  xp: 0,
  visited: [],
  played: [],
  done: [],
  coins: [],
  unlocked: [],
  highScore: 0,
}

function load(): GameState {
  const s = { ...initial }
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) Object.assign(s, JSON.parse(raw), { started: false, turbo: false })
  } catch {
    /* localStorage no disponible */
  }
  try {
    if (sessionStorage.getItem(SESSION_KEY) === '1' || location.hash.startsWith('#/nivel/')) s.started = true
  } catch {
    if (location.hash.startsWith('#/nivel/')) s.started = true
  }
  return s
}

let state: GameState = load()
setSoundEnabled(state.sound)
const listeners = new Set<() => void>()

function persist() {
  try {
    const { started: _s, turbo: _t, ...rest } = state
    void _s
    void _t
    localStorage.setItem(KEY, JSON.stringify(rest))
  } catch {
    /* noop */
  }
}

function set(patch: Partial<GameState>) {
  state = { ...state, ...patch }
  persist()
  listeners.forEach((l) => l())
}

// ---------- toasts ----------
let toasts: Toast[] = []
let toastId = 1
const toastListeners = new Set<() => void>()
function emitToasts() {
  toastListeners.forEach((l) => l())
}
export const toastStore = {
  push(t: Omit<Toast, 'id'>) {
    const id = toastId++
    toasts = [...toasts.slice(-2), { ...t, id }]
    emitToasts()
    setTimeout(() => toastStore.dismiss(id), 4800)
  },
  dismiss(id: number) {
    toasts = toasts.filter((t) => t.id !== id)
    emitToasts()
  },
}
export function useToasts() {
  return useSyncExternalStore(
    (l) => {
      toastListeners.add(l)
      return () => toastListeners.delete(l)
    },
    () => toasts,
    () => toasts,
  )
}

// ---------- logros ----------
function evaluate() {
  for (const a of achievements) {
    if (a.check && !state.unlocked.includes(a.id) && a.check(state)) game.unlock(a.id)
  }
}

export const game = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
  start() {
    if (state.started) return
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* noop */
    }
    set({ started: true })
    evaluate()
  },
  toggleSound() {
    const sound = !state.sound
    setSoundEnabled(sound)
    set({ sound })
    if (sound) sfx.click()
  },
  setSound(sound: boolean) {
    setSoundEnabled(sound)
    set({ sound })
  },
  setPersona(persona: Persona) {
    set({ persona })
  },
  toggleTurbo() {
    const turbo = !state.turbo
    document.documentElement.dataset.turbo = turbo ? '1' : '0'
    set({ turbo })
  },
  addXp(n: number) {
    if (n <= 0) return
    const before = rankFor(state.xp)
    set({ xp: state.xp + n })
    const after = rankFor(state.xp)
    if (after.index > before.index) {
      sfx.levelUp()
      fx.confetti()
      toastStore.push({ kind: 'rank', title: `Rango: ${after.name}`, text: '¡Subiste de nivel!' })
    }
    evaluate()
  },
  visit(id: string) {
    if (state.visited.includes(id)) return
    set({ visited: [...state.visited, id] })
    game.addXp(40)
  },
  play(id: string) {
    if (state.played.includes(id)) return
    set({ played: [...state.played, id] })
    game.addXp(60)
  },
  complete(id: string) {
    if (state.done.includes(id)) return
    set({ done: [...state.done, id] })
    sfx.success()
    fx.confetti()
    toastStore.push({ kind: 'info', title: '¡Nivel superado!', text: 'Completaste el desafío del mundo. +100 XP' })
    game.addXp(100)
  },
  collect(id: string) {
    if (state.coins.includes(id)) return false
    set({ coins: [...state.coins, id] })
    game.addXp(25)
    return true
  },
  unlock(id: string) {
    if (state.unlocked.includes(id)) return
    const a = achievementById(id)
    if (!a) return
    set({ unlocked: [...state.unlocked, id] })
    if (id !== 'start') {
      sfx.achievement()
      toastStore.push({ kind: 'achievement', title: a.title, text: a.desc, xp: a.xp })
    }
    game.addXp(a.xp)
  },
  setHigh(n: number) {
    if (n > state.highScore) set({ highScore: n })
  },
  reset() {
    try {
      localStorage.removeItem(KEY)
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      /* noop */
    }
    state = { ...initial, sound: state.sound }
    listeners.forEach((l) => l())
    location.hash = ''
    location.reload()
  },
}

export function useGame<T>(selector: (s: GameState) => T): T {
  return useSyncExternalStore(
    game.subscribe,
    () => selector(state),
    () => selector(state),
  )
}
