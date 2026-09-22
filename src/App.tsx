import { useEffect } from 'react'
import { AnimatePresence } from 'motion/react'
import { Starfield } from './components/Starfield'
import { CursorFx } from './components/CursorFx'
import { Boot } from './components/Boot'
import { Hud } from './components/Hud'
import { Toasts } from './components/Toasts'
import { Palette } from './components/Palette'
import { Hero } from './components/Hero'
import { Ribbon } from './components/Ribbon'
import { Overworld } from './components/Overworld'
import { Inventory } from './components/Inventory'
import { Timeline } from './components/Timeline'
import { Profile } from './components/Profile'
import { Contact } from './components/Contact'
import { LevelScreen } from './components/LevelScreen'
import { game, useGame } from './game/store'
import { sfx } from './game/audio'
import { fx } from './lib/fx'
import { useLevelRoute } from './lib/route'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

function useKonami() {
  useEffect(() => {
    let i = 0
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      i = k === KONAMI[i] ? i + 1 : k === KONAMI[0] ? 1 : 0
      if (i === KONAMI.length) {
        i = 0
        if (!game.get().turbo) game.toggleTurbo()
        game.unlock('konami')
        sfx.levelUp()
        fx.confetti()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])
}

export default function App() {
  const started = useGame((s) => s.started)
  const level = useLevelRoute()
  useKonami()

  return (
    <>
      <Starfield />
      <CursorFx />
      <Boot />
      {started && <Hud />}
      <Palette />
      <Toasts />

      <main className="relative z-[1]" aria-hidden={!started}>
        <Hero />
        <Ribbon />
        <Overworld />
        <Inventory />
        <Timeline />
        <Profile />
        <Contact />
      </main>

      <AnimatePresence>{level && started && <LevelScreen key="level" id={level} />}</AnimatePresence>
    </>
  )
}
