import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { ArrowRight, Briefcase, Calculator, Check, Handshake, Headset, Laptop, MessageCircle, RotateCcw, Tractor, Users, type LucideIcon } from 'lucide-react'
import { game } from '../../game/store'
import { sfx } from '../../game/audio'
import { fx } from '../../lib/fx'

// Misma curva de easing que usa toda la landing real.
const EASE = [0.16, 1, 0.3, 1] as const
const HEADLINE_1 = 'Soluciones Contables, Impositivas y'
const HEADLINE_2 = 'Laborales Estratégicas'
const BLUE = '#3b76f6'
const GREEN = '#14c087'

interface Service {
  title: string
  Icon: LucideIcon
  items: string[]
}
const SERVICES: Service[] = [
  {
    title: 'Asesoría Impositiva',
    Icon: Calculator,
    items: ['Liquidación de Impuestos Anuales y Mensuales.', 'Ganancias y Bienes Personales.', 'IVA, Ingresos Brutos y Monotributo.', 'Monitoreo de normativas nacionales y provinciales.'],
  },
  {
    title: 'Asesoría Laboral',
    Icon: Users,
    items: ['Liquidación de sueldos y jornales integrales.', 'Cargas Sociales y Declaraciones Juradas.', 'Seguimiento exhaustivo de paritarias de convenios.', 'Empleados de Comercio y Casas Particulares.'],
  },
  {
    title: 'Sector Agropecuario',
    Icon: Tractor,
    items: ['Gestión contable y administrativa para el agro.', 'Control de Cartas de Porte y regímenes de información.', 'Seguimiento de mercados y evolución sectorial.', 'Clasificación y gestión de hacienda.'],
  },
  {
    title: 'Gestión Societaria',
    Icon: Briefcase,
    items: ['Constitución de Sociedades por Acciones Simplificadas (SAS).', 'Estructuración corporativa e inscripciones legales.', 'Asesoramiento a medida para nuevos emprendimientos.'],
  },
  {
    title: 'Soluciones Tecnológicas',
    Icon: Laptop,
    items: ['Implementación y parametrización de Facturación Electrónica.', 'Adecuación digital para profesionales y comercios.'],
  },
]

const MODES = [
  {
    id: 'remoto',
    label: 'Servicio Remoto',
    Icon: Headset,
    color: BLUE,
    title: 'Asesoría Digital',
    text: 'Atención remota eficiente, fluida y con la máxima rapidez técnica, desde cualquier punto del país.',
    bullets: ['Videollamadas y mensajería en tiempo real', 'Firma y gestión documental 100% digital', 'Seguimiento de trámites desde cualquier lugar'],
  },
  {
    id: 'presencial',
    label: 'Servicio Presencial',
    Icon: Handshake,
    color: GREEN,
    title: 'Atención en Oficina',
    text: 'Reuniones personalizadas y de trato directo, en las oficinas de la ciudad de Santa Fe.',
    bullets: ['Reuniones agendadas a tu medida', 'Trato cercano y de largo plazo'],
  },
]

type Tab = 'motion' | 'servicios'

