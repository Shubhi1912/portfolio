import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Plus, Terminal, Cpu, Box, Clapperboard, Gamepad2, Globe } from 'lucide-react'
import { Headline } from './SplitText'
import { ProjectArt } from './ProjectArt'
import { projects, models, toolkit } from '../data'
import { useClock } from '../lib/hooks'

const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`
const ICONS = { Terminal, Cpu, Box, Clapperboard, Gamepad2, Globe }
const FILTERS = ['ALL', 'CODE', 'VISUAL', 'INTERACTIVE']
const ModelViewer = lazy(() => import('./Models').then((module) => ({ default: module.ModelViewer })))

function DeferredModel({ model, index }) {
  const host = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = host.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { setNear(true); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); observer.disconnect() }
    }, { rootMargin: '80px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return <div ref={host} className="model-deferred">{near ? <Suspense fallback={<div className="model-fallback">PREPARING 3D VIEW</div>}><ModelViewer index={index} url={model.url} /></Suspense> : <div className="model-fallback">3D VIEW LOADS ON APPROACH</div>}</div>
}

export function About() {
  return (
    <section className="about-section" id="about">
      <div className="shell">
        <div className="about-head">
          <p className="eyebrow" data-reveal>01 / A LITTLE CONTEXT</p>
          <Headline text={'Curiosity is\nmy *operating system.*'} />
        </div>
        <div className="about-grid">
          <div className="about-visual">
            <div className="visual-notes">
              <div className="vn vn-a" data-clip><img data-parallax src={asset('creative-systems.svg')} alt="Abstract technical illustration connecting code, geometry and interactive systems" /></div>
              <div className="vn vn-b glass" data-clip><img data-parallax src={asset('spatial-blueprint.svg')} alt="Architectural blueprint-inspired illustration of a digital object and its geometry" /></div>
            </div>
            <span className="image-caption" data-reveal>A VISUAL NOTE FROM THE WORKSHOP</span>
          </div>
          <div className="about-copy" data-reveal>
            <p className="about-lead">I like making things that sit somewhere between useful and unexpected.</p>
            <p>I’m a student and aspiring developer with a multidisciplinary creative practice. Programming gives me a way to build systems; 3D and visual design let me shape spaces and objects; editing and game design help me think about timing, interaction and story.</p>
            <p>I’m learning by building: testing ideas, solving problems and connecting disciplines. This portfolio is a living record of that process.</p>
            <div className="principles">
              <div><b>01</b><span>THINK IN SYSTEMS</span><small>Break ideas into clear, workable parts.</small></div>
              <div><b>02</b><span>MAKE IT TANGIBLE</span><small>Turn abstract thoughts into prototypes.</small></div>
              <div><b>03</b><span>KEEP EXPERIMENTING</span><small>Learn through iteration and curiosity.</small></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Work({ onOpen }) {
  return (
    <section className="work-section shell" id="work">
      <div className="section-head">
        <div>
          <p className="eyebrow" data-reveal>02 / FORM & DIMENSION</p>
          <Headline text={'Small worlds.\n*Different angles.*'} />
        </div>
        <p data-reveal>Selected Blender work. Drag to rotate, pinch to zoom, or reset the view.</p>
      </div>
      <div className="model-grid">
        {models.map((m, i) => (
          <article className="model-card" key={m.type} data-reveal>
            <div className="model-top"><span>0{i + 1} / {String(models.length).padStart(2, '0')}</span><span>BLENDER — 3D WORK</span></div>
            <DeferredModel model={m} index={i} />
            <div className="model-info"><h3>{m.label}</h3><p>{m.note}</p><button type="button" onClick={() => onOpen(projects.find((p) => p.id === m.projectId))}>VIEW CASE STUDY ↗</button></div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Projects({ filter, setFilter, onOpen }) {
  const list = projects.filter((p) => filter === 'ALL' || p.group === filter)
  const total = String(projects.length).padStart(2, '0')
  return (
    <section className="projects-section" id="projects">
      <div className="shell">
        <div className="section-head">
          <div>
            <p className="eyebrow" data-reveal>03 / SELECTED WORK</p>
            <Headline text={'Ideas taking\n*shape.*'} />
          </div>
          <p data-reveal>Software, code and visual storytelling. Open a project to see its case file.</p>
        </div>
        <div className="project-filters glass-dark" role="group" aria-label="Filter projects" data-reveal>
          {FILTERS.map((f) => (
            <button key={f} className={filter === f ? 'filter-chip active' : 'filter-chip'} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="project-grid">
          {list.map((p) => (
            <button className={`project-tile ac-${p.accent} tilt fx-track`} key={p.id} onClick={() => onOpen(p)} data-cursor="OPEN">
              <div className="tile-top"><span>{p.no} / {total}</span><span>{p.status}</span></div>
              <div className="tile-art">
                <ProjectArt id={p.id} />
                <span className="tile-mark">{p.mark}</span>
                <span className="ph-badge glass">{p.modelUrl ? 'INTERACTIVE 3D' : 'PLACEHOLDER'}</span>
              </div>
              <div className="tile-bottom">
                <div><span className="tile-category">{p.category}</span><h3>{p.title}</h3><p>{p.subtitle}</p></div>
                <span className="tile-open"><ArrowUpRight size={18} /></span>
              </div>
            </button>
          ))}
        </div>
        <div className="archive-note" data-reveal>
          <span>THE ARCHIVE IS OPEN-ENDED.</span>
          <span>MORE EXPERIMENTS COMING <Plus size={14} /></span>
        </div>
      </div>
    </section>
  )
}

export function Toolkit() {
  return (
    <section className="toolkit-section shell" id="toolkit">
      <div className="section-head">
        <div>
          <p className="eyebrow" data-reveal>04 / CURRENT TOOLKIT</p>
          <Headline text={'Different tools.\n*Shared curiosity.*'} />
        </div>
        <p data-reveal>Tools and disciplines I use and keep exploring.</p>
      </div>
      <div className="toolkit-grid" data-stagger>
        {toolkit.map((t, i) => {
          const Icon = ICONS[t.icon]
          return (
            <div className="toolkit-item fx-track" key={t.name}>
              <Icon /><span>0{i + 1}</span><h3>{t.name}</h3><small>{t.tag}</small>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function Footer({ onTerminal, goTo }) {
  const time = useClock()
  return (
    <footer className="footer shell">
      <span>SS® — CREATIVE TECHNOLOGIST</span>
      <span className="footer-clock"><i /> INDIA {time} IST</span>
      <a href="#top" onClick={(e) => { e.preventDefault(); goTo('top') }}>BACK TO THE TOP ↑</a>
      <button className="footer-egg" onClick={onTerminal} aria-label="Open hidden terminal">psst — press ` or tap the logo 5×</button>
    </footer>
  )
}
