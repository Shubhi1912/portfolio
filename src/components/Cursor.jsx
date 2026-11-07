import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { pointer, prefersReducedMotion } from '../lib/pointer'

// Desktop: a liquid-glass ring that stretches with speed, swells over interactive things
// and shows a label for anything tagged data-cursor="…".
export function Cursor() {
  const root = useRef(null), ring = useRef(null), inner = useRef(null), dot = useRef(null), label = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || prefersReducedMotion()) return
    const html = document.documentElement
    const el = root.current
    html.classList.add('has-cursor')

    const x0 = window.innerWidth / 2, y0 = window.innerHeight / 2
    gsap.set([ring.current, dot.current], { xPercent: -50, yPercent: -50, x: x0, y: y0 })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' })
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.1, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.1, ease: 'power3' })

    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY)
      el.classList.add('is-on')
    }
    const over = (e) => {
      const t = e.target instanceof Element ? e.target : null
      const tagged = t && t.closest('[data-cursor]')
      const link = t && t.closest('a,button,[role="button"],label')
      const field = t && t.closest('input,textarea')
      el.classList.toggle('is-label', !!tagged)
      el.classList.toggle('is-link', !tagged && !!link)
      el.classList.toggle('is-field', !!field)
      if (tagged) label.current.textContent = tagged.getAttribute('data-cursor')
    }
    const down = () => el.classList.add('is-down')
    const up = () => el.classList.remove('is-down')
    const leave = () => el.classList.remove('is-on')

    // squash & stretch along the direction of travel
    const tick = () => {
      const speed = Math.hypot(pointer.vx, pointer.vy)
      const s = 1 + Math.min(speed / 70, 0.55)
      const a = (Math.atan2(pointer.vy, pointer.vx) * 180) / Math.PI
      gsap.set(inner.current, { rotation: a, scaleX: s, scaleY: 1 / Math.sqrt(s) })
    }
    gsap.ticker.add(tick)

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    html.addEventListener('mouseleave', leave)
    return () => {
      gsap.ticker.remove(tick)
      html.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      html.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <div className="cursor-ring" ref={ring}>
        <div className="cursor-scale"><div className="cursor-glass" ref={inner} /></div>
        <span className="cursor-label" ref={label} />
      </div>
      <i className="cursor-dot" ref={dot} />
    </div>
  )
}

// Touch screens (iPhone first): a liquid-glass blob blooms under the finger with a spring,
// follows it, then melts away — the same build everywhere, tuned in CSS for iOS.
export function TouchGlass() {
  const blob = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: none), (pointer: coarse)').matches) return
    const el = blob.current
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 })
    const qx = gsap.quickTo(el, 'x', { duration: 0.28, ease: 'power3' })
    const qy = gsap.quickTo(el, 'y', { duration: 0.28, ease: 'power3' })
    let active = false

    const down = (e) => {
      if (e.pointerType === 'mouse') return
      active = true
      gsap.killTweensOf(el, 'scale,opacity')
      gsap.set(el, { x: e.clientX, y: e.clientY })
      gsap.to(el, { scale: 1, opacity: 1, duration: 0.55, ease: 'elastic.out(1,0.55)' })
    }
    const move = (e) => { if (active) { qx(e.clientX); qy(e.clientY) } }
    const up = () => {
      if (!active) return
      active = false
      gsap.to(el, { scale: 0.35, opacity: 0, duration: 0.45, ease: 'power3.out' })
    }
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    window.addEventListener('pointercancel', up, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [])

  return <div className="touch-blob" ref={blob} aria-hidden="true" />
}
