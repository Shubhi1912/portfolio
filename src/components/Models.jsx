import React, { Suspense, useMemo, useRef, useState } from 'react'
import { Box3, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { Float, OrbitControls, useGLTF } from '@react-three/drei'
import { RotateCcw } from 'lucide-react'
import { SafeCanvas, StudioEnv } from './SafeCanvas'
import { useInView } from '../lib/hooks'

const SAGE = '#a9b9ae', CLAY = '#c88767', SLATE = '#829ca8', CREAM = '#e8d8b8'
useGLTF.setDecoderPath(`${import.meta.env.BASE_URL}draco/`)

// Slow spin + a gentle lean toward the pointer.
function Spin({ children, speed = 0.13 }) {
  const g = useRef()
  useFrame((s, d) => {
    if (!g.current) return
    g.current.rotation.y += d * speed
    g.current.rotation.x += (-s.pointer.y * 0.35 - g.current.rotation.x) * Math.min(1, d * 3)
  })
  return <group ref={g}>{children}</group>
}

function GLBModel({ url, interacted, spinRef }) {
  const { scene } = useGLTF(url)
  const model = useMemo(() => {
    const copy = scene.clone(true)
    const bounds = new Box3().setFromObject(copy)
    const size = bounds.getSize(new Vector3())
    const center = bounds.getCenter(new Vector3())
    const scale = 2.55 / Math.max(size.x, size.y, size.z, 0.001)
    copy.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
    copy.scale.setScalar(scale)
    return copy
  }, [scene])
  useFrame((_, delta) => {
    if (!interacted.current && spinRef.current) spinRef.current.rotation.y += delta * 0.16
  })
  return <group ref={spinRef}><primitive object={model} /></group>
}

function Orbital() {
  return (
    <>
      <mesh>
        <icosahedronGeometry args={[1, 3]} />
        <meshPhysicalMaterial color={SAGE} roughness={0.25} metalness={0.2} clearcoat={1} clearcoatRoughness={0.15} iridescence={0.8} iridescenceIOR={1.3} flatShading />
      </mesh>
      <mesh rotation={[0.8, 0.2, 0.25]}>
        <torusGeometry args={[1.45, 0.03, 16, 160]} />
        <meshStandardMaterial color={CLAY} metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh rotation={[1.5, 0.6, 0]}>
        <torusGeometry args={[1.75, 0.018, 16, 160]} />
        <meshStandardMaterial color={CREAM} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[1.12, 0.55, 0.1]}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color={CREAM} metalness={0.5} roughness={0.2} />
      </mesh>
    </>
  )
}

function FormMatter() {
  return (
    <>
      <mesh rotation={[0.3, 0.3, 0]}>
        <torusKnotGeometry args={[0.72, 0.23, 220, 32, 2, 5]} />
        <meshPhysicalMaterial color={CLAY} roughness={0.28} metalness={0.25} clearcoat={1} clearcoatRoughness={0.12} iridescence={0.5} />
      </mesh>
      <mesh position={[0, -1.12, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.18, 64]} />
        <meshStandardMaterial color="#d8cfba" roughness={0.6} metalness={0.05} />
      </mesh>
    </>
  )
}

function Kinetic() {
  const a = useRef(), b = useRef(), c = useRef()
  useFrame((_, d) => {
    if (a.current) a.current.rotation.x += d * 0.7
    if (b.current) b.current.rotation.y += d * 0.95
    if (c.current) { c.current.rotation.z += d * 0.5; c.current.rotation.x -= d * 0.3 }
  })
  return (
    <>
      <mesh ref={a} rotation={[0.4, 0.4, 0.2]}>
        <torusGeometry args={[0.8, 0.17, 24, 100]} />
        <meshPhysicalMaterial color={SLATE} metalness={0.65} roughness={0.25} clearcoat={1} />
      </mesh>
      <mesh ref={b} rotation={[1.2, 0.2, 0.7]}>
        <torusGeometry args={[1.15, 0.045, 16, 100]} />
        <meshStandardMaterial color={CLAY} metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh ref={c}>
        <torusGeometry args={[1.5, 0.02, 12, 120]} />
        <meshStandardMaterial color={CREAM} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.45, 1]} />
        <meshPhysicalMaterial color="#ded5c0" roughness={0.2} metalness={0.3} clearcoat={1} iridescence={0.7} />
      </mesh>
    </>
  )
}

const BY_TYPE = { orbital: Orbital, form: FormMatter, kinetic: Kinetic }

export function ModelViewer({ type, index, url }) {
  const box = useRef(null)
  const controls = useRef(null)
  const spin = useRef(null)
  const interacted = useRef(false)
  const [, setInteractionState] = useState(false)
  const inView = useInView(box, '160px')
  const Piece = BY_TYPE[type] || Orbital
  return (
    <div className={`model-stage model-${index}`} ref={box} data-cursor="DRAG">
      <SafeCanvas
        fallback={<div className="model-fallback">3D PREVIEW UNAVAILABLE ON THIS DEVICE</div>}
        frameloop={inView ? 'always' : 'never'}
        dpr={typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, 1.25)}
        camera={{ position: [0, 0, 4.3], fov: 43 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} />
        <pointLight position={[-3, -2, -2]} intensity={25} color="#9caed0" />
        <Suspense fallback={null}>
          {url ? <GLBModel url={`${import.meta.env.BASE_URL}${url}`} interacted={interacted} spinRef={spin} /> : <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.25}><Spin><Piece /></Spin></Float>}
          <StudioEnv />
        </Suspense>
        <OrbitControls
          ref={controls}
          enablePan={false}
          enableZoom
          minDistance={3.1}
          maxDistance={7}
          rotateSpeed={0.7}
          autoRotate={false}
          onStart={() => { interacted.current = true; setInteractionState(true); if (controls.current) controls.current.autoRotate = false }}
        />
      </SafeCanvas>
      <span className="model-hint glass">DRAG TO ROTATE · PINCH TO ZOOM</span>
      <button className="model-reset" type="button" aria-label="Reset 3D view" title="Reset view" onClick={() => { controls.current?.reset(); if (spin.current) spin.current.rotation.set(0, 0, 0); interacted.current = false; setInteractionState(false) }}>
        <RotateCcw size={15} /><span>RESET</span>
      </button>
    </div>
  )
}

