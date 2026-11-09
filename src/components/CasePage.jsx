import React, { lazy, Suspense } from 'react'
import { ArrowLeft, ArrowUpRight, Github, Play } from 'lucide-react'
import { Headline } from './SplitText'
import { ProjectArt } from './ProjectArt'
import { processSteps } from '../data'

const ModelViewer = lazy(() => import('./Models').then((module) => ({ default: module.ModelViewer })))

export function CasePage({ project, next, onBack, onOpen }) {
  const { source, demo } = project.links || {}
  return (
    <section className="case-page shell">
      <button className="back-link glass" onClick={onBack} data-cursor="BACK"><ArrowLeft size={16} /> BACK TO PORTFOLIO</button>

      <div className={`case-hero ac-${project.accent}`}>
        <div className="case-top"><span>{project.no} / CASE FILE</span><span>{project.category}</span></div>
        <div className="case-symbol">{project.mark}</div>
        <div className="case-titles">
          <Headline as="h1" text={project.title} className="case-title" />
          <p>{project.subtitle}</p>
        </div>
      </div>

      <dl className="case-facts" data-reveal>
        <div><dt>STATUS</dt><dd>{project.status}</dd></div>
        <div><dt>DISCIPLINE</dt><dd>{project.category}</dd></div>
        <div><dt>TOOLS</dt><dd>{project.stack.join(' · ')}</dd></div>
        <div><dt>YEAR</dt><dd>2026</dd></div>
      </dl>

      <div className="case-body">
        <div><p className="eyebrow">OVERVIEW</p><Headline text={'Making the idea\n*real.*'} /></div>
        <div data-reveal>
          <p>{project.description}</p>
          <div className="case-links">
            {source ? <a className="button button-dark magnetic" href={source} target="_blank" rel="noreferrer"><Github size={15} /> VIEW SOURCE</a> : <span className="button button-off" title="Add a URL in src/data.js"><Github size={15} /> SOURCE · COMING SOON</span>}
            {demo ? <a className="button button-glass magnetic" href={demo} target="_blank" rel="noreferrer"><Play size={15} /> OPEN DEMO</a> : <span className="button button-off" title="Add a URL in src/data.js"><Play size={15} /> DEMO · COMING SOON</span>}
          </div>
        </div>
      </div>

      <div className="case-gallery">
        {project.modelUrl && <figure className="case-model-panel" data-clip><div className="case-model-caption">INTERACTIVE MODEL · DRAG TO ROTATE · PINCH TO ZOOM</div><Suspense fallback={<div className="case-model-loading">PREPARING 3D VIEW</div>}><ModelViewer url={project.modelUrl} index={0} /></Suspense><figcaption>{project.title} — interactive 3D view</figcaption></figure>}
        {!project.modelUrl && <><figure className={`g-main ac-${project.accent} tilt fx-track`} data-clip>
          <ProjectArt id={project.id} large />
          <figcaption className="glass">PLACEHOLDER · REPLACE WITH A SCREENSHOT</figcaption>
        </figure>
        <figure className="g-ph tilt fx-track" data-clip><span>DROP IN A SCREENSHOT</span><small>02</small></figure>
        <figure className="g-ph wide tilt fx-track" data-clip><span>DEMO CLIP OR PROCESS SKETCH</span><small>03</small></figure></>}
      </div>

      <div className="case-process">
        <p className="eyebrow" data-reveal>HOW IT CAME TOGETHER</p>
        <ol>
          {processSteps.map((s, i) => (
            <li key={s.k} data-reveal>
              <b>0{i + 1}</b>
              <h3>{s.k}</h3>
              {project.notes && project.notes[s.k] ? <p>{project.notes[s.k]}</p> : <p className="prompt">{s.q}<em> Add your notes in src/data.js.</em></p>}
            </li>
          ))}
        </ol>
      </div>

      <button className={`case-next ac-${next.accent}`} onClick={() => onOpen(next)} data-cursor="NEXT">
        <span>NEXT CASE FILE · {next.no}</span>
        <strong>{next.title}</strong>
        <ArrowUpRight size={28} />
      </button>
    </section>
  )
}
