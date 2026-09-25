import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { ArrowRight, Briefcase, Calculator, Check, Handshake, Headset, Laptop, MessageCircle, RotateCcw, Tractor, Users, type LucideIcon } from 'lucide-react'
import { game } from '../../game/store'
import { sfx } from '../../game/audio'
import { fx } from '../../lib/fx'
import { useT, type Loc } from '../../lib/i18n'

// Misma curva de easing que usa toda la landing real.
const EASE = [0.16, 1, 0.3, 1] as const
// El contenido replica el sitio real (en español); la versión en inglés es una traducción para la demo.
const HEADLINE_1: Loc = { es: 'Soluciones Contables, Impositivas y', en: 'Strategic Accounting, Tax and', it: 'Soluzioni Contabili, Fiscali e' }
const HEADLINE_2: Loc = { es: 'Laborales Estratégicas', en: 'Payroll Solutions', it: 'del Lavoro Strategiche' }
const BLUE = '#3b76f6'
const GREEN = '#14c087'

interface Service {
  title: Loc
  Icon: LucideIcon
  items: Loc<string[]>
}
const SERVICES: Service[] = [
  {
    title: { es: 'Asesoría Impositiva', en: 'Tax Advisory', it: 'Consulenza Fiscale' },
    Icon: Calculator,
    items: {
      es: ['Liquidación de Impuestos Anuales y Mensuales.', 'Ganancias y Bienes Personales.', 'IVA, Ingresos Brutos y Monotributo.', 'Monitoreo de normativas nacionales y provinciales.'],
      en: ['Annual and monthly tax filings.', 'Income tax and personal assets tax.', 'VAT, gross receipts tax and Monotributo.', 'Monitoring of national and provincial regulations.'],
      it: ['Liquidazione delle imposte annuali e mensili.', 'Imposta sul reddito e patrimoniale.', 'IVA, imposta sui ricavi lordi e Monotributo.', 'Monitoraggio delle normative nazionali e provinciali.'],
    },
  },
  {
    title: { es: 'Asesoría Laboral', en: 'Payroll & Labor Advisory', it: 'Consulenza del Lavoro' },
    Icon: Users,
    items: {
      es: ['Liquidación de sueldos y jornales integrales.', 'Cargas Sociales y Declaraciones Juradas.', 'Seguimiento exhaustivo de paritarias de convenios.', 'Empleados de Comercio y Casas Particulares.'],
      en: ['Full payroll and wage processing.', 'Social security contributions and sworn statements.', 'Close tracking of collective wage agreements.', 'Retail employees and domestic workers.'],
      it: ['Elaborazione completa di stipendi e paghe.', 'Contributi previdenziali e dichiarazioni giurate.', 'Monitoraggio costante dei contratti collettivi.', 'Dipendenti del commercio e lavoratori domestici.'],
    },
  },
  {
    title: { es: 'Sector Agropecuario', en: 'Agricultural Sector', it: 'Settore Agricolo' },
    Icon: Tractor,
    items: {
      es: ['Gestión contable y administrativa para el agro.', 'Control de Cartas de Porte y regímenes de información.', 'Seguimiento de mercados y evolución sectorial.', 'Clasificación y gestión de hacienda.'],
      en: ['Accounting and administrative management for agribusiness.', 'Control of grain waybills and reporting regimes.', 'Market and industry trend tracking.', 'Livestock classification and management.'],
      it: ['Gestione contabile e amministrativa per l’agricoltura.', 'Controllo delle lettere di vettura e dei regimi informativi.', 'Monitoraggio dei mercati e dell’andamento del settore.', 'Classificazione e gestione del bestiame.'],
    },
  },
  {
    title: { es: 'Gestión Societaria', en: 'Corporate Services', it: 'Gestione Societaria' },
    Icon: Briefcase,
    items: {
      es: ['Constitución de Sociedades por Acciones Simplificadas (SAS).', 'Estructuración corporativa e inscripciones legales.', 'Asesoramiento a medida para nuevos emprendimientos.'],
      en: ['Incorporation of simplified stock companies (SAS).', 'Corporate structuring and legal registrations.', 'Tailored advice for new ventures.'],
      it: ['Costituzione di Società per Azioni Semplificate (SAS).', 'Strutturazione societaria e iscrizioni legali.', 'Consulenza su misura per nuove imprese.'],
    },
  },
  {
    title: { es: 'Soluciones Tecnológicas', en: 'Tech Solutions', it: 'Soluzioni Tecnologiche' },
    Icon: Laptop,
    items: {
      es: ['Implementación y parametrización de Facturación Electrónica.', 'Adecuación digital para profesionales y comercios.'],
      en: ['E-invoicing implementation and setup.', 'Digital adaptation for professionals and businesses.'],
      it: ['Implementazione e configurazione della fatturazione elettronica.', 'Adeguamento digitale per professionisti e negozi.'],
    },
  },
]

