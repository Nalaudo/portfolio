import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Briefcase, Building2, ChevronDown, Code2, type LucideIcon } from 'lucide-react'
import { profile } from '../data/profile'
import { game, rankFor, useGame, type Persona } from '../game/store'
import { sfx } from '../game/audio'
import { openLevel, scrollToId } from '../lib/route'
import { Mascot } from './ui/Mascot'
import { Counter, Relic, ScrambleText } from './ui/bits'

interface PersonaDef {
  id: Persona
  icon: LucideIcon
  title: string
  sub: string
  msg: string
  cta: string
  act: () => void
}

const PERSONAS: PersonaDef[] = [
  {
    id: 'recruiter',
    icon: Briefcase,
    title: 'Vengo a reclutar',
    sub: 'Quiero evaluar el perfil',
    msg: 'Misión recomendada: mirá el inventario de tecnologías y después enfrentá al jefe final, donde está lo más complejo.',
    cta: 'Abrir el inventario',
    act: () => scrollToId('inventario'),
  },
  {
    id: 'client',
    icon: Building2,
    title: 'Tengo un proyecto',
    sub: 'Busco quién lo construya',
    msg: 'Misión recomendada: jugá una o dos demos para ver cómo trabajo y después contame tu idea.',
    cta: 'Ir al mapa de mundos',
    act: () => scrollToId('mapa'),
  },
  {
    id: 'dev',
    icon: Code2,
    title: 'Soy dev',
    sub: 'Vengo por curiosidad técnica',
    msg: 'Misión recomendada: entrá a Kontari y cifrá un secreto con PBKDF2 + AES-GCM reales, corriendo en tu navegador.',
    cta: 'Entrar a Kontari',
    act: () => openLevel('kontari'),
  },
]

const TIPS = ['Tip: probá Ctrl + K', 'Hay 7 estrellas escondidas', '¿Conocés el código Konami?', 'Mové el mouse, te sigo con la mirada']

