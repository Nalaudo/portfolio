import { lazy, Suspense, useEffect, type ComponentType, type CSSProperties } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Circle, Crown, Sparkles, Swords, Target } from 'lucide-react'
import { projectById, projects, type LevelId } from '../data/projects'
import { skillName, skills } from '../data/skills'
import { levelIcon } from '../lib/icons'
import { closeLevel, levelOrigin, openLevel } from '../lib/route'
import { game, useGame } from '../game/store'
import { sfx } from '../game/audio'
import { Counter, Kbd, Relic, Stars } from './ui/bits'
import { useT } from '../lib/i18n'

const KontariDemo = lazy(() => import('./levels/KontariDemo').then((m) => ({ default: m.KontariDemo })))
const PolizariDemo = lazy(() => import('./levels/PolizariDemo').then((m) => ({ default: m.PolizariDemo })))
const CotizariDemo = lazy(() => import('./levels/CotizariDemo').then((m) => ({ default: m.CotizariDemo })))
const MehringDemo = lazy(() => import('./levels/MehringDemo').then((m) => ({ default: m.MehringDemo })))
const SbDemo = lazy(() => import('./levels/SbDemo').then((m) => ({ default: m.SbDemo })))

const DEMOS: Record<LevelId, ComponentType> = {
  kontari: KontariDemo,
  polizari: PolizariDemo,
  cotizari: CotizariDemo,
  mehring: MehringDemo,
  sbestudio: SbDemo,
}

