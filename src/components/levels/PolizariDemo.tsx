import { useCallback, useEffect, useReducer, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bike, Car, HeartPulse, House, Play, RotateCcw, Store, Timer, Trophy, type LucideIcon } from 'lucide-react'
import { game, useGame } from '../../game/store'
import { sfx } from '../../game/audio'
import { fx } from '../../lib/fx'
import { Kbd } from '../ui/bits'
import { useT, type Loc, type T } from '../../lib/i18n'

interface Ramo {
  k: string
  label: Loc
  Icon: LucideIcon
  color: string
}
const RAMOS: Ramo[] = [
  { k: 'auto', label: { es: 'Auto', en: 'Car', it: 'Auto' }, Icon: Car, color: '#22d3ee' },
  { k: 'hogar', label: { es: 'Hogar', en: 'Home', it: 'Casa' }, Icon: House, color: '#4ade80' },
  { k: 'vida', label: { es: 'Vida', en: 'Life', it: 'Vita' }, Icon: HeartPulse, color: '#ff5c8a' },
  { k: 'moto', label: { es: 'Moto', en: 'Moto', it: 'Moto' }, Icon: Bike, color: '#ffb547' },
  { k: 'comercio', label: { es: 'Comercio', en: 'Business', it: 'Commercio' }, Icon: Store, color: '#c084fc' },
]
const CLIENTS = ['M. Fernández', 'L. Acosta', 'Panadería Sol', 'R. Ibarra', 'Taller Ruiz', 'C. Domínguez', 'Estudio Vega', 'N. Paz', 'Ferretería Norte', 'J. Molina', 'Kiosco 24', 'A. Sosa', 'Óptica Luz', 'D. Romero']
const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3']
const DURATION = 30000
const GOAL_RENEWED = 15

interface Card {
  id: number
  slot: number
  ramo: Ramo
  client: string
  amount: number
  born: number
  ttl: number
  gold: boolean
}

interface G {
  phase: 'idle' | 'playing' | 'over'
  start: number
  cards: Card[]
  nextSpawn: number
  nextId: number
  score: number
  streak: number
  best: number
  renewed: number
  lost: number
  byRamo: Record<string, number>
}

const fresh = (): G => ({ phase: 'idle', start: 0, cards: [], nextSpawn: 0, nextId: 1, score: 0, streak: 0, best: 0, renewed: 0, lost: 0, byRamo: {} })
const mult = (streak: number) => Math.min(5, 1 + Math.floor(streak / 3))
const money = (n: number, locale: string) => `$ ${n.toLocaleString(locale)}`
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function title(score: number, t: T) {
  if (score < 20000) return t('Aprendiz de productor', 'Apprentice agent', 'Apprendista agente')
  if (score < 50000) return t('Productor', 'Agent', 'Agente')
  if (score < 90000) return t('Productor estrella', 'Star agent', 'Agente stellare')
  return t('Leyenda de la cartera', 'Book-of-business legend', 'Leggenda del portafoglio')
}

