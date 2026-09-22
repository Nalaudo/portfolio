import { Blocks, Layers, Lock, Plug, ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react'
import { achievements } from '../data/achievements'
import { achievementIcon } from '../lib/icons'
import { game, useGame } from '../game/store'
import { Relic, SectionTitle } from './ui/bits'

const PRINCIPLES = [
  { icon: Layers, title: 'De la base de datos al píxel', text: 'Como único desarrollador de Kontari llevo el ciclo completo: modelo el dominio (110 modelos), diseño la interfaz, la conecto y la despliego.' },
  { icon: ShieldCheck, title: 'Tests como seguro de vida', text: 'Más de 600 tests en Kontari (Vitest, Playwright y axe-core en CI), incluidos guards estáticos que rompen el build si una ruta queda sin autenticación.' },
  { icon: Plug, title: 'Integraciones que funcionan', text: 'ARCA, Mercado Pago, Stripe, Adyen, WhatsApp e IA generativa. Cobros, webhooks y facturas que existen de verdad, no maquetas.' },
  { icon: Blocks, title: 'Arquitectura que aguanta', text: 'Clean Architecture con NestJS en Crombie, diseño modular y POO en ShineForth. Capas claras para que el código crezca sin dolor.' },
  { icon: Users, title: 'Lidero y mentoreo', text: 'Lideré proyectos full stack y mentoreé a un desarrollador junior en buenas prácticas, Git y APIs. Comunico bien con clientes y stakeholders.' },
  { icon: Sparkles, title: 'Detalle que se siente', text: 'Motion con criterio, accesibilidad probada con axe en los E2E y microinteracciones que hacen que un producto se sienta vivo. Como este portfolio.' },
]

export function Profile() {
  const unlocked = useGame((s) => s.unlocked)
  const xp = useGame((s) => s.xp)

  return (
    <section id="perfil" className="relative px-4 py-24 sm:px-6 md:py-32">
      <Relic id="profile" className="left-[5%] top-28" />
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="04 · Perfil" title={<>Cómo <span className="text-gradient">juego</span>.</>}>
          Seis reglas que se repiten en cada proyecto, y la sala de trofeos con lo que fuiste desbloqueando por acá.
        </SectionTitle>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <article key={p.title} className="panel panel-hover flex flex-col gap-4 p-6 sm:flex-row sm:gap-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/25">
                <p.icon size={22} />
              </span>
              <div>
                <p className="font-mono text-[10px] text-accent">REGLA {String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 font-display text-lg font-bold leading-tight">{p.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/60">{p.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label mb-2 flex items-center gap-2 !text-accent"><Trophy size={13} /> Sala de trofeos</p>
              <h3 className="font-display text-2xl font-black sm:text-3xl">Logros <span className="text-white/35">{unlocked.length}/{achievements.length}</span></h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-white/50">{xp} XP acumulada</span>
              <button onClick={() => { if (confirm('¿Reiniciar toda tu partida?')) game.reset() }} className="btn btn-ghost !px-4 !py-2 !text-[10px]">Reiniciar partida</button>
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
                    <p className="truncate font-display text-[14px] font-bold">{secret ? '???' : a.title}</p>
                    <p className="text-[12.5px] leading-snug text-white/50">{secret ? 'Logro secreto. Hay un código que los gamers conocen…' : a.desc}</p>
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
