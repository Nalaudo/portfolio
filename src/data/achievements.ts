import type { GameState } from '../game/store'
import type { Loc } from '../lib/i18n'

export interface Achievement {
  id: string
  title: Loc
  desc: Loc
  xp: number
  icon: 'flag' | 'compass' | 'map' | 'gamepad' | 'crown' | 'star' | 'lock' | 'zap' | 'terminal' | 'armchair' | 'shield' | 'mail' | 'footprints' | 'bolt'
  hidden?: boolean
  /** Si existe se evalúa solo tras cada cambio de estado; si no, se desbloquea a mano con game.unlock(id). */
  check?: (s: GameState) => boolean
}

export const TOTAL_STARS = 7
export const TOTAL_LEVELS = 5

export const achievements: Achievement[] = [
  { id: 'start', title: { es: 'Primer paso', en: 'First step', it: 'Primo passo' }, desc: { es: 'Apretaste START. Todo viaje arranca así.', en: 'You pressed START. Every journey begins like this.', it: 'Hai premuto START. Ogni viaggio comincia così.' }, xp: 10, icon: 'flag', check: (s) => s.started },
  { id: 'explorer', title: { es: 'Explorador', en: 'Explorer', it: 'Esploratore' }, desc: { es: 'Visitaste 3 mundos.', en: 'You visited 3 worlds.', it: 'Hai visitato 3 mondi.' }, xp: 40, icon: 'compass', check: (s) => s.visited.length >= 3 },
  { id: 'completionist', title: { es: 'Completista', en: 'Completionist', it: 'Completista' }, desc: { es: 'Visitaste los 5 mundos.', en: 'You visited all 5 worlds.', it: 'Hai visitato tutti e 5 i mondi.' }, xp: 80, icon: 'map', check: (s) => s.visited.length >= TOTAL_LEVELS },
  { id: 'player', title: { es: 'Jugador', en: 'Player', it: 'Giocatore' }, desc: { es: 'Probaste la demo de 3 mundos.', en: 'You tried the demo of 3 worlds.', it: 'Hai provato la demo di 3 mondi.' }, xp: 50, icon: 'gamepad', check: (s) => s.played.length >= 3 },
  { id: 'master', title: { es: 'Maestro', en: 'Master', it: 'Maestro' }, desc: { es: 'Completaste los desafíos de los 5 mundos.', en: 'You beat the challenges of all 5 worlds.', it: 'Hai superato le sfide di tutti e 5 i mondi.' }, xp: 150, icon: 'crown', check: (s) => s.done.length >= TOTAL_LEVELS },
  { id: 'treasure', title: { es: 'Cazatesoros', en: 'Treasure hunter', it: 'Cacciatore di tesori' }, desc: { es: 'Encontraste las 7 estrellas escondidas.', en: 'You found all 7 hidden stars.', it: 'Hai trovato tutte e 7 le stelle nascoste.' }, xp: 100, icon: 'star', check: (s) => s.coins.length >= TOTAL_STARS },
  { id: 'crypto', title: { es: 'Criptógrafo', en: 'Cryptographer', it: 'Crittografo' }, desc: { es: 'Cifraste y descifraste un secreto en Kontari.', en: 'You encrypted and decrypted a secret in Kontari.', it: 'Hai cifrato e decifrato un segreto in Kontari.' }, xp: 50, icon: 'lock' },
  { id: 'rush', title: { es: 'Productor estrella', en: 'Star broker', it: 'Broker stellare' }, desc: { es: 'Encadenaste 10 renovaciones seguidas en Renewal Rush.', en: 'You chained 10 renewals in a row in Renewal Rush.', it: 'Hai concatenato 10 rinnovi di fila in Renewal Rush.' }, xp: 50, icon: 'zap' },
  { id: 'carpenter', title: { es: 'Ebanista', en: 'Cabinetmaker', it: 'Ebanista' }, desc: { es: 'Explotaste una silla en mil piezas.', en: 'You blew a chair into a thousand pieces.', it: 'Hai fatto esplodere una sedia in mille pezzi.' }, xp: 30, icon: 'armchair' },
  { id: 'insured', title: { es: 'Bien asegurado', en: 'Well insured', it: 'Ben assicurato' }, desc: { es: 'Dejaste que el agente de Cotizari te contacte.', en: 'You let the Cotizari agent reach out to you.', it: 'Hai lasciato che l’agente di Cotizari ti contattasse.' }, xp: 30, icon: 'shield' },
  { id: 'walker', title: { es: 'Caminante', en: 'Wanderer', it: 'Viandante' }, desc: { es: 'Recorriste el mapa con el teclado.', en: 'You walked the map with the keyboard.', it: 'Hai percorso la mappa con la tastiera.' }, xp: 20, icon: 'footprints' },
  { id: 'hacker', title: { es: 'Consola abierta', en: 'Console open', it: 'Console aperta' }, desc: { es: 'Abriste el menú de comandos.', en: 'You opened the command menu.', it: 'Hai aperto il menu dei comandi.' }, xp: 20, icon: 'terminal' },
  { id: 'contact', title: { es: 'Player 2 listo', en: 'Player 2 ready', it: 'Player 2 pronto' }, desc: { es: 'Fuiste a la sala de contacto.', en: 'You reached the contact room.', it: 'Sei arrivato alla sala dei contatti.' }, xp: 40, icon: 'mail' },
  { id: 'konami', title: { es: '↑↑↓↓←→←→BA', en: '↑↑↓↓←→←→BA', it: '↑↑↓↓←→←→BA' }, desc: { es: 'Activaste el modo turbo. Bien ahí.', en: 'You turned on turbo mode. Nice one.', it: 'Hai attivato la modalità turbo. Grande.' }, xp: 100, icon: 'bolt', hidden: true },
]

export const achievementById = (id: string) => achievements.find((a) => a.id === id)
