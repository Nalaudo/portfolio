import { useEffect, useId, useRef } from 'react'

interface Props {
  size?: number
  walking?: boolean
  facing?: 1 | -1
  track?: boolean
  className?: string
}

// "Bit": la mascota. Los ojos siguen al cursor.
export function Mascot({ size = 96, walking = false, facing = 1, track = true, className = '' }: Props) {
  const id = useId().replace(/:/g, '')
  const root = useRef<SVGSVGElement>(null)
  const eyes = useRef<SVGGElement>(null)

  useEffect(() => {
    if (!track) return
    const onMove = (e: PointerEvent) => {
      const el = root.current
      const g = eyes.current
      if (!el || !g) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height * 0.42
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(1, d / 260)
      g.style.transform = `translate(${(dx / d) * 3.4 * k}px, ${(dy / d) * 3 * k}px)`
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [track])

  return (
    <svg
      ref={root}
      viewBox="0 0 80 96"
      width={size}
      height={(size * 96) / 80}
      className={`${walking ? 'bit-walking' : ''} ${className}`}
      style={{ transform: `scaleX(${facing})`, overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f5ff" />
          <stop offset="1" stopColor="#8f98d0" />
        </linearGradient>
        <radialGradient id={`g${id}`}>
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.85" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="90" rx="24" ry="4.5" fill="#000" opacity="0.38" />
      <g className="bit-bob">
        <line x1="40" y1="16" x2="40" y2="6" stroke="#aab1e0" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="40" cy="5" r="9" fill={`url(#g${id})`} />
        <circle cx="40" cy="5" r="3.3" fill="var(--accent)" />
        <rect className="bit-foot foot-l" x="19" y="70" width="17" height="11" rx="5.5" fill="#7f88c4" />
        <rect className="bit-foot foot-r" x="44" y="70" width="17" height="11" rx="5.5" fill="#7f88c4" />
        <circle cx="6" cy="46" r="5.5" fill="#9aa3d8" />
        <circle cx="74" cy="46" r="5.5" fill="#9aa3d8" />
        <rect x="9" y="15" width="62" height="58" rx="22" fill={`url(#b${id})`} />
        <path d="M18 24c4-6 12-8 22-8" stroke="#fff" strokeOpacity="0.8" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <rect x="17" y="27" width="46" height="29" rx="14" fill="#070912" />
        <g ref={eyes} style={{ transition: 'transform 0.08s linear' }}>
          <ellipse className="bit-eye" cx="31" cy="41" rx="4.6" ry="6.2" fill="var(--accent)" />
          <ellipse className="bit-eye" cx="49" cy="41" rx="4.6" ry="6.2" fill="var(--accent)" />
        </g>
        <rect x="30" y="61" width="20" height="3.4" rx="1.7" fill="#5c6499" opacity="0.7" />
      </g>
    </svg>
  )
}
