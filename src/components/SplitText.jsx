import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { pointer, prefersReducedMotion } from '../lib/pointer'

// Section heading. "\n" = line break, *text* = serif italic accent.
// Words sit in masks so ScrollTrigger can slide them up (see App reveal effect).
export function Headline({ text, as: Tag = 'h2', className = '' }) {
  const plain = text.replace(/\*/g, '').replace(/\n/g, ' ')
  return (
    <Tag className={`headline ${className}`} aria-label={plain} data-split>
      {text.split('\n').map((line, li) => (
        <span className="hl-line" key={li} aria-hidden="true">
          {line.split('*').map((seg, si) =>
            seg.split(' ').filter(Boolean).map((word, wi) => (
              <React.Fragment key={`${si}-${wi}`}>
                <span className="w"><span className={si % 2 ? 'wi em' : 'wi'}>{word}</span></span>{' '}
              </React.Fragment>
            ))
          )}
        </span>
      ))}
    </Tag>
  )
}

// Hero title: every glyph is its own element. After the intro, a wave of font-weight
// ripples through the sans letters and swells around the pointer (variable font).
const LINES = [{ text: 'I make' }, { text: 'ideas' }, { text: 'move.', em: true }]

export function KineticTitle({ active }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active || prefersReducedMotion()) return
    const root = ref.current
    const chars = [...root.querySelectorAll('.k-char:not(.em)')]
    let cache = []
    let visible = true

    const measure = () => {
      const rr = root.getBoundingClientRect()
      cache = chars.map((c) => {
        const r = c.getBoundingClientRect()
        return { x: r.left - rr.left + r.width / 2, y: r.top - rr.top + r.height / 2 }
      })
    }
    measure()
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure)
    window.addEventListener('resize', measure)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) measure() })
    io.observe(root)

    const tick = (time) => {
      if (!visible) return
      const rr = root.getBoundingClientRect()
      const px = pointer.x - rr.left
      const py = pointer.y - rr.top
      chars.forEach((c, i) => {
        const p = cache[i]
        if (!p) return
        const near = Math.max(0, 1 - Math.hypot(px - p.x, py - p.y) / 220)
        const wave = Math.sin(time * 1.1 + i * 0.6) * 0.5 + 0.5
        c.style.fontVariationSettings = `"wght" ${Math.round(430 + wave * 110 + near * near * 260)}`
      })
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', measure)
      io.disconnect()
    }
  }, [active])

  return (
    <h1 className="hero-title" aria-label="I make ideas move." ref={ref}>
      {LINES.map((line, li) => (
        <span className="k-line" key={li} aria-hidden="true">
          {[...line.text].map((ch, i) =>
            ch === ' '
              ? <span className="k-space" key={i}>{'\u00a0'}</span>
              : <span className="k-mask" key={i}><span className={line.em ? 'k-char em' : 'k-char'}>{ch}</span></span>
          )}
        </span>
      ))}
    </h1>
  )
}
