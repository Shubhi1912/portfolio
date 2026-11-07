import React, { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import { SafeCanvas, StudioEnv } from './SafeCanvas'
import { useInView } from '../lib/hooks'

const SAGE = '#a9b9ae', CLAY = '#c88767', SLATE = '#829ca8', CREAM = '#e8d8b8'

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

export function ModelViewer({ type, index }) {
  const box = useRef(null)
  const inView = useInView(box, '160px')
  const Piece = BY_TYPE[type] || Orbital
  return (
    <div className={`model-stage model-${index}`} ref={box} data-cursor="DRAG">
      <SafeCanvas
        fallback={<div className="model-fallback">3D PREVIEW UNAVAILABLE ON THIS DEVICE</div>}
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.3], fov: 43 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} />
        <pointLight position={[-3, -2, -2]} intensity={25} color="#9caed0" />
        <Suspense fallback={null}>
          <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.25}>
            <Spin><Piece /></Spin>
          </Float>
          <StudioEnv />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.7} />
      </SafeCanvas>
      <span className="model-hint glass">DRAG SIDEWAYS TO ROTATE</span>
    </div>
  )
}
