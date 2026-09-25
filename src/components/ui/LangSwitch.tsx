import { sfx } from '../../game/audio'
import { i18n, useT, type Lang } from '../../lib/i18n'

export const LANG_OPTIONS: { k: Lang; label: string; name: string; switchTo: string }[] = [
  { k: 'es', label: 'ES', name: 'Español', switchTo: 'Cambiar a español' },
  { k: 'en', label: 'EN', name: 'English', switchTo: 'Switch to English' },
  { k: 'it', label: 'IT', name: 'Italiano', switchTo: 'Passa all’italiano' },
]

/** Selector ES / EN / IT. Cada opción se anuncia en su propio idioma. */
export function LangSwitch({ className = '' }: { className?: string }) {
  const t = useT()
  return (
    <div role="group" aria-label={t('Idioma', 'Language', 'Lingua')} className={`flex items-center rounded-full border border-white/10 p-0.5 font-mono text-[10.5px] ${className}`}>
      {LANG_OPTIONS.map((o) => {
        const on = t.lang === o.k
        return (
          <button
            key={o.k}
            lang={o.k}
            onClick={() => {
              if (on) return
              sfx.click()
              i18n.set(o.k)
            }}
            aria-pressed={on}
            aria-label={o.name}
            title={o.name}
            className={`rounded-full px-2 py-1 leading-none transition ${on ? 'bg-accent/15 text-accent' : 'text-white/50 hover:text-white'}`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
