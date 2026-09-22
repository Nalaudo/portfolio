import { projects } from './projects'
import { jobSources } from './experience'

export type SkillCat = 'Lenguajes' | 'Frontend' | 'Backend' | 'Datos' | 'Integraciones' | 'IA' | 'Cloud & DevOps' | 'Testing' | 'Arquitectura'

export interface Skill {
  id: string
  name: string
  cat: SkillCat
  note: string
  /** Aprendido en cursos (todavía sin proyecto propio en el mapa). */
  study?: boolean
}

// Fuente: CV "Full Stack ES" + aptitudes de LinkedIn + dependencias reales de los repos.
export const skills: Skill[] = [
  // Lenguajes
  { id: 'typescript', name: 'TypeScript', cat: 'Lenguajes', note: 'Modelos tipados de punta a punta' },
  { id: 'javascript', name: 'JavaScript', cat: 'Lenguajes', note: 'Node.js y React en producción' },
  { id: 'python', name: 'Python', cat: 'Lenguajes', note: 'Programador avanzado (Udemy, 2026)', study: true },
  { id: 'sql', name: 'SQL', cat: 'Lenguajes', note: 'Consultas y modelado relacional' },
  { id: 'pandas', name: 'Pandas', cat: 'Lenguajes', note: 'Análisis de datos en Python', study: true },
  { id: 'streamlit', name: 'Streamlit', cat: 'Lenguajes', note: 'Apps de datos en Python', study: true },
  { id: 'pygame', name: 'Pygame', cat: 'Lenguajes', note: 'Juegos en Python', study: true },
  { id: 'tkinter', name: 'Tkinter', cat: 'Lenguajes', note: 'Interfaces de escritorio', study: true },
  { id: 'jupyter', name: 'Jupyter', cat: 'Lenguajes', note: 'Notebooks y prototipado', study: true },
  // Frontend
  { id: 'react', name: 'React', cat: 'Frontend', note: 'v19, hooks propios y Server Components' },
  { id: 'nextjs', name: 'Next.js', cat: 'Frontend', note: 'App Router, SSR, route handlers' },
  { id: 'vite', name: 'Vite', cat: 'Frontend', note: 'SPAs rápidas y sin fricción' },
  { id: 'tailwind', name: 'Tailwind CSS', cat: 'Frontend', note: 'v3 y v4, sistemas de diseño propios' },
  { id: 'framer', name: 'Framer Motion', cat: 'Frontend', note: 'Motion design con criterio' },
  { id: 'reactquery', name: 'React Query', cat: 'Frontend', note: 'Estado de servidor y caché' },
  { id: 'rhf', name: 'React Hook Form', cat: 'Frontend', note: 'Formularios complejos' },
  { id: 'zod', name: 'Zod', cat: 'Frontend', note: 'Validación de esquemas' },
  { id: 'gsap', name: 'GSAP', cat: 'Frontend', note: 'ScrollTrigger y timelines' },
  { id: 'radix', name: 'Radix / shadcn', cat: 'Frontend', note: 'Componentes accesibles' },
  { id: 'heroui', name: 'HeroUI', cat: 'Frontend', note: 'UI kit para paneles complejos' },
  { id: 'recharts', name: 'Recharts', cat: 'Frontend', note: 'Dashboards y reportes' },
  // Backend
  { id: 'nodejs', name: 'Node.js', cat: 'Backend', note: 'Servicios y APIs' },
  { id: 'nestjs', name: 'NestJS', cat: 'Backend', note: 'Arquitectura limpia con TypeScript' },
  { id: 'express', name: 'Express', cat: 'Backend', note: 'APIs con middleware personalizado' },
  { id: 'rest', name: 'REST', cat: 'Backend', note: 'APIs documentadas' },
  { id: 'graphql', name: 'GraphQL', cat: 'Backend', note: 'Con autorización personalizada' },
  { id: 'authjs', name: 'NextAuth / Auth.js', cat: 'Backend', note: 'Sesiones JWT, magic link, 2FA' },
  // Datos
  { id: 'prisma', name: 'Prisma ORM', cat: 'Datos', note: 'Esquemas de 100+ modelos' },
  { id: 'postgres', name: 'PostgreSQL', cat: 'Datos', note: 'Multi-tenencia y migraciones' },
  { id: 'mssql', name: 'SQL Server', cat: 'Datos', note: 'Microsoft SQL Server en Crombie' },
  // Integraciones
  { id: 'mp', name: 'Mercado Pago', cat: 'Integraciones', note: 'Suscripciones recurrentes y webhooks' },
  { id: 'stripe', name: 'Stripe', cat: 'Integraciones', note: 'Pagos vía HTTP y webhooks' },
  { id: 'adyen', name: 'Adyen', cat: 'Integraciones', note: 'Pagos vía HTTP y webhooks' },
  { id: 'arca', name: 'ARCA / AFIP', cat: 'Integraciones', note: 'Padrón, catálogo y facturación' },
  { id: 'soap', name: 'SOAP', cat: 'Integraciones', note: 'Servicios web de ARCA' },
  { id: 'webhooks', name: 'Webhooks', cat: 'Integraciones', note: 'Eventos firmados e idempotentes' },
  { id: 'whatsapp', name: 'WhatsApp Cloud', cat: 'Integraciones', note: 'Mensajería con clientes' },
  { id: 'resend', name: 'Resend', cat: 'Integraciones', note: 'Email transaccional y magic links' },
  // IA
  { id: 'aisdk', name: 'AI SDK', cat: 'IA', note: 'Asistentes con tools y tope de gasto' },
  { id: 'claude', name: 'Claude', cat: 'IA', note: 'IA generativa en producto' },
  { id: 'langchain', name: 'LangChain', cat: 'IA', note: 'Curso de Udemy, en curso', study: true },
  { id: 'langgraph', name: 'LangGraph', cat: 'IA', note: 'Agentes con grafos, en curso', study: true },
  // Cloud & DevOps
  { id: 'aws', name: 'AWS', cat: 'Cloud & DevOps', note: 'Deploys en Crombie' },
  { id: 'vercel', name: 'Vercel', cat: 'Cloud & DevOps', note: 'Deploys, analytics y AI Gateway' },
  { id: 'cicd', name: 'CI/CD', cat: 'Cloud & DevOps', note: 'Pipelines de build, test y deploy' },
  { id: 'gha', name: 'GitHub Actions', cat: 'Cloud & DevOps', note: 'CI en los tres repos de Kontari' },
  { id: 'docker', name: 'Docker', cat: 'Cloud & DevOps', note: 'Entornos locales reproducibles' },
  { id: 'git', name: 'Git / GitHub', cat: 'Cloud & DevOps', note: 'Flujo por ramas' },
  // Testing
  { id: 'vitest', name: 'Vitest', cat: 'Testing', note: 'Unit tests y guards estáticos' },
  { id: 'playwright', name: 'Playwright', cat: 'Testing', note: 'E2E multi-app' },
  { id: 'testinglib', name: 'Testing Library', cat: 'Testing', note: 'Tests de componentes' },
  { id: 'axe', name: 'axe-core', cat: 'Testing', note: 'Accesibilidad automatizada' },
  // Arquitectura & seguridad
  { id: 'clean', name: 'Clean Architecture', cat: 'Arquitectura', note: 'Capas y dependencias claras' },
  { id: 'oop', name: 'POO', cat: 'Arquitectura', note: 'Diseño orientado a objetos' },
  { id: 'modular', name: 'Diseño modular', cat: 'Arquitectura', note: 'Código reutilizable' },
  { id: 'microservices', name: 'Microservicios', cat: 'Arquitectura', note: 'Servicios desacoplados' },
  { id: '2fa', name: '2FA', cat: 'Arquitectura', note: 'TOTP y códigos de respaldo' },
  { id: 'e2ee', name: 'E2EE', cat: 'Arquitectura', note: 'Bóveda AES-256-GCM + PBKDF2' },
]

