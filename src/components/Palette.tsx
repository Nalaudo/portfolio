import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CornerDownLeft, Gamepad2, Mail, Map as MapIcon, Rocket, RotateCcw, Search, User, Backpack, Briefcase, Volume2, Zap, type LucideIcon } from 'lucide-react'
import { projects } from '../data/projects'
import { profile } from '../data/profile'
import { GithubMark, levelIcon } from '../lib/icons'
import { closeLevel, openLevel, readLevel, scrollToId } from '../lib/route'
import { game, useGame } from '../game/store'
import { sfx } from '../game/audio'
import { fx } from '../lib/fx'

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

  const nav = (id: string) => () => {
    const wasOpen = !!readLevel()
    if (wasOpen) closeLevel()
    setTimeout(() => scrollToId(id), wasOpen ? 350 : 0)
  }

  const cmds: Cmd[] = useMemo(
    () => [
      { id: 'home', label: 'Ir al inicio', hint: 'sección', icon: Rocket, run: nav('inicio') },
      { id: 'map', label: 'Ir al mapa de mundos', hint: 'sección', icon: MapIcon, run: nav('mapa') },
      { id: 'inv', label: 'Ver el inventario (stack)', hint: 'sección', icon: Backpack, run: nav('inventario') },
      { id: 'trayectoria', label: 'Ver la trayectoria (Kontari, Crombie, ShineForth…)', hint: 'sección', icon: Briefcase, run: nav('trayectoria') },
      { id: 'profile', label: 'Ver el perfil y logros', hint: 'sección', icon: User, run: nav('perfil') },
      { id: 'contact', label: 'Ir a contacto', hint: 'sección', icon: Mail, run: nav('contacto') },
      ...projects.map<Cmd>((p) => ({
        id: p.id,
        label: `Nivel ${p.n} · ${p.name}`,
        hint: p.boss_level ? 'jefe final' : 'entrar al mundo',
        icon: levelIcon[p.id],
        run: () => openLevel(p.id),
      })),
      { id: 'sound', label: 'Activar / silenciar sonido', hint: 'ajuste', icon: Volume2, run: () => game.toggleSound() },
      { id: 'turbo', label: 'Modo turbo', hint: 'easter egg', icon: Zap, run: () => { game.toggleTurbo(); game.unlock('konami'); fx.confetti() } },
      { id: 'gh', label: 'Abrir GitHub', hint: 'externo', icon: GithubIcon, run: () => window.open(profile.github, '_blank', 'noopener') },
      { id: 'in', label: 'Abrir LinkedIn', hint: 'externo', icon: Briefcase, run: () => window.open(profile.linkedin, '_blank', 'noopener') },
      { id: 'mail', label: 'Escribirme un email', hint: 'externo', icon: Mail, run: () => (location.href = `mailto:${profile.email}`) },
      { id: 'reset', label: 'Reiniciar partida', hint: 'borra tu progreso', icon: RotateCcw, run: () => game.reset() },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
          aria-label="Menú de comandos"
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
                placeholder="Escribí un comando…  (mapa, kontari, sonido)"
                className="h-14 flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-white/30"
                aria-label="Buscar comando"
              />
              <span className="kbd">Esc</span>
            </div>
            <ul className="max-h-[52vh] overflow-y-auto p-2" role="listbox">
              {results.length === 0 && <li className="px-4 py-8 text-center font-mono text-xs text-white/40">Sin resultados. Probá "mapa" o "kontari".</li>}
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
                <Gamepad2 size={12} /> consola de comandos
              </span>
              <span>↑↓ navegar · ↵ ejecutar</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
