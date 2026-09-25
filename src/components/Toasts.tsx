import { AnimatePresence, motion } from 'motion/react'
import { Sparkles, Trophy } from 'lucide-react'
import { toastStore, useToasts } from '../game/store'
import { useT } from '../lib/i18n'

export function Toasts() {
  const toasts = useToasts()
  const t = useT()
  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-4 z-[95] flex flex-col items-end gap-3 sm:inset-x-auto sm:right-5" role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={() => toastStore.dismiss(toast.id)}
            className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0d101a]/95 p-4 text-left shadow-2xl backdrop-blur-md sm:w-80"
          >
            <span className="absolute inset-y-0 left-0 w-1 bg-accent" />
            <span className="absolute -left-10 top-0 h-full w-32 bg-gradient-to-r from-accent/25 to-transparent" />
            <div className="relative flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                {toast.kind === 'achievement' ? <Trophy size={20} /> : <Sparkles size={20} />}
              </span>
              <div className="min-w-0">
                <p className="label !text-accent">{toast.kind === 'achievement' ? t('Logro desbloqueado', 'Achievement unlocked', 'Obiettivo sbloccato') : toast.kind === 'rank' ? t('Nuevo rango', 'New rank', 'Nuovo grado') : t('Aviso', 'Notice', 'Avviso')}</p>
                <p className="mt-0.5 font-display text-[15px] font-bold leading-tight">{toast.title}</p>
                <p className="mt-1 text-[13px] leading-snug text-white/60">{toast.text}</p>
                {toast.xp ? <p className="mt-2 font-mono text-xs font-semibold text-accent">+{toast.xp} XP</p> : null}
              </div>
            </div>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
