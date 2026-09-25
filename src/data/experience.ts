import type { Loc } from '../lib/i18n'
import type { LevelId } from './projects'

// Trayectoria según el CV y LinkedIn.
export type RoleKind = 'Fundador' | 'Empleo' | 'Freelance' | 'Proyecto propio'

export const kindLabel: Record<RoleKind, Loc> = {
  Fundador: { es: 'Fundador', en: 'Founder', it: 'Founder' },
  Empleo: { es: 'Empleo', en: 'Employment', it: 'Impiego' },
  Freelance: { es: 'Freelance', en: 'Freelance', it: 'Freelance' },
  'Proyecto propio': { es: 'Proyecto propio', en: 'Own project', it: 'Progetto personale' },
}

export interface Role {
  id: string
  company: string
  role: Loc
  kind: RoleKind
  from: [number, number] // [año, mes 1-12]
  to: [number, number] | null // null = presente
  place?: Loc
  color: string
  bullets: Loc<string[]>
  tags?: Loc<string[]>
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
    role: { es: 'Founder & Software Engineer', en: 'Founder & Software Engineer', it: 'Founder & Software Engineer' },
    kind: 'Fundador',
    from: [2025, 2],
    to: null,
    place: { es: 'Santa Fe · híbrido', en: 'Santa Fe · hybrid', it: 'Santa Fe · ibrido' },
    color: '#8b7bff',
    world: 'kontari',
    link: 'https://kontari.com.ar',
    tags: { es: ['Único desarrollador', 'SaaS B2B', 'En expansión'], en: ['Sole developer', 'B2B SaaS', 'Expanding'], it: ['Unico sviluppatore', 'SaaS B2B', 'In espansione'] },
    bullets: {
      es: [
        'Fundé y lidero el desarrollo full stack de un SaaS de gestión contable e impositiva: 3 apps (portal de contadores, portal de clientes y landing) con Next.js, React, TypeScript, Prisma y PostgreSQL.',
        'Diseñé el motor de liquidación de IVA, el motor contable completo (diario, mayor, conciliación bancaria, estados contables) y el catálogo de impuestos con sincronización diaria automática contra ARCA.',
        'Implementé autenticación y seguridad end-to-end (NextAuth, 2FA, vault cifrado E2EE), pagos recurrentes con Mercado Pago, IA generativa (Claude, AI SDK) y un programa de referidos entre contadores.',
        'Armé la infraestructura de calidad (Vitest, Playwright, axe-core, CI) en los tres repositorios y lidero arquitectura, producto y prioridades técnicas.',
      ],
      en: [
        'Founded and lead full-stack development of an accounting and tax management SaaS: 3 apps (accountant portal, client portal and landing page) built with Next.js, React, TypeScript, Prisma and PostgreSQL.',
        'Designed the VAT settlement engine, the full accounting engine (journal, ledger, bank reconciliation, financial statements) and the tax catalog with automatic daily sync against ARCA.',
        'Implemented end-to-end authentication and security (NextAuth, 2FA, E2EE vault), recurring payments with Mercado Pago, generative AI (Claude, AI SDK) and an accountant referral program.',
        'Built the quality infrastructure (Vitest, Playwright, axe-core, CI) across all three repositories and lead architecture, product and technical priorities.',
      ],
      it: [
        'Ho fondato e guido lo sviluppo full stack di un SaaS di gestione contabile e fiscale: 3 app (portale per commercialisti, portale clienti e landing) con Next.js, React, TypeScript, Prisma e PostgreSQL.',
        'Ho progettato il motore di liquidazione IVA, il motore contabile completo (libro giornale, mastro, riconciliazione bancaria, bilanci) e il catalogo delle imposte con sincronizzazione giornaliera automatica con ARCA.',
        'Ho implementato autenticazione e sicurezza end-to-end (NextAuth, 2FA, vault cifrato E2EE), pagamenti ricorrenti con Mercado Pago, IA generativa (Claude, AI SDK) e un programma di referral tra commercialisti.',
        'Ho costruito l’infrastruttura di qualità (Vitest, Playwright, axe-core, CI) nei tre repository e guido architettura, prodotto e priorità tecniche.',
      ],
    },
  },
  {
    id: 'crombie',
    company: 'Crombie',
    role: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer', it: 'Sviluppatore Full Stack' },
    kind: 'Empleo',
    from: [2023, 7],
    to: [2025, 9],
    place: { es: 'Santa Fe · híbrido', en: 'Santa Fe · hybrid', it: 'Santa Fe · ibrido' },
    color: '#22d3ee',
    tags: { es: ['Clean Architecture', 'APIs', 'AWS'], en: ['Clean Architecture', 'APIs', 'AWS'], it: ['Clean Architecture', 'API', 'AWS'] },
    stack: ['nodejs', 'nestjs', 'typescript', 'react', 'nextjs', 'tailwind', 'rest', 'graphql', 'stripe', 'adyen', 'webhooks', 'prisma', 'postgres', 'mssql', 'sql', 'aws', 'cicd', 'clean'],
    bullets: {
      es: [
        'Diseñé servicios backend con Node.js y NestJS (arquitectura limpia, TypeScript) e interfaces con React, colaborando en apps Next.js con server-side rendering.',
        'Desarrollé y documenté APIs REST y GraphQL con autorización personalizada; integré servicios externos (Stripe, Adyen) vía HTTP y webhooks.',
        'Gestioné bases de datos con Prisma, PostgreSQL y Microsoft SQL Server, y desplegué en AWS con pipelines CI/CD.',
      ],
      en: [
        'Designed backend services with Node.js and NestJS (clean architecture, TypeScript) and React interfaces, contributing to Next.js apps with server-side rendering.',
        'Built and documented REST and GraphQL APIs with custom authorization; integrated external services (Stripe, Adyen) over HTTP and webhooks.',
        'Managed databases with Prisma, PostgreSQL and Microsoft SQL Server, and deployed to AWS with CI/CD pipelines.',
      ],
      it: [
        'Ho progettato servizi backend con Node.js e NestJS (clean architecture, TypeScript) e interfacce con React, collaborando ad app Next.js con server-side rendering.',
        'Ho sviluppato e documentato API REST e GraphQL con autorizzazione personalizzata; ho integrato servizi esterni (Stripe, Adyen) via HTTP e webhook.',
        'Ho gestito database con Prisma, PostgreSQL e Microsoft SQL Server, e ho fatto deploy su AWS con pipeline CI/CD.',
      ],
    },
  },
  {
    id: 'shineforth',
    company: 'ShineForth',
    role: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer', it: 'Sviluppatore Full Stack' },
    kind: 'Empleo',
    from: [2024, 3],
    to: [2025, 1],
    color: '#ffb547',
    tags: { es: ['Liderazgo', 'Mentoreo', '4 proyectos'], en: ['Leadership', 'Mentoring', '4 projects'], it: ['Leadership', 'Mentoring', '4 progetti'] },
    stack: ['nodejs', 'react', 'express', 'javascript', 'rest', 'oop', 'modular', 'git'],
    bullets: {
      es: [
        'Lideré el desarrollo full stack de dos proyectos (Node.js, React, Express) con arquitectura escalable, POO y middleware personalizado.',
        'Implementé validación, manejo centralizado de errores y código modular, priorizando rendimiento y seguridad.',
        'Mentoreé a un desarrollador junior en buenas prácticas, Git/GitHub y desarrollo de APIs; contribuí en 4 proyectos.',
      ],
      en: [
        'Led full-stack development of two projects (Node.js, React, Express) with a scalable architecture, OOP and custom middleware.',
        'Implemented validation, centralized error handling and modular code, prioritizing performance and security.',
        'Mentored a junior developer on best practices, Git/GitHub and API development; contributed to 4 projects.',
      ],
      it: [
        'Ho guidato lo sviluppo full stack di due progetti (Node.js, React, Express) con un’architettura scalabile, OOP e middleware personalizzato.',
        'Ho implementato validazione, gestione centralizzata degli errori e codice modulare, dando priorità a performance e sicurezza.',
        'Ho fatto da mentor a uno sviluppatore junior su buone pratiche, Git/GitHub e sviluppo di API; ho contribuito a 4 progetti.',
      ],
    },
  },
  {
    id: 'sbestudio',
    company: 'SB Estudio Contable',
    role: { es: 'Sitio web institucional', en: 'Corporate website', it: 'Sito istituzionale' },
    kind: 'Freelance',
    from: [2025, 9],
    to: null,
    color: '#3b76f6',
    world: 'sbestudio',
    link: 'https://sbestudio.com.ar',
    bullets: {
      es: ['Diseño y desarrollo del sitio institucional (React, Next.js, Node.js, Express), del concepto al despliegue.'],
      en: ['Design and development of the corporate website (React, Next.js, Node.js, Express), from concept to deployment.'],
      it: ['Design e sviluppo del sito istituzionale (React, Next.js, Node.js, Express), dal concept al deploy.'],
    },
  },
  {
    id: 'cotizari',
    company: 'Cotizari',
    role: { es: 'Cotizador de seguros', en: 'Insurance quoting tool', it: 'Preventivatore assicurativo' },
    kind: 'Proyecto propio',
    from: [2026, 7],
    to: null,
    color: '#4ade80',
    world: 'cotizari',
    wip: true,
    bullets: {
      es: ['SaaS propia para productores de seguros: cotizador full stack con Next.js, TypeScript, Prisma y PostgreSQL.'],
      en: ['My own SaaS for insurance agents: a full-stack quoting tool with Next.js, TypeScript, Prisma and PostgreSQL.'],
      it: ['Il mio SaaS per agenti assicurativi: un preventivatore full stack con Next.js, TypeScript, Prisma e PostgreSQL.'],
    },
  },
  {
    id: 'polizari',
    company: 'Polizari',
    role: { es: 'Gestor de cartera de clientes', en: 'Client portfolio manager', it: 'Gestore del portafoglio clienti' },
    kind: 'Proyecto propio',
    from: [2026, 7],
    to: null,
    color: '#22d3ee',
    world: 'polizari',
    wip: true,
    bullets: {
      es: ['SaaS propia para gestión de cartera de clientes y pólizas de productores de seguros, con Next.js, TypeScript, NextAuth, Prisma y PostgreSQL.'],
      en: ['My own SaaS for insurance agents to manage their clients and policies, with Next.js, TypeScript, NextAuth, Prisma and PostgreSQL.'],
      it: ['Il mio SaaS per agenti assicurativi per gestire clienti e polizze, con Next.js, TypeScript, NextAuth, Prisma e PostgreSQL.'],
    },
  },
]

/** Empleos que no son un mundo del mapa: aportan sus propias "fuentes" al inventario. */
export const jobSources = roles.filter((r) => !r.world && r.stack)

export const monthsBetween = (from: [number, number], to: [number, number] | null) => {
  const end = to ?? [new Date().getFullYear(), new Date().getMonth() + 1]
  return (end[0] - from[0]) * 12 + (end[1] - from[1]) + 1
}
