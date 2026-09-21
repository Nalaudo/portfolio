import { useEffect, useRef } from 'react'

const HOT = 'a, button, [role="button"], input, textarea, select, label, summary, .hoverable'

export function CursorFx() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const glow = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    let tx = innerWidth / 2
    let ty = innerHeight / 2
    let rx = tx
    let ry = ty
    let gx = tx
    let gy = ty
    let raf = 0
    const move = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      ring.current?.classList.toggle('is-hot', !!(e.target as Element | null)?.closest?.(HOT))
    }
    const loop = () => {
      rx += (tx - rx) * 0.22
      ry += (ty - ry) * 0.22
      gx += (tx - gx) * 0.08
      gy += (ty - gy) * 0.08
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`
      if (dot.current) dot.current.style.transform = `translate3d(${tx}px,${ty}px,0)`
      if (glow.current) glow.current.style.transform = `translate3d(${gx}px,${gy}px,0)`
      raf = requestAnimationFrame(loop)
    }
    addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={glow} className="cursor-glow" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
