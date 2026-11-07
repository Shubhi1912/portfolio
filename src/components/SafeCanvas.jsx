import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'

// Detect WebGL once. If it is missing (or a scene throws), we show a graceful fallback
// instead of crashing the whole page.
let webglOk
function hasWebGL() {
  if (webglOk !== undefined) return webglOk
  try {
    const c = document.createElement('canvas')
    webglOk = !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { webglOk = false }
  return webglOk
}

class Boundary extends React.Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err) { console.warn('[3D disabled]', err) }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

export function SafeCanvas({ fallback = null, children, ...canvasProps }) {
  if (!hasWebGL()) return fallback
  return (
    <Boundary fallback={fallback}>
      <Canvas {...canvasProps}>{children}</Canvas>
    </Boundary>
  )
}

// Procedural studio lighting — no HDR download, so nothing can fail on GitHub Pages.
export function StudioEnv() {
  return (
    <Environment resolution={128} frames={1}>
      <Lightformer form="rect" intensity={2.6} position={[0, 4, -4]} scale={[12, 4, 1]} color="#fff4e0" target={[0, 0, 0]} />
      <Lightformer form="ring" intensity={3.2} position={[-4, 1, 2]} scale={4} color="#c88767" target={[0, 0, 0]} />
      <Lightformer form="circle" intensity={2.2} position={[4, -1, 3]} scale={3} color="#9eafbd" target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.3} position={[0, -4, 3]} scale={[10, 2, 1]} color="#a9b9ae" target={[0, 0, 0]} />
    </Environment>
  )
}
