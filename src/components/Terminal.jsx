import React, { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { projects, toolkit, EMAIL, ACCENTS, SECTIONS } from '../data'

const HELP = [
  ['help', 'show this list'],
  ['about', 'who is behind this site'],
  ['ls', 'list the project case files'],
  ['open <id>', 'open a case file (python, c, motion, game)'],
  ['skills', 'print the toolkit'],
  ['contact', 'print the email address'],
  ['goto <section>', 'jump to ' + SECTIONS.join(' · ')],
  ['theme <name>', 'sage · clay · slate · lilac · reset'],
  ['spin', 'wake up the orb'],
  ['party', 'little celebration'],
  ['glitch', 'break the page, briefly'],
  ['date', 'local time in India'],
  ['clear / exit', 'wipe the screen / close'],
]
const NAMES = ['help', 'about', 'whoami', 'ls', 'open', 'skills', 'contact', 'goto', 'theme', 'spin', 'party', 'glitch', 'date', 'echo', 'clear', 'exit', 'sudo', 'secret']
const CHIPS = ['help', 'ls', 'about', 'spin', 'party', 'theme clay']

let uid = 0
const line = (kind, text) => ({ id: ++uid, kind, text })

export function Terminal({ open, onClose, api }) {
  const [lines, setLines] = useState(() => [
    line('sys', 'SS® terminal 1.0 — you found it.'),
    line('sys', 'Type "help", or tap a shortcut below.'),
  ])
  const [value, setValue] = useState('')
  const history = useRef([])
  const cursor = useRef(-1)
  const input = useRef(null)
  const scroller = useRef(null)

  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => input.current && input.current.focus({ preventScroll: true }), 80)
    return () => clearTimeout(id)
  }, [open])

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight
  }, [lines, open])

  const print = (...rows) => setLines((cur) => [...cur, ...rows.map((r) => (typeof r === 'string' ? line('out', r) : r))].slice(-200))

  const run = (raw) => {
    const text = raw.trim()
    if (!text) return
    history.current.push(text)
    cursor.current = history.current.length
    const [cmd, ...args] = text.split(/\s+/)
    const arg = args.join(' ').toLowerCase()
    const echo = line('in', text)

    switch (cmd.toLowerCase()) {
      case 'help':
        print(echo, ...HELP.map(([c, d]) => `  ${c.padEnd(16)}${d}`))
        break
      case 'about':
      case 'whoami':
        print(echo, 'Shubhnit — creative technologist.', 'Student and aspiring developer working across code, 3D, video and game design.', 'Learning by building. This site is the lab notebook.')
        break
      case 'ls':
      case 'projects':
        print(echo, ...projects.map((p) => `  ${p.no}  ${p.id.padEnd(8)} ${p.title}`))
        break
      case 'open': {
        const p = projects.find((x) => x.id === arg || x.no === arg)
        if (!p) { print(echo, line('err', `no such case file: "${arg || ''}" — try "ls"`)); break }
        print(echo, `opening ${p.title}…`)
        setTimeout(() => { onClose(); api.openProject(p) }, 350)
        break
      }
      case 'skills':
        print(echo, ...toolkit.map((t, i) => `  0${i + 1}  ${t.name.padEnd(12)} ${t.tag}`))
        break
      case 'contact':
        print(echo, `  ${EMAIL}`, '  (or use the project brief at the bottom of the page)')
        break
      case 'goto': {
        const id = arg === 'top' || SECTIONS.includes(arg) ? arg : null
        if (!id) { print(echo, line('err', `unknown section — try: top, ${SECTIONS.join(', ')}`)); break }
        print(echo, `scrolling to ${id}…`)
        setTimeout(() => { onClose(); api.goTo(id) }, 300)
        break
      }
      case 'theme': {
        if (arg === 'reset') { api.setAccent('sage'); print(echo, 'accent reset to sage.'); break }
        if (!ACCENTS[arg]) { print(echo, line('err', `themes: ${Object.keys(ACCENTS).join(', ')}, reset`)); break }
        api.setAccent(arg)
        print(echo, `accent → ${arg}`)
        break
      }
      case 'spin':
        api.spin()
        print(echo, 'spinning up the orb. close this window to watch it.')
        break
      case 'party':
        api.party()
        print(echo, '✳ + ® ◆ ●')
        break
      case 'glitch':
        api.glitch()
        print(echo, 'ƒ̷a̷u̷l̷t̷ ̷s̷i̷m̷u̷l̷a̷t̷e̷d̷ — nothing was harmed.')
        break
      case 'date':
        print(echo, new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' }).format(new Date()) + ' IST')
        break
      case 'echo':
        print(echo, args.join(' '))
        break
      case 'sudo':
        print(echo, line('err', 'permission denied: you are a visitor — a welcome one.'))
        break
      case 'secret':
        print(echo, 'The best interfaces feel like they were already waiting for you.')
        break
      case 'clear':
        setLines([])
        break
      case 'exit':
      case 'quit':
        onClose()
        break
      default:
        print(echo, line('err', `command not found: ${cmd} — try "help"`))
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); run(value); setValue('') }
    else if (e.key === 'Escape' || e.key === '`') { e.preventDefault(); onClose() }
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.current.length) return
      cursor.current = Math.max(0, cursor.current - 1)
      setValue(history.current[cursor.current] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      cursor.current = Math.min(history.current.length, cursor.current + 1)
      setValue(history.current[cursor.current] || '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const hit = NAMES.filter((n) => n.startsWith(value.toLowerCase()))
      if (value && hit.length === 1) setValue(hit[0] + ' ')
    } else if (e.key.toLowerCase() === 'l' && e.ctrlKey) { e.preventDefault(); setLines([]) }
  }

  return (
    <div className={open ? 'term-layer open' : 'term-layer'} aria-hidden={!open} onPointerDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="term glass-dark" role="dialog" aria-modal="true" aria-label="Hidden terminal">
        <div className="term-bar">
          <span className="dots"><i /><i /><i /></span>
          <span className="term-title">ss — visitor@portfolio</span>
          <button className="term-close" onClick={onClose} aria-label="Close terminal"><X size={14} /></button>
        </div>
        <div className="term-out" ref={scroller} data-lenis-prevent>
          {lines.map((l) => <p key={l.id} className={`t-${l.kind}`}>{l.kind === 'in' ? <><b>›</b> {l.text}</> : l.text}</p>)}
        </div>
        <div className="term-chips" data-lenis-prevent>
          {CHIPS.map((c) => <button key={c} type="button" onClick={() => run(c)}>{c}</button>)}
        </div>
        <label className="term-in">
          <b>›</b>
          <input
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            enterKeyHint="go"
            placeholder="type a command"
            aria-label="Terminal command"
          />
        </label>
      </div>
    </div>
  )
}
