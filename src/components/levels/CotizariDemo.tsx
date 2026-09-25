import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bike, Car, Check, House, Loader2, Mail, MessageCircle, Phone, Send, Star, type LucideIcon } from 'lucide-react'
import { game } from '../../game/store'
import { sfx } from '../../game/audio'
import { fx } from '../../lib/fx'
import { useT, type Loc } from '../../lib/i18n'

type Product = 'auto' | 'moto' | 'hogar'
type Tier = 0 | 1 | 2
type Convenio = 'destacado' | 'aliado' | null

interface Insurer {
  id: string
  name: string
  f: number
  rating: number
  claimsDays: number
  convenio: Convenio
}

// Aseguradoras ficticias, solo para la demo.
const INSURERS: Insurer[] = [
  { id: 'andina', name: 'Andina Seguros', f: 1.12, rating: 4.6, claimsDays: 1, convenio: 'destacado' },
  { id: 'pampa', name: 'Pampa Re', f: 0.9, rating: 3.9, claimsDays: 4, convenio: null },
  { id: 'aurora', name: 'Aurora Cía.', f: 1.0, rating: 4.3, claimsDays: 2, convenio: 'aliado' },
  { id: 'litoral', name: 'Litoral Protección', f: 0.84, rating: 3.6, claimsDays: 5, convenio: null },
  { id: 'cordillera', name: 'Cordillera', f: 1.22, rating: 4.8, claimsDays: 1, convenio: null },
  { id: 'norte', name: 'Norte Mutual', f: 0.96, rating: 4.1, claimsDays: 3, convenio: 'aliado' },
]

const TIERS: { name: Loc; sub: Loc; cover: number; mult: number }[] = [
  { name: { es: 'Básica', en: 'Basic', it: 'Base' }, sub: { es: 'Responsabilidad civil', en: 'Liability only', it: 'Solo RC' }, cover: 40, mult: 1 },
  { name: { es: 'Intermedia', en: 'Intermediate', it: 'Intermedia' }, sub: { es: 'Terceros completo', en: 'Full third-party', it: 'Terzi completa' }, cover: 70, mult: 1.9 },
  { name: { es: 'Premium', en: 'Premium', it: 'Premium' }, sub: { es: 'Todo riesgo', en: 'Comprehensive', it: 'Kasko' }, cover: 100, mult: 3.1 },
]

const PRODUCTS: Record<Product, { label: Loc; Icon: LucideIcon; age: Loc; ageUnit: Loc; ageRange: [number, number]; ageDef: number; val: Loc; valRange: [number, number]; valDef: number; rate: number }> = {
  auto: { label: { es: 'Auto', en: 'Car', it: 'Auto' }, Icon: Car, age: { es: 'Edad del conductor', en: 'Driver’s age', it: 'Età del conducente' }, ageUnit: { es: ' años', en: ' yrs', it: ' anni' }, ageRange: [18, 80], ageDef: 34, val: { es: 'Valor del vehículo', en: 'Vehicle value', it: 'Valore del veicolo' }, valRange: [5, 90], valDef: 24, rate: 0.0007 },
  moto: { label: { es: 'Moto', en: 'Motorcycle', it: 'Moto' }, Icon: Bike, age: { es: 'Edad del conductor', en: 'Rider’s age', it: 'Età del motociclista' }, ageUnit: { es: ' años', en: ' yrs', it: ' anni' }, ageRange: [18, 80], ageDef: 27, val: { es: 'Valor de la moto', en: 'Motorcycle value', it: 'Valore della moto' }, valRange: [1, 15], valDef: 4, rate: 0.0011 },
  hogar: { label: { es: 'Hogar', en: 'Home', it: 'Casa' }, Icon: House, age: { es: 'Antigüedad del inmueble', en: 'Property age', it: 'Età dell’immobile' }, ageUnit: { es: ' años', en: ' yrs', it: ' anni' }, ageRange: [0, 60], ageDef: 12, val: { es: 'Valor del inmueble', en: 'Property value', it: 'Valore dell’immobile' }, valRange: [20, 300], valDef: 90, rate: 0.00022 },
}

