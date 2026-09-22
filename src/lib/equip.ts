import { useSyncExternalStore } from 'react'

// "Equipar": qué proyecto/empleo está resaltado en el inventario. Se comparte entre Trayectoria e Inventario.
let current: string | null = null
const listeners = new Set<() => void>()

export const equip = {
  get: () => current,
  set(id: string | null) {
    current = id
    listeners.forEach((l) => l())
  },
  toggle(id: string) {
    equip.set(current === id ? null : id)
  },
}

export function useEquip() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => current,
    () => null,
  )
}
