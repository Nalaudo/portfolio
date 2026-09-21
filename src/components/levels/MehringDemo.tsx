import { useRef, useState } from 'react'
import { game } from '../../game/store'
import { sfx } from '../../game/audio'
import { fx } from '../../lib/fx'

const FINISHES = [
  { k: 'arena', name: 'Arena', c: '#cdbb8c' },
  { k: 'roble', name: 'Roble', c: '#a68e4f' },
  { k: 'musgo', name: 'Musgo', c: '#61532e' },
  { k: 'arcilla', name: 'Arcilla', c: '#7a2a20' },
  { k: 'corteza', name: 'Corteza', c: '#431708' },
] as const
const BACKS = [
  { k: 'barrotes', name: 'Barrotes' },
  { k: 'listones', name: 'Listones' },
  { k: 'panel', name: 'Panel' },
] as const
const SEATS = [
  { k: 'madera', name: 'Madera' },
  { k: 'paja', name: 'Paja' },
  { k: 'tapizado', name: 'Tapizado' },
] as const

const CATALOG = [
  { n: 'Silla Gala', f: 'silla-gala' },
  { n: 'Silla Cocó', f: 'silla-coco' },
  { n: 'Silla Divi', f: 'silla-divi' },
  { n: 'Silla Frida', f: 'silla-frida' },
  { n: 'Silla Sofi', f: 'silla-sofi' },
  { n: 'Silla Mimy', f: 'silla-mimy' },
  { n: 'Silla Aldana', f: 'silla-aldana' },
  { n: 'Sillón Frida', f: 'sillon-frida' },
]

type Finish = (typeof FINISHES)[number]['k']
type Back = (typeof BACKS)[number]['k']
type Seat = (typeof SEATS)[number]['k']

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const t = amt < 0 ? 0 : 255
    return Math.round(v + (t - v) * Math.abs(amt))
  })
  return `rgb(${ch.join(',')})`
}