const WEIGHTS = [
  { k: 'price', label: { es: 'Precio', en: 'Price', it: 'Prezzo' }, color: '#4ade80' },
  { k: 'cover', label: { es: 'Cobertura', en: 'Coverage', it: 'Copertura' }, color: '#22d3ee' },
  { k: 'rating', label: { es: 'Aseguradora', en: 'Insurer', it: 'Compagnia' }, color: '#c084fc' },
  { k: 'claims', label: { es: 'Siniestros', en: 'Claims', it: 'Sinistri' }, color: '#ffb547' },
] as const

const CONVENIO: Record<NonNullable<Convenio>, Loc> = {
  destacado: { es: 'Destacado', en: 'Featured', it: 'In evidenza' },
  aliado: { es: 'Aliado', en: 'Partner', it: 'Partner' },
}

const money = (n: number, locale: string) => `$ ${(Math.round(n / 10) * 10).toLocaleString(locale)}`

function ageFactor(p: Product, age: number) {
  if (p === 'hogar') return 1 + age * 0.006
  if (age < 25) return 1.5
  if (age < 30) return 1.2
  if (age > 65) return 1.15
  return 1
}

interface Option {
  key: string
  insurer: Insurer
  tier: Tier
  price: number
  parts: Record<(typeof WEIGHTS)[number]['k'], number>
  score: number
  bonus: number
}

