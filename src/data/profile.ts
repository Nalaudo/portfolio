import type { Loc } from '../lib/i18n'

// Editá este archivo para personalizar tus datos de contacto y presentación.
// Fuente: CV "Full Stack ES" y perfil de LinkedIn. Los textos visibles van en { es, en }.
export const profile: {
  name: string
  first: string
  last: string
  handle: string
  role: string
  headline: string
  roles: string[]
  tagline: Loc
  location: string
  email: string
  github: string
  linkedin: string
  languages: { name: Loc; level: Loc; pct: number }[]
  education: { title: Loc; place: string; when: Loc }[]
  soft: Loc<string[]>
} = {
  name: 'Nicolás Balaudo',
  first: 'Nicolás',
  last: 'Balaudo',
  handle: 'Nalaudo',
  role: 'Full-Stack Developer',
  headline: 'Founder & Software Engineer',
  roles: ['Full-Stack Developer', 'Founder & Software Engineer', 'SaaS builder', 'Pixel perfectionist'],
  tagline: {
    es: 'Founder de Kontari. Más de 3 años construyendo productos de software end-to-end: arquitectura, backend, frontend, datos y despliegue, hasta el último píxel.',
    en: 'Founder of Kontari. 3+ years building software products end-to-end: architecture, backend, frontend, data and deployment, down to the last pixel.',
    it: 'Founder di Kontari. Più di 3 anni a costruire prodotti software end-to-end: architettura, backend, frontend, dati e deploy, fino all’ultimo pixel.',
  },
  location: 'Santa Fe, Argentina',
  email: 'nicobalaudo@gmail.com',
  github: 'https://github.com/Nalaudo',
  linkedin: 'https://www.linkedin.com/in/nicolas-balaudo',
  languages: [
    { name: { es: 'Español', en: 'Spanish', it: 'Spagnolo' }, level: { es: 'Nativo', en: 'Native', it: 'Madrelingua' }, pct: 100 },
    { name: { es: 'Inglés', en: 'English', it: 'Inglese' }, level: { es: 'Avanzado', en: 'Advanced', it: 'Avanzato' }, pct: 85 },
    { name: { es: 'Italiano', en: 'Italian', it: 'Italiano' }, level: { es: 'B1', en: 'B1', it: 'B1' }, pct: 45 },
  ],
  education: [
    { title: { es: 'Desarrollador Full Stack, Backend y Frontend React', en: 'Full Stack Developer, Backend and React Frontend', it: 'Sviluppatore Full Stack, Backend e Frontend React' }, place: 'Coderhouse', when: { es: '2022 – 2023', en: '2022 – 2023', it: '2022 – 2023' } },
    { title: { es: 'Programador Avanzado de Python', en: 'Advanced Python Programmer', it: 'Programmatore Python Avanzato' }, place: 'Udemy', when: { es: '2026', en: '2026', it: '2026' } },
    { title: { es: 'IA Generativa, LangGraph y LangChain', en: 'Generative AI, LangGraph and LangChain', it: 'IA Generativa, LangGraph e LangChain' }, place: 'Udemy', when: { es: 'en curso', en: 'in progress', it: 'in corso' } },
  ],
  soft: {
    es: ['Liderazgo técnico', 'Comunicación con stakeholders', 'Resolución de problemas', 'Ownership', 'Adaptabilidad', 'Mentoreo de juniors'],
    en: ['Technical leadership', 'Stakeholder communication', 'Problem solving', 'Ownership', 'Adaptability', 'Mentoring juniors'],
    it: ['Leadership tecnica', 'Comunicazione con gli stakeholder', 'Problem solving', 'Ownership', 'Adattabilità', 'Mentoring di junior'],
  },
}
