import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowUpRight, Backpack, GraduationCap, Languages } from 'lucide-react'
import { kindLabel, monthsBetween, roles, type Role } from '../data/experience'
import { profile } from '../data/profile'
import { sfx } from '../game/audio'
import { equip } from '../lib/equip'
import { openLevel, scrollToId } from '../lib/route'
import { SectionTitle } from './ui/bits'
import { useT, type T } from '../lib/i18n'

const MONTHS = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  it: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
}
const fmt = (d: [number, number], t: T) => `${t.l(MONTHS)[d[1] - 1]} ${d[0]}`
const span = (r: Role, t: T) => `${fmt(r.from, t)} – ${r.to ? fmt(r.to, t) : t('presente', 'present', 'oggi')}`
const dur = (r: Role, t: T) => {
  const m = monthsBetween(r.from, r.to)
  const y = Math.floor(m / 12)
  const rest = m % 12
  return [
    y ? `${y} ${y > 1 ? t('años', 'yrs', 'anni') : t('año', 'yr', 'anno')}` : '',
    rest ? `${rest} ${rest > 1 ? t('meses', 'mos', 'mesi') : t('mes', 'mo', 'mese')}` : '',
  ].filter(Boolean).join(' ')
}

// Eje del gantt: jul 2023 → dic 2026 (en meses).
const START = 2023 * 12 + 6
const END = 2026 * 12 + 11
const idx = (d: [number, number]) => d[0] * 12 + (d[1] - 1)

