import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../lib/pointer'

const WORDS = ['CODE', 'DESIGN', '3D', 'MOTION', 'INTERACTION', 'EXPERIMENT']

// Infinite ticker that speeds up with scroll velocity. dir: 1 = left, -1 = right.
function Row({ dir = 1, outline = false }) {
  const track = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = track.current
    let x = 0, started = false, lastY = window.scrollY, vel = 0
    const tick = (_t, dt) => {
      const half = el.scrollWidth / 2
      if (!half) return
      if (!started) { x = dir < 0 ? -half : 0; started = true }
      const y = window.scrollY
      vel += ((y - lastY) - vel) * 0.1
      lastY = y
      const speed = 0.55 + Math.min(Math.abs(vel), 70) * 0.14
      x -= dir * speed * (dt / 16.67)
      if (dir > 0 && x <= -half) x += half
      if (dir < 0 && x >= 0) x -= half
      el.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${(-vel * 0.12 * dir).toFixed(2)}deg)`
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [dir])

  return (
    <div className={outline ? 'marquee-row outline' : 'marquee-row'}>
      <div className="marquee-track" ref={track}>
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i}>{WORDS.map((w) => <React.Fragment key={w}>{w}<b>✳</b></React.Fragment>)}</span>
        ))}
      </div>
    </div>
  )
}

export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <Row dir={1} />
      <Row dir={-1} outline />
    </div>
  )
}
