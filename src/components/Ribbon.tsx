import { skills } from '../data/skills'
import { projects } from '../data/projects'

function Row({ items, reverse = false, outline = false }: { items: string[]; reverse?: boolean; outline?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="flex w-max gap-10 py-3 will-change-transform hover:[animation-play-state:paused]" style={{ animation: `${reverse ? 'marquee-rev' : 'marquee'} ${reverse ? 55 : 45}s linear infinite` }}>
      {doubled.map((t, i) => (
        <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-[clamp(1.6rem,4vw,3rem)] font-black uppercase tracking-tight">
          <span className={outline ? 'text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.28)]' : 'text-white/85'}>{t}</span>
          <span className="text-accent">✦</span>
        </span>
      ))}
    </div>
  )
}

export function Ribbon() {
  return (
    <div className="relative z-10 -rotate-[1.2deg] overflow-hidden border-y border-white/[0.08] bg-[#080a12]/85 py-2 backdrop-blur-sm [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]" aria-hidden="true">
      <Row items={skills.slice(0, 14).map((s) => s.name)} />
      <Row items={projects.map((p) => `Nivel ${p.n} · ${p.name}`)} reverse outline />
    </div>
  )
}