function Chair({ c, back, seat, ex }: { c: string; back: Back; seat: Seat; ex: number }) {
  const labelOp = Math.max(0, Math.min(1, (ex - 0.55) / 0.3))
  const fabric = shade(c, -0.45)
  const T = (x: number, y: number) => `translate(${(x * ex).toFixed(2)} ${(y * ex).toFixed(2)})`
  const FLIP = 'translate(320 0) scale(-1 1)'
  const wood = 'url(#mh-wg)'
  const grain = 'url(#mh-grain)'

  return (
    <svg viewBox="-40 -100 400 610" className="h-full w-full" role="img" aria-label={`Silla ${c} en vista explosionada al ${Math.round(ex * 100)}%`}>
      <defs>
        <linearGradient id="mh-wg" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={shade(c, -0.18)} />
          <stop offset="0.38" stopColor={c} />
          <stop offset="0.6" stopColor={shade(c, 0.16)} />
          <stop offset="1" stopColor={shade(c, -0.3)} />
        </linearGradient>
        <linearGradient id="mh-wd" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={shade(c, -0.4)} />
          <stop offset="1" stopColor={shade(c, -0.52)} />
        </linearGradient>
        <pattern id="mh-grain" width="22" height="120" patternUnits="userSpaceOnUse">
          <path d="M4 0 C8 30 0 70 5 120" stroke="#000" strokeOpacity=".16" strokeWidth="1.2" fill="none" />
          <path d="M13 0 C10 40 17 80 12 120" stroke="#fff" strokeOpacity=".1" strokeWidth="1" fill="none" />
          <path d="M19 0 C21 50 16 90 20 120" stroke="#000" strokeOpacity=".1" strokeWidth=".8" fill="none" />
        </pattern>
        <pattern id="mh-weave" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="9" height="9" fill="#d8bf78" />
          <path d="M0 4.5H9M4.5 0V9" stroke="#a88a3f" strokeWidth="2.2" strokeOpacity=".75" />
          <path d="M0 0H9M0 9H9" stroke="#f3e2a8" strokeWidth="1" strokeOpacity=".7" />
        </pattern>

        <path id="mh-fleg" d="M40 284 h30 l-4 120 q-1 5 -6 5 h-10 q-6 0 -6 -5 z" />
        <path id="mh-bleg" d="M78 284 h20 l-3 106 q0 4 -4 4 h-6 q-4 0 -4 -4 z" />
        <rect id="mh-post" x="78" y="26" width="18" height="180" rx="8" />
        <path id="mh-top" d="M78 44 Q160 14 242 44 L242 76 Q160 46 78 76 Z" />
        <rect id="mh-low" x="78" y="176" width="164" height="26" rx="10" />
        <rect id="mh-str" x="70" y="338" width="180" height="14" rx="6" />
      </defs>

      {/* sombra en el piso */}
      <ellipse cx="160" cy={410 + 40 * ex} rx={130 - 20 * ex} ry="12" fill="#000" opacity={0.22 - 0.08 * ex} />

      {/* patas traseras */}
      <g transform={T(0, 58)}>
        <use href="#mh-bleg" fill="url(#mh-wd)" />
        <use href="#mh-bleg" fill={grain} opacity=".7" />
        <use href="#mh-bleg" fill="url(#mh-wd)" transform={FLIP} />
        <use href="#mh-bleg" fill={grain} opacity=".7" transform={FLIP} />
      </g>

      {/* montantes */}
      <g>
        <g transform={T(-30, -16)}>
          <use href="#mh-post" fill={wood} />
          <use href="#mh-post" fill={grain} />
        </g>
        <g transform={T(30, -16)}>
          <use href="#mh-post" fill={wood} transform="translate(146 0)" />
          <use href="#mh-post" fill={grain} transform="translate(146 0)" />
        </g>
      </g>

      {/* relleno del respaldo */}
      <g transform={T(0, -50)} fill={wood}>
        {back === 'barrotes' &&
          [112, 136, 160, 184, 208].map((x) => (
            <g key={x}>
              <rect x={x - 5} y="74" width="10" height="106" rx="5" fill={wood} />
              <rect x={x - 5} y="74" width="10" height="106" rx="5" fill={grain} />
            </g>
          ))}
        {back === 'listones' &&
          [0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="94" y={80 + i * 32} width="132" height="21" rx="7" fill={wood} />
              <rect x="94" y={80 + i * 32} width="132" height="21" rx="7" fill={grain} />
            </g>
          ))}
        {back === 'panel' && (
          <g>
            <path fillRule="evenodd" fill={wood} d="M104 78 h112 a12 12 0 0 1 12 12 v76 a12 12 0 0 1 -12 12 h-112 a12 12 0 0 1 -12 -12 v-76 a12 12 0 0 1 12 -12 z M136 127 a24 32 0 1 0 48 0 a24 32 0 1 0 -48 0 z" />
            <path fillRule="evenodd" fill={grain} d="M104 78 h112 a12 12 0 0 1 12 12 v76 a12 12 0 0 1 -12 12 h-112 a12 12 0 0 1 -12 -12 v-76 a12 12 0 0 1 12 -12 z M136 127 a24 32 0 1 0 48 0 a24 32 0 1 0 -48 0 z" />
          </g>
        )}
      </g>

      {/* travesaño inferior y superior */}
      <g transform={T(0, -14)}>
        <use href="#mh-low" fill={wood} />
        <use href="#mh-low" fill={grain} />
      </g>
      <g transform={T(0, -92)}>
        <use href="#mh-top" fill={wood} />
        <use href="#mh-top" fill={grain} />
        <path d="M84 50 Q160 24 236 50" stroke="#fff" strokeOpacity=".22" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>

      {/* asiento */}
      <g transform={T(0, 14)}>
        <rect x="28" y="262" width="264" height="22" rx="7" fill={wood} />
        <rect x="28" y="262" width="264" height="22" rx="7" fill={grain} />
        <rect x="28" y="276" width="264" height="8" rx="4" fill="#000" opacity=".22" />
        <polygon points="52,206 268,206 292,262 28,262" fill={seat === 'tapizado' ? fabric : wood} />
        {seat === 'madera' && (
          <>
            <polygon points="52,206 268,206 292,262 28,262" fill={grain} />
            <path d="M106 206 L94 262 M160 206 V262 M214 206 L226 262" stroke="#000" strokeOpacity=".28" strokeWidth="1.6" />
          </>
        )}
        {seat === 'paja' && <polygon points="70,216 250,216 270,254 50,254" fill="url(#mh-weave)" stroke={shade(c, -0.35)} strokeWidth="2" />}
        {seat === 'tapizado' && (
          <>
            <polygon points="52,206 268,206 292,262 28,262" fill="none" stroke={shade(c, 0.1)} strokeWidth="3" strokeOpacity=".5" />
            {[[128, 224], [192, 224], [160, 244], [100, 246], [220, 246]].map(([x, y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r="3" fill="#000" opacity=".4" />
            ))}
          </>
        )}
        <polygon points="52,206 268,206 292,262 28,262" fill="url(#mh-wg)" opacity={seat === 'tapizado' ? 0.18 : 0.12} />
      </g>

      {/* travesaño entre patas */}
      <g transform={T(0, 100)}>
        <use href="#mh-str" fill={wood} />
        <use href="#mh-str" fill={grain} />
      </g>

      {/* patas delanteras */}
      <g transform={T(-44, 82)}>
        <use href="#mh-fleg" fill={wood} />
        <use href="#mh-fleg" fill={grain} />
      </g>
      <g transform={`${FLIP} ${T(-44, 82)}`}>
        <use href="#mh-fleg" fill={wood} />
        <use href="#mh-fleg" fill={grain} />
      </g>

      {/* etiquetas de la vista explosionada */}
      <g opacity={labelOp} fontFamily="var(--font-mono)" fontSize="11" fill="#3b2b20">
        {[
          ['Travesaño', 296, -30],
          ['Respaldo', 296, 40],
          ['Asiento', 300, 246],
          ['Travesaño inf.', -38, 452],
          ['Patas', 332, 480],
        ].map(([t, x, y]) => (
          <text key={String(t)} x={Number(x)} y={Number(y)}>
            {t}
          </text>
        ))}
      </g>
    </svg>
  )
}

