import React, { useRef, useState } from 'react'
import { Check, Copy, Send } from 'lucide-react'
import gsap from 'gsap'
import { Headline } from './SplitText'
import { EMAIL, SOCIALS } from '../data'

const TYPES = ['Website', 'App / tool', '3D / visual', 'Video edit', 'Game concept', 'Something else']
const TIMES = ['Flexible', 'Within a month', '2–3 months']

export function Contact() {
  const [types, setTypes] = useState([])
  const [timeline, setTimeline] = useState(TIMES[0])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)

  const toggle = (t) => setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))

  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL) }
    catch {
      const ta = document.createElement('textarea')
      ta.value = EMAIL; ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy') } catch { /* ignore */ }
      ta.remove()
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1800)
    gsap.fromTo('.copy-btn', { scale: 0.92 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1,0.5)' })
  }

  // No backend needed: the brief is composed into a ready-to-send email.
  const compose = (e) => {
    e.preventDefault()
    const lines = [
      'Hi Shubhnit,', '', 'I’d like to talk about a project.', '',
      `Type: ${types.length ? types.join(', ') : 'Not sure yet'}`,
      `Timeline: ${timeline}`, '',
      message.trim() || '(Add a few lines about the idea here.)', '',
      name.trim() ? `— ${name.trim()}` : '',
    ]
    const subject = `Project enquiry${types.length ? ` — ${types.join(' / ')}` : ''}`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
  }

  const socials = SOCIALS.filter((s) => s.href)

  return (
    <section className="contact-section shell" id="contact">
      <div className="contact-card glass-dark fx-track">
        <div className="contact-bg" aria-hidden="true"><i className="blob b1" /><i className="blob b2" /><i className="blob b3" /><span className="contact-ghost">SS®</span></div>

        <div className="contact-meta">
          <span>05 / OPEN CHANNEL</span>
          <span className="live-pill glass-dark"><i /> OPEN TO COLLABORATE</span>
        </div>

        <p className="eyebrow">HAVE SOMETHING INTERESTING IN MIND?</p>
        <Headline text={'Let’s make\n*something matter.*'} as="h2" className="contact-title" />

        <div className="contact-grid">
          <div className="contact-main" data-reveal>
            <p className="contact-copy">For a conversation, a collaboration or a client project. Write directly, or sketch the brief and I’ll prepare the email.</p>
            <a className="mail-big magnetic" href={`mailto:${EMAIL}`} data-cursor="WRITE" aria-label={`Email ${EMAIL}`}>
              {[...EMAIL].map((ch, i) => <span key={i} aria-hidden="true">{ch}</span>)}
            </a>
            <div className="contact-actions">
              <button className="copy-btn glass-dark" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'COPIED' : 'COPY EMAIL'}</button>
              {socials.map((s) => <a key={s.label} className="social-chip glass-dark" href={s.href} target="_blank" rel="noreferrer">{s.label.toUpperCase()}</a>)}
            </div>
            <ul className="contact-notes">
              <li><b>Replies</b><span>Every genuine message gets an answer.</span></li>
              <li><b>Good fits</b><span>Websites, interactive pieces, 3D, video edits, game ideas.</span></li>
            </ul>
          </div>

          <form className="brief glass-dark" onSubmit={compose} data-reveal>
            <h3>Start a project</h3>
            <fieldset>
              <legend>What are we making?</legend>
              <div className="chip-row">
                {TYPES.map((t) => <button type="button" key={t} className={types.includes(t) ? 'chip on' : 'chip'} aria-pressed={types.includes(t)} onClick={() => toggle(t)}>{t}</button>)}
              </div>
            </fieldset>
            <fieldset>
              <legend>Timeline</legend>
              <div className="chip-row">
                {TIMES.map((t) => <button type="button" key={t} className={timeline === t ? 'chip on' : 'chip'} aria-pressed={timeline === t} onClick={() => setTimeline(t)}>{t}</button>)}
              </div>
            </fieldset>
            <label><span>Your name</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" /></label>
            <label><span>The idea</span><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="A few lines about what you have in mind…" /></label>
            <button className="send-btn magnetic" type="submit"><Send size={16} /> WRITE THE EMAIL</button>
            <small>Opens your email app with this brief filled in. Nothing is stored or sent from this page.</small>
          </form>
        </div>

        <div className="contact-foot">
          <span>SS® / DIGITAL PRACTICE</span>
          <span>© 2026 SHUBHNIT SINGHAL</span>
          <span>BUILT WITH CURIOSITY</span>
        </div>
      </div>
    </section>
  )
}