export function SbDemo() {
  const [tab, setTab] = useState<Tab>('motion')
  const [replayed, setReplayed] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [opened, setOpened] = useState<Set<number>>(new Set())
  const doneRef = useRef(false)

  const goals = [
    { ok: replayed, label: 'Reproducí la animación del titular' },
    { ok: clicked, label: 'Tocá el botón magnético' },
    { ok: opened.size >= SERVICES.length, label: `Abrí las 5 áreas de servicio (${opened.size}/5)` },
  ]

  useEffect(() => {
    if (replayed || clicked || opened.size > 0) game.play('sbestudio')
    if (!doneRef.current && goals.every((g) => g.ok)) {
      doneRef.current = true
      game.complete('sbestudio')
    }
  })

  const setTabSafe = (t: Tab) => {
    sfx.click()
    setTab(t)
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-full border border-white/10 bg-black/30 p-1" role="tablist">
          {(
            [
              ['motion', 'Motion lab'],
              ['servicios', 'Servicios y modalidad'],
            ] as const
          ).map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTabSafe(k)} className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition ${tab === k ? 'bg-accent text-void' : 'text-white/60 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[11px]">
          {goals.map((g) => (
            <li key={g.label} className={`flex items-center gap-1.5 ${g.ok ? 'text-mint' : 'text-white/40'}`}>
              <span className={`grid h-4 w-4 place-items-center rounded-full ${g.ok ? 'bg-mint text-void' : 'border border-white/25'}`}>{g.ok && <Check size={10} strokeWidth={4} />}</span>
              {g.label}
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
          {tab === 'motion' ? (
            <MotionLab onReplay={() => setReplayed(true)} onCta={() => setClicked(true)} />
          ) : (
            <Servicios opened={opened} onOpen={(i) => setOpened((s) => new Set(s).add(i))} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function AnimatedWords({ text, stagger, duration, run, className = '' }: { text: string; stagger: number; duration: number; run: number; className?: string }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={`${run}-${i}`} className="inline-block overflow-hidden pb-1 align-bottom">
          <motion.span className="inline-block" initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration, ease: EASE, delay: stagger * i }}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      className="inline-block"
    >
      {children}
    </motion.div>
  )
}

function MotionLab({ onReplay, onCta }: { onReplay: () => void; onCta: () => void }) {
  const [run, setRun] = useState(0)
  const [stagger, setStagger] = useState(0.05)
  const [duration, setDuration] = useState(0.7)
  const [orbs, setOrbs] = useState(60)
  const [chat, setChat] = useState(false)

  const replay = () => {
    sfx.pop()
    setRun((r) => r + 1)
    onReplay()
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 p-6 text-center sm:p-10" style={{ background: '#05070d' }}>
        {/* mesh + orbes, como en el hero */}
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(60% 50% at 15% 10%, ${BLUE}${Math.round(orbs * 0.5).toString(16).padStart(2, '0')}, transparent 70%), radial-gradient(50% 50% at 90% 30%, ${GREEN}${Math.round(orbs * 0.4).toString(16).padStart(2, '0')}, transparent 70%)` }} />
        <motion.div className="pointer-events-none absolute -left-16 top-8 h-56 w-56 rounded-full" style={{ background: BLUE, opacity: orbs / 250, filter: `blur(${40 + orbs / 2}px)` }} animate={{ y: [0, -22, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="pointer-events-none absolute -right-12 top-36 h-60 w-60 rounded-full" style={{ background: GREEN, opacity: orbs / 300, filter: `blur(${44 + orbs / 2}px)` }} animate={{ y: [0, 20, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }} />

        <div className="relative z-10">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ borderColor: `${GREEN}55`, background: `${GREEN}18`, color: GREEN }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: GREEN }} />
            Santa Fe &amp; Región
          </span>
          <h3 className="mx-auto mb-5 max-w-xl font-sans text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-100 sm:text-[2.6rem]">
            <AnimatedWords text={HEADLINE_1} stagger={stagger} duration={duration} run={run} />{' '}
            <AnimatedWords text={HEADLINE_2} stagger={stagger} duration={duration} run={run} className="bg-gradient-to-r from-[#3b76f6] to-[#14c087] bg-clip-text text-transparent" />
          </h3>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-slate-400">
            Soluciones integrales para empresas, productores agropecuarios, instituciones y profesionales, con foco en la sinceridad, el compromiso y la eficiencia.
          </p>
          <Magnetic>
            <button
              onClick={() => {
                sfx.coin()
                setChat(true)
                onCta()
                const r = document.getElementById('sb-cta')?.getBoundingClientRect()
                if (r) fx.burst(r.left + r.width / 2, r.top + r.height / 2, { colors: [BLUE, GREEN, '#fff'], count: 18, speed: 240 })
              }}
              id="sb-cta"
              className="group inline-flex items-center gap-2.5 rounded-xl px-8 py-3.5 text-base font-bold text-white transition-shadow"
              style={{ background: `linear-gradient(135deg, ${BLUE}, ${GREEN})`, boxShadow: `0 10px 30px ${BLUE}55` }}
            >
              Consultar Ahora
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Magnetic>
          <p className="mt-3 font-mono text-[10.5px] text-slate-500">acercá el mouse: el botón te sigue</p>

          <AnimatePresence>
            {chat && (
              <motion.div initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="mx-auto mt-6 max-w-sm rounded-2xl border border-white/10 bg-[#0c1220] p-4 text-left">
                <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  <MessageCircle size={12} style={{ color: GREEN }} /> En el sitio real abre WhatsApp con este mensaje
                </p>
                <p className="w-fit max-w-full rounded-xl rounded-tl-sm px-3 py-2 text-[13px] text-white" style={{ background: '#0b5d45' }}>
                  Hola SB Estudio Contable, quiero consultar sobre sus servicios.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-6">
        <button onClick={replay} className="btn btn-primary w-full !py-4">
          <RotateCcw size={15} /> Reproducir animación
        </button>
        <Range label="Escalonado entre palabras" value={stagger} min={0.02} max={0.2} step={0.01} unit="s" onChange={setStagger} />
        <Range label="Duración de cada palabra" value={duration} min={0.3} max={1.4} step={0.05} unit="s" onChange={setDuration} />
        <Range label="Intensidad de los orbes" value={orbs} min={10} max={100} step={1} unit="%" onChange={setOrbs} />
        <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-4 font-mono text-[11.5px] leading-relaxed text-white/55">
          <p className="label mb-2 !text-accent">Así está hecho</p>
          <p>
            cada palabra sube desde una máscara <span className="text-white/80">overflow-hidden</span>; la curva es{' '}
            <span className="text-white/80">[{EASE.join(', ')}]</span> y se comparte en todo el sitio.
          </p>
        </div>
      </div>
    </div>
  )
}

function Range({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
  const id = `sb-${label.replace(/\s/g, '-')}`
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between">
        <label htmlFor={id} className="label">{label}</label>
        <span className="font-mono text-sm font-bold text-accent tabular-nums">{unit === '%' ? Math.round(value) : value.toFixed(2)}{unit}</span>
      </div>
      <input id={id} type="range" className="range" min={min} max={max} step={step} value={value} style={{ ['--fill' as string]: `${((value - min) / (max - min)) * 100}%` }} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  )
}

function Servicios({ opened, onOpen }: { opened: Set<number>; onOpen: (i: number) => void }) {
  const [sel, setSel] = useState<number | null>(null)
  const [mode, setMode] = useState(0)
  const m = MODES[mode]
  const svc = sel !== null ? SERVICES[sel] : null

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2">
          {SERVICES.map((s, i) => {
            const seen = opened.has(i)
            return (
              <li key={s.title}>
                <button
                  onClick={() => {
                    sfx.click()
                    setSel(i)
                    onOpen(i)
                  }}
                  aria-pressed={sel === i}
                  className={`group relative h-full w-full rounded-2xl border p-4 text-left transition ${sel === i ? 'border-accent bg-accent/10' : 'border-white/10 bg-white/[0.02] hover:-translate-y-1 hover:border-white/25'}`}
                >
                  <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${i % 2 ? GREEN : BLUE}22`, color: i % 2 ? GREEN : BLUE }}>
                    <s.Icon size={20} />
                  </span>
                  <span className="block font-display text-[13px] font-bold leading-tight">{s.title}</span>
                  {seen && <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-mint text-void"><Check size={11} strokeWidth={4} /></span>}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="min-h-[240px] rounded-2xl border border-white/[0.08] bg-black/30 p-6">
          <AnimatePresence mode="wait">
            {svc ? (
              <motion.div key={svc.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="label !text-accent">Lo que hacemos</p>
                <h4 className="mt-1 mb-5 flex items-center gap-3 font-display text-xl font-bold"><svc.Icon size={22} className="text-accent" /> {svc.title}</h4>
                <ul className="space-y-3">
                  {svc.items.map((it, i) => (
                    <motion.li key={it} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.08 * i }} className="flex items-start gap-3 text-[14.5px] text-white/75">
                      <Check size={16} className="mt-0.5 shrink-0 text-mint" />
                      {it}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <p className="grid h-full min-h-[200px] place-items-center text-center text-sm text-white/35">Elegí un área para ver su detalle, igual que en la sección Servicios.</p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div>
        <p className="label mb-4">Modalidad de atención adaptable</p>
        <div className="mb-5 inline-flex rounded-full border border-white/10 bg-black/30 p-1.5">
          {MODES.map((x, i) => (
            <button key={x.id} onClick={() => { sfx.pop(); setMode(i) }} aria-pressed={mode === i} className={`relative rounded-full px-5 py-2.5 text-[12px] font-bold transition-colors ${mode === i ? 'text-white' : 'text-white/50 hover:text-white/80'}`}>
              {mode === i && <motion.span layoutId="sb-mode" transition={{ type: 'spring', stiffness: 380, damping: 32 }} className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(135deg, ${x.color}, ${x.color}bb)` }} />}
              <span className="relative z-10 flex items-center gap-2"><x.Icon size={15} /> {x.label}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="rounded-2xl border border-white/[0.08] bg-black/30 p-6">
            <h4 className="font-display text-lg font-bold" style={{ color: m.color }}>{m.title}</h4>
            <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-white/65">{m.text}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-3">
              {m.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-[13px] text-white/70">
                  <Check size={14} className="mt-0.5 shrink-0" style={{ color: m.color }} />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
