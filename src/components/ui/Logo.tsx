import { useId } from 'react'

/**
 * Logo personal: un monograma "NB" en grilla de píxeles, en línea con la
 * estética "NB-OS" de la pantalla de arranque. Vive también como archivo
 * standalone en public/brand/ (logo.svg, logo-mark.svg, logo-mono.svg) para
 * usar fuera del sitio — avatar, GitHub, README, lo que sea.
 */

// Coordenadas generadas desde una grilla de bitmap N + B de 5x7 px cada una
// (ver public/brand/README.md). No tocar a mano: regenerar con el script ahí.
const PIXELS: [number, number][] = [
  [0, 0], [4, 0],
  [0, 1], [1, 1], [4, 1],
  [0, 2], [2, 2], [4, 2],
  [0, 3], [2, 3], [4, 3],
  [0, 4], [3, 4], [4, 4],
  [0, 5], [4, 5],
  [0, 6], [4, 6],
  [6, 0], [7, 0], [8, 0], [9, 0],
  [6, 1], [10, 1],
  [6, 2], [10, 2],
  [6, 3], [7, 3], [8, 3], [9, 3],
  [6, 4], [10, 4],
  [6, 5], [10, 5],
  [6, 6], [7, 6], [8, 6], [9, 6],
]
const PX = 8
const GAP = 1.4
const PITCH = PX + GAP
const RX = 1.6
const COLS = 11
const ROWS = 7
const VB = 120
const OX = (VB - (COLS * PX + (COLS - 1) * GAP)) / 2
const OY = (VB - (ROWS * PX + (ROWS - 1) * GAP)) / 2

interface Props {
  size?: number
  /** badge: fondo oscuro + gradiente (favicon/avatar). mark: solo la marca, gradiente, fondo transparente. mono: un solo color vía currentColor. */
  variant?: 'badge' | 'mark' | 'mono'
  className?: string
}

export function Logo({ size = 40, variant = 'badge', className = '' }: Props) {
  const gid = `nb-${useId().replace(/:/g, '')}`
  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} width={size} height={size} className={className} role="img" aria-label="NB">
      {variant === 'badge' && <rect width={VB} height={VB} rx={VB * 0.233} fill="#05060b" />}
      {variant !== 'mono' && (
        <defs>
          <linearGradient id={gid} x1="6" y1="20" x2="114" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#c8ff3d" />
            <stop offset="1" stopColor="#8b7bff" />
          </linearGradient>
        </defs>
      )}
      <g fill={variant === 'mono' ? 'currentColor' : `url(#${gid})`}>
        {PIXELS.map(([c, r]) => (
          <rect key={`${c}-${r}`} x={OX + c * PITCH} y={OY + r * PITCH} width={PX} height={PX} rx={RX} />
        ))}
      </g>
    </svg>
  )
}
