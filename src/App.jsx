import React, { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Environment, ContactShadows } from '@react-three/drei'
import { ArrowDownRight, ArrowUpRight, Code2, Clapperboard, Gamepad2, Box, Terminal, Sparkles, Asterisk, MoveUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const models = [
  { number: '01', title: 'ORBITAL / 01', category: 'BLENDER • SCI-FI', description: 'A study of scale, atmosphere and distant architecture.', year: '2026', type: 'orbital' },
  { number: '02', title: 'FORM STUDY / 02', category: 'BLENDER • ABSTRACT', description: 'An exploration of material, silhouette and studio light.', year: '2026', type: 'form' },
  { number: '03', title: 'KINETIC / 03', category: 'BLENDER • PRODUCT', description: 'A conceptual object built around rhythm and mechanical detail.', year: '2026', type: 'kinetic' }
]

const projects = [
  { icon: 'PY', type: 'python', title: 'PYTHON PROJECT', name: 'PROJECT NAME', text: 'A short description of what it does, the problem it solves and what you learned.', tag: 'PYTHON' },
  { icon: 'C', type: 'c', title: 'C PROJECT', name: 'PROJECT NAME', text: 'A short description of the program, its core logic and the concepts you explored.', tag: 'C' },
  { icon: '▶', type: 'video', title: 'VIDEO EDIT', name: 'VIDEO TITLE', text: 'A short breakdown of the edit: pacing, transitions, sound design or visual style.', tag: 'VIDEO' },
  { icon: '✦', type: 'game', title: 'GAME DESIGN', name: 'GAME TITLE', text: 'A short introduction to the gameplay, mechanics, tools and your role in it.', tag: 'GAME' }
]

function Model({ type }) {
  return (
    <group>
      {type === 'orbital' && (
        <>
          <mesh>
            <icosahedronGeometry args={[1, 2]} />
            <meshStandardMaterial
              color="#7189a8"
              metalness={0.8}
              roughness={0.3}
              wireframe
            />
          </mesh>

          <mesh rotation={[0.7, 0.3, 0]}>
            <torusGeometry args={[1.35, 0.025, 16, 100]} />
            <meshStandardMaterial color="#d5a75f" metalness={0.8} />
          </mesh>
        </>
      )}

      {type === 'form' && (
        <>
          <mesh rotation={[0.5, 0.5, 0.2]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#b58a72"
              metalness={0.5}
              roughness={0.35}
            />
          </mesh>

          <mesh rotation={[0.5, 0.5, 0]}>
            <torusGeometry args={[1.3, 0.035, 16, 100]} />
            <meshStandardMaterial color="#7189a8" />
          </mesh>
        </>
      )}

      {type === 'kinetic' && (
        <>
          <mesh rotation={[0.5, 0.5, 0]}>
            <torusKnotGeometry args={[0.75, 0.22, 120, 16]} />
            <meshStandardMaterial
              color="#9a86b5"
              metalness={0.75}
              roughness={0.25}
            />
          </mesh>

          <mesh position={[0, 0, 0.8]}>
            <sphereGeometry args={[0.18, 32, 32]} />
            <meshStandardMaterial
              color="#e1bd79"
              metalness={0.7}
            />
          </mesh>
        </>
      )}
    </group>
  )
}

function ModelViewer({ type }) {
  return <div className="model-viewer">
    <div className="viewer-label"><span className="live-dot" /> INTERACTIVE OBJECT</div>
    <Canvas camera={{ position: [0, 0, 4.3], fov: 42 }} dpr={[1, 1.7]}>
      <ambientLight intensity={1.2} /><directionalLight position={[3, 4, 5]} intensity={2.1} />
      <pointLight position={[-3, -2, -2]} intensity={1.1} color="#9caed0" />
      <Float speed={1.15} rotationIntensity={0.12} floatIntensity={0.22}><Model type={type} /></Float>
      <ContactShadows position={[0, -1.45, 0]} opacity={0.25} scale={5} blur={2.5} />
      <Environment preset="city" /><OrbitControls enablePan={false} minDistance={3} maxDistance={6} />
    </Canvas>
    <div className="drag-hint">↔ DRAG OR SWIPE TO EXPLORE</div><div className="viewer-index">3D / WEBGL</div>
  </div>
}

function App() {
  const root = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.nav, .hero-copy, .hero-visual', { y: 28, opacity: 0, duration: 0.9, stagger: 0.13, ease: 'power3.out' })
      gsap.utils.toArray('.reveal').forEach(el => gsap.fromTo(el, { y: 34, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 87%', once: true }
      }))
    }, root)
    return () => ctx.revert()
  }, [])

  return <main ref={root}>
    <div className="grain" />
    <nav className="nav shell">
      <a className="wordmark" href="#top">SS<span>®</span></a>
      <div className="nav-links">
        <a href="#top">HOME</a><a href="#about">ABOUT</a><a href="#work">3D MODELS</a><a href="#projects">PROJECTS</a><a href="#skills">SKILLS</a><a href="#contact">CONTACT <ArrowUpRight size={13} /></a>
      </div>
      <div className="availability"><i /> BUILDING / LEARNING / CREATING</div>
    </nav>

    <section className="hero shell" id="top">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-line" /> DEVELOPER • 3D ARTIST • CREATIVE MAKER</p>
        <h1>Hello, I’m<br /><em>Shubhnit Singhal.</em><span className="period">✳</span></h1>
        <p className="hero-intro">I build with code, shape ideas in 3D, edit stories into motion and experiment with games.</p>
        <p className="hero-sub">Python & C development / Blender 3D / Video editing / Game design</p>
        <div className="hero-cta"><a className="button button-dark" href="#projects">EXPLORE MY WORK <ArrowDownRight size={16} /></a><span className="hero-note">A WORK IN PROGRESS — ALWAYS.</span></div>
        <div className="hero-badges"><span><Code2 /> CODE</span><span><Box /> 3D ART</span><span><Clapperboard /> VIDEO</span><span><Gamepad2 /> GAMES</span></div>
      </div>
      <div className="hero-visual">
        <img
          src={`${import.meta.env.BASE_URL}images/retro-workstation.png`}
          alt="Illustrated retro computer workstation and creative desk"
        />
        <div className="hero-sticker sticker-top">IDEAS<br />IN PROGRESS ✳</div>
        <div className="hero-sticker sticker-bottom">SS / DIGITAL<br />WORKSHOP — 2026</div>
        <span className="hero-visual-caption">FIG. 001 — THE CREATIVE WORKBENCH</span>
      </div>
      <div className="hero-bottom"><span>PORTFOLIO / 2026</span><span>CODE • DESIGN • MOTION • PLAY</span><span>SCROLL ↓</span></div>
    </section>

    <div className="ticker"><div className="ticker-track">{Array.from({ length: 4 }).map((_, i) => <span key={i}>PYTHON DEVELOPMENT <Asterisk /> C PROGRAMMING <Asterisk /> BLENDER 3D <Asterisk /> VIDEO EDITING <Asterisk /> GAME DESIGN <Asterisk /></span>)}</div></div>

    <section className="about-section" id="about">
      <div className="shell about-grid">
        <div className="about-heading reveal"><p className="eyebrow"><span className="eyebrow-line" /> ABOUT THE MAKER / 001</p><h2>Many tools.<br /><em>One curious mind.</em></h2>
          <div className="about-image"><img
            src={`${import.meta.env.BASE_URL}images/retro-creative-collage.png`}
            alt="Retro-inspired collage of creative tools, computers and illustrations"
          /><span>THE STUDIO / A VISUAL MOODBOARD</span></div>
        </div>
        <div className="about-copy reveal">
          <p className="about-lead">I’m Shubhnit — a student, developer and creative enthusiast who enjoys turning ideas into things people can use, explore and experience.</p>
          <p>My work moves between programming and visual creativity. I build projects with Python and C, create 3D scenes in Blender, edit videos, and explore game design. Each discipline teaches me a different way to solve problems: code brings structure, design brings clarity, and storytelling gives ideas character.</p>
          <p>I’m still learning, experimenting and building my portfolio one project at a time. I value thoughtful work, curiosity and steady improvement — and I’m excited to keep exploring what I can create next.</p>
          <div className="about-facts">
            <div><b>01</b><span>BUILD</span><small>Useful software & experiments</small></div>
            <div><b>02</b><span>CREATE</span><small>Visuals, models & moving images</small></div>
            <div><b>03</b><span>PLAY</span><small>Game ideas & interactive worlds</small></div>
          </div>
          <div className="skill-tags"><span>PYTHON</span><span>C</span><span>BLENDER</span><span>VIDEO EDITING</span><span>GAME DESIGN</span><span>ALWAYS LEARNING</span></div>
        </div>
        <div className="about-foot"><span>NO PORTRAIT — LET THE WORK SPEAK.</span><span>INDEPENDENT / ALWAYS LEARNING</span></div>
      </div>
    </section>

    <section className="work-section shell" id="work">
      <div className="section-heading reveal"><div><p className="eyebrow"><span className="eyebrow-line" /> 3D GALLERY / 001—003</p><h2>Objects in <em>orbit.</em></h2></div><p className="section-aside">Three featured Blender studies.<br />Drag, rotate and explore.</p></div>
      <div className="project-list">{models.map(m => <article className="project-card reveal" key={m.number}>
        <div className="project-meta"><span>{m.number} / 03</span><span>{m.category}</span></div>
        <ModelViewer type={m.type} />
        <div className="project-info"><div><h3>{m.title}</h3><p>{m.description}</p></div><span className="project-year">{m.year}</span></div>
      </article>)}</div>
      <div className="coming-soon reveal"><div className="coming-symbol"><Sparkles size={23} /></div><div><p className="eyebrow">MORE IN THE WORKSHOP</p><h3>New models are <em>loading.</em></h3><p>More environments, characters and product concepts will be added here.</p></div><span className="loading-bars"><i /><i /><i /><i /><i /></span></div>
    </section>

    <section className="projects-section" id="projects"><div className="shell">
      <div className="section-heading reveal"><div><p className="eyebrow"><span className="eyebrow-line" /> PROJECT ARCHIVE / 002</p><h2>Built, cut & <em>played.</em></h2></div><p className="section-aside">A growing archive across<br />code, motion and games.</p></div>
      <div className="project-grid">{projects.map((p, i) => <article className="work-tile reveal" key={p.type}>
        <div className={`tile-art ${p.type}`}><span className="tile-icon">{p.icon}</span><span className="tile-number">0{i + 1}</span><span className="tile-doodle">✳</span></div>
        <div className="tile-content"><div className="tile-type">{p.title}<span>{p.tag}</span></div><h3>{p.name}</h3><p>{p.text}</p><a href="#contact">PROJECT DETAILS <ArrowUpRight size={13} /></a></div>
      </article>)}
        <article className="work-tile more-tile reveal"><div className="more-art"><Sparkles size={35} /><span>IN THE MAKING</span></div><div className="tile-content"><div className="tile-type">NEXT RELEASE <span>SOON</span></div><h3>More projects coming.</h3><p>New code experiments, edits and playable ideas will appear here.</p><a href="#contact">CHECK BACK SOON <ArrowUpRight size={13} /></a></div></article></div>
    </div></section>

    <section className="skills-section shell" id="skills">
      <div className="skills-heading reveal"><p className="eyebrow"><span className="eyebrow-line" /> THE TOOLBOX / 003</p><h2>Tools of the <em>trade.</em></h2><p>Technologies and creative tools I use, practise and continue to explore.</p></div>
      <div className="tool-grid reveal">
        <div><span className="tool-symbol python">Py</span><b>Python</b><small>Programming</small></div>
        <div><span className="tool-symbol clang">C</span><b>C</b><small>Programming</small></div>
        <div><span className="tool-symbol blender">✿</span><b>Blender</b><small>3D creation</small></div>
        <div><span className="tool-symbol video">▶</span><b>Video editing</b><small>Post-production</small></div>
        <div><span className="tool-symbol game">✦</span><b>Game design</b><small>Interactive ideas</small></div>
        <div><span className="tool-symbol web">JS</span><b>Web basics</b><small>HTML / CSS / JS</small></div>
      </div>
    </section>

    <section className="contact-section shell" id="contact"><div className="contact-card reveal">
      <div className="contact-top"><span>HAVE AN IDEA OR A PROJECT?</span><span>LET’S MAKE SOMETHING MEANINGFUL ↗</span></div>
      <p className="eyebrow"><span className="eyebrow-line" /> OPEN FOR CONVERSATION</p><h2>Let’s make<br /><em>something great.</em></h2>
      <a className="contact-link" href="mailto:YOUR.EMAIL@example.com">YOUR.EMAIL@example.com <MoveUpRight size={19} /></a>
      <div className="contact-bottom"><span>NEW DELHI, INDIA</span><span>© 2026 SHUBHNIT SINGHAL</span><span>BUILT WITH CURIOSITY <Asterisk size={14} /></span></div>
    </div></section>
    <footer className="footer shell"><span>SS® — DIGITAL WORKSHOP</span><a href="#top">BACK TO TOP ↑</a><span>DESIGNED TO EXPLORE.</span></footer>
  </main>
}
export default App
