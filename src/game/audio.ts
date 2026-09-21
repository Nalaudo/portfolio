// SFX sintetizados con WebAudio: cero assets, cero peso.
let ctx: AudioContext | null = null
let enabled = false

export function setSoundEnabled(v: boolean) {
  enabled = v
}

function ac(): AudioContext | null {
  if (!enabled) return null
  try {
    if (!ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new Ctor()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

interface ToneOpts {
  type?: OscillatorType
  vol?: number
  slide?: number
  delay?: number
}

function tone(freq: number, dur: number, { type = 'sine', vol = 0.05, slide = 0, delay = 0 }: ToneOpts = {}) {
  const c = ac()
  if (!c) return
  const t0 = c.currentTime + delay
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(gain).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function noise(dur: number, vol = 0.04, delay = 0) {
  const c = ac()
  if (!c) return
  const len = Math.floor(c.sampleRate * dur)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = c.createBufferSource()
  src.buffer = buf
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 900
  const gain = c.createGain()
  gain.gain.value = vol
  src.connect(filter).connect(gain).connect(c.destination)
  src.start(c.currentTime + delay)
}

export const sfx = {
  hover: () => tone(880, 0.05, { type: 'triangle', vol: 0.018 }),
  click: () => {
    tone(520, 0.07, { type: 'square', vol: 0.03 })
    tone(780, 0.07, { type: 'square', vol: 0.02, delay: 0.05 })
  },
  step: () => tone(180 + Math.random() * 60, 0.05, { type: 'square', vol: 0.02 }),
  tick: () => tone(1200, 0.04, { type: 'square', vol: 0.02 }),
  type: () => tone(600 + Math.random() * 500, 0.03, { type: 'square', vol: 0.012 }),
  coin: () => {
    tone(988, 0.08, { type: 'square', vol: 0.045 })
    tone(1318, 0.32, { type: 'square', vol: 0.045, delay: 0.08 })
  },
  success: () => {
    ;[523, 659, 784, 1046].forEach((f, i) => tone(f, 0.16, { type: 'triangle', vol: 0.06, delay: i * 0.07 }))
  },
  error: () => tone(160, 0.28, { type: 'sawtooth', vol: 0.05, slide: -60 }),
  achievement: () => {
    ;[659, 880, 1174, 1568].forEach((f, i) => tone(f, 0.2, { type: 'triangle', vol: 0.05, delay: i * 0.09 }))
  },
  levelUp: () => {
    ;[392, 523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.22, { type: 'square', vol: 0.04, delay: i * 0.08 }))
  },
  whoosh: () => {
    noise(0.7, 0.05)
    tone(120, 0.7, { type: 'sawtooth', vol: 0.03, slide: 900 })
  },
  open: () => {
    noise(0.35, 0.03)
    tone(260, 0.35, { type: 'triangle', vol: 0.04, slide: 500 })
  },
  close: () => tone(700, 0.25, { type: 'triangle', vol: 0.035, slide: -450 }),
  pop: () => tone(420 + Math.random() * 300, 0.09, { type: 'sine', vol: 0.06, slide: 300 }),
}