export function Timeline() {
  const [hover, setHover] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const t = useT()
  const now = new Date()
  // "Hoy" con fracción del mes, para que la línea caiga en el día real y no al inicio del mes.
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const nowPos = Math.min(END + 1, Math.max(START, now.getFullYear() * 12 + now.getMonth() + (now.getDate() - 0.5) / daysInMonth))
  const total = END - START + 1
  const pct = (m: number) => `${(m / total) * 100}%`
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
            {t.l(kindLabel[r.kind])}
            {r.wip && t(' · en desarrollo', ' · in development', ' · in sviluppo')}
          </p>
          <h3 className="mt-1 font-display text-2xl font-black leading-tight">{r.company}</h3>
          <p className="mt-0.5 text-[15px] text-white/70">{t.l(r.role)}</p>
        </div>
        <div className="text-left font-mono text-xs text-white/50 sm:text-right">
          <p className="text-white/80">{span(r, t)}</p>
          <p>{dur(r, t)}{r.place ? ` · ${t.l(r.place)}` : ''}</p>
        </div>
      </div>

      <ul className="mt-5 space-y-2.5">
        {t.l(r.bullets).map((b) => (
          <li key={b} className="flex gap-3 text-[14.5px] leading-relaxed text-white/65">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: r.color }} />
            {b}
          </li>
        ))}
      </ul>

      {r.tags && (
        <div className="mt-5 flex flex-wrap gap-2">
          {t.l(r.tags).map((tag) => (
            <span key={tag} className="chip" style={{ borderColor: `${r.color}44`, color: r.color }}>{tag}</span>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2.5 border-t border-white/[0.07] pt-4">
        <button onClick={() => showStack(r)} className="btn btn-ghost !px-4 !py-2 !text-[10.5px]">
          <Backpack size={13} /> {t('Ver su stack en el inventario', 'See its stack in the inventory', 'Vedi il suo stack nell’inventario')}
        </button>
        {r.world && (
          <button onClick={() => { sfx.open(); openLevel(r.world!) }} className="btn btn-ghost !px-4 !py-2 !text-[10.5px]">
            {t('Jugar su nivel', 'Play its level', 'Gioca il suo livello')} <ArrowUpRight size={13} />
          </button>
        )}
        {r.link && (
          <a href={r.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !px-4 !py-2 !text-[10.5px]">
            {t('Sitio online', 'Live site', 'Sito online')} <ArrowUpRight size={13} />
          </a>
        )}
      </div>
    </motion.article>
  )

  return (
    <section id="trayectoria" className="relative px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow={t('03 · Trayectoria', '03 · Experience', '03 · Esperienza')}
          title={t(<>La <span className="text-gradient">campaña</span> hasta hoy.</>, <>The <span className="text-gradient">campaign</span> so far.</>, <>La <span className="text-gradient">campagna</span> fino a oggi.</>)}
        >
          {t(
            'Más de 3 años construyendo software end-to-end, entre empleos, mi propio SaaS y proyectos freelance. Pasá el mouse por cada barra y equipá su stack.',
            '3+ years building software end-to-end, across jobs, my own SaaS and freelance projects. Hover over each bar and equip its stack.',
            'Più di 3 anni a costruire software end-to-end, tra impieghi, il mio SaaS e progetti freelance. Passa il mouse su ogni barra ed equipaggia il suo stack.',
          )}
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
              <span className="pointer-events-none absolute -bottom-1 -top-1 w-0 border-l border-dashed border-accent/60" style={{ left: pct(nowPos - START) }}>
                <span className="absolute -top-5 left-0 -translate-x-1/2 whitespace-nowrap rounded bg-accent px-1.5 py-0.5 font-mono text-[9px] font-bold text-void">{t('HOY', 'TODAY', 'OGGI')}</span>
              </span>
              {[...roles].sort((a, b) => idx(a.from) - idx(b.from)).map((r, i) => {
                const a = Math.max(0, idx(r.from) - START)
                // Vigentes: terminan en "hoy". El ancho mínimo crece hacia la izquierda para no pasarse de esa línea.
                const b = Math.min(total, r.to ? idx(r.to) - START + 1 : nowPos - START)
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
                      style={{ left: `min(${pct(a)}, calc(${pct(b)} - 74px))`, width: `max(${pct(b - a)}, 74px)`, background: r.color, opacity: hover && hover !== r.id ? 0.35 : 1 }}
                      aria-label={`${r.company}, ${span(r, t)}`}
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
            <p className="label mb-5">{t('Roles principales', 'Main roles', 'Ruoli principali')}</p>
            <div className="relative space-y-5 md:ml-6 md:border-l md:border-white/10 md:pl-8">{main.map(card)}</div>
          </div>
          <div>
            <p className="label mb-5">{t('Freelance y proyectos propios', 'Freelance and own projects', 'Freelance e progetti personali')}</p>
            <div className="space-y-5">{side.map((r, i) => card(r, i))}</div>
          </div>
        </div>

        {/* formación, idiomas y habilidades blandas */}
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          <div className="panel p-6">
            <p className="label mb-4 flex items-center gap-2 !text-accent"><GraduationCap size={13} /> {t('Formación', 'Education', 'Formazione')}</p>
            <ul className="space-y-4">
              {profile.education.map((e) => (
                <li key={e.title.es}>
                  <p className="text-[14.5px] font-semibold leading-snug">{t.l(e.title)}</p>
                  <p className="font-mono text-[11px] text-white/45">{e.place} · {t.l(e.when)}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel p-6">
            <p className="label mb-4 flex items-center gap-2 !text-accent"><Languages size={13} /> {t('Idiomas', 'Languages', 'Lingue')}</p>
            <ul className="space-y-4">
              {profile.languages.map((l) => (
                <li key={l.name.es}>
                  <div className="mb-1.5 flex items-baseline justify-between text-sm">
                    <span className="font-semibold">{t.l(l.name)}</span>
                    <span className="font-mono text-[11px] text-white/50">{t.l(l.level)}</span>
                  </div>
                  <span className="block h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.span className="block h-full rounded-full bg-gradient-to-r from-accent to-accent-2" initial={{ width: 0 }} whileInView={{ width: `${l.pct}%` }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel p-6">
            <p className="label mb-4 !text-accent">{t('Habilidades blandas', 'Soft skills', 'Soft skill')}</p>
            <div className="flex flex-wrap gap-2">
              {t.l(profile.soft).map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
