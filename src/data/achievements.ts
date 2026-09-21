import type { GameState } from '../game/store'

export interface Achievement {
  id: string
  title: string
  desc: string
  xp: number
  icon: 'flag' | 'compass' | 'map' | 'gamepad' | 'crown' | 'star' | 'lock' | 'zap' | 'terminal' | 'armchair' | 'shield' | 'mail' | 'footprints' | 'bolt'
  hidden?: boolean
  /** Si existe se evalúa solo tras cada cambio de estado; si no, se desbloquea a mano con game.unlock(id). */
  check?: (s: GameState) => boolean
}

export const TOTAL_STARS = 7
export const TOTAL_LEVELS = 5

export const achievements: Achievement[] = [
  { id: 'start', title: 'Primer paso', desc: 'Apretaste START. Todo viaje arranca así.', xp: 10, icon: 'flag', check: (s) => s.started },
  { id: 'explorer', title: 'Explorador', desc: 'Visitaste 3 mundos.', xp: 40, icon: 'compass', check: (s) => s.visited.length >= 3 },
  { id: 'completionist', title: 'Completista', desc: 'Visitaste los 5 mundos.', xp: 80, icon: 'map', check: (s) => s.visited.length >= TOTAL_LEVELS },
  { id: 'player', title: 'Jugador', desc: 'Probaste la demo de 3 mundos.', xp: 50, icon: 'gamepad', check: (s) => s.played.length >= 3 },
  { id: 'master', title: 'Maestro', desc: 'Completaste los desafíos de los 5 mundos.', xp: 150, icon: 'crown', check: (s) => s.done.length >= TOTAL_LEVELS },
  { id: 'treasure', title: 'Cazatesoros', desc: 'Encontraste las 7 estrellas escondidas.', xp: 100, icon: 'star', check: (s) => s.coins.length >= TOTAL_STARS },
  { id: 'crypto', title: 'Criptógrafo', desc: 'Cifraste y descifraste un secreto en Kontari.', xp: 50, icon: 'lock' },
  { id: 'rush', title: 'Productor estrella', desc: 'Encadenaste 10 renovaciones seguidas en Renewal Rush.', xp: 50, icon: 'zap' },
  { id: 'carpenter', title: 'Ebanista', desc: 'Explotaste una silla en mil piezas.', xp: 30, icon: 'armchair' },
  { id: 'insured', title: 'Bien asegurado', desc: 'Dejaste que el agente de Cotizari te contacte.', xp: 30, icon: 'shield' },
  { id: 'walker', title: 'Caminante', desc: 'Recorriste el mapa con el teclado.', xp: 20, icon: 'footprints' },
  { id: 'hacker', title: 'Consola abierta', desc: 'Abriste el menú de comandos.', xp: 20, icon: 'terminal' },
  { id: 'contact', title: 'Player 2 listo', desc: 'Fuiste a la sala de contacto.', xp: 40, icon: 'mail' },
  { id: 'konami', title: '↑↑↓↓←→←→BA', desc: 'Activaste el modo turbo. Bien ahí.', xp: 100, icon: 'bolt', hidden: true },
]

export const achievementById = (id: string) => achievements.find((a) => a.id === id)
