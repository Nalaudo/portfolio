import type { Loc, T } from '../lib/i18n'
import { projects } from './projects'
import { jobSources } from './experience'

export type SkillCat = 'Lenguajes' | 'Frontend' | 'Backend' | 'Datos' | 'Integraciones' | 'IA' | 'Cloud & DevOps' | 'Testing' | 'Arquitectura'

export interface Skill {
  id: string
  /** Nombre propio (igual en los dos idiomas) o { es, en } si se traduce. */
  name: string | Loc
  cat: SkillCat
  note: Loc
  /** Aprendido en cursos (todavía sin proyecto propio en el mapa). */
  study?: boolean
}

export const skillName = (s: Skill, t: T) => (typeof s.name === 'string' ? s.name : t.l(s.name))

// Fuente: CV "Full Stack ES" + aptitudes de LinkedIn + dependencias reales de los repos.
export const skills: Skill[] = [
  // Lenguajes
  { id: 'typescript', name: 'TypeScript', cat: 'Lenguajes', note: { es: 'Modelos tipados de punta a punta', en: 'End-to-end typed models', it: 'Modelli tipizzati end-to-end' } },
  { id: 'javascript', name: 'JavaScript', cat: 'Lenguajes', note: { es: 'Node.js y React en producción', en: 'Node.js and React in production', it: 'Node.js e React in produzione' } },
  { id: 'python', name: 'Python', cat: 'Lenguajes', note: { es: 'Programador avanzado (Udemy, 2026)', en: 'Advanced programmer (Udemy, 2026)', it: 'Programmatore avanzato (Udemy, 2026)' }, study: true },
  { id: 'sql', name: 'SQL', cat: 'Lenguajes', note: { es: 'Consultas y modelado relacional', en: 'Queries and relational modeling', it: 'Query e modellazione relazionale' } },
  { id: 'pandas', name: 'Pandas', cat: 'Lenguajes', note: { es: 'Análisis de datos en Python', en: 'Data analysis in Python', it: 'Analisi dei dati in Python' }, study: true },
  { id: 'streamlit', name: 'Streamlit', cat: 'Lenguajes', note: { es: 'Apps de datos en Python', en: 'Data apps in Python', it: 'App di dati in Python' }, study: true },
  { id: 'pygame', name: 'Pygame', cat: 'Lenguajes', note: { es: 'Juegos en Python', en: 'Games in Python', it: 'Giochi in Python' }, study: true },
  { id: 'tkinter', name: 'Tkinter', cat: 'Lenguajes', note: { es: 'Interfaces de escritorio', en: 'Desktop interfaces', it: 'Interfacce desktop' }, study: true },
  { id: 'jupyter', name: 'Jupyter', cat: 'Lenguajes', note: { es: 'Notebooks y prototipado', en: 'Notebooks and prototyping', it: 'Notebook e prototipazione' }, study: true },
  // Frontend
  { id: 'react', name: 'React', cat: 'Frontend', note: { es: 'v19, hooks propios y Server Components', en: 'v19, custom hooks and Server Components', it: 'v19, hook personalizzati e Server Components' } },
  { id: 'nextjs', name: 'Next.js', cat: 'Frontend', note: { es: 'App Router, SSR, route handlers', en: 'App Router, SSR, route handlers', it: 'App Router, SSR, route handler' } },
  { id: 'vite', name: 'Vite', cat: 'Frontend', note: { es: 'SPAs rápidas y sin fricción', en: 'Fast, frictionless SPAs', it: 'SPA veloci e senza attriti' } },
  { id: 'tailwind', name: 'Tailwind CSS', cat: 'Frontend', note: { es: 'v3 y v4, sistemas de diseño propios', en: 'v3 and v4, custom design systems', it: 'v3 e v4, design system personalizzati' } },
  { id: 'framer', name: 'Framer Motion', cat: 'Frontend', note: { es: 'Motion design con criterio', en: 'Motion design with judgment', it: 'Motion design con criterio' } },
  { id: 'reactquery', name: 'React Query', cat: 'Frontend', note: { es: 'Estado de servidor y caché', en: 'Server state and caching', it: 'Stato del server e cache' } },
  { id: 'rhf', name: 'React Hook Form', cat: 'Frontend', note: { es: 'Formularios complejos', en: 'Complex forms', it: 'Form complessi' } },
  { id: 'zod', name: 'Zod', cat: 'Frontend', note: { es: 'Validación de esquemas', en: 'Schema validation', it: 'Validazione di schemi' } },
  { id: 'gsap', name: 'GSAP', cat: 'Frontend', note: { es: 'ScrollTrigger y timelines', en: 'ScrollTrigger and timelines', it: 'ScrollTrigger e timeline' } },
  { id: 'radix', name: 'Radix / shadcn', cat: 'Frontend', note: { es: 'Componentes accesibles', en: 'Accessible components', it: 'Componenti accessibili' } },
  { id: 'heroui', name: 'HeroUI', cat: 'Frontend', note: { es: 'UI kit para paneles complejos', en: 'UI kit for complex dashboards', it: 'UI kit per pannelli complessi' } },
  { id: 'recharts', name: 'Recharts', cat: 'Frontend', note: { es: 'Dashboards y reportes', en: 'Dashboards and reports', it: 'Dashboard e report' } },
  // Backend
  { id: 'nodejs', name: 'Node.js', cat: 'Backend', note: { es: 'Servicios y APIs', en: 'Services and APIs', it: 'Servizi e API' } },
  { id: 'nestjs', name: 'NestJS', cat: 'Backend', note: { es: 'Arquitectura limpia con TypeScript', en: 'Clean architecture with TypeScript', it: 'Clean architecture con TypeScript' } },
  { id: 'express', name: 'Express', cat: 'Backend', note: { es: 'APIs con middleware personalizado', en: 'APIs with custom middleware', it: 'API con middleware personalizzato' } },
  { id: 'rest', name: 'REST', cat: 'Backend', note: { es: 'APIs documentadas', en: 'Documented APIs', it: 'API documentate' } },
  { id: 'graphql', name: 'GraphQL', cat: 'Backend', note: { es: 'Con autorización personalizada', en: 'With custom authorization', it: 'Con autorizzazione personalizzata' } },
  { id: 'authjs', name: 'NextAuth / Auth.js', cat: 'Backend', note: { es: 'Sesiones JWT, magic link, 2FA', en: 'JWT sessions, magic link, 2FA', it: 'Sessioni JWT, magic link, 2FA' } },
  // Datos
  { id: 'prisma', name: 'Prisma ORM', cat: 'Datos', note: { es: 'Esquemas de 100+ modelos', en: 'Schemas with 100+ models', it: 'Schemi con oltre 100 modelli' } },
  { id: 'postgres', name: 'PostgreSQL', cat: 'Datos', note: { es: 'Multi-tenencia y migraciones', en: 'Multi-tenancy and migrations', it: 'Multi-tenancy e migrazioni' } },
  { id: 'mssql', name: 'SQL Server', cat: 'Datos', note: { es: 'Microsoft SQL Server en Crombie', en: 'Microsoft SQL Server at Crombie', it: 'Microsoft SQL Server in Crombie' } },
  // Integraciones
  { id: 'mp', name: 'Mercado Pago', cat: 'Integraciones', note: { es: 'Suscripciones recurrentes y webhooks', en: 'Recurring subscriptions and webhooks', it: 'Abbonamenti ricorrenti e webhook' } },
  { id: 'stripe', name: 'Stripe', cat: 'Integraciones', note: { es: 'Pagos vía HTTP y webhooks', en: 'Payments over HTTP and webhooks', it: 'Pagamenti via HTTP e webhook' } },
  { id: 'adyen', name: 'Adyen', cat: 'Integraciones', note: { es: 'Pagos vía HTTP y webhooks', en: 'Payments over HTTP and webhooks', it: 'Pagamenti via HTTP e webhook' } },
  { id: 'arca', name: 'ARCA / AFIP', cat: 'Integraciones', note: { es: 'Padrón, catálogo y facturación', en: 'Argentine tax agency: registry, catalog and invoicing', it: 'Agenzia delle entrate argentina: anagrafe, catalogo e fatturazione' } },
  { id: 'soap', name: 'SOAP', cat: 'Integraciones', note: { es: 'Servicios web de ARCA', en: 'ARCA web services', it: 'Web service di ARCA' } },
  { id: 'webhooks', name: 'Webhooks', cat: 'Integraciones', note: { es: 'Eventos firmados e idempotentes', en: 'Signed, idempotent events', it: 'Eventi firmati e idempotenti' } },
  { id: 'whatsapp', name: 'WhatsApp Cloud', cat: 'Integraciones', note: { es: 'Mensajería con clientes', en: 'Messaging with clients', it: 'Messaggistica con i clienti' } },
  { id: 'resend', name: 'Resend', cat: 'Integraciones', note: { es: 'Email transaccional y magic links', en: 'Transactional email and magic links', it: 'Email transazionali e magic link' } },
  // IA
  { id: 'aisdk', name: 'AI SDK', cat: 'IA', note: { es: 'Asistentes con tools y tope de gasto', en: 'Assistants with tools and a spending cap', it: 'Assistenti con tool e tetto di spesa' } },
  { id: 'claude', name: 'Claude', cat: 'IA', note: { es: 'IA generativa en producto', en: 'Generative AI in product', it: 'IA generativa nel prodotto' } },
  { id: 'langchain', name: 'LangChain', cat: 'IA', note: { es: 'Curso de Udemy, en curso', en: 'Udemy course, in progress', it: 'Corso Udemy, in corso' }, study: true },
  { id: 'langgraph', name: 'LangGraph', cat: 'IA', note: { es: 'Agentes con grafos, en curso', en: 'Graph-based agents, in progress', it: 'Agenti basati su grafi, in corso' }, study: true },
  // Cloud & DevOps
  { id: 'aws', name: 'AWS', cat: 'Cloud & DevOps', note: { es: 'Deploys en Crombie', en: 'Deployments at Crombie', it: 'Deploy in Crombie' } },
  { id: 'vercel', name: 'Vercel', cat: 'Cloud & DevOps', note: { es: 'Deploys, analytics y AI Gateway', en: 'Deployments, analytics and AI Gateway', it: 'Deploy, analytics e AI Gateway' } },
  { id: 'cicd', name: 'CI/CD', cat: 'Cloud & DevOps', note: { es: 'Pipelines de build, test y deploy', en: 'Build, test and deploy pipelines', it: 'Pipeline di build, test e deploy' } },
  { id: 'gha', name: 'GitHub Actions', cat: 'Cloud & DevOps', note: { es: 'CI en los tres repos de Kontari', en: 'CI across Kontari’s three repos', it: 'CI nei tre repo di Kontari' } },
  { id: 'docker', name: 'Docker', cat: 'Cloud & DevOps', note: { es: 'Entornos locales reproducibles', en: 'Reproducible local environments', it: 'Ambienti locali riproducibili' } },
  { id: 'git', name: 'Git / GitHub', cat: 'Cloud & DevOps', note: { es: 'Flujo por ramas', en: 'Branch-based workflow', it: 'Flusso basato su branch' } },
  // Testing
  { id: 'vitest', name: 'Vitest', cat: 'Testing', note: { es: 'Unit tests y guards estáticos', en: 'Unit tests and static guards', it: 'Unit test e guardie statiche' } },
  { id: 'playwright', name: 'Playwright', cat: 'Testing', note: { es: 'E2E multi-app', en: 'Multi-app E2E', it: 'E2E multi-app' } },
  { id: 'testinglib', name: 'Testing Library', cat: 'Testing', note: { es: 'Tests de componentes', en: 'Component tests', it: 'Test dei componenti' } },
  { id: 'axe', name: 'axe-core', cat: 'Testing', note: { es: 'Accesibilidad automatizada', en: 'Automated accessibility', it: 'Accessibilità automatizzata' } },
  // Arquitectura & seguridad
  { id: 'clean', name: 'Clean Architecture', cat: 'Arquitectura', note: { es: 'Capas y dependencias claras', en: 'Clear layers and dependencies', it: 'Livelli e dipendenze chiari' } },
  { id: 'oop', name: { es: 'POO', en: 'OOP', it: 'OOP' }, cat: 'Arquitectura', note: { es: 'Diseño orientado a objetos', en: 'Object-oriented design', it: 'Design orientato agli oggetti' } },
  { id: 'modular', name: { es: 'Diseño modular', en: 'Modular design', it: 'Design modulare' }, cat: 'Arquitectura', note: { es: 'Código reutilizable', en: 'Reusable code', it: 'Codice riutilizzabile' } },
  { id: 'microservices', name: { es: 'Microservicios', en: 'Microservices', it: 'Microservizi' }, cat: 'Arquitectura', note: { es: 'Servicios desacoplados', en: 'Decoupled services', it: 'Servizi disaccoppiati' } },
  { id: '2fa', name: '2FA', cat: 'Arquitectura', note: { es: 'TOTP y códigos de respaldo', en: 'TOTP and backup codes', it: 'TOTP e codici di backup' } },
  { id: 'e2ee', name: 'E2EE', cat: 'Arquitectura', note: { es: 'Bóveda AES-256-GCM + PBKDF2', en: 'AES-256-GCM + PBKDF2 vault', it: 'Cassaforte AES-256-GCM + PBKDF2' } },
]

