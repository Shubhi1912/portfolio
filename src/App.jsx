import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { projects, BASE_TITLE, SECTIONS, ACCENTS } from './data'
import { installPointerFx, prefersReducedMotion, scroller, scrollToTarget, sceneState } from './lib/pointer'
import { burst, glitch } from './lib/fx'
import { Cursor, TouchGlass } from './components/Cursor'
import { Terminal } from './components/Terminal'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { About, Work, Projects, Toolkit, Footer } from './components/Sections'
import { Contact } from './components/Contact'
import { CasePage } from './components/CasePage'

gsap.registerPlugin(ScrollTrigger)

const NAV = [['about', 'ABOUT'], ['work', 'EXPERIMENTS'], ['projects', 'SELECTED WORK'], ['toolkit', 'TOOLKIT']]
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const fromHash = () => {
  const m = window.location.hash.match(/^#project-([\w-]+)/)
  return m ? projects.find((p) => p.id === m[1]) || null : null
}
const setCurrentLink = (id) => {
  document.querySelectorAll('.nav-links a[data-target]').forEach((a) => {
    if (a.dataset.target === id) a.setAttribute('data-current', 'true')
    else a.removeAttribute('data-current')
  })
}

export default function App() {
  const root = useRef(null)
  const curtain = useRef(null)
  const busy = useRef(false)
  const pending = useRef(null)
  const taps = useRef({ n: 0, t: 0 })
  const [active, setActive] = useState(fromHash)
  const activeRef = useRef(active)
  activeRef.current = active
  const [menuOpen, setMenuOpen] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [termOpen, setTermOpen] = useState(false)
  const prevFilter = useRef(filter)

  /* ── device flags (touch / iOS) ─────────────────────────────── */
  useEffect(() => {
    const html = document.documentElement
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    html.classList.toggle('touch-device', touch)
    html.classList.toggle('ios-device', ios)
  }, [])

  /* ── smooth inertial scrolling (Lenis, driven by GSAP's ticker) ── */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true, autoRaf: false })
    scroller.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      scroller.lenis = null
    }
  }, [])

  /* ── pointer physics, spotlight, tilt, magnets ──────────────── */
  useEffect(() => installPointerFx(), [])

  /* ── cinematic intro → hero entrance ────────────────────────── */
  useEffect(() => {
    const finish = () => {
      setIntroDone(true)
      document.body.classList.remove('intro-lock')
      if (scroller.lenis) scroller.lenis.start()
      ScrollTrigger.refresh()
    }
    const ctx = gsap.context(() => {
      if (prefersReducedMotion() || !document.querySelector('.intro-screen')) {
        gsap.set('.intro-screen', { display: 'none' })
        finish()
        return
      }
      document.body.classList.add('intro-lock')
      if (scroller.lenis) scroller.lenis.stop()
      const counter = { v: 0 }
      const num = document.querySelector('.boot-num')
      const bar = document.querySelector('.boot-line')
      const chars = gsap.utils.toArray('.k-char')
      const bits = gsap.utils.toArray('.hero-kicker, .hero-description, .hero-actions, .hero-hud > *, .hero-index > *')
      gsap.set(chars, { yPercent: 115 })
      gsap.set(bits, { opacity: 0, y: 24 })

      gsap.timeline({ onComplete: finish })
        .from('.intro-mark .ch', { yPercent: 110, duration: 0.9, stagger: 0.08, ease: 'power4.out' })
        .from('.intro-meta > *, .intro-tag, .boot-readout', { opacity: 0, y: 8, duration: 0.6, stagger: 0.06 }, '-=0.5')
        .to(counter, {
          v: 100, duration: 1.5, ease: 'power2.inOut',
          onUpdate: () => {
            if (num) num.textContent = String(Math.round(counter.v)).padStart(3, '0')
            if (bar) bar.style.transform = `scaleX(${counter.v / 100})`
          },
        }, 0.2)
        .to('.intro-mark .ch', { yPercent: -110, duration: 0.6, stagger: 0.05, ease: 'power3.in' }, '+=0.15')
        .to('.intro-screen', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power4.inOut' }, '-=0.15')
        .to(chars, { yPercent: 0, duration: 1.1, stagger: 0.035, ease: 'expo.out' }, '-=0.55')
        .to(bits, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out', clearProps: 'transform,opacity' }, '-=0.8')
        .set('.intro-screen', { display: 'none' })
    }, root)
    return () => {
      ctx.revert()
      document.body.classList.remove('intro-lock')
      if (scroller.lenis) scroller.lenis.start()
    }
  }, [])

  /* ── scroll-driven reveals (re-run whenever the page view changes) ── */
  useEffect(() => {
    const reduce = prefersReducedMotion()
    const q = (sel) => gsap.utils.toArray(sel, root.current)
    const ctx = gsap.context(() => {
      if (!reduce) {
        q('[data-reveal]').forEach((el) => gsap.fromTo(el, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }))
        q('[data-split]').forEach((h) => gsap.from(h.querySelectorAll('.wi'), { yPercent: 115, duration: 1, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } }))
        q('[data-clip]').forEach((el) => gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power4.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }))
        q('[data-parallax]').forEach((el) => gsap.fromTo(el, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }))
        q('[data-stagger]').forEach((g) => gsap.from(g.children, { y: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: g, start: 'top 88%', once: true } }))
        const hero = root.current.querySelector('.hero')
        const stage = root.current.querySelector('.hero-stage')
        if (hero && stage) gsap.to(stage, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      }
      SECTIONS.forEach((id) => {
        const el = document.getElementById(id)
        if (el) ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) setCurrentLink(id) } })
      })
    }, root)
    ScrollTrigger.refresh()
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh())
    return () => ctx.revert()
  }, [active])

  /* ── animate project tiles when the filter changes ───────────── */
  useEffect(() => {
    if (prevFilter.current === filter) return
    prevFilter.current = filter
    if (prefersReducedMotion()) return
    gsap.fromTo(gsap.utils.toArray('.project-tile'), { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.09, ease: 'expo.out', clearProps: 'opacity,transform' })
    ScrollTrigger.refresh()
  }, [filter])

  /* ── scroll progress bar ─────────────────────────────────────── */
  useEffect(() => {
    const bar = document.querySelector('.scroll-progress span')
    if (!bar) return
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  /* ── page transition curtain ─────────────────────────────────── */
  const transition = useCallback((mid, { color = '#252720', label = '' } = {}) => {
    if (busy.current) return
    const run = () => { try { mid() } catch (err) { console.error(err) } scrollToTarget(0, { immediate: true }) }
    const el = curtain.current
    if (prefersReducedMotion() || !el) { run(); return }
    busy.current = true
    const lab = el.querySelector('.curtain-label')
    lab.textContent = label
    el.style.setProperty('--c', color)
    el.style.setProperty('--t', color === '#252720' ? '#eeeadd' : '#252720')
    gsap.timeline({ onComplete: () => { gsap.set(el, { display: 'none' }); busy.current = false } })
      .set(el, { display: 'grid', clipPath: 'inset(100% 0 0 0)' })
      .to(el, { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'power4.inOut' })
      .fromTo(lab, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }, '-=0.25')
      .add(run)
      .to(lab, { yPercent: -60, opacity: 0, duration: 0.45, ease: 'power3.in' }, '+=0.35')
      .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'power4.inOut' }, '-=0.2')
  }, [])

  const openProject = useCallback((p) => {
    transition(() => { setActive(p); history.pushState(null, '', `#project-${p.id}`) }, { color: p.color, label: `${p.no} — ${p.title}` })
  }, [transition])

  const closeProject = useCallback(() => {
    pending.current = pending.current || 'projects'
    transition(() => { setActive(null); history.replaceState(null, '', '#projects') }, { color: '#252720', label: 'Back to the portfolio' })
  }, [transition])

  const goTo = useCallback((id) => {
    setMenuOpen(false)
    if (activeRef.current) { pending.current = id; closeProject(); return }
    scrollToTarget(id === 'top' ? 0 : `#${id}`)
  }, [closeProject])

  const go = (id) => (e) => { e.preventDefault(); goTo(id) }

  /* title + deferred scroll after leaving a case file */
  useEffect(() => {
    document.title = active ? `${active.title} — Shubhnit` : BASE_TITLE
    if (active || !pending.current) return
    const id = pending.current
    pending.current = null
    const t = setTimeout(() => {
      ScrollTrigger.refresh()
      scrollToTarget(id === 'top' ? 0 : `#${id}`, { immediate: true })
    }, 80)
    return () => clearTimeout(t)
  }, [active])

  /* browser back / forward between portfolio and case files */
  useEffect(() => {
    const onPop = () => {
      const p = fromHash()
      setActive(p)
      if (p) scrollToTarget(0, { immediate: true })
      else pending.current = window.location.hash.slice(1) || 'top'
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  /* ── hidden terminal: ` key, Konami code, five taps on the logo ── */
  useEffect(() => {
    let i = 0
    const onKey = (e) => {
      if (e.key === 'Escape') { setTermOpen(false); setMenuOpen(false); return }
      const t = e.target
      if (t instanceof HTMLElement && (t.closest('input,textarea,select') || t.isContentEditable)) return
      if (e.key === '`' || e.key === '~' || e.code === 'Backquote') { e.preventDefault(); setTermOpen((o) => !o); return }
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      i = k === KONAMI[i] ? i + 1 : (k === KONAMI[0] ? 1 : 0)
      if (i === KONAMI.length) { i = 0; setTermOpen(true); setTimeout(() => burst(), 250) }
    }
    window.addEventListener('keydown', onKey)
    console.log('%cSS®%c  psst — press ` for a hidden terminal.', 'font:700 18px serif;color:#82978a', 'font:12px monospace;color:#77786d')
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('term-open', termOpen)
    if (!scroller.lenis) return
    if (termOpen) scroller.lenis.stop()
    else if (!document.body.classList.contains('intro-lock')) scroller.lenis.start()
  }, [termOpen])

  const onLogo = (e) => {
    e.preventDefault()
    const now = Date.now()
    taps.current.n = now - taps.current.t < 1500 ? taps.current.n + 1 : 1
    taps.current.t = now
    if (taps.current.n >= 5) { taps.current.n = 0; setTermOpen(true); return }
    goTo('top')
  }

  const terminalApi = useMemo(() => ({
    openProject,
    goTo,
    setAccent: (name) => document.documentElement.style.setProperty('--accent', ACCENTS[name] || ACCENTS.sage),
    spin: () => { sceneState.boost = 1 },
    party: () => burst(),
    glitch: () => glitch(),
  }), [openProject, goTo])

  const nextProject = active ? projects[(projects.findIndex((p) => p.id === active.id) + 1) % projects.length] : null

  return (
    <main ref={root}>
      <div className="scroll-progress" aria-hidden="true"><span /></div>
      <Cursor />
      <TouchGlass />
      <div className="curtain" ref={curtain} aria-hidden="true"><span className="curtain-label" /></div>

      <div className="intro-screen" aria-hidden="true">
        <div className="intro-top intro-meta"><span>SS® / DIGITAL PRACTICE</span><span>INDEPENDENT CREATIVE TECHNOLOGIST</span></div>
        <div className="intro-center">
          <div className="intro-mark">{['S', 'S', '®'].map((c, i) => <span className="mask" key={i}><span className={`ch ch${i}`}>{c}</span></span>)}</div>
          <p className="intro-tag">IDEAS BECOME INTERACTIONS.</p>
          <div className="boot-track"><i className="boot-line" /></div>
          <div className="boot-readout"><span>LOADING EXPERIENCE</span><span className="boot-num">000</span></div>
        </div>
        <div className="intro-bottom intro-meta"><span>WEBGL · 60 FPS · 2026</span><span>EST. 2026 — ALWAYS IN PROGRESS</span></div>
      </div>

      <div className="grain" />

      <header className="nav-wrap">
        <nav className="nav glass" aria-label="Primary">
          <a className="wordmark" href="#top" onClick={onLogo} data-cursor="HOME" aria-label="SS — home">SS<span>®</span></a>
          <div className={`nav-links${menuOpen ? ' open' : ''}`}>
            {NAV.map(([id, label]) => <a key={id} href={`#${id}`} data-target={id} onClick={go(id)}>{label}</a>)}
            <a className="nav-cta" href="#contact" data-target="contact" onClick={go('contact')}>CONTACT <ArrowUpRight size={13} /></a>
          </div>
          <span className="nav-status"><i /> AVAILABLE TO EXPLORE</span>
          <button className="menu-toggle" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </nav>
      </header>

      {active ? (
        <CasePage project={active} next={nextProject} onBack={closeProject} onOpen={openProject} />
      ) : (
        <>
          <Hero introDone={introDone} goTo={goTo} />
          <Marquee />
          <About />
          <Work />
          <Projects filter={filter} setFilter={setFilter} onOpen={openProject} />
          <Toolkit />
          <Contact />
        </>
      )}
      <Footer onTerminal={() => setTermOpen(true)} goTo={goTo} />
      <Terminal open={termOpen} onClose={() => setTermOpen(false)} api={terminalApi} />
    </main>
  )
}
