import { useState } from 'react'
import { motion } from 'motion/react'
import { projects, type LevelId } from '../data/projects'
import { rarityMeta, rarityOf, skillCats, skills, skillUsage, type SkillCat } from '../data/skills'
import { sfx } from '../game/audio'
import { Relic, SectionTitle } from './ui/bits'

export function Inventory() {
  const [cat, setCat] = useState<SkillCat | 'Todo'>('Todo')
  const [equip, setEquip] = useState<LevelId | null>(null)
  const eq = projects.find((p) => p.id === equip)

  const list = skills
    .map((s) => ({ s, use: skillUsage(s.id) }))
    .filter(({ s }) => cat === 'Todo' || s.cat === cat)
    .sort((a, b) => b.use.length - a.use.length)

  return (
    <section id="inventario" className="relative px-4 py-24 sm:px-6 md:py-32">
      <Relic id="inventory" className="right-[6%] top-24" />
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="02 · Inventario" title={<>Las herramientas que <span className="text-gradient">llevo encima</span>.</>}>
          La rareza sale de cuántos mundos usan cada herramienta. Equipá un nivel para ver qué stack lo hizo posible.
        </SectionTitle>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="label mr-1">Equipar</span>
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => { sfx.click(); setEquip(equip === p.id ? null : p.id) }}
              aria-pressed={equip === p.id}
              className="chip transition"
              style={equip === p.id ? { borderColor: p.accent, color: p.accent, background: `${p.accent}1f` } : undefined}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: p.accent }} />
              {p.name}
            </button>
          ))}
        </div>
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="label mr-1">Categoría</span>
          {(['Todo', ...skillCats] as const).map((c) => (
            <button key={c} onClick={() => { sfx.click(); setCat(c) }} aria-pressed={cat === c} className={`chip transition ${cat === c ? '!border-accent !bg-accent/15 !text-accent' : 'hover:!border-white/30'}`}>
              {c}
            </button>
          ))}
        </div>

        <motion.ul layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {list.map(({ s, use }) => {
            const r = rarityMeta[rarityOf(use.length)]
            const on = !eq || use.includes(eq.id)
            return (
              <motion.li
                layout
                key={s.id}
                animate={{ opacity: on ? 1 : 0.22, scale: on ? 1 : 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                onMouseEnter={sfx.hover}
                className="panel group relative overflow-hidden p-4 transition hover:-translate-y-1"
                style={{ borderColor: on && eq ? `${eq.accent}99` : `${r.color}44`, boxShadow: on && eq ? `0 0 34px -10px ${eq.accent}` : use.length >= 4 ? `0 0 30px -14px ${r.color}` : undefined }}
              >
                <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-25 blur-2xl transition group-hover:opacity-60" style={{ background: r.color }} />
                <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.16em]" style={{ color: r.color }}>{r.label}</span>
                <p className="mt-2.5 font-display text-[15px] font-bold leading-tight">{s.name}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/35">{s.cat}</p>
                <p className="mt-3 min-h-[32px] text-[11.5px] leading-snug text-white/50">{s.note}</p>
                <div className="mt-3 flex gap-1" aria-label={`Usado en ${use.length} mundos`}>
                  {projects.map((p) => (
                    <span key={p.id} title={p.name} className="h-1.5 flex-1 rounded-full" style={{ background: use.includes(p.id) ? p.accent : 'rgba(255,255,255,.08)' }} />
                  ))}
                </div>
              </motion.li>
            )
          })}
        </motion.ul>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-white/45">
          {(Object.keys(rarityMeta) as (keyof typeof rarityMeta)[]).map((k) => (
            <span key={k} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: rarityMeta[k].color }} />
              {rarityMeta[k].label} · {k === 'legendary' ? '4+ mundos' : k === 'epic' ? '3 mundos' : k === 'rare' ? '2 mundos' : '1 mundo'}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