export const skillCats: SkillCat[] = ['Lenguajes', 'Frontend', 'Backend', 'Datos', 'Integraciones', 'IA', 'Cloud & DevOps', 'Testing', 'Arquitectura']

export const catLabel: Record<SkillCat | 'Todo', Loc> = {
  Todo: { es: 'Todo', en: 'All', it: 'Tutto' },
  Lenguajes: { es: 'Lenguajes', en: 'Languages', it: 'Linguaggi' },
  Frontend: { es: 'Frontend', en: 'Frontend', it: 'Frontend' },
  Backend: { es: 'Backend', en: 'Backend', it: 'Backend' },
  Datos: { es: 'Datos', en: 'Data', it: 'Dati' },
  Integraciones: { es: 'Integraciones', en: 'Integrations', it: 'Integrazioni' },
  IA: { es: 'IA', en: 'AI', it: 'IA' },
  'Cloud & DevOps': { es: 'Cloud & DevOps', en: 'Cloud & DevOps', it: 'Cloud & DevOps' },
  Testing: { es: 'Testing', en: 'Testing', it: 'Testing' },
  Arquitectura: { es: 'Arquitectura', en: 'Architecture', it: 'Architettura' },
}

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

export const rarityMeta: Record<Rarity, { label: Loc; color: string; rule: Loc }> = {
  legendary: { label: { es: 'Legendario', en: 'Legendary', it: 'Leggendario' }, color: '#ffb547', rule: { es: '5+ fuentes', en: '5+ sources', it: '5+ fonti' } },
  epic: { label: { es: 'Épico', en: 'Epic', it: 'Epico' }, color: '#c084fc', rule: { es: '3-4 fuentes', en: '3-4 sources', it: '3-4 fonti' } },
  rare: { label: { es: 'Raro', en: 'Rare', it: 'Raro' }, color: '#38bdf8', rule: { es: '2 fuentes', en: '2 sources', it: '2 fonti' } },
  common: { label: { es: 'Común', en: 'Common', it: 'Comune' }, color: '#94a3b8', rule: { es: '1 fuente', en: '1 source', it: '1 fonte' } },
  training: { label: { es: 'En entrenamiento', en: 'In training', it: 'In allenamento' }, color: '#2dd4bf', rule: { es: 'cursos', en: 'courses', it: 'corsi' } },
}
