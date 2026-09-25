import { Blocks, Layers, Lock, Plug, ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react'
import { achievements } from '../data/achievements'
import { achievementIcon } from '../lib/icons'
import { game, useGame } from '../game/store'
import { Relic, SectionTitle } from './ui/bits'
import { useT } from '../lib/i18n'

const PRINCIPLES = [
  {
    icon: Layers,
    title: { es: 'De la base de datos al píxel', en: 'From the database to the pixel', it: 'Dal database al pixel' },
    text: {
      es: 'Como único desarrollador de Kontari llevo el ciclo completo: modelo el dominio (110 modelos), diseño la interfaz, la conecto y la despliego.',
      en: 'As Kontari’s sole developer I own the full cycle: I model the domain (110 models), design the interface, wire it up and deploy it.',
      it: 'Come unico sviluppatore di Kontari seguo l’intero ciclo: modello il dominio (110 modelli), progetto l’interfaccia, la collego e la metto in produzione.',
    },
  },
  {
    icon: ShieldCheck,
    title: { es: 'Tests como seguro de vida', en: 'Tests as life insurance', it: 'I test come assicurazione sulla vita' },
    text: {
      es: 'Más de 1300 tests en Kontari (Vitest, Playwright y axe-core en CI), incluidos guards estáticos que rompen el build si una ruta queda sin autenticación.',
      en: '1300+ tests in Kontari (Vitest, Playwright and axe-core in CI), including static guards that break the build if a route is left without authentication.',
      it: 'Oltre 1300 test in Kontari (Vitest, Playwright e axe-core in CI), incluse guardie statiche che fanno fallire la build se una rotta resta senza autenticazione.',
    },
  },
  {
    icon: Plug,
    title: { es: 'Integraciones que funcionan', en: 'Integrations that work', it: 'Integrazioni che funzionano' },
    text: {
      es: 'ARCA, Mercado Pago, Stripe, Adyen, WhatsApp e IA generativa. Cobros, webhooks y facturas que existen de verdad, no maquetas.',
      en: 'ARCA, Mercado Pago, Stripe, Adyen, WhatsApp and generative AI. Payments, webhooks and invoices that actually exist, not mockups.',
      it: 'ARCA, Mercado Pago, Stripe, Adyen, WhatsApp e IA generativa. Pagamenti, webhook e fatture che esistono davvero, non mockup.',
    },
  },
  {
    icon: Blocks,
    title: { es: 'Arquitectura que aguanta', en: 'Architecture that holds up', it: 'Un’architettura che regge' },
    text: {
      es: 'Clean Architecture con NestJS en Crombie, diseño modular y POO en ShineForth. Capas claras para que el código crezca sin dolor.',
      en: 'Clean Architecture with NestJS at Crombie, modular design and OOP at ShineForth. Clear layers so the code can grow painlessly.',
      it: 'Clean Architecture con NestJS in Crombie, design modulare e OOP in ShineForth. Livelli chiari perché il codice cresca senza dolore.',
    },
  },
  {
    icon: Users,
    title: { es: 'Lidero y mentoreo', en: 'I lead and mentor', it: 'Guido e faccio da mentor' },
    text: {
      es: 'Lideré proyectos full stack y mentoreé a un desarrollador junior en buenas prácticas, Git y APIs. Comunico bien con clientes y stakeholders.',
      en: 'I’ve led full-stack projects and mentored a junior developer on best practices, Git and APIs. I communicate well with clients and stakeholders.',
      it: 'Ho guidato progetti full stack e fatto da mentor a uno sviluppatore junior su buone pratiche, Git e API. Comunico bene con clienti e stakeholder.',
    },
  },
  {
    icon: Sparkles,
    title: { es: 'Detalle que se siente', en: 'Detail you can feel', it: 'Dettagli che si sentono' },
    text: {
      es: 'Motion con criterio, accesibilidad probada con axe en los E2E y microinteracciones que hacen que un producto se sienta vivo. Como este portfolio.',
      en: 'Motion with judgment, accessibility tested with axe in the E2E suite and micro-interactions that make a product feel alive. Like this portfolio.',
      it: 'Motion con criterio, accessibilità testata con axe negli E2E e micro-interazioni che fanno sembrare vivo un prodotto. Come questo portfolio.',
    },
  },
]

export function Profile() {
  const unlocked = useGame((s) => s.unlocked)
  const xp = useGame((s) => s.xp)
  const t = useT()

  return (
    <section id="perfil" className="relative px-4 py-24 sm:px-6 md:py-32">
      <Relic id="profile" className="left-[5%] top-28" />
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow={t('04 · Perfil', '04 · Profile', '04 · Profilo')} title={t(<>Cómo <span className="text-gradient">juego</span>.</>, <>How I <span className="text-gradient">play</span>.</>, <>Come <span className="text-gradient">gioco</span>.</>)}>
          {t(
            'Seis reglas que se repiten en cada proyecto, y la sala de trofeos con lo que fuiste desbloqueando por acá.',
            'Six rules that repeat in every project, and the trophy room with everything you’ve unlocked along the way.',
            'Sei regole che si ripetono in ogni progetto, e la sala dei trofei con ciò che hai sbloccato finora.',
          )}
        </SectionTitle>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <article key={p.title.es} className="panel panel-hover flex flex-col gap-4 p-6 sm:flex-row sm:gap-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/25">
                <p.icon size={22} />
              </span>
              <div>
                <p className="font-mono text-[10px] text-accent">{t('REGLA', 'RULE', 'REGOLA')} {String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 font-display text-lg font-bold leading-tight">{t.l(p.title)}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/60">{t.l(p.text)}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label mb-2 flex items-center gap-2 !text-accent"><Trophy size={13} /> {t('Sala de trofeos', 'Trophy room', 'Sala dei trofei')}</p>
              <h3 className="font-display text-2xl font-black sm:text-3xl">{t('Logros', 'Achievements', 'Obiettivi')} <span className="text-white/35">{unlocked.length}/{achievements.length}</span></h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-white/50">{xp} {t('XP acumulada', 'XP earned', 'XP accumulati')}</span>
              <button onClick={() => { if (confirm(t('¿Reiniciar toda tu partida?', 'Reset your whole game?', 'Vuoi azzerare tutta la partita?'))) game.reset() }} className="btn btn-ghost !px-4 !py-2 !text-[10px]">{t('Reiniciar partida', 'Reset game', 'Azzera partita')}</button>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((a) => {
              const got = unlocked.includes(a.id)
              const Icon = achievementIcon[a.icon]
              const secret = a.hidden && !got
              return (
                <li key={a.id} className={`panel flex items-center gap-4 p-4 transition ${got ? '!border-accent/40' : 'opacity-60'}`}>
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${got ? 'bg-accent text-void shadow-[0_0_24px_-4px_var(--accent)]' : 'bg-white/[0.05] text-white/35'}`}>
                    {secret ? <Lock size={20} /> : <Icon size={22} />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-[14px] font-bold">{secret ? '???' : t.l(a.title)}</p>
                    <p className="text-[12.5px] leading-snug text-white/50">{secret ? t('Logro secreto. Hay un código que los gamers conocen…', 'Secret achievement. There’s a code gamers know…', 'Obiettivo segreto. C’è un codice che i gamer conoscono…') : t.l(a.desc)}</p>
                  </div>
                  <span className="ml-auto shrink-0 font-mono text-[11px] text-accent">{got ? '✓' : `+${a.xp}`}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