export function MehringDemo() {
  const [finish, setFinish] = useState<Finish>('roble')
  const [back, setBack] = useState<Back>('listones')
  const [seat, setSeat] = useState<Seat>('paja')
  const [ex, setEx] = useState(0)
  const combos = useRef(new Set<string>(['roble|listones|paja']))
  const maxEx = useRef(0)
  const played = useRef(false)
  const fin = FINISHES.find((f) => f.k === finish)!

  const check = (f: Finish, b: Back, s: Seat, e: number) => {
    if (!played.current) {
      played.current = true
      game.play('mehring')
    }
    combos.current.add(`${f}|${b}|${s}`)
    maxEx.current = Math.max(maxEx.current, e)
    if (maxEx.current >= 0.95) game.unlock('carpenter')
    if (combos.current.size >= 4 && maxEx.current >= 0.95) {
      game.complete('mehring')
    }
  }

  const upd = <T,>(set: (v: T) => void, v: T, next: [Finish, Back, Seat]) => {
    sfx.pop()
    set(v)
    check(next[0], next[1], next[2], ex)
  }

  const name = `Silla ${fin.name} · ${BACKS.find((b) => b.k === back)!.name} · ${SEATS.find((s) => s.k === seat)!.name}`
  const done = combos.current.size

  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-3xl" style={{ background: 'radial-gradient(90% 70% at 50% 35%, #f6f0e0, #dcd1b4 75%)' }}>
          <div className="relative h-[420px] sm:h-[480px]">
            <Chair c={fin.c} back={back} seat={seat} ex={ex} />
            <div className="absolute left-4 top-4 rounded-full bg-[#2d0d0a]/90 px-3.5 py-1.5 font-mono text-[11px] text-[#f6f0e0]">{name}</div>
          </div>
          <div className="bg-[#2d0d0a] p-4 text-[#f6f0e0]">
            <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider">
              <label htmlFor="explode">Vista explosionada</label>
              <span className="text-[#e0a458]">{Math.round(ex * 100)}%</span>
            </div>
            <input
              id="explode"
              type="range"
              className="range"
              min={0}
              max={100}
              value={Math.round(ex * 100)}
              style={{ ['--fill' as string]: `${ex * 100}%` }}
              onChange={(e) => {
                const v = Number(e.target.value) / 100
                setEx(v)
                check(finish, back, seat, v)
                if (v >= 0.95 && ex < 0.95) {
                  sfx.coin()
                  const r = e.currentTarget.getBoundingClientRect()
                  fx.burst(r.right - 10, r.top, { colors: ['#e0a458', '#f6f0e0', '#a68e4f'], count: 20 })
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="label mb-3">Terminación</p>
            <div className="flex flex-wrap gap-2.5">
              {FINISHES.map((f) => (
                <button key={f.k} onClick={() => upd(setFinish, f.k, [f.k, back, seat])} aria-pressed={finish === f.k} aria-label={f.name} className={`group flex flex-col items-center gap-2 rounded-2xl border p-2.5 transition ${finish === f.k ? 'border-accent bg-accent/10' : 'border-white/10 hover:border-white/30'}`}>
                  <span className="h-10 w-10 rounded-full ring-2 ring-white/20 transition group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${shade(f.c, 0.2)}, ${f.c} 55%, ${shade(f.c, -0.3)})` }} />
                  <span className="font-mono text-[10.5px] text-white/60">{f.name}</span>
                </button>
              ))}
            </div>
          </div>
          <Segmented label="Respaldo" value={back} options={BACKS} onChange={(v) => upd(setBack, v, [finish, v, seat])} />
          <Segmented label="Asiento" value={seat} options={SEATS} onChange={(v) => upd(setSeat, v, [finish, back, v])} />

          <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-4">
            <p className="label !text-accent">Desafío</p>
            <p className="mt-1 font-display text-base font-bold">Probá 4 combinaciones y explotá la silla al 100%</p>
            <div className="mt-3 flex items-center gap-3 font-mono text-xs text-white/55">
              <span className={done >= 4 ? 'text-mint' : ''}>Combinaciones {Math.min(done, 4)}/4</span>
              <span className={maxEx.current >= 0.95 ? 'text-mint' : ''}>Explosión {maxEx.current >= 0.95 ? '✓' : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <p className="label mb-4">Del catálogo real · fotografía de producto</p>
        <div className="no-scrollbar -mx-3 flex snap-x gap-3 overflow-x-auto px-3 pb-2 sm:-mx-6 sm:px-6">
          {CATALOG.map((c) => (
            <figure key={c.f} className="group relative h-64 w-48 shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-[#efe8d6]">
              <img src={`/img/mehring/${c.f}.webp`} alt={c.n} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 font-display text-sm font-bold">{c.n}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly { k: T; name: string }[]; onChange: (v: T) => void }) {
  return (
    <div>
      <p className="label mb-3">{label}</p>
      <div className="inline-flex rounded-full border border-white/10 bg-black/30 p-1">
        {options.map((o) => (
          <button key={o.k} onClick={() => onChange(o.k)} aria-pressed={value === o.k} className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition ${value === o.k ? 'bg-accent text-void' : 'text-white/60 hover:text-white'}`}>
            {o.name}
          </button>
        ))}
      </div>
    </div>
  )
}
