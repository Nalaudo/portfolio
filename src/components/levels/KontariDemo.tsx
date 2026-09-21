import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, ArrowRight, CalendarDays, Check, KeyRound, Loader2, Lock, ShieldCheck, Unlock } from 'lucide-react'
import { game } from '../../game/store'
import { sfx } from '../../game/audio'
import { fx } from '../../lib/fx'
import { ScrambleText } from '../ui/bits'

type Tab = 'venc' | 'vault'

// ---------- CUIT ----------
const PREFIXES: Record<string, string> = { '20': 'Persona humana', '23': 'Persona humana', '24': 'Persona humana', '27': 'Persona humana', '30': 'Persona jurídica', '33': 'Persona jurídica', '34': 'Persona jurídica' }
const WEIGHTS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]

function checkDigit(d10: string): number | null {
  const sum = WEIGHTS.reduce((a, w, i) => a + w * Number(d10[i]), 0)
  let v = 11 - (sum % 11)
  if (v === 11) v = 0
  return v === 10 ? null : v
}
function validCuit(d: string) {
  if (d.length !== 11 || !PREFIXES[d.slice(0, 2)]) return false
  return checkDigit(d.slice(0, 10)) === Number(d[10])
}
function sampleCuit() {
  for (let n = 71234567; ; n++) {
    const base = `30${n}`
    const c = checkDigit(base)
    if (c !== null) return base + c
  }
}
const fmt = (d: string) => [d.slice(0, 2), d.slice(2, 10), d.slice(10)].filter(Boolean).join('-')

