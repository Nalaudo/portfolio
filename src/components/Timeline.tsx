import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowUpRight, Backpack, GraduationCap, Languages } from 'lucide-react'
import { monthsBetween, roles, type Role } from '../data/experience'
import { profile } from '../data/profile'
import { sfx } from '../game/audio'
import { equip } from '../lib/equip'
import { openLevel, scrollToId } from '../lib/route'
import { SectionTitle } from './ui/bits'

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const fmt = (d: [number, number]) => `${MONTHS[d[1] - 1]} ${d[0]}`
const span = (r: Role) => `${fmt(r.from)} – ${r.to ? fmt(r.to) : 'presente'}`
const dur = (r: Role) => {
  const m = monthsBetween(r.from, r.to)
  const y = Math.floor(m / 12)
  const rest = m % 12
  return [y ? `${y} ${y > 1 ? 'años' : 'año'}` : '', rest ? `${rest} ${rest > 1 ? 'meses' : 'mes'}` : ''].filter(Boolean).join(' ')
}

// Eje del gantt: jul 2023 → dic 2026 (en meses).
const START = 2023 * 12 + 6
const END = 2026 * 12 + 11
const idx = (d: [number, number]) => d[0] * 12 + (d[1] - 1)

export function Timeline() {
  const [hover, setHover] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const now = new Date()
  const nowIdx = Math.min(END, Math.max(START, now.getFullYear() * 12 + now.getMonth()))
  const total = END - START + 1
  const main = roles.filter((r) => r.kind === 'Fundador' || r.kind === 'Empleo')
  const side = roles.filter((r) => r.kind === 'Freelance' || r.kind === 'Proyecto propio')

  const showStack = (r: Role) => {
    sfx.click()
    equip.set(r.id)
    scrollToId('inventario')
  }

  const card = (r: Role, i: number) => (
    <motion.article
      key={r.id}
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHover(r.id)}
      onMouseLeave={() => setHover(null)}
      className="panel relative p-6 transition sm:p-7"
      style={{ borderColor: hover === r.id ? `${r.color}88` : undefined, boxShadow: hover === r.id ? `0 20px 60px -24px ${r.color}` : undefined }}
    >
      <span className="absolute -left-[41px] top-8 hidden h-3.5 w-3.5 rounded-full ring-4 ring-[#05060b] md:block" style={{ background: r.color, boxShadow: `0 0 16px ${r.color}` }} />
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em]" style={{ color: r.color }}>
            {r.kind}
            {r.wip && ' · en desarrollo'}
          </p>
          <h3 className="mt-1 font-display text-2xl font-black leading-tight">{r.company}</h3>
          <p className="mt-0.5 text-[15px] text-white/70">{r.role}</p>
        </div>
        <div className="text-left font-mono text-xs text-white/50 sm:text-right">
          <p className="text-white/80">{span(r)}</p>
          <p>{dur(r)}{r.place ? ` · ${r.place}` : ''}</p>
        </div>
      </div>

      <ul className="mt-5 space-y-2.5">
        {r.bullets.map((b) => (
          <li key={b} className="flex gap-3 text-[14.5px] leading-relaxed text-white/65">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: r.color }} />
            {b}
          </li>
        ))}
      </ul>

      {r.tags && (
        <div className="mt-5 flex flex-wrap gap-2">
          {r.tags.map((t) => (
            <span key={t} className="chip" style={{ borderColor: `${r.color}44`, color: r.color }}>{t}</span>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2.5 border-t border-white/[0.07] pt-4">
        <button onClick={() => showStack(r)} className="btn btn-ghost !px-4 !py-2 !text-[10.5px]">
          <Backpack size={13} /> Ver su stack en el inventario
        </button>
        {r.world && (
          <button onClick={() => { sfx.open(); openLevel(r.world!) }} className="btn btn-ghost !px-4 !py-2 !text-[10.5px]">
            Jugar su nivel <ArrowUpRight size={13} />
          </button>
        )}
        {r.link && (
          <a href={r.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !px-4 !py-2 !text-[10.5px]">
            Sitio online <ArrowUpRight size={13} />
          </a>
        )}
      </div>
    </motion.article>
  )

  return (
    <section id="trayectoria" className="relative px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="03 · Trayectoria" title={<>La <span className="text-gradient">campaña</span> hasta hoy.</>}>
          Más de 3 años construyendo software end-to-end, entre empleos, mi propio SaaS y proyectos freelance. Pasá el mouse por cada barra y equipá su stack.
        </SectionTitle>

        {/* gantt */}
        <div ref={ref} className="panel mb-14 overflow-hidden p-5 sm:p-7">
          <div className="relative">
            <div className="relative mb-3 h-4 font-mono text-[10px] text-white/35">
              {[2023, 2024, 2025, 2026].map((y) => (
                <span key={y} className="absolute top-0 border-l border-white/[0.12] pl-2" style={{ left: `${(Math.max(0, y * 12 - START) / total) * 100}%` }}>{y}</span>
              ))}
            </div>
            <div className="relative space-y-2.5">
              {[2024, 2025, 2026].map((y) => (
                <span key={y} className="pointer-events-none absolute inset-y-0 w-px bg-white/[0.06]" style={{ left: `${((y * 12 - START) / total) * 100}%` }} />
              ))}
              <span className="pointer-events-none absolute inset-y-0 z-10 w-px bg-accent/70" style={{ left: `${((nowIdx - START) / total) * 100}%` }}>
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded bg-accent px-1.5 py-0.5 font-mono text-[9px] font-bold text-void">HOY</span>
              </span>
              {[...roles].sort((a, b) => idx(a.from) - idx(b.from)).map((r, i) => {
                const a = Math.max(0, idx(r.from) - START)
                const b = Math.min(total, (r.to ? idx(r.to) : nowIdx) - START + 1)
                return (
                  <div key={r.id} className="relative flex h-8 items-center">
                    <motion.button
                      onMouseEnter={() => setHover(r.id)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => showStack(r)}
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.9, delay: 0.12 * i, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute flex h-8 origin-left items-center overflow-hidden rounded-full px-3 text-left font-mono text-[11px] font-bold text-void transition-[filter] hover:brightness-125"
                      style={{ left: `${(a / total) * 100}%`, width: `${((b - a) / total) * 100}%`, background: r.color, opacity: hover && hover !== r.id ? 0.35 : 1, minWidth: 74 }}
                      aria-label={`${r.company}, ${span(r)}`}
                    >
                      <span className="truncate">{r.company}</span>
                    </motion.button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <p className="label mb-5">Roles principales</p>
            <div className="relative space-y-5 md:ml-6 md:border-l md:border-white/10 md:pl-8">{main.map(card)}</div>
          </div>
          <div>
            <p className="label mb-5">Freelance y proyectos propios</p>
            <div className="space-y-5">{side.map((r, i) => card(r, i))}</div>
          </div>
        </div>

        {/* formación, idiomas y habilidades blandas */}
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          <div className="panel p-6">
            <p className="label mb-4 flex items-center gap-2 !text-accent"><GraduationCap size={13} /> Formación</p>
            <ul className="space-y-4">
              {profile.education.map((e) => (
                <li key={e.title}>
                  <p className="text-[14.5px] font-semibold leading-snug">{e.title}</p>
                  <p className="font-mono text-[11px] text-white/45">{e.place} · {e.when}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel p-6">
            <p className="label mb-4 flex items-center gap-2 !text-accent"><Languages size={13} /> Idiomas</p>
            <ul className="space-y-4">
              {profile.languages.map((l) => (
                <li key={l.name}>
                  <div className="mb-1.5 flex items-baseline justify-between text-sm">
                    <span className="font-semibold">{l.name}</span>
                    <span className="font-mono text-[11px] text-white/50">{l.level}</span>
                  </div>
                  <span className="block h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.span className="block h-full rounded-full bg-gradient-to-r from-accent to-accent-2" initial={{ width: 0 }} whileInView={{ width: `${l.pct}%` }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel p-6">
            <p className="label mb-4 !text-accent">Habilidades blandas</p>
            <div className="flex flex-wrap gap-2">
              {profile.soft.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