export function CotizariDemo() {
  const [product, setProduct] = useState<Product>('auto')
  const cfg = PRODUCTS[product]
  const [age, setAge] = useState(cfg.ageDef)
  const [val, setVal] = useState(cfg.valDef)
  const [prio, setPrio] = useState(50)
  const [bonusOn, setBonusOn] = useState(true)
  const [tierFilter, setTierFilter] = useState<Tier | 'all'>('all')
  const touched = useRef(false)
  const t = useT()

  const touch = () => {
    if (!touched.current) {
      touched.current = true
      game.play('cotizari')
    }
  }

  const pickProduct = (p: Product) => {
    sfx.click()
    setProduct(p)
    setAge(PRODUCTS[p].ageDef)
    setVal(PRODUCTS[p].valDef)
    touch()
  }

  // pesos reales 42/38/12/8, con el slider desplazando entre precio y cobertura
  const w = useMemo(() => {
    const shift = ((prio - 50) / 50) * 0.2
    return { price: 0.42 - shift, cover: 0.38 + shift, rating: 0.12, claims: 0.08 }
  }, [prio])

  const options = useMemo<Option[]>(() => {
    const base = val * 1_000_000 * cfg.rate * ageFactor(product, age)
    const raw = INSURERS.flatMap((ins) => ([0, 1, 2] as Tier[]).map((tier) => ({ ins, tier, price: base * ins.f * TIERS[tier].mult })))
    const min = Math.min(...raw.map((r) => r.price))
    const list = raw.map(({ ins, tier, price }) => {
      const parts = {
        price: 100 * (min / price),
        cover: TIERS[tier].cover,
        rating: (ins.rating / 5) * 100,
        claims: 100 - (ins.claimsDays - 1) * 12,
      }
      const bonus = bonusOn ? (ins.convenio === 'destacado' ? 3 : ins.convenio === 'aliado' ? 1 : 0) : 0
      const score = Math.min(100, parts.price * w.price + parts.cover * w.cover + parts.rating * w.rating + parts.claims * w.claims + bonus)
      return { key: `${ins.id}-${tier}`, insurer: ins, tier, price, parts, score, bonus }
    })
    return list.sort((a, b) => b.score - a.score)
  }, [age, val, w, bonusOn, cfg.rate, product])

  const best = options[0]
  const shown = options.filter((o) => tierFilter === 'all' || o.tier === tierFilter).slice(0, 6)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(PRODUCTS) as Product[]).map((p) => {
            const P = PRODUCTS[p]
            return (
              <button key={p} onClick={() => pickProduct(p)} aria-pressed={product === p} className={`flex flex-col items-center gap-1.5 rounded-2xl border py-3 transition ${product === p ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-white/60 hover:border-white/25'}`}>
                <P.Icon size={20} />
                <span className="font-mono text-[11px] uppercase tracking-wider">{t.l(P.label)}</span>
              </button>
            )
          })}
        </div>

        <Slider id="cz-age" label={t.l(cfg.age)} value={age} min={cfg.ageRange[0]} max={cfg.ageRange[1]} suffix={t.l(cfg.ageUnit)} onChange={(v) => { setAge(v); touch() }} />
        <Slider id="cz-val" label={t.l(cfg.val)} value={val} min={cfg.valRange[0]} max={cfg.valRange[1]} prefix="$ " suffix=" M" onChange={(v) => { setVal(v); touch() }} />
        <div>
          <Slider id="cz-prio" label={t('Qué priorizás', 'What you prioritize', 'Cosa preferisci')} value={prio} min={0} max={100} format={(v) => (v < 35 ? t('Precio', 'Price', 'Prezzo') : v > 65 ? t('Cobertura', 'Coverage', 'Copertura') : t('Equilibrio', 'Balance', 'Equilibrio'))} onChange={(v) => { setPrio(v); touch() }} />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-white/30"><span>← {t('precio', 'price', 'prezzo')}</span><span>{t('cobertura', 'coverage', 'copertura')} →</span></div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-black/25 p-4">
          <p className="label mb-3">{t('Pesos del score', 'Score weights', 'Pesi dello score')}</p>
          <div className="space-y-2">
            {WEIGHTS.map((x) => (
              <div key={x.k} className="flex items-center gap-2.5 text-xs">
                <span className="w-[74px] text-white/55">{t.l(x.label)}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.span className="block h-full rounded-full" style={{ background: x.color }} animate={{ width: `${w[x.k] * 100 * 1.6}%` }} transition={{ type: 'spring', stiffness: 200, damping: 24 }} />
                </span>
                <span className="w-9 text-right font-mono text-white/60">{Math.round(w[x.k] * 100)}%</span>
              </div>
            ))}
          </div>
          <label className="mt-4 flex cursor-pointer items-center gap-3 text-xs text-white/60">
            <input type="checkbox" checked={bonusOn} onChange={(e) => { setBonusOn(e.target.checked); sfx.click(); touch() }} className="h-4 w-4 accent-[var(--accent)]" />
            {t('Aplicar bonus por convenio divulgado (+1 Aliado · +3 Destacado)', 'Apply disclosed partnership bonus (+1 Partner · +3 Featured)', 'Applica il bonus di convenzione dichiarato (+1 Partner · +3 In evidenza)')}
          </label>
        </div>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="label mr-1">{t('Cobertura', 'Coverage', 'Copertura')}</span>
          {(['all', 0, 1, 2] as const).map((tier) => (
            <button key={tier} onClick={() => { sfx.click(); setTierFilter(tier) }} className={`chip transition ${tierFilter === tier ? '!border-accent !bg-accent/15 !text-accent' : 'hover:!border-white/30'}`}>
              {tier === 'all' ? t('Todas', 'All', 'Tutte') : t.l(TIERS[tier].name)}
            </button>
          ))}
        </div>

        <ul className="space-y-2.5">
          {shown.map((o, i) => {
            const top = o.key === best.key
            return (
              <motion.li layout key={o.key} transition={{ type: 'spring', stiffness: 400, damping: 34 }} className={`relative overflow-hidden rounded-2xl border p-4 ${top ? 'border-accent bg-accent/[0.07] shadow-[0_0_40px_-12px_var(--accent)]' : 'border-white/[0.08] bg-white/[0.02]'}`}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="font-mono text-xs text-white/30">{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-[150px] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-[15px] font-bold">{o.insurer.name}</span>
                      {top && <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase text-void"><Star size={10} className="fill-current" /> {t('Recomendada', 'Recommended', 'Consigliata')}</span>}
                      {o.insurer.convenio && <span className="rounded-full border border-white/15 px-2 py-0.5 font-mono text-[9.5px] uppercase text-white/55">{t.l(CONVENIO[o.insurer.convenio])}</span>}
                    </div>
                    <p className="mt-0.5 text-xs text-white/45">{t.l(TIERS[o.tier].name)} · {t.l(TIERS[o.tier].sub)} · ★ {o.insurer.rating}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold tabular-nums">{money(o.price, t.locale)}</p>
                    <p className="font-mono text-[10px] text-white/35">{t('por mes', 'per month', 'al mese')}</p>
                  </div>
                  <div className="w-full sm:w-[120px]">
                    <div className="mb-1 flex items-baseline justify-between">
                      <span className="font-mono text-[10px] text-white/35">SCORE</span>
                      <span className={`font-display text-xl font-black tabular-nums ${top ? 'text-accent' : ''}`}>{Math.round(o.score)}</span>
                    </div>
                    <div className="flex h-1.5 gap-px overflow-hidden rounded-full">
                      {WEIGHTS.map((x) => (
                        <span key={x.k} style={{ width: `${(o.parts[x.k] * w[x.k])}%`, background: x.color }} className="block h-full" />
                      ))}
                    </div>
                  </div>
                </div>
                {top && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 border-t border-white/10 pt-3 text-[12.5px] leading-relaxed text-white/60">
                    {t(
                      <>
                        Gana por combinar <b className="text-white/85">{o.parts.price > 75 ? 'buen precio' : 'precio razonable'}</b> con <b className="text-white/85">cobertura {t.l(TIERS[o.tier].name).toLowerCase()}</b> y una aseguradora con {o.insurer.claimsDays === 1 ? 'respuesta de siniestros en el día' : `siniestros en ~${o.insurer.claimsDays} días`}.
                        {o.bonus > 0 && ' Incluye el bonus de convenio, divulgado.'}
                      </>,
                      <>
                        It wins by combining <b className="text-white/85">{o.parts.price > 75 ? 'a great price' : 'a fair price'}</b> with <b className="text-white/85">{t.l(TIERS[o.tier].name).toLowerCase()} coverage</b> and an insurer that {o.insurer.claimsDays === 1 ? 'handles claims same-day' : `settles claims in ~${o.insurer.claimsDays} days`}.
                        {o.bonus > 0 && ' Includes the disclosed partnership bonus.'}
                      </>,
                      <>
                        Vince perché unisce <b className="text-white/85">{o.parts.price > 75 ? 'un ottimo prezzo' : 'un prezzo ragionevole'}</b> a una <b className="text-white/85">copertura {t.l(TIERS[o.tier].name).toLowerCase()}</b> e a una compagnia che {o.insurer.claimsDays === 1 ? 'gestisce i sinistri in giornata' : `liquida i sinistri in ~${o.insurer.claimsDays} giorni`}.
                        {o.bonus > 0 && ' Include il bonus di convenzione, dichiarato.'}
                      </>,
                    )}
                  </motion.p>
                )}
              </motion.li>
            )
          })}
        </ul>
        <p className="mt-3 text-[11.5px] leading-snug text-white/35">
          {t(
            'Regla de Cotizari: la recomendada es siempre la de mayor score, con o sin convenio. Apagá el bonus y comprobalo.',
            'Cotizari’s rule: the recommended option is always the highest score, partner or not. Turn the bonus off and check.',
            'Regola di Cotizari: la consigliata è sempre quella con lo score più alto, con o senza convenzione. Disattiva il bonus e verificalo.',
          )}
        </p>

        <Agent />
      </div>
    </div>
  )
}

