import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronLeft, ChevronRight, CreditCard, Loader2, Terminal, Video } from 'lucide-react'
import { game } from '../../game/store'
import { sfx } from '../../game/audio'
import { fx } from '../../lib/fx'

const SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const DOW = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const STEPS = ['Fecha', 'Horario', 'Pago', 'Confirmado']

const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return Math.abs(h)
}
const isBooked = (dateKey: string, time: string) => hash(dateKey + time) % 100 < 38

interface Line {
  t: string
  m: string
  path: string
  code: string
  note?: string
}

export function SbDemo() {
  const today = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return t
  }, [])
  const [step, setStep] = useState(0)
  const [monthOff, setMonthOff] = useState(0)
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [pay, setPay] = useState<'idle' | 'pref' | 'mp' | 'ok'>('idle')
  const [log, setLog] = useState<Line[]>([])
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const logEnd = useRef<HTMLDivElement>(null)
  const meet = useRef(`meet.google.com/${Math.random().toString(36).slice(2, 5)}-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 5)}`)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => {
    const el = logEnd.current?.parentElement
    if (el) el.scrollTop = el.scrollHeight
  }, [log])

  const push = (m: string, path: string, code: string, note?: string) => {
    const t = new Date().toLocaleTimeString('es-AR', { hour12: false })
    setLog((l) => [...l.slice(-30), { t, m, path, code, note }])
  }
  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms))

  const base = new Date(today.getFullYear(), today.getMonth() + monthOff, 1)
  const dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()
  const lead = (base.getDay() + 6) % 7

  const pickDate = (d: Date) => {
    sfx.click()
    game.play('sbestudio')
    setDate(d)
    setTime(null)
    setLoadingSlots(true)
    setStep(1)
    push('GET', `/api/get-booked-slots?date=${key(d)}`, '…')
    later(650, () => {
      setLoadingSlots(false)
      const n = SLOTS.filter((s) => isBooked(key(d), s)).length
      push('GET', `/api/get-booked-slots?date=${key(d)}`, '200', `${n} horarios ocupados en Google Calendar`)
    })
  }

  const pickTime = (t: string) => {
    sfx.click()
    setTime(t)
  }

  const goPay = () => {
    sfx.click()
    setStep(2)
    setPay('idle')
  }

  const payNow = () => {
    if (pay !== 'idle' || !date || !time) return
    sfx.click()
    setPay('pref')
    push('POST', '/api/create-preference', '…')
    later(700, () => {
      push('POST', '/api/create-preference', '200', 'init_point creado')
      setPay('mp')
    })
    later(1900, () => {
      push('POST', '/api/webhook-mp', '200', 'payment.approved · pago acreditado')
      setPay('ok')
      sfx.coin()
    })
    later(2700, () => {
      push('SDK', 'calendar.events.insert', '200', `evento ${key(date)} ${time} creado`)
      setStep(3)
      sfx.success()
      fx.confetti(['#3b76f6', '#22d3ee', '#ffffff', '#c8ff3d'])
      game.complete('sbestudio')
    })
  }

  const reset = () => {
    sfx.click()
    timers.current.forEach(clearTimeout)
    setStep(0)
    setDate(null)
    setTime(null)
    setPay('idle')
    setLog([])
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div>
        {/* stepper */}
        <ol className="mb-6 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[11px] transition ${i < step ? 'bg-accent text-void' : i === step ? 'border-2 border-accent text-accent' : 'border border-white/15 text-white/35'}`}>
                {i < step ? <Check size={13} strokeWidth={3.5} /> : i + 1}
              </span>
              <span className={`hidden font-mono text-[11px] uppercase tracking-wider sm:block ${i === step ? 'text-white' : 'text-white/35'}`}>{s}</span>
              {i < STEPS.length - 1 && <span className={`h-px flex-1 ${i < step ? 'bg-accent' : 'bg-white/10'}`} />}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display text-lg font-bold capitalize">{MONTHS[base.getMonth()]} {base.getFullYear()}</p>
                <div className="flex gap-2">
                  <button disabled={monthOff === 0} onClick={() => setMonthOff((m) => m - 1)} aria-label="Mes anterior" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 disabled:opacity-25"><ChevronLeft size={16} /></button>
                  <button disabled={monthOff >= 2} onClick={() => setMonthOff((m) => m + 1)} aria-label="Mes siguiente" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 disabled:opacity-25"><ChevronRight size={16} /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {DOW.map((d) => <span key={d} className="pb-1 font-mono text-[10px] text-white/35">{d}</span>)}
                {Array.from({ length: lead }, (_, i) => <span key={`l${i}`} />)}
                {Array.from({ length: dim }, (_, i) => {
                  const d = new Date(base.getFullYear(), base.getMonth(), i + 1)
                  const off = d < today || d.getDay() === 0 || d.getDay() === 6
                  const sel = date && key(date) === key(d)
                  return (
                    <button key={i} disabled={off} onClick={() => pickDate(d)} className={`aspect-square rounded-xl font-mono text-[13px] transition ${off ? 'text-white/20' : sel ? 'bg-accent font-bold text-void' : 'border border-white/10 text-white/80 hover:border-accent hover:bg-accent/10'} ${key(d) === key(today) ? 'ring-1 ring-accent/60' : ''}`}>
                      {i + 1}
                    </button>
                  )
                })}
              </div>
              <p className="mt-4 text-xs text-white/40">Los fines de semana y los días pasados están deshabilitados, igual que en el sitio real.</p>
            </motion.div>
          )}

          {step === 1 && date && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="label mb-1">Horarios para el</p>
              <p className="mb-5 block font-display text-xl font-bold first-letter:uppercase">{date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {SLOTS.map((s) => {
                  const booked = !loadingSlots && isBooked(key(date), s)
                  return loadingSlots ? (
                    <span key={s} className="h-12 animate-pulse rounded-xl bg-white/[0.06]" />
                  ) : (
                    <button key={s} disabled={booked} onClick={() => pickTime(s)} className={`h-12 rounded-xl font-mono text-sm transition ${booked ? 'text-white/20 line-through' : time === s ? 'bg-accent font-bold text-void' : 'border border-white/10 hover:border-accent hover:bg-accent/10'}`}>
                      {s}
                    </button>
                  )
                })}
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => { setStep(0); sfx.click() }} className="btn btn-ghost">Cambiar día</button>
                <button disabled={!time} onClick={goPay} className="btn btn-primary">Continuar al pago</button>
              </div>
            </motion.div>
          )}

          {step === 2 && date && time && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="label mb-3">Resumen</p>
                <p className="font-display text-lg font-bold">Consulta contable · 60 min</p>
                <p className="mt-1 text-sm text-white/55 first-letter:uppercase">{date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })} · {time} hs</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm text-white/55">Total</span>
                  <span className="font-display text-2xl font-black">$ 25.000</span>
                </div>
              </div>
              <button onClick={payNow} disabled={pay !== 'idle'} className="btn mt-5 w-full !py-4" style={{ background: '#009ee3', color: '#fff' }}>
                {pay === 'idle' ? <CreditCard size={16} /> : <Loader2 size={16} className="animate-spin" />}
                {pay === 'idle' && 'Pagar con Mercado Pago'}
                {pay === 'pref' && 'Creando preferencia…'}
                {pay === 'mp' && 'Procesando el pago…'}
                {pay === 'ok' && 'Pago aprobado · agendando…'}
              </button>
              <p className="mt-3 text-center text-xs text-white/35">Demo: no se procesa ningún pago real.</p>
            </motion.div>
          )}

          {step === 3 && date && time && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="mb-5 flex items-center gap-3 text-mint">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-mint/15"><Check size={20} strokeWidth={3} /></span>
                <div>
                  <p className="font-display text-lg font-bold text-white">¡Turno confirmado!</p>
                  <p className="text-sm text-white/50">Te llega la invitación por email.</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white text-[#1f2937]">
                <div className="flex">
                  <span className="w-1.5 bg-[#3b76f6]" />
                  <div className="flex-1 p-5">
                    <p className="text-lg font-semibold">Consulta contable · SB Estudio</p>
                    <p className="mt-1 text-sm text-[#4b5563] first-letter:uppercase">{date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })} · {time} – {String(Number(time.slice(0, 2)) + 1).padStart(2, '0')}:00</p>
                    <p className="mt-3 flex items-center gap-2 text-sm text-[#1a73e8]"><Video size={15} /> {meet.current}</p>
                    <p className="mt-3 text-xs text-[#6b7280]">Google Calendar · creado por la API</p>
                  </div>
                </div>
              </div>
              <button onClick={reset} className="btn btn-ghost mt-5">Reservar otro turno</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* consola del servidor */}
      <div className="flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-black/50">
        <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5 font-mono text-[11px] text-white/45">
          <Terminal size={13} className="text-accent" /> modo desarrollador · qué pasa detrás
        </div>
        <div className="max-h-[340px] flex-1 overflow-y-auto p-4 font-mono text-[11.5px] leading-relaxed">
          {log.length === 0 && <p className="text-white/30">Elegí un día y mirá las llamadas a la API en tiempo real.</p>}
          {log.map((l, i) => (
            <div key={i} className="mb-2">
              <p>
                <span className="text-white/30">{l.t} </span>
                <span className={l.m === 'GET' ? 'text-aqua' : l.m === 'POST' ? 'text-amber' : 'text-accent'}>{l.m} </span>
                <span className="break-all text-white/80">{l.path} </span>
                <span className={l.code === '200' ? 'text-mint' : 'text-white/40'}>{l.code}</span>
              </p>
              {l.note && <p className="pl-3 text-white/45">↳ {l.note}</p>}
            </div>
          ))}
          <div ref={logEnd} />
        </div>
      </div>
    </div>
  )
}
