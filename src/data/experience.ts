import type { LevelId } from './projects'

// Trayectoria según el CV y LinkedIn.
export interface Role {
  id: string
  company: string
  role: string
  kind: 'Fundador' | 'Empleo' | 'Freelance' | 'Proyecto propio'
  from: [number, number] // [año, mes 1-12]
  to: [number, number] | null // null = presente
  place?: string
  color: string
  bullets: string[]
  tags?: string[]
  /** Si el rol corresponde a un mundo del mapa, se usa el stack de ese proyecto. */
  world?: LevelId
  /** Stack propio (roles que no son un mundo). */
  stack?: string[]
  wip?: boolean
  link?: string
}

export const roles: Role[] = [
  {
    id: 'kontari',
    company: 'Kontari',
    role: 'Founder & Software Engineer',
    kind: 'Fundador',
    from: [2025, 2],
    to: null,
    place: 'Santa Fe · híbrido',
    color: '#8b7bff',
    world: 'kontari',
    link: 'https://kontari.com.ar',
    tags: ['Único desarrollador', 'SaaS B2B', 'En expansión'],
    bullets: [
      'Fundé y lidero el desarrollo full stack de un SaaS de gestión contable e impositiva: 3 apps (portal de contadores, portal de clientes y landing) con Next.js, React, TypeScript, Prisma y PostgreSQL.',
      'Diseñé el motor de liquidación de IVA, el motor contable completo (diario, mayor, conciliación bancaria, estados contables) y el catálogo de impuestos con sincronización diaria automática contra ARCA.',
      'Implementé autenticación y seguridad end-to-end (NextAuth, 2FA, vault cifrado E2EE), pagos recurrentes con Mercado Pago, IA generativa (Claude, AI SDK) y un programa de referidos entre contadores.',
      'Armé la infraestructura de calidad (Vitest, Playwright, axe-core, CI) en los tres repositorios y lidero arquitectura, producto y prioridades técnicas.',
    ],
  },
  {
    id: 'crombie',
    company: 'Crombie',
    role: 'Desarrollador Full Stack',
    kind: 'Empleo',
    from: [2023, 7],
    to: [2025, 9],
    place: 'Santa Fe · híbrido',
    color: '#22d3ee',
    tags: ['Clean Architecture', 'APIs', 'AWS'],
    stack: ['nodejs', 'nestjs', 'typescript', 'react', 'nextjs', 'tailwind', 'rest', 'graphql', 'stripe', 'adyen', 'webhooks', 'prisma', 'postgres', 'mssql', 'sql', 'aws', 'cicd', 'clean'],
    bullets: [
      'Diseñé servicios backend con Node.js y NestJS (arquitectura limpia, TypeScript) e interfaces con React, colaborando en apps Next.js con server-side rendering.',
      'Desarrollé y documenté APIs REST y GraphQL con autorización personalizada; integré servicios externos (Stripe, Adyen) vía HTTP y webhooks.',
      'Gestioné bases de datos con Prisma, PostgreSQL y Microsoft SQL Server, y desplegué en AWS con pipelines CI/CD.',
    ],
  },
  {
    id: 'shineforth',
    company: 'ShineForth',
    role: 'Desarrollador Full Stack',
    kind: 'Empleo',
    from: [2024, 3],
    to: [2025, 1],
    color: '#ffb547',
    tags: ['Liderazgo', 'Mentoreo', '4 proyectos'],
    stack: ['nodejs', 'react', 'express', 'javascript', 'rest', 'oop', 'modular', 'git'],
    bullets: [
      'Lideré el desarrollo full stack de dos proyectos (Node.js, React, Express) con arquitectura escalable, POO y middleware personalizado.',
      'Implementé validación, manejo centralizado de errores y código modular, priorizando rendimiento y seguridad.',
      'Mentoreé a un desarrollador junior en buenas prácticas, Git/GitHub y desarrollo de APIs; contribuí en 4 proyectos.',
    ],
  },
  {
    id: 'sbestudio',
    company: 'SB Estudio Contable',
    role: 'Sitio web institucional',
    kind: 'Freelance',
    from: [2025, 9],
    to: null,
    color: '#3b76f6',
    world: 'sbestudio',
    link: 'https://sbestudio.com.ar',
    bullets: ['Diseño y desarrollo del sitio institucional (React, Next.js, Node.js, Express), del concepto al despliegue.'],
  },
  {
    id: 'cotizari',
    company: 'Cotizari',
    role: 'Cotizador de seguros',
    kind: 'Proyecto propio',
    from: [2026, 7],
    to: null,
    color: '#4ade80',
    world: 'cotizari',
    wip: true,
    bullets: ['SaaS propia para productores de seguros: cotizador full stack con Next.js, TypeScript, Prisma y PostgreSQL.'],
  },
  {
    id: 'polizari',
    company: 'Polizari',
    role: 'Gestor de cartera de clientes',
    kind: 'Proyecto propio',
    from: [2026, 7],
    to: null,
    color: '#22d3ee',
    world: 'polizari',
    wip: true,
    bullets: ['SaaS propia para gestión de cartera de clientes y pólizas de productores de seguros, con Next.js, TypeScript, NextAuth, Prisma y PostgreSQL.'],
  },
]

/** Empleos que no son un mundo del mapa: aportan sus propias "fuentes" al inventario. */
export const jobSources = roles.filter((r) => !r.world && r.stack)

export const monthsBetween = (from: [number, number], to: [number, number] | null) => {
  const end = to ?? [new Date().getFullYear(), new Date().getMonth() + 1]
  return (end[0] - from[0]) * 12 + (end[1] - from[1]) + 1
}
