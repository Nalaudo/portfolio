import { projects } from './projects'

export type SkillCat = 'Frontend' | 'Backend' | 'Datos' | 'Integraciones' | 'Calidad' | 'Infra'

export interface Skill {
  id: string
  name: string
  cat: SkillCat
  note: string
}

export const skills: Skill[] = [
  { id: 'react', name: 'React', cat: 'Frontend', note: 'v19, Server Components y hooks propios' },
  { id: 'nextjs', name: 'Next.js', cat: 'Frontend', note: 'App Router, RSC, route handlers' },
  { id: 'typescript', name: 'TypeScript', cat: 'Frontend', note: 'Modelos tipados de punta a punta' },
  { id: 'tailwind', name: 'Tailwind CSS', cat: 'Frontend', note: 'v3 y v4, sistemas de diseño propios' },
  { id: 'framer', name: 'Framer Motion', cat: 'Frontend', note: 'Motion design con criterio' },
  { id: 'gsap', name: 'GSAP', cat: 'Frontend', note: 'ScrollTrigger y timelines' },
  { id: 'vite', name: 'Vite', cat: 'Frontend', note: 'SPAs rápidas y sin fricción' },
  { id: 'radix', name: 'Radix / shadcn', cat: 'Frontend', note: 'Componentes accesibles' },
  { id: 'heroui', name: 'HeroUI', cat: 'Frontend', note: 'UI kit para paneles complejos' },
  { id: 'recharts', name: 'Recharts', cat: 'Frontend', note: 'Dashboards y reportes' },
  { id: 'authjs', name: 'Auth.js', cat: 'Backend', note: 'Sesiones JWT, magic link, 2FA' },
  { id: 'aisdk', name: 'Vercel AI SDK', cat: 'Backend', note: 'Asistentes con tools y tope de gasto' },
  { id: 'prisma', name: 'Prisma', cat: 'Datos', note: 'Esquemas de 100+ modelos' },
  { id: 'postgres', name: 'PostgreSQL', cat: 'Datos', note: 'Multi-tenencia y migraciones' },
  { id: 'mp', name: 'Mercado Pago', cat: 'Integraciones', note: 'Suscripciones, preferencias, webhooks' },
  { id: 'arca', name: 'ARCA / AFIP', cat: 'Integraciones', note: 'Padrón, WSAA, facturación electrónica' },
  { id: 'gcal', name: 'Google Calendar', cat: 'Integraciones', note: 'Disponibilidad y eventos vía OAuth' },
  { id: 'whatsapp', name: 'WhatsApp Cloud', cat: 'Integraciones', note: 'Mensajería con clientes' },
  { id: 'resend', name: 'Resend', cat: 'Integraciones', note: 'Email transaccional y magic links' },
  { id: 'vitest', name: 'Vitest', cat: 'Calidad', note: 'Unit tests y guards estáticos' },
  { id: 'playwright', name: 'Playwright', cat: 'Calidad', note: 'E2E con axe de accesibilidad' },
  { id: 'vercel', name: 'Vercel', cat: 'Infra', note: 'Deploys, analytics y AI Gateway' },
  { id: 'docker', name: 'Docker', cat: 'Infra', note: 'Entornos locales reproducibles' },
  { id: 'git', name: 'Git / GitHub', cat: 'Infra', note: 'Flujo por ramas y CI' },
]

export const skillCats: SkillCat[] = ['Frontend', 'Backend', 'Datos', 'Integraciones', 'Calidad', 'Infra']

export const skillUsage = (id: string) => projects.filter((p) => p.stack.includes(id)).map((p) => p.id)

export type Rarity = 'legendary' | 'epic' | 'rare' | 'common'
export const rarityOf = (count: number): Rarity =>
  count >= 4 ? 'legendary' : count === 3 ? 'epic' : count === 2 ? 'rare' : 'common'

export const rarityMeta: Record<Rarity, { label: string; color: string }> = {
  legendary: { label: 'Legendario', color: '#ffb547' },
  epic: { label: 'Épico', color: '#c084fc' },
  rare: { label: 'Raro', color: '#38bdf8' },
  common: { label: 'Común', color: '#94a3b8' },
}