export function Hero() {
  const started = useGame((s) => s.started)
  const persona = useGame((s) => s.persona)
  const [roleIdx, setRoleIdx] = useState(0)
  const [tip, setTip] = useState(0)
  const active = PERSONAS.find((p) => p.id === persona)

  useEffect(() => {
    const a = setInterval(() => setRoleIdx((i) => (i + 1) % profile.roles.length), 2600)
    const b = setInterval(() => setTip((i) => (i + 1) % TIPS.length), 4200)
    return () => {
      clearInterval(a)
      clearInterval(b)
    }
  }, [])

  const item = (i: number) => ({
    initial: { opacity: 0, y: 26 },
    animate: started ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
    transition: { duration: 0.8, delay: 0.15 + i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <section id="inicio" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 pb-16 pt-28 sm:px-6">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_45%,#000,transparent)]" />
      {/* En mobile el contenido se apila, así que esta estrella se ancla a una fila corta (el renglón "&gt; rol") en vez de al fondo de la sección. */}
      <Relic id="hero" className="right-[8%] top-[300px] sm:top-auto sm:bottom-24 sm:right-[7%]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.div {...item(0)} className="mb-7 flex items-center gap-4">
            <span className="label flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/70" />
                <span className="relative h-2 w-2 rounded-full bg-accent" />
              </span>
              Player 1 · online
            </span>
            <span className="label hidden sm:block">{profile.location}</span>
            <div className="lg:hidden">
              <Mascot size={44} />
            </div>
          </motion.div>

          <h1 className="font-display text-[clamp(2.7rem,7.4vw,6.4rem)] font-black leading-[0.92] tracking-[-0.03em]">
            <motion.span {...item(1)} className="block">
              <ScrambleText text={profile.first.toUpperCase()} active={started} delay={250} />
            </motion.span>
            <motion.span {...item(2)} className="text-gradient block">
              <ScrambleText text={profile.last.toUpperCase()} active={started} delay={450} />
            </motion.span>
          </h1>

          <motion.div {...item(3)} className="mt-6 flex h-8 items-center gap-3 font-mono text-sm text-white/70">
            <span className="text-accent">&gt;</span>
            <AnimatePresence mode="wait">
              <motion.span key={roleIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }}>
                {profile.roles[roleIdx]}
              </motion.span>
            </AnimatePresence>
            <span className="h-4 w-2 animate-blink bg-accent" />
          </motion.div>

          <motion.p {...item(4)} className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/65">
            {profile.tagline}
          </motion.p>

          <motion.div {...item(5)} className="mt-9">
            <p className="label mb-3">Elegí tu clase para personalizar la misión</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {PERSONAS.map((p) => {
                const on = persona === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      sfx.click()
                      game.setPersona(p.id)
                    }}
                    onMouseEnter={sfx.hover}
                    aria-pressed={on}
                    className={`panel group relative overflow-hidden p-4 text-left transition ${on ? '!border-accent bg-accent/10 shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_16%,transparent)]' : 'hover:!border-white/25 hover:-translate-y-0.5'}`}
                  >
                    <p.icon size={20} className={on ? 'text-accent' : 'text-white/60 transition group-hover:text-white'} />
                    <p className="mt-3 font-display text-[13px] font-bold leading-tight">{p.title}</p>
                    <p className="mt-1 text-xs text-white/50">{p.sub}</p>
                  </button>
                )
              })}
            </div>

            <div className="mt-4 min-h-[86px]">
              <AnimatePresence mode="wait">
                {active ? (
                  <motion.div key={active.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <p className="max-w-md text-sm leading-relaxed text-white/75">{active.msg}</p>
                    <button className="btn btn-primary" onClick={() => { sfx.click(); active.act() }}>
                      {active.cta} <ArrowRight size={15} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-mono text-xs text-white/35">
                    ↑ o explorá libremente: scrolleá o usá Ctrl + K
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <motion.div {...item(3)} className="hidden lg:block">
          <PlayerCard tip={TIPS[tip]} />
        </motion.div>
      </div>

      <motion.div {...item(7)} className="relative mx-auto mt-14 grid w-full max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-4">
        {[
          { to: 3, s: '+', l: 'años construyendo software end-to-end' },
          { to: 5, s: '', l: 'mundos para explorar' },
          { to: 600, s: '+', l: 'tests automatizados en Kontari' },
          { to: 110, s: '', l: 'modelos de datos en un solo SaaS' },
        ].map((x) => (
          <div key={x.l} className="bg-[#080a12]/90 px-5 py-5">
            <p className="font-display text-3xl font-black text-white">
              <Counter to={x.to} suffix={x.s} />
            </p>
            <p className="mt-1 text-xs text-white/45">{x.l}</p>
          </div>
        ))}
      </motion.div>

      <button onClick={() => scrollToId('mapa')} className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35 transition hover:text-accent sm:flex" aria-label="Bajar al mapa">
        scroll
        <ChevronDown size={16} className="animate-bounce" />
      </button>
    </section>
  )
}

function PlayerCard({ tip }: { tip: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const started = useGame((s) => s.started)
  const xp = useGame((s) => s.xp)
  const rank = rankFor(xp)

  const move = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${(0.5 - py) * 12}deg`)
    el.style.setProperty('--ry', `${(px - 0.5) * 16}deg`)
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
    el.style.setProperty('--gx-n', `${px}`)
  }
  const leave = () => {
    const el = ref.current
    if (!el) return
    ;['--rx', '--ry'].forEach((k) => el.style.setProperty(k, '0deg'))
    el.style.setProperty('--gx', '50%')
    el.style.setProperty('--gy', '30%')
  }

  const stats = [
    { k: 'Front', v: 92 },
    { k: 'Back', v: 90 },
    { k: 'Datos', v: 86 },
    { k: 'Tests', v: 84 },
    { k: 'UX', v: 88 },
  ]

  return (
    <div className="relative mx-auto w-full max-w-[380px]" style={{ perspective: 1200 }} onPointerMove={move} onPointerLeave={leave}>
      <div
        ref={ref}
        className="relative rounded-[28px] p-[1.5px] transition-transform duration-150 ease-out will-change-transform"
        style={{ transform: 'rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))', background: 'linear-gradient(140deg, var(--accent), transparent 40%, var(--accent-2))' }}
      >
        <div className="relative overflow-hidden rounded-[27px] bg-[#0a0d17] p-5">
          <div className="holo pointer-events-none absolute inset-0 z-10 rounded-[27px]" />
          <div className="relative z-0">
            <div className="mb-4 flex items-center justify-between">
              <span className="label">Player card</span>
              <span className="chip !border-amber/40 !text-amber">★ Legendaria</span>
            </div>
            <div className="grid-bg relative grid h-56 place-items-center overflow-hidden rounded-2xl bg-gradient-to-b from-accent/10 via-transparent to-accent-2/10">
              <div className="absolute h-40 w-40 rounded-full bg-accent/25 blur-3xl" />
              <div className="animate-float relative">
                <Mascot size={132} />
              </div>
              <AnimatePresence mode="wait">
                <motion.span key={tip} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-3 left-3 right-3 rounded-lg bg-black/50 px-3 py-1.5 text-center font-mono text-[10.5px] text-white/70 backdrop-blur">
                  {tip}
                </motion.span>
              </AnimatePresence>
            </div>
            <h3 className="mt-5 font-display text-xl font-black tracking-tight">{profile.name.toUpperCase()}</h3>
            <p className="font-mono text-xs text-accent">{profile.role}</p>

            <div className="mt-5 space-y-2.5">
              {stats.map((s, i) => (
                <div key={s.k} className="flex items-center gap-3">
                  <span className="w-11 font-mono text-[10px] uppercase tracking-wider text-white/45">{s.k}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <motion.span
                      className="block h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                      initial={{ width: 0 }}
                      animate={{ width: started ? `${s.v}%` : 0 }}
                      transition={{ duration: 1.2, delay: 0.9 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                  <span className="w-6 text-right font-mono text-[11px] text-white/70">{s.v}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
              <div>
                <p className="label">Rango</p>
                <p className="font-display text-sm font-bold">{rank.name}</p>
              </div>
              <div className="text-right">
                <p className="label">XP</p>
                <p className="font-mono text-sm font-bold text-accent">{xp}</p>
              </div>
              <div className="text-right">
                <p className="label">ID</p>
                <p className="font-mono text-sm text-white/60">#NB-0001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
