import { useState } from 'react'
import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { catLabel, rarityMeta, rarityOf, skillCats, skillName, skills, skillUsage, sources, type SkillCat } from '../data/skills'
import { sfx } from '../game/audio'
import { equip, useEquip } from '../lib/equip'
import { Relic, SectionTitle } from './ui/bits'
import { useT } from '../lib/i18n'

const COLLAPSED = 18

export function Inventory() {
  const [cat, setCat] = useState<SkillCat | 'Todo'>('Todo')
  const [all, setAll] = useState(false)
  const equipped = useEquip()
  const eq = sources.find((s) => s.id === equipped)
  const t = useT()

  const list = skills
    .map((s) => ({ s, use: skillUsage(s.id) }))
    .filter(({ s }) => cat === 'Todo' || s.cat === cat)
    .sort((a, b) => (eq ? Number(b.use.includes(eq.id)) - Number(a.use.includes(eq.id)) : 0) || b.use.length - a.use.length || Number(!!a.s.study) - Number(!!b.s.study))

  const visible = all || cat !== 'Todo' || eq ? list : list.slice(0, COLLAPSED)

  return (
    <section id="inventario" className="relative px-4 py-24 sm:px-6 md:py-32">
      <Relic id="inventory" className="right-[6%] top-24" />
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          eyebrow={t('02 · Inventario', '02 · Inventory', '02 · Inventario')}
          title={t(<>Las herramientas que <span className="text-gradient">llevo encima</span>.</>, <>The tools I <span className="text-gradient">carry with me</span>.</>, <>Gli strumenti che <span className="text-gradient">porto con me</span>.</>)}
        >
          {t(
            `${skills.length} habilidades según mi CV y LinkedIn. La rareza sale de en cuántos mundos y trabajos usé cada una. Equipá uno para ver qué stack lo hizo posible.`,
            `${skills.length} skills from my CV and LinkedIn. Rarity comes from how many worlds and jobs I used each one in. Equip one to see which stack made it possible.`,
            `${skills.length} competenze dal mio CV e da LinkedIn. La rarità dipende da quanti mondi e lavori le ho usate. Equipaggiane uno per vedere quale stack lo ha reso possibile.`,
          )}
        </SectionTitle>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="label mr-1">{t('Equipar', 'Equip', 'Equipaggia')}</span>
          {sources.map((p) => (
            <button
              key={p.id}
              onClick={() => { sfx.click(); equip.toggle(p.id) }}
              aria-pressed={equipped === p.id}
              className="chip transition"
              style={equipped === p.id ? { borderColor: p.color, color: p.color, background: `${p.color}1f` } : undefined}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {p.name}
            </button>
          ))}
        </div>
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="label mr-1">{t('Categoría', 'Category', 'Categoria')}</span>
          {(['Todo', ...skillCats] as const).map((c) => (
            <button key={c} onClick={() => { sfx.click(); setCat(c) }} aria-pressed={cat === c} className={`chip transition ${cat === c ? '!border-accent !bg-accent/15 !text-accent' : 'hover:!border-white/30'}`}>
              {t.l(catLabel[c])}
            </button>
          ))}
        </div>

        <motion.ul layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {visible.map(({ s, use }) => {
            const r = rarityMeta[rarityOf(use.length, s.study)]
            const on = !eq || use.includes(eq.id)
            return (
              <motion.li
                layout
                key={s.id}
                animate={{ opacity: on ? 1 : 0.22, scale: on ? 1 : 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                onMouseEnter={sfx.hover}
                className="panel group relative overflow-hidden p-4 transition hover:-translate-y-1"
                style={{ borderColor: on && eq ? `${eq.color}99` : `${r.color}44`, boxShadow: on && eq ? `0 0 34px -10px ${eq.color}` : use.length >= 5 ? `0 0 30px -14px ${r.color}` : undefined }}
              >
                <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-25 blur-2xl transition group-hover:opacity-60" style={{ background: r.color }} />
                <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.16em]" style={{ color: r.color }}>{t.l(r.label)}</span>
                <p className="mt-2.5 font-display text-[15px] font-bold leading-tight">{skillName(s, t)}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/35">{t.l(catLabel[s.cat])}</p>
                <p className="mt-3 min-h-[32px] text-[11.5px] leading-snug text-white/50">{t.l(s.note)}</p>
                <div className="mt-3 flex gap-1" aria-label={t(`Usado en ${use.length} fuentes`, `Used in ${use.length} sources`, `Usata in ${use.length} fonti`)}>
                  {sources.map((p) => (
                    <span key={p.id} title={p.name} className="h-1.5 flex-1 rounded-full" style={{ background: use.includes(p.id) ? p.color : 'rgba(255,255,255,.08)' }} />
                  ))}
                </div>
              </motion.li>
            )
          })}
        </motion.ul>

        {!all && cat === 'Todo' && !eq && list.length > COLLAPSED && (
          <div className="mt-6 flex justify-center">
            <button onClick={() => { sfx.click(); setAll(true) }} className="btn btn-ghost">
              {t(`Ver las ${list.length} habilidades`, `See all ${list.length} skills`, `Vedi tutte le ${list.length} competenze`)} <ChevronDown size={15} />
            </button>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-white/45">
          {(Object.keys(rarityMeta) as (keyof typeof rarityMeta)[]).map((k) => (
            <span key={k} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: rarityMeta[k].color }} />
              {t.l(rarityMeta[k].label)} · {t.l(rarityMeta[k].rule)}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
