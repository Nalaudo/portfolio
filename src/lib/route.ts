import { useSyncExternalStore } from 'react'
import { projectById, type LevelId } from '../data/projects'

// Ruteo mínimo por hash: #/nivel/<id>. Abrir agrega una entrada al historial; cambiar de nivel la reemplaza.
export const levelOrigin = { x: innerWidth / 2, y: innerHeight / 2 }

const EVENT = 'nb:route'
const emit = () => window.dispatchEvent(new Event(EVENT))

export function readLevel(): LevelId | null {
  const m = location.hash.match(/^#\/nivel\/([a-z]+)$/)
  return m && projectById(m[1]) ? (m[1] as LevelId) : null
}

export function openLevel(id: LevelId, origin?: { x: number; y: number }) {
  if (origin) Object.assign(levelOrigin, origin)
  if (readLevel()) history.replaceState({ nb: 1 }, '', `#/nivel/${id}`)
  else history.pushState({ nb: 1 }, '', `#/nivel/${id}`)
  emit()
}

export function closeLevel() {
  if (history.state?.nb) history.back()
  else {
    history.replaceState(null, '', location.pathname + location.search)
    emit()
  }
}

function subscribe(l: () => void) {
  window.addEventListener('popstate', l)
  window.addEventListener('hashchange', l)
  window.addEventListener(EVENT, l)
  return () => {
    window.removeEventListener('popstate', l)
    window.removeEventListener('hashchange', l)
    window.removeEventListener(EVENT, l)
  }
}

export function useLevelRoute(): LevelId | null {
  return useSyncExternalStore(subscribe, readLevel, () => null)
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