const MODES = [
  {
    id: 'remoto',
    label: { es: 'Servicio Remoto', en: 'Remote Service', it: 'Servizio da Remoto' },
    Icon: Headset,
    color: BLUE,
    title: { es: 'Asesoría Digital', en: 'Digital Advisory', it: 'Consulenza Digitale' },
    text: {
      es: 'Atención remota eficiente, fluida y con la máxima rapidez técnica, desde cualquier punto del país.',
      en: 'Efficient, seamless remote service with top technical speed, from anywhere in the country.',
      it: 'Assistenza da remoto efficiente, fluida e con la massima rapidità tecnica, da qualsiasi punto del paese.',
    },
    bullets: {
      es: ['Videollamadas y mensajería en tiempo real', 'Firma y gestión documental 100% digital', 'Seguimiento de trámites desde cualquier lugar'],
      en: ['Video calls and real-time messaging', '100% digital signing and document management', 'Track your filings from anywhere'],
      it: ['Videochiamate e messaggi in tempo reale', 'Firma e gestione documentale 100% digitale', 'Segui le pratiche da ovunque'],
    },
  },
  {
    id: 'presencial',
    label: { es: 'Servicio Presencial', en: 'In-Person Service', it: 'Servizio in Presenza' },
    Icon: Handshake,
    color: GREEN,
    title: { es: 'Atención en Oficina', en: 'Office Appointments', it: 'Ricevimento in Ufficio' },
    text: {
      es: 'Reuniones personalizadas y de trato directo, en las oficinas de la ciudad de Santa Fe.',
      en: 'Personalized, face-to-face meetings at our offices in the city of Santa Fe.',
      it: 'Incontri personalizzati e di persona, negli uffici della città di Santa Fe.',
    },
    bullets: {
      es: ['Reuniones agendadas a tu medida', 'Trato cercano y de largo plazo'],
      en: ['Meetings scheduled around you', 'A close, long-term relationship'],
      it: ['Incontri fissati su misura per te', 'Un rapporto vicino e di lungo periodo'],
    },
  },
]

type Tab = 'motion' | 'servicios'

