export type LevelId = 'mehring' | 'sbestudio' | 'cotizari' | 'polizari' | 'kontari'

export interface Project {
  id: LevelId
  n: number
  name: string
  kicker: string
  tagline: string
  description: string
  role: string
  tags: string[]
  accent: string
  accent2: string
  stats: { value: number; suffix?: string; label: string }[]
  stack: string[]
  missions: { title: string; text: string }[]
  boss: { name: string; text: string; win: string }
  demo: { title: string; hint: string }
  live?: string
  status?: string
  boss_level?: boolean
}

// El orden es el de la progresión del mapa: de menor a mayor complejidad.
export const projects: Project[] = [
  {
    id: 'mehring',
    n: 1,
    name: 'Mehring',
    kicker: 'Sitio institucional · Fábrica de sillas desde 1953',
    tagline: 'Una marca centenaria en la web, sin una sola librería de animación.',
    description:
      'Sitio de una página para la primera fábrica de sillas en serie de la Argentina. Contenido rescatado de archivos web y redes (el sitio original estaba caído), con identidad de marca fiel al manual, fotografía cuidada y una obsesión por la performance.',
    role: 'Diseño · Desarrollo · Contenido',
    tags: ['Marca', 'Performance', 'SEO'],
    accent: '#e0a458',
    accent2: '#c2410c',
    stats: [
      { value: 0, label: 'libs de animación' },
      { value: 0, label: 'requests a Google Fonts' },
      { value: 25, label: 'fotos optimizadas en WebP' },
      { value: 1953, label: 'año de fundación' },
    ],
    stack: ['react', 'typescript', 'tailwind', 'vite', 'vercel', 'git'],
    missions: [
      {
        title: 'Rescate de contenido',
        text: 'El sitio real no estaba disponible. Reconstruí catálogo, historia y textos a partir de archivos web y redes sociales, y los normalicé en un modelo de datos tipado.',
      },
      {
        title: 'Animación sin dependencias',
        text: 'Reveals con IntersectionObserver, scroll-spy para el menú y un smooth scroll con easing propio. Cero librerías, cero bloqueo del hilo principal.',
      },
      {
        title: 'Performance como feature',
        text: 'Imágenes WebP ≤1800 px, preload del hero con fetchpriority, fuentes self-hosted y JSON-LD de FurnitureStore. Medido siempre contra el build, no contra el dev server.',
      },
      {
        title: 'Marca en el código',
        text: 'El logotipo oficial vive inline como SVG con currentColor, así se adapta a cualquier fondo. La paleta sale directo del manual de marca.',
      },
    ],
    boss: {
      name: 'El sitio que no existía',
      text: 'Faltaban fuentes, textos y fotos de una marca con 70 años de historia.',
      win: 'Curaduría de contenido + un sistema visual cálido que hace que todo parezca siempre haber estado ahí.',
    },
    demo: {
      title: 'Taller de sillas',
      hint: 'Armá tu silla, cambiá terminaciones y explotá la vista para ver cada pieza.',
    },
  },
  {
    id: 'sbestudio',
    n: 2,
    name: 'SB Estudio',
    kicker: 'Estudio contable · Sitio institucional',
    tagline: 'Una web que transmite la solidez de un estudio con décadas de trayectoria.',
    description:
      'Sitio institucional de un estudio contable de Santa Fe, del concepto al despliegue: identidad visual sobria, motion design cuidado, servicios claros, modalidad de atención y un camino corto al contacto por WhatsApp.',
    role: 'Freelance · Diseño · Desarrollo full-stack',
    tags: ['Landing', 'Motion', 'SEO'],
    accent: '#3b76f6',
    accent2: '#14c087',
    live: 'https://sbestudio.com.ar',
    status: 'Online',
    stats: [
      { value: 5, label: 'áreas de servicio' },
      { value: 2, label: 'modalidades de atención' },
      { value: 5, label: 'secciones de navegación' },
      { value: 1, label: 'clic para consultar por WhatsApp' },
    ],
    stack: ['nextjs', 'react', 'typescript', 'tailwind', 'framer', 'radix', 'rhf', 'zod', 'nodejs', 'express', 'vercel', 'git'],
    missions: [
      {
        title: 'Motion con criterio',
        text: 'Headline animado palabra por palabra, mesh gradient, orbes flotantes, tarjetas con tilt y botones magnéticos con Framer Motion. Todo comparte una misma curva de easing para que el sitio se sienta coherente.',
      },
      {
        title: 'Sistema visual',
        text: 'Paleta azul y verde sobre fondo oscuro, logos en versión clara y oscura, tipografías Plus Jakarta Sans y Sora, cursor personalizado y una jerarquía tipográfica que se lee de un vistazo.',
      },
      {
        title: 'Contenido que ordena',
        text: 'Cinco áreas de servicio con su detalle, un selector animado de modalidad remota o presencial y una sección de nosotros con contadores animados. Cada bloque responde una duda concreta.',
      },
      {
        title: 'Conversión y medición',
        text: 'CTA de WhatsApp con mensaje pre-armado en el hero, la barra de navegación y un botón flotante. Sitemap, metadata canónica, Google Analytics y Vercel Analytics/Speed Insights desde el primer día.',
      },
    ],
    boss: {
      name: 'La confianza a primera vista',
      text: 'Un estudio contable tiene que verse serio, moderno y cercano al mismo tiempo, y llevar a la consulta sin fricción.',
      win: 'Un sistema visual sobrio, animaciones sutiles con un único easing y un camino corto al contacto: WhatsApp a un clic en toda la página.',
    },
    demo: {
      title: 'Laboratorio de la landing',
      hint: 'Reproducí las animaciones, probá el botón magnético y recorré los servicios del estudio.',
    },
  },
  {
    id: 'cotizari',
    n: 3,
    name: 'Cotizari',
    kicker: 'Comparador de seguros · Marketplace',
    tagline: 'Un comparador que recomienda con reglas claras, no con letra chica.',
    description:
      'Cotizador automatizado que devuelve muchas opciones de varias compañías y una recomendada para tu perfil, con el detalle de por qué. Al broker solo le llega la solicitud para cargar la póliza.',
    role: 'Producto · Diseño · Desarrollo full-stack',
    tags: ['Motor de scoring', 'Marketplace', 'Panel broker'],
    accent: '#4ade80',
    accent2: '#22d3ee',
    status: 'En desarrollo',
    stats: [
      { value: 4, label: 'factores de score' },
      { value: 5, label: 'productos (auto, moto, hogar…)' },
      { value: 3, label: 'canales de contacto' },
      { value: 2, label: 'planes de convenio' },
    ],
    stack: ['nextjs', 'react', 'typescript', 'tailwind', 'prisma', 'postgres', 'docker', 'vercel', 'git'],
    missions: [
      {
        title: 'Un score explicable',
        text: 'Cada opción recibe un puntaje 0–100: precio relativo 42%, cobertura 38%, valoración de la aseguradora 12% y velocidad de siniestros 8%. Todo visible para el usuario.',
      },
      {
        title: 'Convenios con transparencia',
        text: 'Planes Aliado y Destacado con bonus divulgado (+1 / +3). La recomendada es siempre la de mayor score, con o sin convenio, y las que tienen convenio lo dicen.',
      },
      {
        title: 'Agente de contacto multicanal',
        text: 'Email, llamada o mensaje: un agente hace el primer contacto y deja la actividad registrada en el lead, con puntos de integración listos para Resend, WhatsApp y Twilio.',
      },
      {
        title: 'Panel del broker',
        text: 'Bandeja de solicitudes con flujo de estados, botón de "cargar póliza", gestión de convenios y registro de cotizaciones, protegido por contraseña.',
      },
    ],
    boss: {
      name: 'El conflicto de intereses',
      text: 'Cobrar convenios sin sesgar la recomendación al usuario.',
      win: 'Un algoritmo único y auditable, bonus acotado y etiquetado, y la regla de que el mayor score gana siempre.',
    },
    demo: {
      title: 'Cotizador en vivo',
      hint: 'Movés los sliders y el ranking se reordena solo. Después dejá que el agente te contacte.',
    },
  },
  {
    id: 'polizari',
    n: 4,
    name: 'Polizari',
    kicker: 'SaaS multiusuario · Productores y corredores de seguros',
    tagline: 'La cartera completa de un productor: pólizas, renovaciones y comisiones.',
    description:
      'App para productores de seguros: clientes, pólizas, vencimientos de renovación, cobranzas, siniestros, tareas y comisiones por compañía. Cada productor se registra y ve únicamente su propia cartera.',
    role: 'Producto · Diseño · Desarrollo full-stack',
    tags: ['SaaS', 'Multiusuario', 'Dashboard'],
    accent: '#22d3ee',
    accent2: '#3b76f6',
    status: 'En desarrollo',
    stats: [
      { value: 8, label: 'módulos de gestión' },
      { value: 5, label: 'entidades aisladas por usuario' },
      { value: 13, label: 'pantallas' },
      { value: 4, label: 'comandos de CLI de cuentas' },
    ],
    stack: ['nextjs', 'react', 'typescript', 'tailwind', 'prisma', 'postgres', 'authjs', 'recharts', 'docker', 'vercel', 'git'],
    missions: [
      {
        title: 'Renovaciones a tiempo',
        text: 'Vista de vencimientos con cuotas y estados para que ninguna póliza se caiga por descuido. Cobranzas y tareas conectadas al mismo modelo.',
      },
      {
        title: 'Comisiones por ramo',
        text: 'Esquemas de comisión por compañía y ramo guardados como JSON, y un panel con Recharts que muestra cuánto se cobra y cuánto falta.',
      },
      {
        title: 'Multiusuario de verdad',
        text: 'Auth.js v5 con contraseñas scrypt + salt, JWT, middleware que protege páginas y API, y un userId en cada entidad y en cada query. Nadie ve datos ajenos.',
      },
      {
        title: 'Operación real',
        text: 'CLI para listar, crear, resetear y borrar cuentas, cambio de clave forzado, migraciones automáticas en el deploy de Vercel y seed con datos demo.',
      },
    ],
    boss: {
      name: 'El aislamiento de datos',
      text: 'Pasar de una app de un usuario a un SaaS donde cada productor solo ve lo suyo.',
      win: 'userId obligatorio en cada tabla, colecciones que filtran por sesión y una migración que blinda el esquema.',
    },
    demo: {
      title: 'Renewal Rush',
      hint: 'Renová las pólizas antes de que venzan y cobrá tus comisiones. 30 segundos. Combos multiplican.',
    },
  },
  {
    id: 'kontari',
    n: 5,
    name: 'Kontari',
    kicker: 'SaaS B2B · Ecosistema de 3 apps para estudios contables',
    tagline: 'El jefe final: un ecosistema completo para contadores, con ARCA, pagos, IA y cifrado.',
    description:
      'Plataforma para estudios contables compuesta por tres aplicaciones: el panel del contador, un portal para sus clientes y la landing de ventas. Comparten base de datos y un modelo de acceso por suscripción, con integración real a ARCA y Mercado Pago.',
    role: 'Founder · Único desarrollador · Producto y arquitectura',
    tags: ['SaaS B2B', 'ARCA', 'IA', 'E2EE'],
    accent: '#8b7bff',
    accent2: '#ff5c8a',
    live: 'https://kontari.com.ar',
    status: 'Online · en expansión',
    boss_level: true,
    stats: [
      { value: 110, label: 'modelos de datos' },
      { value: 3, label: 'apps · 1 base compartida' },
      { value: 600, suffix: '+', label: 'tests automatizados' },
      { value: 9, label: 'planes de suscripción' },
    ],
    stack: [
      'nextjs', 'react', 'typescript', 'tailwind', 'heroui', 'gsap', 'vite', 'framer', 'reactquery', 'rhf', 'zod', 'recharts',
      'prisma', 'postgres', 'authjs', '2fa', 'e2ee',
      'aisdk', 'claude', 'mp', 'arca', 'soap', 'webhooks', 'whatsapp', 'resend',
      'playwright', 'vitest', 'testinglib', 'axe', 'gha', 'cicd', 'docker', 'vercel', 'git',
    ],
    missions: [
      {
        title: 'Multi-tenencia sin fugas',
        text: '110 modelos con moldes de tenencia (estudio, solo, cliente) y un test estático que rompe el build si algún route handler no referencia un guard de autenticación.',
      },
      {
        title: 'Contabilidad y ARCA de verdad',
        text: 'Motor de liquidación de IVA y motor contable completo (diario, mayor, conciliación bancaria, estados contables). Catálogo de impuestos con sincronización diaria contra ARCA, padrón por CUIT y facturación electrónica con CAE.',
      },
      {
        title: 'Cobrar, crecer y proteger',
        text: 'Suscripciones recurrentes con Mercado Pago (3 tiers × 3 ciclos), programa de referidos entre contadores, bóveda E2EE con AES-256-GCM + PBKDF2, 2FA y auditoría.',
      },
      {
        title: 'IA con tope de gasto',
        text: 'IA generativa con AI SDK: un asistente conversacional con herramientas de lectura, opt-in por estudio y con un presupuesto máximo.',
      },
    ],
    boss: {
      name: 'El esquema de 110 modelos',
      text: 'Dos apps escribiendo y leyendo sobre la misma base, con permisos, suscripciones y datos sensibles.',
      win: 'Una sola fuente de verdad para el schema, guards verificados por tests, docs por módulo y una suite E2E que recorre ~90 flujos.',
    },
    demo: {
      title: 'Laboratorio Kontari',
      hint: 'Calculá un vencimiento por CUIT y cifrá un secreto con criptografía real en tu navegador.',
    },
  },
]

export const projectById = (id: string) => projects.find((p) => p.id === id)