export function LevelScreen({ id }: { id: LevelId }) {
  const p = projectById(id)!
  const idx = projects.findIndex((x) => x.id === id)
  const prev = projects[idx - 1]
  const next = projects[idx + 1]
  const isVisited = useGame((s) => s.visited.includes(id))
  const isPlayed = useGame((s) => s.played.includes(id))
  const isDone = useGame((s) => s.done.includes(id))
  const Icon = levelIcon[id]
  const Demo = DEMOS[id]
  const stars = (isVisited ? 1 : 0) + (isPlayed ? 1 : 0) + (isDone ? 1 : 0)
  const t = useT()
  const L = t('Nivel', 'Level', 'Livello')

  useEffect(() => {
    document.documentElement.classList.add('no-scroll')
    return () => document.documentElement.classList.remove('no-scroll')
  }, [])

  useEffect(() => {
    game.visit(id)
    const el = document.getElementById('level-scroll')
    el?.scrollTo({ top: 0 })
    el?.focus({ preventScroll: true })
  }, [id])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('[aria-modal="true"]')) {
        sfx.close()
        closeLevel()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  const go = (to: LevelId) => {
    sfx.click()
    openLevel(to)
  }

  const objectives = [
    { ok: isVisited, label: t('Entraste al mundo', 'You entered the world', 'Sei entrato nel mondo'), xp: 40 },
    { ok: isPlayed, label: t('Probaste la demo', 'You tried the demo', 'Hai provato la demo'), xp: 60 },
    { ok: isDone, label: t('Completaste el desafío', 'You beat the challenge', 'Hai superato la sfida'), xp: 100 },
  ]

  const stackItems = p.stack.map((sid) => skills.find((s) => s.id === sid)).filter((s): s is NonNullable<typeof s> => !!s)

  return (
    <motion.div
      id="level-scroll"
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-[#06070c] outline-none"
      tabIndex={-1}
      style={{ ['--accent' as string]: p.accent, ['--accent-2' as string]: p.accent2 } as CSSProperties}
      initial={{ clipPath: `circle(0px at ${levelOrigin.x}px ${levelOrigin.y}px)` }}
      animate={{ clipPath: `circle(160% at ${levelOrigin.x}px ${levelOrigin.y}px)` }}
      exit={{ clipPath: `circle(0px at ${levelOrigin.x}px ${levelOrigin.y}px)` }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      role="region"
      aria-label={`${L} ${p.n}: ${p.name}`}
    >
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-50 [mask-image:radial-gradient(80%_60%_at_50%_0%,#000,transparent)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[70vh]" style={{ background: 'radial-gradient(70% 60% at 20% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%), radial-gradient(50% 50% at 90% 10%, color-mix(in oklab, var(--accent-2) 16%, transparent), transparent 70%)' }} />

      <motion.div key={id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="relative mx-auto max-w-6xl px-4 pb-28 pt-24 sm:px-6">
        {/* barra de nivel */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <button onClick={() => { sfx.close(); closeLevel() }} className="btn btn-ghost !px-4 !py-2.5">
            <ArrowLeft size={15} /> {t('Mapa', 'Map', 'Mappa')} <Kbd>Esc</Kbd>
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label={t('Niveles', 'Levels', 'Livelli')}>
            <button disabled={!prev} onClick={() => prev && go(prev.id)} aria-label={t('Nivel anterior', 'Previous level', 'Livello precedente')} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/60 transition hover:border-accent hover:text-accent disabled:opacity-25">
              <ChevronLeft size={16} />
            </button>
            {projects.map((q) => (
              <button key={q.id} onClick={() => go(q.id)} role="tab" aria-selected={q.id === id} aria-label={`${L} ${q.n}: ${q.name}`} className={`h-2.5 rounded-full transition-all ${q.id === id ? 'w-10 bg-accent' : 'w-2.5 bg-white/20 hover:bg-white/50'}`} />
            ))}
            <button disabled={!next} onClick={() => next && go(next.id)} aria-label={t('Nivel siguiente', 'Next level', 'Livello successivo')} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/60 transition hover:border-accent hover:text-accent disabled:opacity-25">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* cabecera */}
        <header className="relative grid items-end gap-10 lg:grid-cols-[1fr_320px]">
          {id === 'kontari' && <Relic id="lvl-kontari" className="-top-8 right-[34%]" />}
          {id === 'mehring' && <Relic id="lvl-mehring" className="-top-8 right-[34%]" />}
          <div>
            <p className="label mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 !text-accent">
              <span>{L} {String(p.n).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
              {p.boss_level && <span className="flex items-center gap-1 rounded-full bg-rose px-2 py-0.5 !text-void"><Crown size={11} /> {t('Jefe final', 'Final boss', 'Boss finale')}</span>}
            </p>
            <h1 className="font-display text-[clamp(2.8rem,9vw,7.2rem)] font-black leading-[0.9] tracking-[-0.04em]">
              <span className="text-gradient">{p.name.toUpperCase()}</span>
            </h1>
            <p className="mt-5 font-mono text-[13px] text-white/50">{t.l(p.kicker)}</p>
            <p className="mt-6 max-w-2xl font-display text-[clamp(1.1rem,2.1vw,1.55rem)] font-semibold leading-snug text-white">{t.l(p.tagline)}</p>
            <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-white/60">{t.l(p.description)}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {p.status && (
                <span className="chip !border-mint/40 !text-mint">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint" /> {t.l(p.status)}
                </span>
              )}
              <span className="chip !border-accent/40 !text-accent">{t.l(p.role)}</span>
              {t.l(p.tags).map((tag) => (
                <span key={tag} className="chip">{tag}</span>
              ))}
            </div>
            {p.live && (
              <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8">
                {t('Ver el sitio online', 'Visit the live site', 'Visita il sito online')} <ArrowUpRight size={15} />
              </a>
            )}
          </div>

          <aside className="panel p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/30">
                <Icon size={28} />
              </span>
              <Stars n={stars} size={20} />
            </div>
            <p className="label mb-3 flex items-center gap-2"><Target size={12} /> {t('Objetivos del nivel', 'Level objectives', 'Obiettivi del livello')}</p>
            <ul className="space-y-2.5">
              {objectives.map((o) => (
                <li key={o.label} className={`flex items-center gap-3 text-sm ${o.ok ? 'text-white' : 'text-white/45'}`}>
                  <span className={`grid h-5 w-5 place-items-center rounded-full ${o.ok ? 'bg-accent text-void' : 'border border-white/20'}`}>
                    {o.ok ? <Check size={12} strokeWidth={3.5} /> : <Circle size={0} />}
                  </span>
                  <span className="flex-1">{o.label}</span>
                  <span className="font-mono text-[11px] text-accent">{o.ok ? '✓' : `+${o.xp} XP`}</span>
                </li>
              ))}
            </ul>
          </aside>
        </header>

        {/* atributos */}
        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
          {p.stats.map((s) => (
            <div key={s.label.es} className="panel p-5">
              <p className="font-display text-3xl font-black text-accent sm:text-4xl">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-[13px] leading-snug text-white/55">{t.l(s.label)}</p>
            </div>
          ))}
        </div>

        {/* zona de juego */}
        <section className="mt-20" aria-labelledby="demo-title">
          <p className="label mb-3 flex items-center gap-3 !text-accent"><Sparkles size={13} /> {t('Zona de juego', 'Play zone', 'Zona di gioco')}</p>
          <h2 id="demo-title" className="font-display text-2xl font-black sm:text-3xl">{t.l(p.demo.title)}</h2>
          <p className="mb-6 mt-2 max-w-2xl text-white/55">{t.l(p.demo.hint)}</p>
          <div className="rounded-[30px] p-[1.5px]" style={{ background: 'linear-gradient(140deg, var(--accent), rgba(255,255,255,.06) 35%, rgba(255,255,255,.06) 65%, var(--accent-2))' }}>
            <div className="overflow-hidden rounded-[29px] bg-[#080a12]">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-mint/80" />
                </div>
                <span className="label hidden sm:block">◉ {t('demo jugable', 'playable demo', 'demo giocabile')} · {p.name.toLowerCase()}</span>
                <span className="w-12" />
              </div>
              <div className="p-3 sm:p-6">
                <Suspense fallback={<div className="grid h-64 place-items-center font-mono text-xs text-white/40">{t('cargando demo…', 'loading demo…', 'caricamento demo…')}</div>}>
                  <Demo />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* bitácora */}
        <section className="mt-24">
          <p className="label mb-3 flex items-center gap-3 !text-accent"><Swords size={13} /> {t('Bitácora de misión', 'Mission log', 'Diario di missione')}</p>
          <h2 className="mb-8 font-display text-2xl font-black sm:text-3xl">{t('Lo que resolví acá', 'What I solved here', 'Cosa ho risolto qui')}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {p.missions.map((m, i) => (
              <article key={m.title.es} className="panel panel-hover p-6">
                <span className="font-mono text-[11px] text-accent">{t('MISIÓN', 'MISSION', 'MISSIONE')} {String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-display text-lg font-bold leading-tight">{t.l(m.title)}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-white/60">{t.l(m.text)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* jefe + botín */}
        <section className="mt-16 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <article className="panel relative overflow-hidden p-7">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-rose/15 blur-3xl" />
            <p className="label mb-3 flex items-center gap-2 !text-rose"><Crown size={13} /> {t('Jefe del nivel', 'Level boss', 'Boss del livello')}</p>
            <h3 className="font-display text-2xl font-black leading-tight">{t.l(p.boss.name)}</h3>
            <p className="mt-3 text-white/60">{t.l(p.boss.text)}</p>
            <div className="mt-5 rounded-xl border border-accent/25 bg-accent/[0.06] p-4">
              <p className="label mb-1.5 !text-accent">{t('Cómo lo derroté', 'How I beat it', 'Come l’ho sconfitto')}</p>
              <p className="text-[14.5px] leading-relaxed text-white/80">{t.l(p.boss.win)}</p>
            </div>
          </article>
          <article className="panel p-7">
            <p className="label mb-4">{t('Botín · stack del nivel', 'Loot · level stack', 'Bottino · stack del livello')}</p>
            <div className="flex flex-wrap gap-2">
              {stackItems.map((s) => (
                <span key={s.id} className="chip" title={t.l(s.note)}>{skillName(s, t)}</span>
              ))}
            </div>
          </article>
        </section>

        {/* siguiente */}
        <div className="mt-20 flex flex-col items-stretch gap-3 sm:flex-row">
          {next ? (
            <button onClick={() => go(next.id)} className="panel panel-hover group flex flex-1 items-center justify-between gap-4 p-6 text-left" style={{ ['--accent' as string]: next.accent }}>
              <span>
                <span className="label !text-accent">{t('Siguiente nivel', 'Next level', 'Livello successivo')} · {String(next.n).padStart(2, '0')}</span>
                <span className="mt-1 block font-display text-2xl font-black">{next.name}</span>
                <span className="mt-1 block text-sm text-white/50">{t.l(next.tagline)}</span>
              </span>
              <ArrowRight className="shrink-0 text-accent transition group-hover:translate-x-2" size={28} />
            </button>
          ) : (
            <button onClick={() => { closeLevel(); setTimeout(() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }), 400) }} className="panel panel-hover group flex flex-1 items-center justify-between gap-4 p-6 text-left">
              <span>
                <span className="label !text-accent">{t('Fin del recorrido', 'End of the journey', 'Fine del percorso')}</span>
                <span className="mt-1 block font-display text-2xl font-black">{t('Ir a la sala final', 'Go to the final room', 'Vai alla sala finale')}</span>
                <span className="mt-1 block text-sm text-white/50">{t('¿Te gustó? Hablemos de tu proyecto.', 'Liked it? Let’s talk about your project.', 'Ti è piaciuto? Parliamo del tuo progetto.')}</span>
              </span>
              <ArrowRight className="shrink-0 text-accent transition group-hover:translate-x-2" size={28} />
            </button>
          )}
          <button onClick={() => { sfx.close(); closeLevel() }} className="btn btn-ghost sm:w-56">
            <ArrowLeft size={15} /> {t('Volver al mapa', 'Back to the map', 'Torna alla mappa')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