export function SbDemo() {
  const [tab, setTab] = useState<Tab>('motion')
  const [replayed, setReplayed] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [opened, setOpened] = useState<Set<number>>(new Set())
  const doneRef = useRef(false)
  const t = useT()

  const goals = [
    { ok: replayed, label: t('Reproducí la animación del titular', 'Replay the headline animation', 'Riproduci l’animazione del titolo') },
    { ok: clicked, label: t('Tocá el botón magnético', 'Click the magnetic button', 'Tocca il bottone magnetico') },
    { ok: opened.size >= SERVICES.length, label: t(`Abrí las 5 áreas de servicio (${opened.size}/5)`, `Open all 5 service areas (${opened.size}/5)`, `Apri tutte e 5 le aree di servizio (${opened.size}/5)`) },
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
              ['servicios', t('Servicios y modalidad', 'Services and modes', 'Servizi e modalità')],
            ] as const
          ).map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTabSafe(k)} className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition ${tab === k ? 'bg-accent text-void' : 'text-white/60 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[11px]">
          {goals.map((g, i) => (
            <li key={i} className={`flex items-center gap-1.5 ${g.ok ? 'text-mint' : 'text-white/40'}`}>
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
  const t = useT()

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
            {t('Santa Fe & Región', 'Santa Fe & Region', 'Santa Fe e Regione')}
          </span>
          <h3 className="mx-auto mb-5 max-w-xl font-sans text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-100 sm:text-[2.6rem]">
            <AnimatedWords text={t.l(HEADLINE_1)} stagger={stagger} duration={duration} run={run} />{' '}
            <AnimatedWords text={t.l(HEADLINE_2)} stagger={stagger} duration={duration} run={run} className="bg-gradient-to-r from-[#3b76f6] to-[#14c087] bg-clip-text text-transparent" />
          </h3>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-slate-400">
            {t(
              'Soluciones integrales para empresas, productores agropecuarios, instituciones y profesionales, con foco en la sinceridad, el compromiso y la eficiencia.',
              'Comprehensive solutions for businesses, farmers, institutions and professionals, focused on honesty, commitment and efficiency.',
              'Soluzioni integrate per aziende, produttori agricoli, istituzioni e professionisti, con attenzione a sincerità, impegno ed efficienza.',
            )}
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
              {t('Consultar Ahora', 'Ask Now', 'Chiedi Ora')}
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Magnetic>
          <p className="mt-3 font-mono text-[10.5px] text-slate-500">{t('acercá el mouse: el botón te sigue', 'move your mouse closer: the button follows you', 'avvicina il mouse: il bottone ti segue')}</p>

          <AnimatePresence>
            {chat && (
              <motion.div initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="mx-auto mt-6 max-w-sm rounded-2xl border border-white/10 bg-[#0c1220] p-4 text-left">
                <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  <MessageCircle size={12} style={{ color: GREEN }} /> {t('En el sitio real abre WhatsApp con este mensaje', 'On the real site this opens WhatsApp with this message', 'Sul sito reale apre WhatsApp con questo messaggio')}
                </p>
                <p className="w-fit max-w-full rounded-xl rounded-tl-sm px-3 py-2 text-[13px] text-white" style={{ background: '#0b5d45' }}>
                  {t('Hola SB Estudio Contable, quiero consultar sobre sus servicios.', 'Hi SB Estudio Contable, I’d like to ask about your services.', 'Ciao SB Estudio Contable, vorrei informazioni sui vostri servizi.')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-6">
        <button onClick={replay} className="btn btn-primary w-full !py-4">
          <RotateCcw size={15} /> {t('Reproducir animación', 'Replay animation', 'Riproduci animazione')}
        </button>
        <Range id="sb-stagger" label={t('Escalonado entre palabras', 'Stagger between words', 'Sfalsamento tra le parole')} value={stagger} min={0.02} max={0.2} step={0.01} unit="s" onChange={setStagger} />
        <Range id="sb-duration" label={t('Duración de cada palabra', 'Duration of each word', 'Durata di ogni parola')} value={duration} min={0.3} max={1.4} step={0.05} unit="s" onChange={setDuration} />
        <Range id="sb-orbs" label={t('Intensidad de los orbes', 'Orb intensity', 'Intensità delle sfere')} value={orbs} min={10} max={100} step={1} unit="%" onChange={setOrbs} />
        <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-4 font-mono text-[11.5px] leading-relaxed text-white/55">
          <p className="label mb-2 !text-accent">{t('Así está hecho', 'How it’s built', 'Com’è fatto')}</p>
          {t(
            <p>
              cada palabra sube desde una máscara <span className="text-white/80">overflow-hidden</span>; la curva es{' '}
              <span className="text-white/80">[{EASE.join(', ')}]</span> y se comparte en todo el sitio.
            </p>,
            <p>
              each word rises from an <span className="text-white/80">overflow-hidden</span> mask; the curve is{' '}
              <span className="text-white/80">[{EASE.join(', ')}]</span> and it’s shared across the whole site.
            </p>,
            <p>
              ogni parola sale da una maschera <span className="text-white/80">overflow-hidden</span>; la curva è{' '}
              <span className="text-white/80">[{EASE.join(', ')}]</span> ed è condivisa in tutto il sito.
            </p>,
          )}
        </div>
      </div>
    </div>
  )
}

function Range({ id, label, value, min, max, step, unit, onChange }: { id: string; label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void }) {
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
  const t = useT()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2">
          {SERVICES.map((s, i) => {
            const seen = opened.has(i)
            return (
              <li key={s.title.es}>
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
                  <span className="block font-display text-[13px] font-bold leading-tight">{t.l(s.title)}</span>
                  {seen && <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-mint text-void"><Check size={11} strokeWidth={4} /></span>}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="min-h-[240px] rounded-2xl border border-white/[0.08] bg-black/30 p-6">
          <AnimatePresence mode="wait">
            {svc ? (
              <motion.div key={svc.title.es} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="label !text-accent">{t('Lo que hacemos', 'What we do', 'Cosa facciamo')}</p>
                <h4 className="mt-1 mb-5 flex items-center gap-3 font-display text-xl font-bold"><svc.Icon size={22} className="text-accent" /> {t.l(svc.title)}</h4>
                <ul className="space-y-3">
                  {t.l(svc.items).map((it, i) => (
                    <motion.li key={it} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.08 * i }} className="flex items-start gap-3 text-[14.5px] text-white/75">
                      <Check size={16} className="mt-0.5 shrink-0 text-mint" />
                      {it}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <p className="grid h-full min-h-[200px] place-items-center text-center text-sm text-white/35">{t('Elegí un área para ver su detalle, igual que en la sección Servicios.', 'Pick an area to see its details, just like in the Services section.', 'Scegli un’area per vederne i dettagli, come nella sezione Servizi.')}</p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div>
        <p className="label mb-4">{t('Modalidad de atención adaptable', 'Flexible service modes', 'Modalità di assistenza flessibile')}</p>
        <div className="mb-5 inline-flex rounded-full border border-white/10 bg-black/30 p-1.5">
          {MODES.map((x, i) => (
            <button key={x.id} onClick={() => { sfx.pop(); setMode(i) }} aria-pressed={mode === i} className={`relative rounded-full px-5 py-2.5 text-[12px] font-bold transition-colors ${mode === i ? 'text-white' : 'text-white/50 hover:text-white/80'}`}>
              {mode === i && <motion.span layoutId="sb-mode" transition={{ type: 'spring', stiffness: 380, damping: 32 }} className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(135deg, ${x.color}, ${x.color}bb)` }} />}
              <span className="relative z-10 flex items-center gap-2"><x.Icon size={15} /> {t.l(x.label)}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="rounded-2xl border border-white/[0.08] bg-black/30 p-6">
            <h4 className="font-display text-lg font-bold" style={{ color: m.color }}>{t.l(m.title)}</h4>
            <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-white/65">{t.l(m.text)}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-3">
              {t.l(m.bullets).map((b) => (
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
