import { useEffect, useRef, useState } from 'react'
import { Command, Star, Volume2, VolumeX } from 'lucide-react'
import { game, rankFor, useGame } from '../game/store'
import { sfx } from '../game/audio'
import { fx } from '../lib/fx'
import { scrollToId, closeLevel, readLevel } from '../lib/route'
import { TOTAL_STARS } from '../data/achievements'
import { profile } from '../data/profile'
import { Logo } from './ui/Logo'
import { LangSwitch } from './ui/LangSwitch'
import { useT } from '../lib/i18n'

const NAV = [
  { id: 'mapa', label: { es: 'Mapa', en: 'Map', it: 'Mappa' } },
  { id: 'inventario', label: { es: 'Inventario', en: 'Inventory', it: 'Inventario' } },
  { id: 'trayectoria', label: { es: 'Trayectoria', en: 'Experience', it: 'Esperienza' } },
  { id: 'perfil', label: { es: 'Perfil', en: 'Profile', it: 'Profilo' } },
  { id: 'contacto', label: { es: 'Contacto', en: 'Contact', it: 'Contatti' } },
]

export function Hud() {
  const xp = useGame((s) => s.xp)
  const coins = useGame((s) => s.coins.length)
  const sound = useGame((s) => s.sound)
  const rank = rankFor(xp)
  const t = useT()
  const [active, setActive] = useState('inicio')
  const bar = useRef<HTMLDivElement>(null)
  const xpBar = useRef<HTMLDivElement>(null)
  const prevXp = useRef(xp)

  useEffect(() => {
    if (xp > prevXp.current && xpBar.current) {
      const r = xpBar.current.getBoundingClientRect()
      fx.floatText(r.left + r.width / 2, r.bottom + 16, `+${xp - prevXp.current} XP`)
    }
    prevXp.current = xp
  }, [xp])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ;['inicio', ...NAV.map((n) => n.id)].forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => {
      removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  const go = (id: string) => {
    sfx.click()
    const wasOpen = !!readLevel()
    if (wasOpen) closeLevel()
    setTimeout(() => scrollToId(id), wasOpen ? 350 : 0)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[70] border-b border-white/[0.06] bg-[#05060b]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <button onClick={() => go('inicio')} className="group flex items-center gap-2.5" aria-label={t('Volver al inicio', 'Back to top', 'Torna all’inizio')}>
          <Logo size={32} className="rounded-lg transition group-hover:rotate-6 group-hover:scale-110" />
          <span className="hidden font-display text-[13px] font-bold tracking-tight sm:block">{profile.first}</span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t('Secciones', 'Sections', 'Sezioni')}>
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              onMouseEnter={sfx.hover}
              className={`relative rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition ${active === n.id ? 'text-accent' : 'text-white/55 hover:text-white'}`}
            >
              {active === n.id && <span className="absolute inset-0 -z-10 rounded-full bg-accent/10 ring-1 ring-accent/30" />}
              {t.l(n.label)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5" title={`${xp} XP`}>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-white/45 sm:block">
              {t('Rango', 'Rank', 'Grado')} <span className="text-accent">{t.l(rank.name)}</span>
            </span>
            <div ref={xpBar} className="relative h-2 w-14 overflow-hidden rounded-full bg-white/10 sm:w-28" role="progressbar" aria-valuenow={xp} aria-label={t('Experiencia', 'Experience points', 'Punti esperienza')}>
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-accent-2 transition-[width] duration-700" style={{ width: `${Math.max(4, rank.progress * 100)}%` }} />
            </div>
            <span className="w-12 font-mono text-[11px] tabular-nums text-white/70">{xp} XP</span>
          </div>
          <span className="hidden items-center gap-1 font-mono text-[11px] text-amber md:flex" title={t('Estrellas escondidas', 'Hidden stars', 'Stelle nascoste')}>
            <Star size={13} className="fill-amber" />
            {coins}/{TOTAL_STARS}
          </span>
          <LangSwitch className="h-8" />
          <button
            onClick={() => game.toggleSound()}
            aria-label={sound ? t('Silenciar', 'Mute', 'Silenzia') : t('Activar sonido', 'Turn sound on', 'Attiva il suono')}
            aria-pressed={sound}
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/70 transition hover:border-accent hover:text-accent"
          >
            {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <button
            onClick={() => window.dispatchEvent(new Event('nb:palette'))}
            aria-label={t('Abrir menú de comandos', 'Open command menu', 'Apri il menu dei comandi')}
            className="flex h-8 items-center gap-1.5 rounded-full border border-white/10 px-2.5 font-mono text-[11px] text-white/70 transition hover:border-accent hover:text-accent"
          >
            <Command size={14} />
            <span className="hidden sm:inline">K</span>
          </button>
        </div>
      </div>
      <div ref={bar} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-accent to-accent-2" style={{ transform: 'scaleX(0)' }} />
    </header>
  )
}
