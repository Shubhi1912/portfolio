import gsap from 'gsap'
import { prefersReducedMotion } from './pointer'

const GLYPHS = ['✳', '+', '®', '◆', '●']
const COLORS = ['#82978a', '#c88767', '#9eafbd', '#252720']

// Terminal / Konami easter egg: a burst of editorial glyphs.
export function burst(x = window.innerWidth / 2, y = window.innerHeight / 2, n = 44) {
  if (prefersReducedMotion()) return
  const wrap = document.createElement('div')
  wrap.className = 'burst'
  document.body.appendChild(wrap)
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span')
    s.textContent = GLYPHS[i % GLYPHS.length]
    s.style.left = `${x}px`
    s.style.top = `${y}px`
    s.style.fontSize = `${14 + Math.random() * 26}px`
    s.style.color = COLORS[i % COLORS.length]
    wrap.appendChild(s)
    const a = Math.random() * Math.PI * 2
    const d = 140 + Math.random() * 340
    gsap.fromTo(s, { x: 0, y: 0, scale: 0.2, rotation: 0, opacity: 1 }, {
      x: Math.cos(a) * d, y: Math.sin(a) * d + 140, scale: 1, rotation: (Math.random() - 0.5) * 540,
      opacity: 0, duration: 1.6 + Math.random() * 0.8, ease: 'power3.out',
    })
  }
  gsap.delayedCall(2.8, () => wrap.remove())
}

export function glitch() {
  document.body.classList.add('glitch')
  setTimeout(() => document.body.classList.remove('glitch'), 1100)
}
