import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { animate } from 'motion/react'
import { Check, CornerDownLeft, Crown, Flag, Rocket } from 'lucide-react'
import { projects, type Project } from '../data/projects'
import { levelIcon } from '../lib/icons'
import { openLevel, readLevel, scrollToId } from '../lib/route'
import { game, useGame } from '../game/store'
import { sfx } from '../game/audio'
import { TOTAL_LEVELS } from '../data/achievements'
import { Mascot } from './ui/Mascot'
import { Kbd, Relic, SectionTitle, Stars } from './ui/bits'
import { useMedia } from '../hooks/useMedia'

// Coordenadas del mapa. Índice 0 = START, 1..5 = niveles, 6 = sala final (contacto).
const LAYOUTS = {
  wide: {
    w: 1200,
    h: 640,
    pts: [[90, 520], [255, 330], [470, 490], [660, 240], [865, 430], [1035, 190], [1120, 500]],
  },
  tall: {
    w: 400,
    h: 1020,
    pts: [[95, 950], [300, 815], [100, 665], [300, 515], [100, 365], [295, 215], [140, 75]],
  },
} as const

type LayoutKey = keyof typeof LAYOUTS

function buildPath(pts: readonly (readonly number[])[]) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0]} ${p2[1]}`
  }
  return d
}

// Posición persistente entre aperturas de nivel (dentro de la sesión de la página).
let lastNode = 0

const DUST = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 47 + 13) % 100,
  y: (i * 71 + 29) % 100,
  s: 2 + (i % 4),
  d: 6 + (i % 7) * 1.7,
  o: 0.15 + (i % 5) * 0.09,
}))

export function Overworld() {
  const tall = useMedia('(max-width: 767px)')
  const key: LayoutKey = tall ? 'tall' : 'wide'
  const L = LAYOUTS[key]
  const d = useMemo(() => buildPath(L.pts), [L])

  const visited = useGame((s) => s.visited)
  const played = useGame((s) => s.played)
  const done = useGame((s) => s.done)

  const wrap = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const mascot = useRef<HTMLDivElement>(null)
  const lens = useRef<number[]>([])
  const pos = useRef(0)
  const busy = useRef(false)
  const stepMark = useRef(0)
  const [total, setTotal] = useState(0)
  const [cur, setCur] = useState(lastNode)
  const [walking, setWalking] = useState(false)
  const [facing, setFacing] = useState<1 | -1>(1)
  const [ready, setReady] = useState(false)
  const [nodeLens, setNodeLens] = useState<number[]>([])

  const place = useCallback(
    (len: number) => {
      const p = pathRef.current
      const m = mascot.current
      if (!p || !m) return
      const pt = p.getPointAtLength(len)
      m.style.left = `${(pt.x / L.w) * 100}%`
      m.style.top = `${(pt.y / L.h) * 100}%`
      pos.current = len
    },
    [L],
  )

  // Mide la longitud acumulada hasta cada nodo muestreando el camino.
  useLayoutEffect(() => {
    const p = pathRef.current
    if (!p) return
    const T = p.getTotalLength()
    const res: number[] = L.pts.map(() => 0)
    const step = 2
    L.pts.forEach((pt, i) => {
      let best = Infinity
      let bl = 0
      for (let l = 0; l <= T; l += step) {
        const q = p.getPointAtLength(l)
        const dd = (q.x - pt[0]) ** 2 + (q.y - pt[1]) ** 2
        if (dd < best) {
          best = dd
          bl = l
        }
      }
      res[i] = i === 0 ? 0 : i === L.pts.length - 1 ? T : bl
    })
    lens.current = res
    setNodeLens(res)
    setTotal(T)
    place(res[Math.min(lastNode, res.length - 1)] ?? 0)
    setReady(true)
  }, [L, place])

  const walkTo = useCallback(
    (i: number, then?: () => void) => {
      if (busy.current) return
      const to = lens.current[i]
      if (to === undefined) return
      const from = pos.current
      if (Math.abs(to - from) < 3) {
        setCur(i)
        lastNode = i
        then?.()
        return
      }
      busy.current = true
      setWalking(true)
      setFacing(to > from ? 1 : -1)
      const dur = Math.min(2.4, 0.55 + Math.abs(to - from) / (tall ? 520 : 780))
      animate(from, to, {
        duration: dur,
        ease: [0.45, 0.05, 0.3, 1],
        onUpdate: (v) => {
          place(v)
          const mark = Math.floor(v / 46)
          if (mark !== stepMark.current) {
            stepMark.current = mark
            sfx.step()
          }
        },
        onComplete: () => {
          busy.current = false
          setWalking(false)
          setCur(i)
          lastNode = i
          then?.()
        },
      })
    },
    [place, tall],
  )

  const enter = useCallback(
    (i: number) => {
      const el = wrap.current?.querySelector<HTMLElement>(`[data-node="${i}"]`)
      const r = el?.getBoundingClientRect()
      if (i === 0) return
      if (i === L.pts.length - 1) {
        scrollToId('contacto')
        return
      }
      const p = projects[i - 1]
      sfx.open()
      openLevel(p.id, r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined)
    },
    [L],
  )

  const onNode = (i: number) => {
    sfx.click()
    walkTo(i, () => enter(i))
  }

  // Navegación con teclado cuando el mapa está a la vista.
  const inView = useRef(false)
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => (inView.current = e.intersectionRatio > 0.35), { threshold: [0, 0.35, 0.6, 1] })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!inView.current || readLevel() || document.querySelector('[aria-modal="true"]')) return
      const t = e.target as HTMLElement
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT') return
      if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault()
        const n = Math.min(L.pts.length - 1, cur + 1)
        if (n !== cur) {
          walkTo(n)
          game.unlock('walker')
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault()
        const n = Math.max(0, cur - 1)
        if (n !== cur) {
          walkTo(n)
          game.unlock('walker')
        }
      } else if ((e.key === 'Enter' || e.key === ' ') && t.tagName !== 'BUTTON') {
        e.preventDefault()
        enter(cur)
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [cur, enter, walkTo, L])

  const maxVisited = visited.reduce((m, id) => Math.max(m, projects.findIndex((p) => p.id === id) + 1), 0)
  const trailTo = nodeLens[maxVisited] ?? 0
  const starsOf = (p: Project) => (visited.includes(p.id) ? 1 : 0) + (played.includes(p.id) ? 1 : 0) + (done.includes(p.id) ? 1 : 0)
  const totalStars = projects.reduce((n, p) => n + starsOf(p), 0)
  const pct = (i: number) => ({ left: `${(L.pts[i][0] / L.w) * 100}%`, top: `${(L.pts[i][1] / L.h) * 100}%` })

  return (
    <section id="mapa" className="relative px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="01 · Mapa de mundos" title={<>Cada proyecto es <span className="text-gradient">un nivel</span>. Elegí el tuyo.</>}>
          Caminá con Bit por el mapa y entrá a un mundo. Cada uno trae una demo jugable de lo que hace el proyecto real, más las decisiones técnicas detrás.
        </SectionTitle>

        <div
          ref={wrap}
          className="panel relative mx-auto w-full overflow-hidden !rounded-[28px]"
          style={{ aspectRatio: `${L.w} / ${L.h}` }}
        >
          {/* escenografía */}
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(75%_75%_at_50%_50%,#000,transparent)]" />
          {projects.map((p, i) => (
            <div key={p.id} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl" style={{ ...pct(i + 1), width: tall ? 220 : '24%', aspectRatio: '1', background: `radial-gradient(circle, ${p.accent}${visited.includes(p.id) ? '40' : '24'}, transparent 68%)` }} />
          ))}
          {DUST.map((s, i) => (
            <span key={i} className="animate-drift pointer-events-none absolute rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o, animationDuration: `${s.d}s`, animationDelay: `${-i}s` }} />
          ))}
          <Relic id="map" className={tall ? 'left-[6%] top-[12%]' : 'left-[46%] top-[8%]'} />

          <svg viewBox={`0 0 ${L.w} ${L.h}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--accent)" />
                <stop offset="1" stopColor="var(--accent-2)" />
              </linearGradient>
              <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
            </defs>
            <path ref={pathRef} d={d} fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 13" />
            {ready && total > 0 && (
              <>
                <path d={d} fill="none" stroke="url(#trail)" strokeWidth="9" strokeLinecap="round" filter="url(#soft)" opacity=".7" strokeDasharray={`${total} ${total}`} strokeDashoffset={total - trailTo} style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)' }} />
                <path d={d} fill="none" stroke="url(#trail)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${total} ${total}`} strokeDashoffset={total - trailTo} style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)' }} />
              </>
            )}
          </svg>

          {/* START */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={pct(0)} data-node="0">
            <button onClick={() => onNode(0)} className="grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-white/5 text-white/70 transition hover:border-accent hover:text-accent" aria-label="Punto de inicio">
              <Flag size={20} />
            </button>
            <p className="label absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap">Start</p>
          </div>

          {/* niveles */}
          {projects.map((p, idx) => {
            const i = idx + 1
            const Icon = levelIcon[p.id]
            const st = starsOf(p)
            const isCur = cur === i
            const tipBelow = !tall && L.pts[i][1] < 300
            return (
              <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ ...pct(i), ['--accent' as string]: p.accent, ['--accent-2' as string]: p.accent2 }} data-node={i}>
                <button
                  onClick={() => onNode(i)}
                  onMouseEnter={sfx.hover}
                  className="group relative flex flex-col items-center outline-offset-8"
                  aria-label={`Nivel ${p.n}: ${p.name}. ${p.tagline}`}
                >
                  {isCur && !walking && <span className="absolute left-1/2 top-[38px] h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 animate-[pulse-ring_2.2s_ease-out_infinite] rounded-full border-2 border-accent sm:top-[44px] sm:h-[88px] sm:w-[88px]" />}
                  <span className="relative grid h-[76px] w-[76px] place-items-center transition-transform duration-300 group-hover:scale-110 sm:h-[88px] sm:w-[88px]">
                    <span className="animate-spin-slow absolute inset-0 rounded-full border border-dashed" style={{ borderColor: `${p.accent}90` }} />
                    <span className="absolute inset-[7px] rounded-full ring-1 ring-white/15" style={{ background: `radial-gradient(circle at 30% 25%, ${p.accent}55, #0b0e18 72%)`, boxShadow: `0 0 ${visited.includes(p.id) ? 44 : 22}px -6px ${p.accent}` }} />
                    <Icon size={30} className="relative text-accent drop-shadow-[0_0_10px_var(--accent)]" />
                    {st === 3 && (
                      <span className="absolute -right-0.5 -top-0.5 grid h-6 w-6 place-items-center rounded-full bg-accent text-void shadow-[0_0_14px_var(--accent)]">
                        <Check size={14} strokeWidth={3.5} />
                      </span>
                    )}
                    {p.boss_level && (
                      <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-rose px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-void">
                        <Crown size={10} /> Jefe
                      </span>
                    )}
                  </span>
                  <span className="mt-2 flex flex-col items-center gap-1 rounded-xl bg-[#080a12]/80 px-3 py-1.5 backdrop-blur-sm">
                    <span className="font-mono text-[9.5px] tracking-[0.2em] text-accent">NIVEL {String(p.n).padStart(2, '0')}</span>
                    <span className="font-display text-[12px] font-extrabold uppercase tracking-tight sm:text-[13px]">{p.name}</span>
                    <Stars n={st} size={11} />
                  </span>
                  <span className={`pointer-events-none absolute left-1/2 z-30 hidden w-56 -translate-x-1/2 rounded-xl border border-white/10 bg-[#0b0e18]/95 p-3 text-left opacity-0 shadow-2xl backdrop-blur transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:block ${tipBelow ? 'top-full mt-24 translate-y-1 group-hover:translate-y-0' : 'bottom-full mb-6 -translate-y-1 group-hover:translate-y-0'}`}>
                    <span className="block text-[12.5px] leading-snug text-white/80">{p.tagline}</span>
                    <span className="mt-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                      Entrar <CornerDownLeft size={11} />
                    </span>
                  </span>
                </button>
              </div>
            )
          })}

          {/* sala final */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2" style={pct(6)} data-node="6">
            <button onClick={() => onNode(6)} onMouseEnter={sfx.hover} className="group flex flex-col items-center" aria-label="Sala final: contacto">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-dashed border-white/30 bg-white/5 text-white/70 transition group-hover:scale-110 group-hover:border-accent group-hover:text-accent">
                <Rocket size={24} />
              </span>
              <span className="mt-2 rounded-lg bg-[#080a12]/80 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/60">Sala final</span>
            </button>
          </div>

          {/* Bit */}
          <div ref={mascot} className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[88%] transition-opacity duration-500" style={{ opacity: ready ? 1 : 0, left: 0, top: 0 }}>
            <Mascot size={tall ? 42 : 54} walking={walking} facing={facing} track={false} />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] text-white/45">
            <span className="hidden items-center gap-1.5 md:flex"><Kbd>←</Kbd><Kbd>→</Kbd> caminar</span>
            <span className="hidden items-center gap-1.5 md:flex"><Kbd>Enter</Kbd> entrar</span>
            <span>o tocá cualquier mundo</span>
          </p>
          <div className="flex items-center gap-4 font-mono text-[11px] text-white/60">
            <span>Mundos <b className="text-accent">{visited.length}/{TOTAL_LEVELS}</b></span>
            <span>Estrellas <b className="text-accent">{totalStars}/{TOTAL_LEVELS * 3}</b></span>
          </div>
        </div>
      </div>
    </section>
  )
}
