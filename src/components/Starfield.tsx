import { useEffect, useRef } from 'react'

/** Controlador global del efecto "warp" (lo dispara el Boot). */
export const warp = { boost: 0 }

interface S {
  x: number
  y: number
  z: number
  tw: number
}

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let stars: S[] = []
    let raf = 0
    let last = performance.now()
    let scrollY = window.scrollY
    let vel = 0
    let accent = '#c8ff3d'
    let accentAt = 0
    const mouse = { x: -9999, y: -9999 }

    const seed = () => {
      const n = Math.max(90, Math.min(260, Math.floor((w * h) / 7500)))
      stars = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, z: 0.15 + Math.random() * 0.85, tw: Math.random() * 6 }))
    }
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = innerWidth
      h = innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onLeave = () => {
      mouse.x = mouse.y = -9999
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (now - accentAt > 400) {
        accentAt = now
        accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || accent
      }
      const sy = window.scrollY
      vel += ((sy - scrollY) - vel) * 0.18
      scrollY = sy
      warp.boost = Math.max(0, warp.boost - dt * 0.85)
      const boost = warp.boost > 0.5 ? 1 : warp.boost * 2

      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2
      const near: S[] = []

      for (const s of stars) {
        if (!reduce) {
          if (boost > 0.01) {
            s.x += (s.x - cx) * boost * 2.6 * s.z * dt
            s.y += (s.y - cy) * boost * 2.6 * s.z * dt
          } else {
            s.y -= (6 + 16 * s.z) * dt + vel * s.z * 0.55
          }
        }
        if (s.y < -20) s.y = h + 10
        else if (s.y > h + 20) s.y = -10
        if (s.x < -20 || s.x > w + 20) {
          s.x = boost > 0.01 ? cx + (Math.random() - 0.5) * 80 : Math.random() * w
          if (boost > 0.01) s.y = cy + (Math.random() - 0.5) * 80
        }
        const px = s.x + (mouse.x > -9000 ? (mouse.x - cx) * 0.012 * s.z : 0)
        const py = s.y
        const a = Math.min(1, 0.25 + s.z * 0.65 + Math.sin(now / 900 + s.tw) * 0.12)
        const r = 0.5 + s.z * 1.3
        const streakV = Math.min(140, Math.abs(vel) * s.z * 1.6)
        ctx.globalAlpha = a
        if (boost > 0.01) {
          const dx = px - cx
          const dy = py - cy
          const d = Math.hypot(dx, dy) || 1
          const len = 20 + boost * 160 * s.z
          ctx.strokeStyle = accent
          ctx.lineWidth = r
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(px - (dx / d) * len, py - (dy / d) * len)
          ctx.stroke()
        } else if (streakV > 2) {
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = r
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(px, py + Math.sign(vel) * streakV)
          ctx.stroke()
        } else {
          ctx.fillStyle = s.z > 0.85 ? accent : '#e9ecff'
          ctx.beginPath()
          ctx.arc(px, py, r, 0, 6.283)
          ctx.fill()
        }
        if (mouse.x > -9000 && Math.hypot(px - mouse.x, py - mouse.y) < 130) near.push({ ...s, x: px, y: py })
      }

      // constelación alrededor del cursor
      if (near.length) {
        ctx.strokeStyle = accent
        ctx.lineWidth = 0.7
        for (let i = 0; i < near.length && i < 14; i++) {
          const a = near[i]
          const d = Math.hypot(a.x - mouse.x, a.y - mouse.y)
          ctx.globalAlpha = (1 - d / 130) * 0.5
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
          for (let j = i + 1; j < near.length && j < 14; j++) {
            const b = near[j]
            const dd = Math.hypot(a.x - b.x, a.y - b.y)
            if (dd < 90) {
              ctx.globalAlpha = (1 - dd / 90) * 0.28
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
          }
        }
      }
      ctx.globalAlpha = 1
      if (!reduce && !document.hidden) raf = requestAnimationFrame(frame)
    }

    const onVis = () => {
      if (!document.hidden && !reduce) {
        last = performance.now()
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    raf = requestAnimationFrame(frame)
    addEventListener('resize', resize)
    addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 78% 8%, color-mix(in oklab, var(--accent-2) 16%, transparent), transparent 70%), radial-gradient(50% 45% at 8% 92%, color-mix(in oklab, var(--accent) 9%, transparent), transparent 70%)',
        }}
      />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
