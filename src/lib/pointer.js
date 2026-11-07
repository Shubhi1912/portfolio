import gsap from 'gsap'

// Shared, mutable state read by the cursor, the hero scene and the kinetic type.
export const pointer = { x: 0, y: 0, nx: 0, ny: 0, vx: 0, vy: 0, down: false, type: 'mouse' }
export const sceneState = { boost: 0 }
export const scroller = { lenis: null }

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Scrolls through Lenis when it is running, natively otherwise.
export function scrollToTarget(target, opts = {}) {
  const isNum = typeof target === 'number'
  const el = isNum ? null : (typeof target === 'string' ? document.querySelector(target) : target)
  if (!isNum && !el) return
  const { lenis } = scroller
  if (lenis) {
    lenis.scrollTo(isNum ? target : el, { offset: isNum ? 0 : -84, duration: 1.4, ...opts })
  } else if (isNum) {
    window.scrollTo({ top: target, behavior: opts.immediate ? 'instant' : 'smooth' })
  } else {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: opts.immediate ? 'instant' : 'smooth' })
  }
}

// One delegated listener drives: pointer physics, glass spotlight (.fx-track),
// 3D tilt (.tilt) and magnetic buttons (.magnetic). No per-element listeners to rebind.
export function installPointerFx() {
  pointer.x = window.innerWidth / 2
  pointer.y = window.innerHeight / 2
  let lastX = pointer.x, lastY = pointer.y
  let tiltEl = null, magnetEl = null

  const velocity = () => {
    pointer.vx += ((pointer.x - lastX) - pointer.vx) * 0.22
    pointer.vy += ((pointer.y - lastY) - pointer.vy) * 0.22
    lastX = pointer.x
    lastY = pointer.y
  }
  gsap.ticker.add(velocity)

  const resetTilt = (el) => { if (el) { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg') } }
  const resetMagnet = (el) => { if (el) el.style.transform = '' }

  const onMove = (e) => {
    pointer.x = e.clientX
    pointer.y = e.clientY
    pointer.nx = (e.clientX / window.innerWidth) * 2 - 1
    pointer.ny = -((e.clientY / window.innerHeight) * 2 - 1)
    pointer.type = e.pointerType
    const t = e.target instanceof Element ? e.target : null
    const mouse = e.pointerType === 'mouse'

    const track = t && t.closest('.fx-track')
    if (track) {
      const r = track.getBoundingClientRect()
      track.style.setProperty('--mx', `${e.clientX - r.left}px`)
      track.style.setProperty('--my', `${e.clientY - r.top}px`)
    }

    const tl = mouse && t ? t.closest('.tilt') : null
    if (tiltEl && tiltEl !== tl) resetTilt(tiltEl)
    if (tl) {
      const r = tl.getBoundingClientRect()
      const dx = (e.clientX - r.left) / r.width - 0.5
      const dy = (e.clientY - r.top) / r.height - 0.5
      tl.style.setProperty('--ry', `${(dx * 8).toFixed(2)}deg`)
      tl.style.setProperty('--rx', `${(-dy * 8).toFixed(2)}deg`)
    }
    tiltEl = tl

    const mg = mouse && t ? t.closest('.magnetic') : null
    if (magnetEl && magnetEl !== mg) resetMagnet(magnetEl)
    if (mg) {
      const r = mg.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      mg.style.transform = `translate3d(${(dx * 0.16).toFixed(1)}px,${(dy * 0.22).toFixed(1)}px,0)`
    }
    magnetEl = mg
  }
  const onDown = (e) => { pointer.down = true; onMove(e) }
  const onUp = () => { pointer.down = false }
  const onLeave = () => { resetTilt(tiltEl); resetMagnet(magnetEl); tiltEl = magnetEl = null }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  window.addEventListener('pointerup', onUp, { passive: true })
  window.addEventListener('pointercancel', onUp, { passive: true })
  document.documentElement.addEventListener('mouseleave', onLeave)

  return () => {
    gsap.ticker.remove(velocity)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
    document.documentElement.removeEventListener('mouseleave', onLeave)
  }
}
