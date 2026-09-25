import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, useInView } from 'motion/react'
import { Star } from 'lucide-react'
import { fx } from '../../lib/fx'
import { sfx } from '../../game/audio'
import { game, toastStore, useGame } from '../../game/store'
import { useT } from '../../lib/i18n'

const GLYPHS = '01<>/_=+*#$%&?'

/** Texto que se "descifra" al activarse. */
export function ScrambleText({ text, active = true, className = '', delay = 0, duration = 900 }: {
  text: string
  active?: boolean
  className?: string
  delay?: number
  duration?: number
}) {
  const [out, setOut] = useState(text)
  const frame = useRef(0)
  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text)
      return
    }
    let start = 0
    const timer = setTimeout(() => {
      const tick = (t: number) => {
        if (!start) start = t
        const p = Math.min(1, (t - start) / duration)
        const reveal = Math.floor(p * text.length)
        setOut(
          text
            .split('')
            .map((c, i) => (c === ' ' || i < reveal ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
            .join(''),
        )
        if (p < 1) frame.current = requestAnimationFrame(tick)
      }
      frame.current = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame.current)
    }
  }, [active, text, delay, duration])
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{active ? out : text.replace(/[^ ]/g, '·')}</span>
    </span>
  )
}

export function Counter({ to, suffix = '', duration = 1.6, className = '' }: { to: number; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const [v, setV] = useState(0)
  const t = useT()
  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(to)
      return
    }
    const c = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, to, duration])
  return (
    <span ref={ref} className={className}>
      {to >= 1000 ? v : v.toLocaleString(t.locale)}
      {suffix}
    </span>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return <span className="kbd">{children}</span>
}

export function Stars({ n, max = 3, size = 14 }: { n: number; max?: number; size?: number }) {
  const t = useT()
  return (
    <span className="inline-flex gap-0.5" aria-label={t(`${n} de ${max} estrellas`, `${n} of ${max} stars`, `${n} di ${max} stelle`)}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < n ? 'fill-accent text-accent drop-shadow-[0_0_6px_var(--accent)]' : 'text-white/20'}
        />
      ))}
    </span>
  )
}

/** Estrella coleccionable escondida. Posicionala con className (el padre debe ser relative). */
export function Relic({ id, className = '', size = 22 }: { id: string; className?: string; size?: number }) {
  const got = useGame((s) => s.coins.includes(id))
  const started = useGame((s) => s.started)
  const t = useT()
  if (got || !started) return null
  const grab = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!game.collect(id)) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    sfx.coin()
    fx.burst(x, y, { colors: ['#ffb547', '#ffe08a', '#fff'], count: 22, speed: 260, shape: 'star' })
    fx.floatText(x, y - 12, '+25 XP', '#ffb547')
    const found = game.get().coins.length
    toastStore.push({
      kind: 'info',
      title: t('Estrella encontrada', 'Star found', 'Stella trovata'),
      text: t(`Llevás ${found} de 7. ${found >= 7 ? '¡Las tenés todas!' : 'Seguí buscando.'}`, `${found} of 7 found. ${found >= 7 ? 'You got them all!' : 'Keep looking.'}`, `${found} su 7 trovate. ${found >= 7 ? 'Le hai prese tutte!' : 'Continua a cercare.'}`),
    })
  }
  return (
    <button
      onClick={grab}
      aria-label={t('Estrella escondida', 'Hidden star', 'Stella nascosta')}
      title={t('…¿qué es eso?', '…what’s that?', '…cos’è quello?')}
      className={`absolute z-20 grid place-items-center rounded-full opacity-60 transition hover:opacity-100 hover:scale-125 ${className}`}
      style={{ width: size + 14, height: size + 14 }}
    >
      <Star size={size} className="animate-twinkle fill-amber text-amber drop-shadow-[0_0_8px_#ffb547]" />
    </button>
  )
}

export function SectionTitle({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="label mb-3 flex items-center gap-3 text-accent">
        <span className="h-px w-8 bg-accent" />
        {eyebrow}
      </p>
      <h2 className="font-display text-[clamp(1.9rem,4.6vw,3.4rem)] font-black leading-[1.02] tracking-tight">{title}</h2>
      {children && <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">{children}</p>}
    </div>
  )
}
