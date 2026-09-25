import type { Loc } from '../lib/i18n'

export type LevelId = 'mehring' | 'sbestudio' | 'cotizari' | 'polizari' | 'kontari'

export interface Project {
  id: LevelId
  n: number
  name: string
  kicker: Loc
  tagline: Loc
  description: Loc
  role: Loc
  tags: Loc<string[]>
  accent: string
  accent2: string
  stats: { value: number; suffix?: string; label: Loc }[]
  stack: string[]
  missions: { title: Loc; text: Loc }[]
  boss: { name: Loc; text: Loc; win: Loc }
  demo: { title: Loc; hint: Loc }
  live?: string
  status?: Loc
  boss_level?: boolean
}

// El orden es el de la progresión del mapa: de menor a mayor complejidad.
export const projects: Project[] = [
  {
    id: 'mehring',
    n: 1,
    name: 'Mehring',
    kicker: { es: 'Sitio institucional · Fábrica de sillas desde 1953', en: 'Corporate website · Chair factory since 1953', it: 'Sito istituzionale · Fabbrica di sedie dal 1953' },
    tagline: { es: 'Una marca centenaria en la web, sin una sola librería de animación.', en: 'A heritage brand on the web, without a single animation library.', it: 'Un marchio storico sul web, senza una sola libreria di animazione.' },
    description: {
      es: 'Sitio de una página para la primera fábrica de sillas en serie de la Argentina. Contenido rescatado de archivos web y redes (el sitio original estaba caído), con identidad de marca fiel al manual, fotografía cuidada y una obsesión por la performance.',
      en: 'One-page site for Argentina’s first mass-production chair factory. Content rescued from web archives and social media (the original site was down), with a brand identity true to the guidelines, curated photography and an obsession with performance.',
      it: 'Sito one-page per la prima fabbrica di sedie in serie dell’Argentina. Contenuti recuperati da archivi web e social (il sito originale era offline), con un’identità fedele al manuale del marchio, fotografia curata e un’ossessione per la performance.',
    },
    role: { es: 'Diseño · Desarrollo · Contenido', en: 'Design · Development · Content', it: 'Design · Sviluppo · Contenuti' },
    tags: { es: ['Marca', 'Performance', 'SEO'], en: ['Branding', 'Performance', 'SEO'], it: ['Branding', 'Performance', 'SEO'] },
    accent: '#e0a458',
    accent2: '#c2410c',
    stats: [
      { value: 100, suffix: '%', label: { es: 'animación nativa, sin librerías', en: 'native animation, no libraries', it: 'animazione nativa, senza librerie' } },
      { value: 3, label: { es: 'fuentes self-hosted, sin CDN', en: 'self-hosted fonts, no CDN', it: 'font self-hosted, senza CDN' } },
      { value: 25, label: { es: 'fotos optimizadas en WebP', en: 'photos optimized as WebP', it: 'foto ottimizzate in WebP' } },
      { value: 1953, label: { es: 'año de fundación', en: 'year founded', it: 'anno di fondazione' } },
    ],
    stack: ['react', 'typescript', 'tailwind', 'vite', 'vercel', 'git'],
    missions: [
      {
        title: { es: 'Rescate de contenido', en: 'Content rescue', it: 'Recupero dei contenuti' },
        text: {
          es: 'El sitio real no estaba disponible. Reconstruí catálogo, historia y textos a partir de archivos web y redes sociales, y los normalicé en un modelo de datos tipado.',
          en: 'The real site was unavailable. I rebuilt the catalog, history and copy from web archives and social media, and normalized it all into a typed data model.',
          it: 'Il sito reale non era disponibile. Ho ricostruito catalogo, storia e testi da archivi web e social, normalizzandoli in un modello dati tipizzato.',
        },
      },
      {
        title: { es: 'Animación sin dependencias', en: 'Dependency-free animation', it: 'Animazione senza dipendenze' },
        text: {
          es: 'Reveals con IntersectionObserver, scroll-spy para el menú y un smooth scroll con easing propio. Cero librerías, cero bloqueo del hilo principal.',
          en: 'Reveals with IntersectionObserver, scroll-spy for the menu and smooth scrolling with a custom easing. Zero libraries, zero main-thread blocking.',
          it: 'Reveal con IntersectionObserver, scroll-spy per il menu e uno smooth scroll con easing personalizzato. Zero librerie, zero blocchi del main thread.',
        },
      },
      {
        title: { es: 'Performance como feature', en: 'Performance as a feature', it: 'La performance come feature' },
        text: {
          es: 'Imágenes WebP ≤1800 px, preload del hero con fetchpriority, fuentes self-hosted y JSON-LD de FurnitureStore. Medido siempre contra el build, no contra el dev server.',
          en: 'WebP images ≤1800 px, hero preload with fetchpriority, self-hosted fonts and FurnitureStore JSON-LD. Always measured against the build, never the dev server.',
          it: 'Immagini WebP ≤1800 px, preload dell’hero con fetchpriority, font self-hosted e JSON-LD di FurnitureStore. Misurato sempre sulla build, mai sul dev server.',
        },
      },
      {
        title: { es: 'Marca en el código', en: 'Brand in the code', it: 'Il marchio nel codice' },
        text: {
          es: 'El logotipo oficial vive inline como SVG con currentColor, así se adapta a cualquier fondo. La paleta sale directo del manual de marca.',
          en: 'The official logo lives inline as an SVG with currentColor, so it adapts to any background. The palette comes straight from the brand guidelines.',
          it: 'Il logo ufficiale vive inline come SVG con currentColor, così si adatta a qualsiasi sfondo. La palette arriva dritta dal manuale del marchio.',
        },
      },
    ],
    boss: {
      name: { es: 'El sitio que no existía', en: 'The site that didn’t exist', it: 'Il sito che non esisteva' },
      text: { es: 'Faltaban fuentes, textos y fotos de una marca con 70 años de historia.', en: 'Fonts, copy and photos were missing for a brand with 70 years of history.', it: 'Mancavano font, testi e foto di un marchio con 70 anni di storia.' },
      win: {
        es: 'Curaduría de contenido + un sistema visual cálido que hace que todo parezca siempre haber estado ahí.',
        en: 'Content curation + a warm visual system that makes everything feel like it was always there.',
        it: 'Cura dei contenuti + un sistema visivo caldo che fa sembrare tutto lì da sempre.',
      },
    },
    demo: {
      title: { es: 'Taller de sillas', en: 'Chair workshop', it: 'Laboratorio di sedie' },
      hint: { es: 'Armá tu silla, cambiá terminaciones y explotá la vista para ver cada pieza.', en: 'Build your chair, switch finishes and explode the view to see every piece.', it: 'Componi la tua sedia, cambia finiture ed esplodi la vista per vedere ogni pezzo.' },
    },
  },
  {
    id: 'sbestudio',
    n: 2,
    name: 'SB Estudio',
    kicker: { es: 'Estudio contable · Sitio institucional', en: 'Accounting firm · Corporate website', it: 'Studio commerciale · Sito istituzionale' },
    tagline: { es: 'Una web que transmite la solidez de un estudio con décadas de trayectoria.', en: 'A website that conveys the solidity of a firm with decades of experience.', it: 'Un sito che trasmette la solidità di uno studio con decenni di esperienza.' },
    description: {
      es: 'Sitio institucional de un estudio contable de Santa Fe, del concepto al despliegue: identidad visual sobria, motion design cuidado, servicios claros, modalidad de atención y un camino corto al contacto por WhatsApp.',
      en: 'Corporate website for an accounting firm in Santa Fe, from concept to deployment: a restrained visual identity, careful motion design, clear services, service modes and a short path to contact via WhatsApp.',
      it: 'Sito istituzionale di uno studio commerciale di Santa Fe, dal concept al deploy: identità visiva sobria, motion design curato, servizi chiari, modalità di assistenza e una via breve al contatto su WhatsApp.',
    },
    role: { es: 'Freelance · Diseño · Desarrollo full-stack', en: 'Freelance · Design · Full-stack development', it: 'Freelance · Design · Sviluppo full-stack' },
    tags: { es: ['Landing', 'Motion', 'SEO'], en: ['Landing', 'Motion', 'SEO'], it: ['Landing', 'Motion', 'SEO'] },
    accent: '#3b76f6',
    accent2: '#14c087',
    live: 'https://sbestudio.com.ar',
    status: { es: 'Online', en: 'Live', it: 'Online' },
    stats: [
      { value: 5, label: { es: 'áreas de servicio', en: 'service areas', it: 'aree di servizio' } },
      { value: 2, label: { es: 'modalidades de atención', en: 'service modes', it: 'modalità di assistenza' } },
      { value: 5, label: { es: 'secciones de navegación', en: 'navigation sections', it: 'sezioni di navigazione' } },
      { value: 1, label: { es: 'clic para consultar por WhatsApp', en: 'click to ask via WhatsApp', it: 'clic per chiedere su WhatsApp' } },
    ],
    stack: ['nextjs', 'react', 'typescript', 'tailwind', 'framer', 'radix', 'rhf', 'zod', 'nodejs', 'express', 'vercel', 'git'],
    missions: [
      {
        title: { es: 'Motion con criterio', en: 'Motion with judgment', it: 'Motion con criterio' },
        text: {
          es: 'Headline animado palabra por palabra, mesh gradient, orbes flotantes, tarjetas con tilt y botones magnéticos con Framer Motion. Todo comparte una misma curva de easing para que el sitio se sienta coherente.',
          en: 'Word-by-word animated headline, mesh gradient, floating orbs, tilt cards and magnetic buttons with Framer Motion. Everything shares a single easing curve so the site feels coherent.',
          it: 'Headline animato parola per parola, mesh gradient, sfere fluttuanti, card con tilt e bottoni magnetici con Framer Motion. Tutto condivide la stessa curva di easing perché il sito risulti coerente.',
        },
      },
      {
        title: { es: 'Sistema visual', en: 'Visual system', it: 'Sistema visivo' },
        text: {
          es: 'Paleta azul y verde sobre fondo oscuro, logos en versión clara y oscura, tipografías Plus Jakarta Sans y Sora, cursor personalizado y una jerarquía tipográfica que se lee de un vistazo.',
          en: 'Blue and green palette on a dark background, light and dark logo versions, Plus Jakarta Sans and Sora typefaces, a custom cursor and a type hierarchy you can read at a glance.',
          it: 'Palette blu e verde su sfondo scuro, loghi in versione chiara e scura, font Plus Jakarta Sans e Sora, cursore personalizzato e una gerarchia tipografica che si legge a colpo d’occhio.',
        },
      },
      {
        title: { es: 'Contenido que ordena', en: 'Content that guides', it: 'Contenuti che orientano' },
        text: {
          es: 'Cinco áreas de servicio con su detalle, un selector animado de modalidad remota o presencial y una sección de nosotros con contadores animados. Cada bloque responde una duda concreta.',
          en: 'Five service areas with their details, an animated remote/in-person selector and an about section with animated counters. Every block answers a specific question.',
          it: 'Cinque aree di servizio con i loro dettagli, un selettore animato tra modalità remota e in presenza e una sezione chi siamo con contatori animati. Ogni blocco risponde a un dubbio concreto.',
        },
      },
      {
        title: { es: 'Conversión y medición', en: 'Conversion and analytics', it: 'Conversione e misurazione' },
        text: {
          es: 'CTA de WhatsApp con mensaje pre-armado en el hero, la barra de navegación y un botón flotante. Sitemap, metadata canónica, Google Analytics y Vercel Analytics/Speed Insights desde el primer día.',
          en: 'WhatsApp CTA with a pre-filled message in the hero, the navbar and a floating button. Sitemap, canonical metadata, Google Analytics and Vercel Analytics/Speed Insights from day one.',
          it: 'CTA WhatsApp con messaggio precompilato nell’hero, nella navbar e in un bottone flottante. Sitemap, metadata canonici, Google Analytics e Vercel Analytics/Speed Insights dal primo giorno.',
        },
      },
    ],
    boss: {
      name: { es: 'La confianza a primera vista', en: 'Trust at first sight', it: 'Fiducia a prima vista' },
      text: {
        es: 'Un estudio contable tiene que verse serio, moderno y cercano al mismo tiempo, y llevar a la consulta sin fricción.',
        en: 'An accounting firm has to look serious, modern and approachable all at once, and lead to an inquiry without friction.',
        it: 'Uno studio commerciale deve sembrare serio, moderno e vicino allo stesso tempo, e portare alla richiesta senza attriti.',
      },
      win: {
        es: 'Un sistema visual sobrio, animaciones sutiles con un único easing y un camino corto al contacto: WhatsApp a un clic en toda la página.',
        en: 'A restrained visual system, subtle animations with a single easing and a short path to contact: WhatsApp one click away across the whole page.',
        it: 'Un sistema visivo sobrio, animazioni sottili con un unico easing e una via breve al contatto: WhatsApp a un clic in tutta la pagina.',
      },
    },
    demo: {
      title: { es: 'Laboratorio de la landing', en: 'Landing page lab', it: 'Laboratorio della landing' },
      hint: { es: 'Reproducí las animaciones, probá el botón magnético y recorré los servicios del estudio.', en: 'Replay the animations, try the magnetic button and browse the firm’s services.', it: 'Riproduci le animazioni, prova il bottone magnetico e sfoglia i servizi dello studio.' },
    },
  },
  {
    id: 'cotizari',
    n: 3,
    name: 'Cotizari',
    kicker: { es: 'Comparador de seguros · Marketplace', en: 'Insurance comparison · Marketplace', it: 'Comparatore assicurativo · Marketplace' },
    tagline: { es: 'Un comparador que recomienda con reglas claras, no con letra chica.', en: 'A comparison tool that recommends with clear rules, not fine print.', it: 'Un comparatore che consiglia con regole chiare, non con le clausole in piccolo.' },
    description: {
      es: 'Cotizador automatizado que devuelve muchas opciones de varias compañías y una recomendada para tu perfil, con el detalle de por qué. Al broker solo le llega la solicitud para cargar la póliza.',
      en: 'Automated quoting tool that returns many options from several insurers and one recommended for your profile, explaining why. The broker only receives the request to issue the policy.',
      it: 'Preventivatore automatico che restituisce molte opzioni da varie compagnie e una consigliata per il tuo profilo, spiegando il perché. Al broker arriva solo la richiesta per emettere la polizza.',
    },
    role: { es: 'Producto · Diseño · Desarrollo full-stack', en: 'Product · Design · Full-stack development', it: 'Prodotto · Design · Sviluppo full-stack' },
    tags: { es: ['Motor de scoring', 'Marketplace', 'Panel broker'], en: ['Scoring engine', 'Marketplace', 'Broker dashboard'], it: ['Motore di scoring', 'Marketplace', 'Pannello broker'] },
    accent: '#4ade80',
    accent2: '#22d3ee',
    status: { es: 'En desarrollo', en: 'In development', it: 'In sviluppo' },
    stats: [
      { value: 4, label: { es: 'factores de score', en: 'score factors', it: 'fattori di score' } },
      { value: 5, label: { es: 'productos (auto, moto, hogar…)', en: 'products (car, motorcycle, home…)', it: 'prodotti (auto, moto, casa…)' } },
      { value: 3, label: { es: 'canales de contacto', en: 'contact channels', it: 'canali di contatto' } },
      { value: 2, label: { es: 'planes de convenio', en: 'partnership plans', it: 'piani di convenzione' } },
    ],
    stack: ['nextjs', 'react', 'typescript', 'tailwind', 'prisma', 'postgres', 'docker', 'vercel', 'git'],
    missions: [
      {
        title: { es: 'Un score explicable', en: 'An explainable score', it: 'Uno score spiegabile' },
        text: {
          es: 'Cada opción recibe un puntaje 0–100: precio relativo 42%, cobertura 38%, valoración de la aseguradora 12% y velocidad de siniestros 8%. Todo visible para el usuario.',
          en: 'Each option gets a 0–100 score: relative price 42%, coverage 38%, insurer rating 12% and claims speed 8%. All of it visible to the user.',
          it: 'Ogni opzione riceve un punteggio 0–100: prezzo relativo 42%, copertura 38%, valutazione della compagnia 12% e velocità nei sinistri 8%. Tutto visibile all’utente.',
        },
      },
      {
        title: { es: 'Convenios con transparencia', en: 'Transparent partnerships', it: 'Convenzioni trasparenti' },
        text: {
          es: 'Planes Aliado y Destacado con bonus divulgado (+1 / +3). La recomendada es siempre la de mayor score, con o sin convenio, y las que tienen convenio lo dicen.',
          en: 'Partner and Featured plans with a disclosed bonus (+1 / +3). The recommended option is always the highest score, partner or not, and partners are labeled as such.',
          it: 'Piani Partner e In evidenza con bonus dichiarato (+1 / +3). La consigliata è sempre quella con lo score più alto, con o senza convenzione, e quelle convenzionate lo dicono.',
        },
      },
      {
        title: { es: 'Agente de contacto multicanal', en: 'Multichannel contact agent', it: 'Agente di contatto multicanale' },
        text: {
          es: 'Email, llamada o mensaje: un agente hace el primer contacto y deja la actividad registrada en el lead, con puntos de integración listos para Resend, WhatsApp y Twilio.',
          en: 'Email, call or message: an agent makes first contact and logs the activity on the lead, with integration points ready for Resend, WhatsApp and Twilio.',
          it: 'Email, chiamata o messaggio: un agente fa il primo contatto e registra l’attività sul lead, con punti di integrazione pronti per Resend, WhatsApp e Twilio.',
        },
      },
      {
        title: { es: 'Panel del broker', en: 'Broker dashboard', it: 'Pannello del broker' },
        text: {
          es: 'Bandeja de solicitudes con flujo de estados, botón de "cargar póliza", gestión de convenios y registro de cotizaciones, protegido por contraseña.',
          en: 'Request inbox with a status workflow, an "issue policy" button, partnership management and a quote log, all password-protected.',
          it: 'Inbox delle richieste con flusso di stati, bottone "emetti polizza", gestione delle convenzioni e registro dei preventivi, protetto da password.',
        },
      },
    ],
    boss: {
      name: { es: 'El conflicto de intereses', en: 'The conflict of interest', it: 'Il conflitto di interessi' },
      text: { es: 'Cobrar convenios sin sesgar la recomendación al usuario.', en: 'Charging for partnerships without biasing the recommendation to the user.', it: 'Farsi pagare le convenzioni senza falsare il consiglio all’utente.' },
      win: {
        es: 'Un algoritmo único y auditable, bonus acotado y etiquetado, y la regla de que el mayor score gana siempre.',
        en: 'A single auditable algorithm, a capped and labeled bonus, and the rule that the highest score always wins.',
        it: 'Un unico algoritmo verificabile, bonus limitato ed etichettato, e la regola che vince sempre lo score più alto.',
      },
    },
    demo: {
      title: { es: 'Cotizador en vivo', en: 'Live quoting tool', it: 'Preventivatore dal vivo' },
      hint: { es: 'Movés los sliders y el ranking se reordena solo. Después dejá que el agente te contacte.', en: 'Move the sliders and the ranking reorders itself. Then let the agent reach out to you.', it: 'Muovi gli slider e la classifica si riordina da sola. Poi lascia che l’agente ti contatti.' },
    },
  },
  {
    id: 'polizari',
    n: 4,
    name: 'Polizari',
    kicker: { es: 'SaaS multiusuario · Productores y corredores de seguros', en: 'Multi-user SaaS · Insurance agents and brokers', it: 'SaaS multiutente · Agenti e broker assicurativi' },
    tagline: { es: 'La cartera completa de un productor: pólizas, renovaciones y comisiones.', en: 'An agent’s whole book of business: policies, renewals and commissions.', it: 'L’intero portafoglio di un agente: polizze, rinnovi e provvigioni.' },
    description: {
      es: 'App para productores de seguros: clientes, pólizas, vencimientos de renovación, cobranzas, siniestros, tareas y comisiones por compañía. Cada productor se registra y ve únicamente su propia cartera.',
      en: 'App for insurance agents: clients, policies, renewal due dates, collections, claims, tasks and commissions per insurer. Each agent signs up and sees only their own book.',
      it: 'App per agenti assicurativi: clienti, polizze, scadenze di rinnovo, incassi, sinistri, attività e provvigioni per compagnia. Ogni agente si registra e vede solo il proprio portafoglio.',
    },
    role: { es: 'Producto · Diseño · Desarrollo full-stack', en: 'Product · Design · Full-stack development', it: 'Prodotto · Design · Sviluppo full-stack' },
    tags: { es: ['SaaS', 'Multiusuario', 'Dashboard'], en: ['SaaS', 'Multi-user', 'Dashboard'], it: ['SaaS', 'Multiutente', 'Dashboard'] },
    accent: '#22d3ee',
    accent2: '#3b76f6',
    status: { es: 'En desarrollo', en: 'In development', it: 'In sviluppo' },
    stats: [
      { value: 8, label: { es: 'módulos de gestión', en: 'management modules', it: 'moduli di gestione' } },
      { value: 5, label: { es: 'entidades aisladas por usuario', en: 'entities isolated per user', it: 'entità isolate per utente' } },
      { value: 13, label: { es: 'pantallas', en: 'screens', it: 'schermate' } },
      { value: 4, label: { es: 'comandos de CLI de cuentas', en: 'account CLI commands', it: 'comandi CLI per gli account' } },
    ],
    stack: ['nextjs', 'react', 'typescript', 'tailwind', 'prisma', 'postgres', 'authjs', 'recharts', 'docker', 'vercel', 'git'],
    missions: [
      {
        title: { es: 'Renovaciones a tiempo', en: 'Renewals on time', it: 'Rinnovi puntuali' },
        text: {
          es: 'Vista de vencimientos con cuotas y estados para que ninguna póliza se caiga por descuido. Cobranzas y tareas conectadas al mismo modelo.',
          en: 'A due-date view with installments and statuses so no policy lapses by accident. Collections and tasks connected to the same model.',
          it: 'Vista delle scadenze con rate e stati, perché nessuna polizza decada per distrazione. Incassi e attività collegati allo stesso modello.',
        },
      },
      {
        title: { es: 'Comisiones por ramo', en: 'Commissions by line', it: 'Provvigioni per ramo' },
        text: {
          es: 'Esquemas de comisión por compañía y ramo guardados como JSON, y un panel con Recharts que muestra cuánto se cobra y cuánto falta.',
          en: 'Commission schemes per insurer and line of business stored as JSON, and a Recharts dashboard showing what’s been collected and what’s pending.',
          it: 'Schemi di provvigione per compagnia e ramo salvati come JSON, e un pannello con Recharts che mostra quanto si è incassato e quanto manca.',
        },
      },
      {
        title: { es: 'Multiusuario de verdad', en: 'Truly multi-user', it: 'Multiutente davvero' },
        text: {
          es: 'Auth.js v5 con contraseñas scrypt + salt, JWT, middleware que protege páginas y API, y un userId en cada entidad y en cada query. Nadie ve datos ajenos.',
          en: 'Auth.js v5 with scrypt + salt passwords, JWT, middleware protecting pages and API, and a userId on every entity and every query. Nobody sees anyone else’s data.',
          it: 'Auth.js v5 con password scrypt + salt, JWT, middleware che protegge pagine e API, e uno userId in ogni entità e in ogni query. Nessuno vede i dati degli altri.',
        },
      },
      {
        title: { es: 'Operación real', en: 'Real-world operations', it: 'Operatività reale' },
        text: {
          es: 'CLI para listar, crear, resetear y borrar cuentas, cambio de clave forzado, migraciones automáticas en el deploy de Vercel y seed con datos demo.',
          en: 'CLI to list, create, reset and delete accounts, forced password change, automatic migrations on Vercel deploys and a seed with demo data.',
          it: 'CLI per elencare, creare, resettare ed eliminare account, cambio password obbligatorio, migrazioni automatiche nel deploy su Vercel e seed con dati demo.',
        },
      },
    ],
    boss: {
      name: { es: 'El aislamiento de datos', en: 'Data isolation', it: 'L’isolamento dei dati' },
      text: { es: 'Pasar de una app de un usuario a un SaaS donde cada productor solo ve lo suyo.', en: 'Going from a single-user app to a SaaS where each agent only sees their own data.', it: 'Passare da un’app monoutente a un SaaS in cui ogni agente vede solo i propri dati.' },
      win: {
        es: 'userId obligatorio en cada tabla, colecciones que filtran por sesión y una migración que blinda el esquema.',
        en: 'A mandatory userId on every table, collections that filter by session and a migration that locks down the schema.',
        it: 'userId obbligatorio in ogni tabella, collezioni filtrate per sessione e una migrazione che blinda lo schema.',
      },
    },
    demo: {
      title: { es: 'Renewal Rush', en: 'Renewal Rush', it: 'Renewal Rush' },
      hint: { es: 'Renová las pólizas antes de que venzan y cobrá tus comisiones. 30 segundos. Combos multiplican.', en: 'Renew policies before they expire and collect your commissions. 30 seconds. Combos multiply.', it: 'Rinnova le polizze prima che scadano e incassa le provvigioni. 30 secondi. Le combo moltiplicano.' },
    },
  },
  {
    id: 'kontari',
    n: 5,
    name: 'Kontari',
    kicker: { es: 'SaaS B2B · Ecosistema de 3 apps para estudios contables', en: 'B2B SaaS · A 3-app ecosystem for accounting firms', it: 'SaaS B2B · Un ecosistema di 3 app per studi commerciali' },
    tagline: {
      es: 'El jefe final: un ecosistema completo para contadores, con ARCA, pagos, IA y cifrado.',
      en: 'The final boss: a complete ecosystem for accountants, with ARCA, payments, AI and encryption.',
      it: 'Il boss finale: un ecosistema completo per commercialisti, con ARCA, pagamenti, IA e crittografia.',
    },
    description: {
      es: 'Plataforma para estudios contables compuesta por tres aplicaciones: el panel del contador, un portal para sus clientes y la landing de ventas. Comparten base de datos y un modelo de acceso por suscripción, con integración real a ARCA y Mercado Pago.',
      en: 'Platform for accounting firms made up of three apps: the accountant’s dashboard, a portal for their clients and the sales landing page. They share a database and a subscription access model, with real integration with ARCA (Argentina’s tax agency) and Mercado Pago.',
      it: 'Piattaforma per studi commerciali composta da tre applicazioni: il pannello del commercialista, un portale per i suoi clienti e la landing di vendita. Condividono database e un modello di accesso in abbonamento, con integrazione reale con ARCA (l’agenzia delle entrate argentina) e Mercado Pago.',
    },
    role: { es: 'Founder · Único desarrollador · Producto y arquitectura', en: 'Founder · Sole developer · Product and architecture', it: 'Founder · Unico sviluppatore · Prodotto e architettura' },
    tags: { es: ['SaaS B2B', 'ARCA', 'IA', 'E2EE'], en: ['B2B SaaS', 'ARCA', 'AI', 'E2EE'], it: ['SaaS B2B', 'ARCA', 'IA', 'E2EE'] },
    accent: '#8b7bff',
    accent2: '#ff5c8a',
    live: 'https://kontari.com.ar',
    status: { es: 'Online · en expansión', en: 'Live · expanding', it: 'Online · in espansione' },
    boss_level: true,
    stats: [
      { value: 110, label: { es: 'modelos de datos', en: 'data models', it: 'modelli di dati' } },
      { value: 3, label: { es: 'apps · 1 base compartida', en: 'apps · 1 shared database', it: 'app · 1 database condiviso' } },
      { value: 1300, suffix: '+', label: { es: 'tests automatizados', en: 'automated tests', it: 'test automatizzati' } },
      { value: 9, label: { es: 'planes de suscripción', en: 'subscription plans', it: 'piani di abbonamento' } },
    ],
    stack: [
      'nextjs', 'react', 'typescript', 'tailwind', 'heroui', 'gsap', 'vite', 'framer', 'reactquery', 'rhf', 'zod', 'recharts',
      'prisma', 'postgres', 'authjs', '2fa', 'e2ee',
      'aisdk', 'claude', 'mp', 'arca', 'soap', 'webhooks', 'whatsapp', 'resend',
      'playwright', 'vitest', 'testinglib', 'axe', 'gha', 'cicd', 'docker', 'vercel', 'git',
    ],
    missions: [
      {
        title: { es: 'Multi-tenencia sin fugas', en: 'Leak-free multi-tenancy', it: 'Multi-tenancy senza perdite' },
        text: {
          es: '110 modelos con moldes de tenencia (estudio, solo, cliente) y un test estático que rompe el build si algún route handler no referencia un guard de autenticación.',
          en: '110 models with tenancy templates (firm, solo, client) and a static test that breaks the build if any route handler doesn’t reference an auth guard.',
          it: '110 modelli con schemi di tenancy (studio, singolo, cliente) e un test statico che fa fallire la build se un route handler non richiama una guardia di autenticazione.',
        },
      },
      {
        title: { es: 'Contabilidad y ARCA de verdad', en: 'Real accounting and ARCA', it: 'Contabilità e ARCA sul serio' },
        text: {
          es: 'Motor de liquidación de IVA y motor contable completo (diario, mayor, conciliación bancaria, estados contables). Catálogo de impuestos con sincronización diaria contra ARCA, padrón por CUIT y facturación electrónica con CAE.',
          en: 'VAT settlement engine and a full accounting engine (journal, ledger, bank reconciliation, financial statements). Tax catalog synced daily with ARCA, taxpayer lookup by CUIT and e-invoicing with CAE.',
          it: 'Motore di liquidazione IVA e motore contabile completo (libro giornale, mastro, riconciliazione bancaria, bilanci). Catalogo delle imposte sincronizzato ogni giorno con ARCA, anagrafe per CUIT e fatturazione elettronica con CAE.',
        },
      },
      {
        title: { es: 'Cobrar, crecer y proteger', en: 'Charge, grow and protect', it: 'Incassare, crescere e proteggere' },
        text: {
          es: 'Suscripciones recurrentes con Mercado Pago (3 tiers × 3 ciclos), programa de referidos entre contadores, bóveda E2EE con AES-256-GCM + PBKDF2, 2FA y auditoría.',
          en: 'Recurring subscriptions with Mercado Pago (3 tiers × 3 cycles), an accountant referral program, an E2EE vault with AES-256-GCM + PBKDF2, 2FA and audit logs.',
          it: 'Abbonamenti ricorrenti con Mercado Pago (3 tier × 3 cicli), programma di referral tra commercialisti, cassaforte E2EE con AES-256-GCM + PBKDF2, 2FA e audit.',
        },
      },
      {
        title: { es: 'IA con tope de gasto', en: 'AI with a spending cap', it: 'IA con tetto di spesa' },
        text: {
          es: 'IA generativa con AI SDK: un asistente conversacional con herramientas de lectura, opt-in por estudio y con un presupuesto máximo.',
          en: 'Generative AI with the AI SDK: a conversational assistant with read-only tools, opt-in per firm and a maximum budget.',
          it: 'IA generativa con AI SDK: un assistente conversazionale con strumenti di sola lettura, opt-in per studio e con un budget massimo.',
        },
      },
    ],
    boss: {
      name: { es: 'El esquema de 110 modelos', en: 'The 110-model schema', it: 'Lo schema da 110 modelli' },
      text: { es: 'Dos apps escribiendo y leyendo sobre la misma base, con permisos, suscripciones y datos sensibles.', en: 'Two apps reading and writing to the same database, with permissions, subscriptions and sensitive data.', it: 'Due app che leggono e scrivono sullo stesso database, con permessi, abbonamenti e dati sensibili.' },
      win: {
        es: 'Una sola fuente de verdad para el schema, guards verificados por tests, docs por módulo y una suite E2E que recorre ~90 flujos.',
        en: 'A single source of truth for the schema, test-verified guards, per-module docs and an E2E suite covering ~90 flows.',
        it: 'Un’unica fonte di verità per lo schema, guardie verificate dai test, documentazione per modulo e una suite E2E che copre ~90 flussi.',
      },
    },
    demo: {
      title: { es: 'Laboratorio Kontari', en: 'Kontari lab', it: 'Laboratorio Kontari' },
      hint: { es: 'Calculá un vencimiento por CUIT y cifrá un secreto con criptografía real en tu navegador.', en: 'Compute a tax due date from a CUIT and encrypt a secret with real cryptography in your browser.', it: 'Calcola una scadenza fiscale da un CUIT e cifra un segreto con crittografia vera nel tuo browser.' },
    },
  },
]

export const projectById = (id: string) => projects.find((p) => p.id === id)
