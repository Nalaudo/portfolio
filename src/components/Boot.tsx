import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Play, Volume2, VolumeX } from 'lucide-react'
import { game, useGame } from '../game/store'
import { sfx } from '../game/audio'
import { Mascot } from './ui/Mascot'
import { Kbd, ScrambleText } from './ui/bits'
import { profile } from '../data/profile'
import { warp } from './Starfield'

const LOG = [
  'NB-OS v1.0 · arrancando sistema',
  'detectando dispositivo ........ ok',
  'cargando tipografías ........... ok',
  'montando 5 mundos .............. ok',
  'compilando demos jugables ....... ok',
]

export function Boot() {
  const started = useGame((s) => s.started)
  const sound = useGame((s) => s.sound)
  const hasSave = useGame((s) => s.xp > 0)
  const [phase, setPhase] = useState<'load' | 'ready' | 'leave' | 'gone'>(started ? 'gone' : 'load')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (phase !== 'load') return
    let p = 0
    let fontsReady = false
    void document.fonts?.ready.then(() => (fontsReady = true))
    const fast = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = setInterval(() => {
      p += 3 + Math.random() * 6
      if (!fontsReady) p = Math.min(p, 88)
      if (p >= 100) {
        p = 100
        clearInterval(id)
        setPhase('ready')
      }
      setProgress(p)
    }, fast ? 10 : 90)
    return () => clearInterval(id)
  }, [phase])

  const go = useCallback(() => {
    if (phase !== 'ready') return
    sfx.whoosh()
    warp.boost = 1
    setPhase('leave')
    game.start()
    setTimeout(() => setPhase('gone'), 1100)
  }, [phase])

  useEffect(() => {
    if (phase !== 'ready') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        go()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [phase, go])

  const shown = Math.floor((progress / 100) * LOG.length + 0.999)

  return (
    <AnimatePresence>
      {phase !== 'gone' && (
        <motion.div
          key="boot"
          className="scanlines fixed inset-0 z-[100] grid place-items-center overflow-hidden"
          style={{ background: 'radial-gradient(120% 90% at 50% 40%, rgba(5,6,11,.82), #05060b 78%)' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'leave' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: phase === 'leave' ? 0.9 : 0.2, delay: phase === 'leave' ? 0.25 : 0 }}
          aria-live="polite"
        >
          <motion.div
            className="relative z-10 flex w-full max-w-xl flex-col items-center px-6 text-center"
            animate={phase === 'leave' ? { scale: 1.7, opacity: 0, filter: 'blur(12px)' } : { scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.7, 0, 0.84, 0] }}
          >
            <Mascot size={phase === 'ready' ? 104 : 76} walking={phase === 'load'} className="mb-6 transition-all duration-500" />

            <div className="mb-8 w-full text-left font-mono text-[12px] leading-relaxed text-accent/80">
              {LOG.slice(0, shown).map((l, i) => (
                <div key={l} className={i === shown - 1 && phase === 'load' ? 'text-white/90' : 'text-white/45'}>
                  <span className="text-accent">&gt; </span>
                  {l}
                </div>
              ))}
              {hasSave && phase !== 'load' && (
                <div className="text-white/45">
                  <span className="text-accent">&gt; </span>partida guardada encontrada
                </div>
              )}
            </div>

            <div className="mb-8 flex w-full items-center gap-3">
              <div className="flex h-3 flex-1 gap-[3px]">
                {Array.from({ length: 28 }, (_, i) => (
                  <span
                    key={i}
                    className="h-full flex-1 rounded-[2px] transition-colors duration-150"
                    style={{ background: (i / 28) * 100 < progress ? 'var(--accent)' : 'rgba(255,255,255,.09)', boxShadow: (i / 28) * 100 < progress ? '0 0 8px var(--accent)' : 'none' }}
                  />
                ))}
              </div>
              <span className="w-10 text-right font-mono text-xs text-white/60">{Math.floor(progress)}%</span>
            </div>

            <AnimatePresence>
              {phase === 'ready' && (
                <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
                  <p className="label mb-3">Portfolio jugable · 5 mundos</p>
                  <h1 className="font-display text-[clamp(1.6rem,6vw,2.6rem)] font-black tracking-tight">
                    <ScrambleText text={profile.name.toUpperCase()} />
                  </h1>
                  <button onClick={go} className="btn btn-primary mt-8 !px-9 !py-4 text-sm" autoFocus>
                    <Play size={16} className="fill-current" />
                    <span className="animate-blink">Press start</span>
                  </button>
                  <div className="mt-5 flex items-center gap-4 text-[11px] text-white/45">
                    <span className="flex items-center gap-2">
                      <Kbd>Enter</Kbd> para empezar
                    </span>
                    <button
                      onClick={() => game.toggleSound()}
                      className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 font-mono text-[11px] text-white/70 transition hover:border-accent hover:text-accent"
                      aria-pressed={sound}
                    >
                      {sound ? <Volume2 size={14} /> : <VolumeX size={14} />}
                      Sonido {sound ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