export const skillCats: SkillCat[] = ['Lenguajes', 'Frontend', 'Backend', 'Datos', 'Integraciones', 'IA', 'Cloud & DevOps', 'Testing', 'Arquitectura']

/** "Fuentes" donde se usó una tecnología: los 5 mundos del mapa + empleos que no son un mundo. */
export interface Source {
  id: string
  name: string
  color: string
}
export const sources: Source[] = [
  ...projects.map((p) => ({ id: p.id, name: p.name, color: p.accent })),
  ...jobSources.map((j) => ({ id: j.id, name: j.company, color: j.color })),
]

const jobStack = (id: string) => jobSources.find((j) => j.id === id)?.stack ?? []

export const skillUsage = (id: string): string[] =>
  sources.filter((s) => (projects.find((p) => p.id === s.id)?.stack ?? jobStack(s.id)).includes(id)).map((s) => s.id)

export type Rarity = 'legendary' | 'epic' | 'rare' | 'common' | 'training'
export const rarityOf = (count: number, study?: boolean): Rarity =>
  count >= 5 ? 'legendary' : count >= 3 ? 'epic' : count === 2 ? 'rare' : count === 1 ? 'common' : study ? 'training' : 'common'

export const rarityMeta: Record<Rarity, { label: string; color: string; rule: string }> = {
  legendary: { label: 'Legendario', color: '#ffb547', rule: '5+ fuentes' },
  epic: { label: 'Épico', color: '#c084fc', rule: '3-4 fuentes' },
  rare: { label: 'Raro', color: '#38bdf8', rule: '2 fuentes' },
  common: { label: 'Común', color: '#94a3b8', rule: '1 fuente' },
  training: { label: 'En entrenamiento', color: '#2dd4bf', rule: 'cursos' },
}
