import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { Check, Copy, Mail } from 'lucide-react'
import { profile } from '../data/profile'
import { game, toastStore, useGame } from '../game/store'
import { sfx } from '../game/audio'
import { fx } from '../lib/fx'
import { GithubMark, LinkedinMark } from '../lib/icons'
import { Mascot } from './ui/Mascot'
import { Relic } from './ui/bits'
import { useT, type Loc } from '../lib/i18n'

const SUBJECT: Record<string, Loc> = {
  recruiter: { es: 'Hablemos: vi tu portfolio', en: 'Let’s talk: I saw your portfolio', it: 'Parliamone: ho visto il tuo portfolio' },
  client: { es: 'Tengo un proyecto para vos', en: 'I have a project for you', it: 'Ho un progetto per te' },
  dev: { es: 'Hola, vi tu portfolio', en: 'Hi, I saw your portfolio', it: 'Ciao, ho visto il tuo portfolio' },
}

export function Contact() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  // El aro tiene su propio observer: la cuenta (y su sonido) solo corre
  // mientras el círculo esté realmente a la vista, no con solo asomar el título.
  const ringRef = useRef<HTMLDivElement>(null)
  const ringInView = useInView(ringRef, { amount: 0.6 })
  const persona = useGame((s) => s.persona)
  const [n, setN] = useState(9)
  const [over, setOver] = useState(false)
  const [copied, setCopied] = useState(false)
  const t = useT()

  useEffect(() => {
    if (inView) game.unlock('contact')
  }, [inView])

  // Cuenta regresiva: se detiene en 0 y deja el game over prendido.
  useEffect(() => {
    if (!ringInView || over) return
    const id = setInterval(() => {
      setN((x) => Math.max(0, x - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [ringInView, over])

  // Al llegar a 0: game over. Si no insertás una moneda, revive solo, como el
  // modo demo de un fichín.
  useEffect(() => {
    if (n !== 0 || over) return
    setOver(true)
    sfx.gameOver()
  }, [n, over])

  useEffect(() => {
    if (!over) return
    const t = setTimeout(() => {
      setOver(false)
      setN(9)
    }, 3200)
    return () => clearTimeout(t)
  }, [over])

  const mail = `mailto:${profile.email}?subject=${encodeURIComponent(t.l(SUBJECT[persona ?? 'client']))}`

  const insertCoin = (e: React.MouseEvent) => {
    sfx.coin()
    fx.burst(e.clientX, e.clientY, { count: 30, colors: over ? ['#ff5c8a', '#fff', 'var(--accent)'] : undefined })
    setOver(false)
    setN(9)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      sfx.success()
      toastStore.push({ kind: 'info', title: t('Copiado', 'Copied', 'Copiato'), text: profile.email })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toastStore.push({ kind: 'info', title: t('No pude copiar', 'Couldn’t copy', 'Non sono riuscito a copiare'), text: t(`Mi email es ${profile.email}`, `My email is ${profile.email}`, `La mia email è ${profile.email}`) })
    }
  }

  const C = 2 * Math.PI * 88

  return (
    <section id="contacto" ref={ref} className="relative px-4 pb-16 pt-24 sm:px-6 md:pt-32">
      <Relic id="contact" className="right-[10%] top-32" />
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(60%_80%_at_80%_20%,#000,transparent)]" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="label mb-4 flex items-center gap-3 !text-accent"><span className="h-px w-8 bg-accent" />{t('05 · Sala final', '05 · Final room', '05 · Sala finale')}</p>
              <h2 className="font-display text-[clamp(2.2rem,6vw,4.6rem)] font-black leading-[0.95] tracking-tight">
                {t(<>¿Jugamos <span className="text-gradient">juntos</span>?</>, <>Shall we play <span className="text-gradient">together</span>?</>, <>Giochiamo <span className="text-gradient">insieme</span>?</>)}
              </h2>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/65">
                {t(
                  'Si tenés un producto para construir, un sistema que ordenar o una idea que todavía no tiene forma, contame. Respondo rápido y me gusta entender el problema antes de escribir código.',
                  'If you have a product to build, a system to untangle or an idea that hasn’t taken shape yet, tell me about it. I reply fast and I like to understand the problem before writing code.',
                  'Se hai un prodotto da costruire, un sistema da mettere in ordine o un’idea che non ha ancora forma, raccontamela. Rispondo in fretta e mi piace capire il problema prima di scrivere codice.',
                )}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href={mail} onClick={insertCoin} className="btn btn-primary !px-7 !py-4">
                  <Mail size={16} /> {t('Insertar moneda · Escribirme', 'Insert coin · Email me', 'Inserisci una moneta · Scrivimi')}
                </a>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" onClick={() => sfx.click()} className="btn btn-ghost !py-4">
                  <GithubMark size={16} /> GitHub
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" onClick={() => sfx.click()} className="btn btn-ghost !py-4">
                  <LinkedinMark size={16} /> LinkedIn
                </a>
                <button onClick={copy} className="btn btn-ghost !py-4" aria-label={t('Copiar email', 'Copy email', 'Copia email')}>
                  {copied ? <Check size={16} className="text-mint" /> : <Copy size={16} />}
                  <span className="hidden sm:inline normal-case tracking-normal">{profile.email}</span>
                  <span className="sm:hidden">{t('Copiar email', 'Copy email', 'Copia email')}</span>
                </button>
              </div>
            </div>

            <div className="mx-auto flex flex-col items-center">
              <div ref={ringRef} className="relative grid h-[230px] w-[230px] place-items-center">
                <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90" aria-hidden="true">
                  <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="6" />
                  <circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke={over ? 'var(--color-rose)' : 'var(--accent)'}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={over ? 0 : C * (1 - n / 9)}
                    style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s', filter: `drop-shadow(0 0 8px ${over ? 'var(--color-rose)' : 'var(--accent)'})` }}
                  />
                </svg>
                <div className="text-center">
                  {over ? (
                    <>
                      <p className="font-display text-3xl font-black leading-[1.05] tracking-tight text-rose">
                        GAME
                        <br />
                        OVER
                      </p>
                      <p className="label mt-2 !text-rose">{t('insertá una moneda', 'insert a coin', 'inserisci una moneta')}</p>
                    </>
                  ) : (
                    <>
                      <p className="label !text-accent">{t('¿Continuar?', 'Continue?', 'Continuare?')}</p>
                      <p className="font-display text-7xl font-black tabular-nums leading-none">{n}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-end gap-3">
                <Mascot size={54} className={over ? 'animate-shake' : undefined} />
                {over ? (
                  <p className="pb-2 font-mono text-[11px] text-rose">
                    {t('Bit está en game over.', 'Bit is in game over.', 'Bit è in game over.')}
                    <br />
                    {t('Tocá "Insertar moneda" o esperá el revive.', 'Hit "Insert coin" or wait for the respawn.', 'Tocca "Inserisci una moneta" o aspetta il respawn.')}
                  </p>
                ) : (
                  <p className="pb-2 font-mono text-[11px] text-white/45">
                    {t('Bit te espera.', 'Bit is waiting for you.', 'Bit ti aspetta.')}
                    <br />
                    {t('No lo dejes en game over.', 'Don’t leave it in game over.', 'Non lasciarlo in game over.')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] pt-8 font-mono text-[11px] text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} {profile.name} · {profile.location}</p>
          <p className="text-center">{t('Hecho a mano con React, Tailwind y motion. Pista: ↑ ↑ ↓ ↓ ← → ← → B A', 'Handmade with React, Tailwind and motion. Hint: ↑ ↑ ↓ ↓ ← → ← → B A', 'Fatto a mano con React, Tailwind e motion. Indizio: ↑ ↑ ↓ ↓ ← → ← → B A')}</p>
        </footer>
      </div>
    </section>
  )
}
