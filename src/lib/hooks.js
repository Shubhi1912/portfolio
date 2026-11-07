import { useEffect, useState } from 'react'

// True while the element is on (or near) the screen. Used to pause WebGL when off-screen.
export function useInView(ref, margin = '0px') {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
  return visible
}

// Live HH:MM clock for a time zone (defaults to India).
export function useClock(timeZone = 'Asia/Kolkata') {
  const read = () => new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
  const [time, setTime] = useState(read)
  useEffect(() => {
    const id = setInterval(() => setTime(read()), 15000)
    return () => clearInterval(id)
  }, [])
  return time
}
