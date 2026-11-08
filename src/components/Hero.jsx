import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { SafeCanvas } from './SafeCanvas'
import { HeroScene } from './HeroScene'
import { KineticTitle } from './SplitText'
import { useInView } from '../lib/hooks'
import { pointer, prefersReducedMotion } from '../lib/pointer'

const fmt = (v) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}`

export function Hero({ introDone, goTo }) {
  const section = useRef(null), hud = useRef(null), readout = useRef(null)
  const visible = useInView(section, '0px')

  // Glass chips drift on different depth layers; the readout prints live pointer coordinates.
  useEffect(() => {
    if (prefersReducedMotion()) return
    let px = 0, py = 0, n = 0
    const tick = () => {
      if (!hud.current) return
      px += (pointer.nx - px) * 0.08
      py += (pointer.ny - py) * 0.08
      hud.current.style.setProperty('--px', px.toFixed(3))
      hud.current.style.setProperty('--py', py.toFixed(3))
      if (++n % 4 === 0 && readout.current) readout.current.textContent = `X ${fmt(pointer.nx)}   Y ${fmt(pointer.ny)}`
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <section className="hero" id="top" ref={section}>
      <div className="hero-stage" aria-hidden="true">
        <SafeCanvas
          fallback={<div className="hero-fallback" />}
          frameloop={visible ? 'always' : 'never'}
          dpr={[1, 1.25]}
          camera={{ position: [0, 0, 6], fov: 40 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <HeroScene />
        </SafeCanvas>
      </div>

      <div className="shell hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker"><span /> CREATIVE TECHNOLOGIST <b> / 001</b></p>
          <KineticTitle active={introDone} />
          <p className="hero-description">I’m Shubhnit. I build software, shape 3D forms and turn ideas into motion.</p>
          <div className="hero-actions">
            <a className="button button-dark magnetic" href="#projects" onClick={(e) => { e.preventDefault(); goTo('projects') }}>EXPLORE SELECTED WORK <ArrowUpRight size={16} /></a>
            <a className="text-link" href="#about" onClick={(e) => { e.preventDefault(); goTo('about') }}>GET TO KNOW ME <ArrowDown size={14} /></a>
          </div>
        </div>

        <div className="hero-hud" ref={hud} aria-hidden="true">
          <span className="hud-chip glass c1">CODE</span>
          <span className="hud-chip glass c2">FORM</span>
          <span className="hud-chip glass c3">MOTION</span>
          <div className="hud-card glass">
            <span className="hud-title">FIG. 001 — A SYSTEM IN MOTION</span>
            <span className="hud-xy" ref={readout}>X +0.00   Y +0.00</span>
            <span className="hud-hint">MOVE · PRESS · DRAG</span>
          </div>
        </div>
      </div>

      <div className="shell hero-index">
        <span>BASED IN INDIA / WORKING EVERYWHERE</span>
        <span>SCROLL TO EXPLORE ↓</span>
      </div>
    </section>
  )
}