// Tabla de ejemplo: terminación de CUIT -> día de vencimiento del mes.
const DUE_DAY = [18, 18, 19, 19, 20, 20, 21, 21, 22, 22]
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const DOW = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function Vencimientos({ onDone }: { onDone: () => void }) {
  const [raw, setRaw] = useState('')
  const [off, setOff] = useState(0)
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  const ok = validCuit(digits)
  const full = digits.length === 11

  const today = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return t
  }, [])
  const base = new Date(today.getFullYear(), today.getMonth() + off, 1)
  const year = base.getFullYear()
  const month = base.getMonth()
  const dim = new Date(year, month + 1, 0).getDate()
  const lead = (base.getDay() + 6) % 7

  const term = ok ? Number(digits[10]) : null
  const nominal = term === null ? null : DUE_DAY[term]
  let due: Date | null = null
  let shifted = false
  if (nominal) {
    due = new Date(year, month, nominal)
    const dw = due.getDay()
    if (dw === 6) {
      due = new Date(year, month, nominal + 2)
      shifted = true
    } else if (dw === 0) {
      due = new Date(year, month, nominal + 1)
      shifted = true
    }
  }
  const days = due ? Math.round((due.getTime() - today.getTime()) / 86400000) : null

  useEffect(() => {
    if (ok) {
      game.play('kontari')
      onDone()
    }
  }, [ok, onDone])

  const setSample = () => {
    sfx.click()
    setRaw(fmt(sampleCuit()))
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div>
        <label htmlFor="cuit" className="label mb-2 block">CUIT del cliente</label>
        <div className={`flex items-center gap-3 rounded-2xl border bg-black/30 px-4 transition ${full ? (ok ? 'border-mint/60' : 'border-rose/60') : 'border-white/10 focus-within:border-accent'}`}>
          <input
            id="cuit"
            inputMode="numeric"
            autoComplete="off"
            value={fmt(digits)}
            onChange={(e) => {
              setRaw(e.target.value)
              sfx.type()
            }}
            placeholder="30-71234567-8"
            className="h-14 flex-1 bg-transparent font-mono text-lg tracking-wider outline-none placeholder:text-white/20"
          />
          {full && (ok ? <Check className="text-mint" size={20} /> : <AlertTriangle className="text-rose" size={20} />)}
        </div>
        <p className="mt-2 min-h-[20px] text-xs text-white/45">
          {full ? (ok ? `${PREFIXES[digits.slice(0, 2)]} · dígito verificador correcto` : 'CUIT inválido: el dígito verificador (módulo 11) no coincide.') : 'Escribí 11 dígitos o usá uno de ejemplo.'}
        </p>
        <button onClick={setSample} className="btn btn-ghost mt-3 !py-2.5">Usar un CUIT de ejemplo</button>

        <div className="mt-8">
          <p className="label mb-3">Mes a consultar</p>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3].map((o) => {
              const d = new Date(today.getFullYear(), today.getMonth() + o, 1)
              return (
                <button key={o} onClick={() => { sfx.click(); setOff(o) }} className={`chip transition ${off === o ? '!border-accent !bg-accent/15 !text-accent' : 'hover:!border-white/30'}`}>
                  {MONTHS[d.getMonth()].slice(0, 3)} {d.getFullYear()}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
          <p className="label mb-3">Tabla de ejemplo · terminación → día</p>
          <div className="grid grid-cols-5 gap-2 text-center">
            {[0, 2, 4, 6, 8].map((t) => (
              <div key={t} className={`rounded-lg border py-2 transition ${term !== null && Math.floor(term / 2) * 2 === t ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-white/50'}`}>
                <p className="font-mono text-[10px]">{t}-{t + 1}</p>
                <p className="font-display text-base font-bold">{DUE_DAY[t]}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] leading-snug text-white/40">Los feriados y el calendario real se cargan desde el catálogo de impuestos de la app. Acá se ejemplifica solo el corrimiento por fin de semana.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-black/25 p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-lg font-bold capitalize">{MONTHS[month]} {year}</p>
          <CalendarDays size={18} className="text-accent" />
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {DOW.map((d) => (
            <span key={d} className="pb-1 font-mono text-[10px] text-white/35">{d}</span>
          ))}
          {Array.from({ length: lead }, (_, i) => <span key={`l${i}`} />)}
          {Array.from({ length: dim }, (_, i) => {
            const day = i + 1
            const dt = new Date(year, month, day)
            const wk = dt.getDay() === 0 || dt.getDay() === 6
            const isDue = due && due.getDate() === day && due.getMonth() === month
            const isNominal = nominal === day && shifted
            return (
              <motion.span
                key={day}
                animate={isDue ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`relative grid aspect-square place-items-center rounded-lg font-mono text-[12px] ${isDue ? 'bg-accent font-bold text-void shadow-[0_0_24px_-2px_var(--accent)]' : isNominal ? 'border border-dashed border-rose text-rose' : wk ? 'text-white/25' : 'text-white/65'}`}
              >
                {day}
              </motion.span>
            )
          })}
        </div>
        <div className="mt-5 min-h-[92px] rounded-xl bg-white/[0.03] p-4">
          {due && days !== null ? (
            <>
              <p className="label !text-accent">Vencimiento calculado</p>
              <p className="mt-1 block font-display text-lg font-bold leading-tight first-letter:uppercase">{due.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <p className="mt-1.5 text-[13px] text-white/55">
                {shifted && <span className="text-rose">El {nominal} cae en fin de semana: corre al día hábil siguiente. </span>}
                {days > 0 ? `Faltan ${days} días.` : days === 0 ? 'Vence hoy.' : `Venció hace ${-days} días.`}
              </p>
            </>
          ) : (
            <p className="text-sm text-white/40">Ingresá un CUIT válido para calcular el vencimiento y ver cómo se corre por fin de semana.</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------- Bóveda ----------
const hex = (u: Uint8Array) => Array.from(u, (b) => b.toString(16).padStart(2, '0')).join('')

interface Sealed {
  salt: Uint8Array
  iv: Uint8Array
  ct: Uint8Array
  ms: number
}

const STAGES = ['Texto plano', 'PBKDF2 · 600.000 iteraciones', 'Clave AES-256', 'AES-GCM (iv + tag)', 'Bytes cifrados']

function Vault({ onDone }: { onDone: () => void }) {
  const canCrypto = typeof crypto !== 'undefined' && !!crypto.subtle
  const [secret, setSecret] = useState('Clave fiscal ARCA · Ferretería Norte · Lm#8271-demo')
  const [pass, setPass] = useState('kontari-2026')
  const [sealed, setSealed] = useState<Sealed | null>(null)
  const [stage, setStage] = useState(0)
  const [busy, setBusy] = useState(false)
  const [unlockPass, setUnlockPass] = useState('')
  const [plain, setPlain] = useState<string | null>(null)
  const [err, setErr] = useState(false)
  const [shake, setShake] = useState(0)

  const derive = async (p: string, salt: Uint8Array) => {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(p), 'PBKDF2', false, ['deriveKey'])
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt as BufferSource, iterations: 600000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
  }

  const encrypt = async () => {
    if (!canCrypto || busy || !secret || !pass) return
    game.play('kontari')
    setBusy(true)
    setSealed(null)
    setPlain(null)
    setErr(false)
    setStage(1)
    sfx.click()
    const t0 = performance.now()
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))
    await new Promise((r) => setTimeout(r, 60))
    const key = await derive(pass, salt)
    setStage(2)
    await new Promise((r) => setTimeout(r, 380))
    setStage(3)
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as BufferSource }, key, new TextEncoder().encode(secret)))
    await new Promise((r) => setTimeout(r, 380))
    setStage(4)
    setSealed({ salt, iv, ct, ms: Math.round(performance.now() - t0) })
    setBusy(false)
    sfx.success()
  }

  const decrypt = async () => {
    if (!sealed || busy) return
    setBusy(true)
    setErr(false)
    setPlain(null)
    try {
      const key = await derive(unlockPass, sealed.salt)
      const out = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: sealed.iv as BufferSource }, key, sealed.ct as BufferSource)
      setPlain(new TextDecoder().decode(out))
      sfx.coin()
      fx.burst(innerWidth / 2, innerHeight / 2, { count: 30 })
      game.unlock('crypto')
      onDone()
    } catch {
      setErr(true)
      setShake((s) => s + 1)
      sfx.error()
    }
    setBusy(false)
  }

  if (!canCrypto) {
    return (
      <div className="rounded-2xl border border-amber/40 bg-amber/10 p-6 text-sm text-amber">
        Tu navegador no expone WebCrypto en este contexto (hace falta HTTPS o localhost). En la versión publicada esta demo funciona normalmente.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div>
          <label htmlFor="secret" className="label mb-2 block">1 · Secreto a proteger</label>
          <textarea id="secret" value={secret} onChange={(e) => setSecret(e.target.value)} rows={3} className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-[13px] leading-relaxed outline-none transition focus:border-accent" />
        </div>
        <div>
          <label htmlFor="pass" className="label mb-2 block">2 · Passphrase maestra</label>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 transition focus-within:border-accent">
            <KeyRound size={16} className="text-accent" />
            <input id="pass" value={pass} onChange={(e) => setPass(e.target.value)} className="h-12 flex-1 bg-transparent font-mono text-sm outline-none" />
          </div>
        </div>
        <button onClick={encrypt} disabled={busy || !secret || !pass} className="btn btn-primary w-full !py-4">
          {busy && stage < 4 ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
          {busy && stage < 4 ? 'Derivando clave…' : 'Cifrar en mi navegador'}
        </button>

        <ol className="space-y-2 pt-1">
          {STAGES.map((s, i) => {
            const on = stage >= i && (i === 0 || stage > 0)
            const current = stage === i && busy
            return (
              <li key={s} className={`flex items-center gap-3 font-mono text-[12px] transition ${on ? 'text-white' : 'text-white/30'}`}>
                <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] transition ${on ? 'bg-accent text-void' : 'border border-white/20'}`}>
                  {current ? <Loader2 size={11} className="animate-spin" /> : on ? <Check size={11} strokeWidth={3.5} /> : i + 1}
                </span>
                {s}
              </li>
            )
          })}
        </ol>
      </div>

      <div className="flex flex-col gap-4">
        <div className="min-h-[190px] flex-1 rounded-2xl border border-white/[0.07] bg-black/40 p-4 font-mono text-[11.5px] leading-relaxed">
          <p className="label mb-3 flex items-center gap-2"><ShieldCheck size={12} /> Lo único que vería el servidor</p>
          {sealed ? (
            <div className="space-y-2 break-all">
              <p><span className="text-accent">salt </span><span className="text-white/55">{hex(sealed.salt)}</span></p>
              <p><span className="text-accent">iv   </span><span className="text-white/55">{hex(sealed.iv)}</span></p>
              <p><span className="text-accent">data </span><span className="text-white/80"><ScrambleText text={hex(sealed.ct)} duration={1100} /></span></p>
              <p className="pt-1 text-white/35">{sealed.ct.length} bytes · derivación + cifrado en {sealed.ms} ms · el tag GCM autentica el mensaje</p>
            </div>
          ) : (
            <p className="text-white/30">{busy ? 'calculando…' : 'Todavía no cifraste nada.'}</p>
          )}
        </div>

        <motion.div key={shake} animate={shake ? { x: [0, -8, 7, -5, 3, 0] } : undefined} transition={{ duration: 0.4 }} className={`rounded-2xl border p-4 transition ${sealed ? 'border-white/10' : 'border-white/[0.05] opacity-50'}`}>
          <label htmlFor="unlock" className="label mb-2 block">3 · Desbloquear</label>
          <div className="flex gap-2">
            <input id="unlock" value={unlockPass} onChange={(e) => setUnlockPass(e.target.value)} disabled={!sealed} placeholder="Passphrase (probá una equivocada)" className={`h-12 min-w-0 flex-1 rounded-xl border bg-black/30 px-4 font-mono text-sm outline-none transition ${err ? 'border-rose' : 'border-white/10 focus:border-accent'}`} onKeyDown={(e) => e.key === 'Enter' && decrypt()} />
            <button onClick={decrypt} disabled={!sealed || busy} className="btn btn-ghost !px-4" aria-label="Descifrar"><Unlock size={16} /></button>
          </div>
          <div className="mt-3 min-h-[46px] text-[13px]">
            <AnimatePresence mode="wait">
              {err && <motion.p key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-mono text-rose">✗ OperationError: el tag de autenticación no coincide. Sin la clave correcta no hay forma de leerlo.</motion.p>}
              {plain !== null && <motion.p key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-mono text-mint">✓ <ScrambleText text={plain} /></motion.p>}
            </AnimatePresence>
          </div>
        </motion.div>
        <p className="text-[12px] leading-snug text-white/40">Es el mismo esquema que usa la bóveda de Kontari: PBKDF2-SHA256 (600k) + AES-256-GCM, todo del lado del cliente.</p>
      </div>
    </div>
  )
}

export function KontariDemo() {
  const [tab, setTab] = useState<Tab>('venc')
  const [doneDue, setDoneDue] = useState(false)
  const [doneVault, setDoneVault] = useState(false)
  const markDue = useCallback(() => setDoneDue(true), [])
  const markVault = useCallback(() => setDoneVault(true), [])

  useEffect(() => {
    if (doneDue && doneVault) game.complete('kontari')
  }, [doneDue, doneVault])

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-white/10 bg-black/30 p-1" role="tablist">
          {(
            [
              ['venc', 'Vencimientos', doneDue],
              ['vault', 'Bóveda E2EE', doneVault],
            ] as const
          ).map(([k, label, ok]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => { sfx.click(); setTab(k) }} className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition ${tab === k ? 'bg-accent text-void' : 'text-white/60 hover:text-white'}`}>
              {label}
              {ok && <Check size={12} strokeWidth={3.5} />}
            </button>
          ))}
        </div>
        <p className="flex items-center gap-2 font-mono text-[11px] text-white/40">
          Desafío: completá las dos pruebas <ArrowRight size={12} /> {Number(doneDue) + Number(doneVault)}/2
        </p>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
          {tab === 'venc' ? <Vencimientos onDone={markDue} /> : <Vault onDone={markVault} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
