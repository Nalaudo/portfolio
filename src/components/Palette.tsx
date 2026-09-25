import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CornerDownLeft, Gamepad2, Languages, Mail, Map as MapIcon, Rocket, RotateCcw, Search, User, Backpack, Briefcase, Volume2, Zap, type LucideIcon } from 'lucide-react'
import { projects } from '../data/projects'
import { profile } from '../data/profile'
import { GithubMark, levelIcon } from '../lib/icons'
import { closeLevel, openLevel, readLevel, scrollToId } from '../lib/route'
import { game, useGame } from '../game/store'
import { sfx } from '../game/audio'
import { fx } from '../lib/fx'
import { i18n, useT } from '../lib/i18n'
import { LANG_OPTIONS } from './ui/LangSwitch'

const GithubIcon = GithubMark as unknown as LucideIcon

interface Cmd {
  id: string
  label: string
  hint: string
  icon: LucideIcon
  run: () => void
}

export function Palette() {
  const started = useGame((s) => s.started)
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const t = useT()

  const nav = (id: string) => () => {
    const wasOpen = !!readLevel()
    if (wasOpen) closeLevel()
    setTimeout(() => scrollToId(id), wasOpen ? 350 : 0)
  }

  const cmds: Cmd[] = useMemo(
    () => [
      { id: 'home', label: t('Ir al inicio', 'Go to the top', 'Vai all’inizio'), hint: t('sección', 'section', 'sezione'), icon: Rocket, run: nav('inicio') },
      { id: 'map', label: t('Ir al mapa de mundos', 'Go to the world map', 'Vai alla mappa dei mondi'), hint: t('sección', 'section', 'sezione'), icon: MapIcon, run: nav('mapa') },
      { id: 'inv', label: t('Ver el inventario (stack)', 'See the inventory (stack)', 'Vedi l’inventario (stack)'), hint: t('sección', 'section', 'sezione'), icon: Backpack, run: nav('inventario') },
      { id: 'trayectoria', label: t('Ver la trayectoria (Kontari, Crombie, ShineForth…)', 'See the experience (Kontari, Crombie, ShineForth…)', 'Vedi l’esperienza (Kontari, Crombie, ShineForth…)'), hint: t('sección', 'section', 'sezione'), icon: Briefcase, run: nav('trayectoria') },
      { id: 'profile', label: t('Ver el perfil y logros', 'See the profile and achievements', 'Vedi il profilo e gli obiettivi'), hint: t('sección', 'section', 'sezione'), icon: User, run: nav('perfil') },
      { id: 'contact', label: t('Ir a contacto', 'Go to contact', 'Vai ai contatti'), hint: t('sección', 'section', 'sezione'), icon: Mail, run: nav('contacto') },
      ...projects.map<Cmd>((p) => ({
        id: p.id,
        label: `${t('Nivel', 'Level', 'Livello')} ${p.n} · ${p.name}`,
        hint: p.boss_level ? t('jefe final', 'final boss', 'boss finale') : t('entrar al mundo', 'enter the world', 'entra nel mondo'),
        icon: levelIcon[p.id],
        run: () => openLevel(p.id),
      })),
      // Un comando por idioma, escrito en ese idioma para que se encuentre aunque no entiendas el actual.
      ...LANG_OPTIONS.filter((o) => o.k !== t.lang).map<Cmd>((o) => ({
        id: `lang-${o.k}`,
        label: o.switchTo,
        hint: t('idioma', 'language', 'lingua'),
        icon: Languages,
        run: () => i18n.set(o.k),
      })),
      { id: 'sound', label: t('Activar / silenciar sonido', 'Turn sound on / off', 'Attiva / disattiva il suono'), hint: t('ajuste', 'setting', 'impostazione'), icon: Volume2, run: () => game.toggleSound() },
      { id: 'turbo', label: t('Modo turbo', 'Turbo mode', 'Modalità turbo'), hint: 'easter egg', icon: Zap, run: () => { game.toggleTurbo(); game.unlock('konami'); fx.confetti() } },
      { id: 'gh', label: t('Abrir GitHub', 'Open GitHub', 'Apri GitHub'), hint: t('externo', 'external', 'esterno'), icon: GithubIcon, run: () => window.open(profile.github, '_blank', 'noopener') },
      { id: 'in', label: t('Abrir LinkedIn', 'Open LinkedIn', 'Apri LinkedIn'), hint: t('externo', 'external', 'esterno'), icon: Briefcase, run: () => window.open(profile.linkedin, '_blank', 'noopener') },
      { id: 'mail', label: t('Escribirme un email', 'Send me an email', 'Scrivimi un’email'), hint: t('externo', 'external', 'esterno'), icon: Mail, run: () => (location.href = `mailto:${profile.email}`) },
      { id: 'reset', label: t('Reiniciar partida', 'Reset game', 'Azzera partita'), hint: t('borra tu progreso', 'erases your progress', 'cancella i tuoi progressi'), icon: RotateCcw, run: () => game.reset() },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  )

  const results = useMemo(() => {
    const n = q.trim().toLowerCase()
    if (!n) return cmds
    return cmds.filter((c) => (c.label + ' ' + c.hint).toLowerCase().includes(n))
  }, [q, cmds])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === '/' && !typing && !open) {
        e.preventDefault()
        setOpen(true)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    const onEvt = () => setOpen(true)
    addEventListener('keydown', onKey)
    addEventListener('nb:palette', onEvt)
    return () => {
      removeEventListener('keydown', onKey)
      removeEventListener('nb:palette', onEvt)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      setQ('')
      setIdx(0)
      sfx.open()
      game.unlock('hacker')
      setTimeout(() => input.current?.focus(), 30)
    }
  }, [open])

  const run = (c?: Cmd) => {
    if (!c) return
    setOpen(false)
    sfx.click()
    setTimeout(c.run, 120)
  }

  if (!started) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t('Menú de comandos', 'Command menu', 'Menu dei comandi')}
        >
          <motion.div
            initial={{ y: -20, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -10, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e18] shadow-[0_30px_100px_-20px_rgba(0,0,0,.9)]"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4">
              <Search size={16} className="text-accent" />
              <input
                ref={input}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setIdx(0)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setIdx((i) => (i + 1) % Math.max(1, results.length))
                    sfx.tick()
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setIdx((i) => (i - 1 + results.length) % Math.max(1, results.length))
                    sfx.tick()
                  } else if (e.key === 'Enter') {
                    e.preventDefault()
                    run(results[idx])
                  }
                }}
                placeholder={t('Escribí un comando…  (mapa, kontari, sonido)', 'Type a command…  (map, kontari, sound)', 'Scrivi un comando…  (mappa, kontari, suono)')}
                className="h-14 flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-white/30"
                aria-label={t('Buscar comando', 'Search commands', 'Cerca comandi')}
              />
              <span className="kbd">Esc</span>
            </div>
            <ul className="max-h-[52vh] overflow-y-auto p-2" role="listbox">
              {results.length === 0 && <li className="px-4 py-8 text-center font-mono text-xs text-white/40">{t('Sin resultados. Probá "mapa" o "kontari".', 'No results. Try "map" or "kontari".', 'Nessun risultato. Prova "mappa" o "kontari".')}</li>}
              {results.map((c, i) => (
                <li key={c.id} role="option" aria-selected={i === idx}>
                  <button
                    onMouseMove={() => setIdx(i)}
                    onClick={() => run(c)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${i === idx ? 'bg-accent/12 text-white ring-1 ring-accent/30' : 'text-white/70'}`}
                  >
                    <c.icon size={16} className={i === idx ? 'text-accent' : 'text-white/40'} />
                    <span className="flex-1 text-sm">{c.label}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">{c.hint}</span>
                    {i === idx && <CornerDownLeft size={13} className="text-accent" />}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 font-mono text-[10px] text-white/35">
              <span className="flex items-center gap-1.5">
                <Gamepad2 size={12} /> {t('consola de comandos', 'command console', 'console dei comandi')}
              </span>
              <span>{t('↑↓ navegar · ↵ ejecutar', '↑↓ navigate · ↵ run', '↑↓ naviga · ↵ esegui')}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