export function PolizariDemo() {
  const g = useRef<G>(fresh())
  const [, force] = useReducer((x: number) => x + 1, 0)
  const high = useGame((s) => s.highScore)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const t = useT()
  // Las callbacks del loop leen el traductor vigente sin tener que recrearse.
  const tRef = useRef(t)
  tRef.current = t

  const stop = () => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
  }

  const finish = useCallback(() => {
    stop()
    g.current.phase = 'over'
    g.current.cards = []
    game.setHigh(g.current.score)
    sfx.success()
    if (g.current.score > 30000) fx.confetti()
    force()
  }, [])

  const tick = useCallback(() => {
    const s = g.current
    const now = performance.now()
    if (now - s.start >= DURATION) return finish()
    const f = (now - s.start) / DURATION
    // vencidas
    const alive: Card[] = []
    for (const c of s.cards) {
      if (now - c.born >= c.ttl) {
        s.lost++
        s.streak = 0
        const el = document.querySelector(`[data-slot="${c.slot}"]`)
        if (el) {
          const r = el.getBoundingClientRect()
          fx.floatText(r.left + r.width / 2, r.top + r.height / 2, tRef.current('Vencida', 'Expired', 'Scaduta'), '#ff5c8a')
        }
        sfx.error()
      } else alive.push(c)
    }
    s.cards = alive
    // altas
    if (now >= s.nextSpawn && s.cards.length < 6) {
      const used = new Set(s.cards.map((c) => c.slot))
      const free = Array.from({ length: 9 }, (_, i) => i).filter((i) => !used.has(i))
      if (free.length) {
        const gold = Math.random() < 0.1
        const base = lerp(3400, 1750, f) * (0.85 + Math.random() * 0.35)
        s.cards.push({
          id: s.nextId++,
          slot: free[(Math.random() * free.length) | 0],
          ramo: RAMOS[(Math.random() * RAMOS.length) | 0],
          client: CLIENTS[(Math.random() * CLIENTS.length) | 0],
          amount: Math.round((800 + Math.random() * 2600) / 50) * 50 * (gold ? 3 : 1),
          born: now,
          ttl: gold ? base * 0.8 : base,
          gold,
        })
        sfx.pop()
      }
      s.nextSpawn = now + lerp(900, 430, f) * (0.8 + Math.random() * 0.4)
    }
    force()
  }, [finish])

  const startGame = () => {
    stop()
    g.current = { ...fresh(), phase: 'playing', start: performance.now() }
    g.current.nextSpawn = performance.now() + 250
    game.play('polizari')
    sfx.click()
    timer.current = setInterval(tick, 60)
    force()
  }

  const renew = useCallback((id: number, target?: Element | null) => {
    const s = g.current
    if (s.phase !== 'playing') return
    const c = s.cards.find((x) => x.id === id)
    if (!c) return
    const gain = c.amount * mult(s.streak)
    s.cards = s.cards.filter((x) => x.id !== id)
    s.score += gain
    s.streak++
    s.best = Math.max(s.best, s.streak)
    s.renewed++
    s.byRamo[c.ramo.k] = (s.byRamo[c.ramo.k] ?? 0) + gain
    const el = target ?? document.querySelector(`[data-slot="${c.slot}"]`)
    if (el) {
      const r = el.getBoundingClientRect()
      const x = r.left + r.width / 2
      const y = r.top + r.height / 2
      fx.floatText(x, y, `+${money(gain, tRef.current.locale)}`, c.gold ? '#ffb547' : c.ramo.color)
      fx.burst(x, y, { colors: [c.ramo.color, '#fff'], count: c.gold ? 26 : 12, speed: 220 })
    }
    c.gold ? sfx.coin() : sfx.click()
    if (s.best >= 10) game.unlock('rush')
    if (s.renewed >= GOAL_RENEWED) game.complete('polizari')
    force()
  }, [])

  useEffect(() => stop, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const slot = KEYS.indexOf(e.key)
      if (slot < 0 || g.current.phase !== 'playing') return
      const t = e.target as HTMLElement
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return
      const c = g.current.cards.find((x) => x.slot === slot)
      if (c) renew(c.id)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [renew])

  const s = g.current
  const left = s.phase === 'playing' ? Math.max(0, DURATION - (performance.now() - s.start)) : s.phase === 'over' ? 0 : DURATION
  const m = mult(s.streak)
  const maxBar = Math.max(1, ...RAMOS.map((r) => s.byRamo[r.k] ?? 0))

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <div className="relative">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {Array.from({ length: 9 }, (_, slot) => {
            const card = s.cards.find((c) => c.slot === slot)
            return (
              <div key={slot} data-slot={slot} className="relative aspect-[1.05] sm:aspect-[1.2]">
                <div className="absolute inset-0 rounded-2xl border border-dashed border-white/[0.09]">
                  <span className="absolute right-2 top-1.5 font-mono text-[10px] text-white/20">{KEYS[slot]}</span>
                </div>
                <AnimatePresence>
                  {card && (
                    <motion.button
                      key={card.id}
                      initial={{ scale: 0.4, opacity: 0, rotate: -6 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 1.25, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 520, damping: 26 }}
                      onPointerDown={(e) => renew(card.id, e.currentTarget.parentElement)}
                      className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border p-2.5 text-left sm:p-3"
                      style={{
                        borderColor: card.gold ? '#ffb547' : `${card.ramo.color}88`,
                        background: card.gold ? 'linear-gradient(160deg, #ffb54733, #0b0e18)' : `linear-gradient(160deg, ${card.ramo.color}26, #0b0e18)`,
                        boxShadow: card.gold ? '0 0 30px -4px #ffb547' : `0 8px 24px -12px ${card.ramo.color}`,
                      }}
                      aria-label={t(
                        `Renovar póliza de ${t.l(card.ramo.label)} de ${card.client}, comisión ${money(card.amount, t.locale)}`,
                        `Renew ${card.client}'s ${t.l(card.ramo.label).toLowerCase()} policy, commission ${money(card.amount, t.locale)}`,
                        `Rinnova la polizza ${t.l(card.ramo.label).toLowerCase()} di ${card.client}, provvigione ${money(card.amount, t.locale)}`,
                      )}
                    >
                      <span className="flex items-center justify-between">
                        <card.ramo.Icon size={18} style={{ color: card.gold ? '#ffb547' : card.ramo.color }} />
                        {card.gold && <span className="rounded bg-amber px-1.5 py-0.5 font-mono text-[9px] font-bold text-void">x3</span>}
                      </span>
                      <span>
                        <span className="block truncate text-[11px] text-white/60 sm:text-xs">{card.client}</span>
                        <span className="block font-display text-sm font-bold sm:text-base">{money(card.amount, t.locale)}</span>
                      </span>
                      <motion.span
                        className="absolute inset-x-0 bottom-0 h-1.5 origin-left"
                        initial={{ scaleX: 1, backgroundColor: '#4ade80' }}
                        animate={{ scaleX: 0, backgroundColor: ['#4ade80', '#ffb547', '#ff5c8a'] }}
                        transition={{ duration: card.ttl / 1000, ease: 'linear' }}
                      />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <AnimatePresence>
          {s.phase !== 'playing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-[#06070c]/85 p-6 text-center backdrop-blur-sm">
              {s.phase === 'idle' ? (
                <div>
                  <p className="label mb-3">Renewal Rush</p>
                  <p className="mx-auto max-w-xs font-display text-xl font-bold leading-snug">{t('Las pólizas vencen rápido. ¡Renovalas antes de que se caigan!', 'Policies expire fast. Renew them before they lapse!', 'Le polizze scadono in fretta. Rinnovale prima che decadano!')}</p>
                  <p className="mx-auto mt-3 max-w-xs text-sm text-white/50">
                    {t(
                      <>Tocá las tarjetas o usá el teclado numérico (<Kbd>1</Kbd>–<Kbd>9</Kbd>). Cada renovación seguida sube tu multiplicador.</>,
                      <>Tap the cards or use the number keys (<Kbd>1</Kbd>–<Kbd>9</Kbd>). Every renewal in a row raises your multiplier.</>,
                      <>Tocca le carte o usa il tastierino numerico (<Kbd>1</Kbd>–<Kbd>9</Kbd>). Ogni rinnovo di fila alza il moltiplicatore.</>,
                    )}
                  </p>
                  <button onClick={startGame} className="btn btn-primary mt-6 !px-8 !py-4"><Play size={16} className="fill-current" /> {t('Jugar 30 s', 'Play 30 s', 'Gioca 30 s')}</button>
                  {high > 0 && <p className="mt-4 font-mono text-xs text-white/45">{t('Tu récord', 'Your best', 'Il tuo record')}: <b className="text-accent">{money(high, t.locale)}</b></p>}
                </div>
              ) : (
                <div>
                  <Trophy className="mx-auto mb-3 text-amber" size={34} />
                  <p className="label mb-2">{t('Ronda terminada', 'Round over', 'Round finito')}</p>
                  <p className="font-display text-4xl font-black text-accent">{money(s.score, t.locale)}</p>
                  <p className="mt-2 font-display text-lg font-bold">{title(s.score, t)}</p>
                  <p className="mt-2 font-mono text-xs text-white/50">
                    {t(`${s.renewed} renovadas · ${s.lost} vencidas · mejor racha ${s.best}`, `${s.renewed} renewed · ${s.lost} expired · best streak ${s.best}`, `${s.renewed} rinnovate · ${s.lost} scadute · serie migliore ${s.best}`)}
                  </p>
                  {s.score >= high && s.score > 0 && <p className="mt-2 font-mono text-xs text-amber">★ {t('¡Nuevo récord!', 'New record!', 'Nuovo record!')}</p>}
                  <p className="mt-2 font-mono text-[11px] text-white/40">
                    {s.renewed >= GOAL_RENEWED ? t('Desafío superado ✓', 'Challenge cleared ✓', 'Sfida superata ✓') : t(`Desafío: renová ${GOAL_RENEWED} pólizas en una ronda`, `Challenge: renew ${GOAL_RENEWED} policies in one round`, `Sfida: rinnova ${GOAL_RENEWED} polizze in un round`)}
                  </p>
                  <button onClick={startGame} className="btn btn-primary mt-6"><RotateCcw size={15} /> {t('Otra ronda', 'Another round', 'Un altro round')}</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-4">
            <p className="label mb-1 flex items-center gap-1.5"><Timer size={11} /> {t('Tiempo', 'Time', 'Tempo')}</p>
            <p className={`font-display text-3xl font-black tabular-nums ${left < 6000 && s.phase === 'playing' ? 'text-rose' : ''}`}>{(left / 1000).toFixed(1)}s</p>
          </div>
          <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-4">
            <p className="label mb-1">{t('Racha', 'Streak', 'Serie')}</p>
            <p className="font-display text-3xl font-black tabular-nums">
              {s.streak} <span className="text-lg text-accent">x{m}</span>
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-4">
          <p className="label mb-1">{t('Comisiones cobradas', 'Commissions collected', 'Provvigioni incassate')}</p>
          <p className="font-display text-3xl font-black tabular-nums text-accent">{money(s.score, t.locale)}</p>
          <p className="mt-1 font-mono text-[11px] text-white/40">{t(`${s.renewed} renovadas · ${s.lost} vencidas`, `${s.renewed} renewed · ${s.lost} expired`, `${s.renewed} rinnovate · ${s.lost} scadute`)}</p>
        </div>
        <div className="flex-1 rounded-2xl border border-white/[0.07] bg-black/30 p-4">
          <p className="label mb-3">{t('Comisiones por ramo', 'Commissions by line', 'Provvigioni per ramo')}</p>
          <div className="space-y-2.5">
            {RAMOS.map((r) => {
              const v = s.byRamo[r.k] ?? 0
              return (
                <div key={r.k} className="flex items-center gap-3">
                  <r.Icon size={14} style={{ color: r.color }} />
                  <span className="w-16 text-xs text-white/55">{t.l(r.label)}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <span className="block h-full rounded-full transition-[width] duration-300" style={{ width: `${(v / maxBar) * 100}%`, background: r.color }} />
                  </span>
                  <span className="w-16 text-right font-mono text-[10.5px] text-white/50">{v ? money(v, t.locale) : '—'}</span>
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-[11.5px] leading-snug text-white/35">
            {t(
              'En Polizari el mismo panel se alimenta de los esquemas de comisión reales por compañía y ramo.',
              'In Polizari the same dashboard is fed by the real commission schemes per insurer and line of business.',
              'In Polizari lo stesso pannello si alimenta con gli schemi di provvigione reali per compagnia e ramo.',
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