function Slider({ id, label, value, min, max, prefix = '', suffix = '', format, onChange }: { id: string; label: string; value: number; min: number; max: number; prefix?: string; suffix?: string; format?: (v: number) => string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between">
        <label htmlFor={id} className="label">{label}</label>
        <span className="font-display text-base font-bold text-accent tabular-nums">{format ? format(value) : `${prefix}${value}${suffix}`}</span>
      </div>
      <input id={id} type="range" className="range" min={min} max={max} value={value} style={{ ['--fill' as string]: `${((value - min) / (max - min)) * 100}%` }} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  )
}

// Agente de contacto simulado: email, llamada o mensaje.
const CHANNELS = [
  { k: 'email', label: { es: 'Email', en: 'Email', it: 'Email' }, Icon: Mail, svc: 'Resend' },
  { k: 'mensaje', label: { es: 'Mensaje', en: 'Message', it: 'Messaggio' }, Icon: MessageCircle, svc: 'WhatsApp Cloud API' },
  { k: 'llamada', label: { es: 'Llamada', en: 'Call', it: 'Chiamata' }, Icon: Phone, svc: 'Twilio Voice' },
] as const

function Agent() {
  const [ch, setCh] = useState<(typeof CHANNELS)[number]>(CHANNELS[1])
  const [log, setLog] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const t = useT()

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const run = () => {
    if (running) return
    sfx.click()
    setRunning(true)
    setLog([])
    const id = 4800 + Math.floor(Math.random() * 199)
    const channel = t.l(ch.label).toLowerCase()
    const lines = t(
      [
        `lead #A-${id} creado · estado: nuevo`,
        `agente → canal "${channel}" vía ${ch.svc} (simulado)`,
        'primer contacto enviado ✓',
        'actividad registrada en el lead',
        'panel del broker → estado: contactado',
      ],
      [
        `lead #A-${id} created · status: new`,
        `agent → "${channel}" channel via ${ch.svc} (simulated)`,
        'first contact sent ✓',
        'activity logged on the lead',
        'broker dashboard → status: contacted',
      ],
      [
        `lead #A-${id} creato · stato: nuovo`,
        `agente → canale "${channel}" via ${ch.svc} (simulato)`,
        'primo contatto inviato ✓',
        'attività registrata sul lead',
        'pannello del broker → stato: contattato',
      ],
    )
    lines.forEach((l, i) => {
      timers.current.push(
        setTimeout(() => {
          setLog((x) => [...x, l])
          sfx.type()
          if (i === lines.length - 1) {
            setRunning(false)
            sfx.success()
            fx.burst(innerWidth / 2, innerHeight * 0.6, { count: 26 })
            game.unlock('insured')
            game.complete('cotizari')
          }
        }, 500 + i * 620),
      )
    })
  }

  return (
    <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/30 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="label !text-accent">{t('Desafío', 'Challenge', 'Sfida')}</p>
          <p className="font-display text-base font-bold">{t('Que el agente te contacte', 'Get the agent to reach out', 'Fatti contattare dall’agente')}</p>
        </div>
        <div className="flex gap-2">
          {CHANNELS.map((c) => (
            <button key={c.k} onClick={() => { sfx.click(); setCh(c) }} aria-pressed={ch.k === c.k} aria-label={t.l(c.label)} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] transition ${ch.k === c.k ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-white/55 hover:border-white/25'}`}>
              <c.Icon size={13} /> {t.l(c.label)}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        <button onClick={run} disabled={running} className="btn btn-primary shrink-0">
          {running ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} {t('Pedir contacto', 'Request contact', 'Richiedi contatto')}
        </button>
        <div className="min-h-[92px] flex-1 rounded-xl bg-black/40 p-3 font-mono text-[11.5px] leading-relaxed">
          {log.length === 0 && <p className="text-white/30">{t('La bitácora del agente aparece acá.', 'The agent’s log shows up here.', 'Il registro dell’agente appare qui.')}</p>}
          <AnimatePresence initial={false}>
            {log.map((l, i) => (
              <motion.p key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-white/70">
                <span className="text-accent">[{t('agente', 'agent', 'agente')}] </span>
                {l}
                {i === log.length - 1 && !running && <Check size={12} className="ml-1.5 inline text-mint" />}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
