// Efectos visuales imperativos (partículas, textos flotantes). Un único canvas superpuesto.
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  color: string
  rot: number
  vr: number
  shape: 'rect' | 'circle' | 'star'
  g: number
}

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let parts: Particle[] = []
let raf = 0
let last = 0

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function ensure() {
  if (canvas) return
  canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '125', width: '100%', height: '100%' })
  document.body.appendChild(canvas)
  ctx = canvas.getContext('2d')
  const resize = () => {
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = innerWidth * dpr
    canvas.height = innerHeight * dpr
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  addEventListener('resize', resize)
}

function drawStar(c: CanvasRenderingContext2D, r: number) {
  c.beginPath()
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r * 0.45 : r
    const a = (Math.PI / 5) * i - Math.PI / 2
    c.lineTo(Math.cos(a) * rad, Math.sin(a) * rad)
  }
  c.closePath()
  c.fill()
}

function loop(t: number) {
  if (!ctx || !canvas) return
  const dt = Math.min(0.033, (t - last) / 1000 || 0.016)
  last = t
  ctx.clearRect(0, 0, innerWidth, innerHeight)
  parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40)
  for (const p of parts) {
    p.life -= dt
    p.vy += p.g * dt
    p.vx *= 0.995
    p.x += p.vx * dt
    p.y += p.vy * dt
    p.rot += p.vr * dt
    const a = Math.max(0, Math.min(1, p.life / p.max))
    ctx.save()
    ctx.globalAlpha = Math.min(1, a * 2)
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot)
    ctx.fillStyle = p.color
    if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
    else if (p.shape === 'circle') {
      ctx.beginPath()
      ctx.arc(0, 0, p.size / 2, 0, 6.283)
      ctx.fill()
    } else drawStar(ctx, p.size)
    ctx.restore()
  }
  if (parts.length) raf = requestAnimationFrame(loop)
  else {
    raf = 0
    ctx.clearRect(0, 0, innerWidth, innerHeight)
  }
}

function kick() {
  if (!raf) {
    last = performance.now()
    raf = requestAnimationFrame(loop)
  }
}

const PALETTE = ['#c8ff3d', '#8b7bff', '#22d3ee', '#ff5c8a', '#ffb547', '#ffffff']

interface BurstOpts {
  colors?: string[]
  count?: number
  speed?: number
  shape?: Particle['shape'] | 'mixed'
}

export const fx = {
  burst(x: number, y: number, o: BurstOpts = {}) {
    if (reduced()) return
    ensure()
    const { colors = PALETTE, count = 26, speed = 320, shape = 'mixed' } = o
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const s = speed * (0.35 + Math.random() * 0.75)
      parts.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 80,
        life: 0.7 + Math.random() * 0.6,
        max: 1.2,
        size: 5 + Math.random() * 7,
        color: colors[(Math.random() * colors.length) | 0],
        rot: Math.random() * 6,
        vr: (Math.random() - 0.5) * 14,
        shape: shape === 'mixed' ? (['rect', 'circle', 'star'] as const)[(Math.random() * 3) | 0] : shape,
        g: 620,
      })
    }
    kick()
  },
  confetti(colors: string[] = PALETTE) {
    if (reduced()) return
    ensure()
    for (const side of [0, 1]) {
      const x = side ? innerWidth + 10 : -10
      for (let i = 0; i < 70; i++) {
        const a = (side ? Math.PI : 0) - 0.35 - Math.random() * 0.9 * (side ? -1 : 1)
        const s = 520 + Math.random() * 620
        parts.push({
          x,
          y: innerHeight * 0.78,
          vx: Math.cos(a) * s,
          vy: -Math.abs(Math.sin(a)) * s * 1.05,
          life: 2.6 + Math.random(),
          max: 3,
          size: 7 + Math.random() * 7,
          color: colors[(Math.random() * colors.length) | 0],
          rot: Math.random() * 6,
          vr: (Math.random() - 0.5) * 18,
          shape: Math.random() > 0.3 ? 'rect' : 'circle',
          g: 780,
        })
      }
    }
    kick()
  },
  floatText(x: number, y: number, text: string, color = 'var(--accent)') {
    const el = document.createElement('div')
    el.textContent = text
    Object.assign(el.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: '126',
      fontFamily: 'var(--font-mono)',
      fontWeight: '700',
      fontSize: '15px',
      color,
      textShadow: '0 0 14px currentColor',
      transition: 'transform 0.9s cubic-bezier(.2,.8,.2,1), opacity 0.9s',
      opacity: '1',
    })
    document.body.appendChild(el)
    requestAnimationFrame(() => {
      el.style.transform = 'translate(-50%, -130%) scale(1.15)'
      el.style.opacity = '0'
    })
    setTimeout(() => el.remove(), 950)
  },
}
