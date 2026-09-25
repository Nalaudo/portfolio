import { useSyncExternalStore } from 'react'

// Idioma de la interfaz. Sin librerías: los textos de datos son { es, en, it } y los de UI se escriben
// en línea con t('español', 'english', 'italiano'), así cada traducción vive al lado de su original.
export const LANGS = ['es', 'en', 'it'] as const
export type Lang = (typeof LANGS)[number]
export type Loc<T = string> = Record<Lang, T>

const KEY = 'nb-lang'

const LOCALE: Loc = { es: 'es-AR', en: 'en-US', it: 'it-IT' }

const META: Loc<{ title: string; description: string }> = {
  es: {
    title: 'Nicolás Balaudo · Full-Stack Developer — Portfolio jugable',
    description: 'Portfolio jugable de Nicolás Balaudo, desarrollador full-stack. Explorá 5 mundos, jugá las demos de cada proyecto y desbloqueá logros.',
  },
  en: {
    title: 'Nicolás Balaudo · Full-Stack Developer — Playable portfolio',
    description: 'Playable portfolio of Nicolás Balaudo, full-stack developer. Explore 5 worlds, play each project’s demo and unlock achievements.',
  },
  it: {
    title: 'Nicolás Balaudo · Full-Stack Developer — Portfolio giocabile',
    description: 'Portfolio giocabile di Nicolás Balaudo, sviluppatore full-stack. Esplora 5 mondi, gioca le demo di ogni progetto e sblocca gli obiettivi.',
  },
}

const isLang = (v: unknown): v is Lang => LANGS.includes(v as Lang)

function detect(): Lang {
  // ?lang=en permite compartir el link directo en un idioma; gana sobre la preferencia guardada.
  try {
    const q = new URLSearchParams(location.search).get('lang')
    if (isLang(q)) {
      localStorage.setItem(KEY, q)
      return q
    }
  } catch {
    /* noop */
  }
  try {
    const saved = localStorage.getItem(KEY)
    if (isLang(saved)) return saved
  } catch {
    /* localStorage no disponible */
  }
  const nav = (typeof navigator !== 'undefined' ? navigator.languages?.[0] ?? navigator.language : '')?.toLowerCase() ?? ''
  if (nav.startsWith('es')) return 'es'
  if (nav.startsWith('it')) return 'it'
  return 'en'
}

let lang: Lang = detect()
const listeners = new Set<() => void>()

function apply() {
  document.documentElement.lang = lang
  document.title = META[lang].title
  document.querySelector('meta[name="description"]')?.setAttribute('content', META[lang].description)
}
apply()

export const i18n = {
  get: () => lang,
  set(next: Lang) {
    if (next === lang) return
    lang = next
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* noop */
    }
    // Si se entró con ?lang=, se actualiza para que recargar o compartir el link respete la elección.
    const url = new URL(location.href)
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', next)
      history.replaceState(history.state, '', url)
    }
    apply()
    listeners.forEach((l) => l())
  },
  subscribe(l: () => void) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}

export function useLang(): Lang {
  return useSyncExternalStore(i18n.subscribe, i18n.get, i18n.get)
}

export interface T {
  <V>(es: V, en: V, it: V): V
  /** Resuelve un texto de datos { es, en, it }. */
  l: <V>(v: Loc<V>) => V
  lang: Lang
  /** Locale para Intl / toLocaleString. */
  locale: string
}

function make(l: Lang): T {
  const t = (<V>(es: V, en: V, it: V) => ({ es, en, it })[l]) as T
  t.l = (v) => v[l]
  t.lang = l
  t.locale = LOCALE[l]
  return t
}

const T_BY_LANG: Loc<T> = { es: make('es'), en: make('en'), it: make('it') }

/** Traductor reactivo: el componente se vuelve a renderizar al cambiar de idioma. */
export function useT(): T {
  return T_BY_LANG[useLang()]
}

/** Traductor fuera de React (toasts, store): usa el idioma del momento en que se llama. */
export const getT = (): T => T_BY_LANG[lang]
