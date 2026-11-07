import React, { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { pointer, sceneState } from '../lib/pointer'
import { StudioEnv } from './SafeCanvas'

// Full-screen quad: ignores the camera and paints a living, topographic paper-and-sage field.
const vert = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`

const frag = /* glsl */`
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uPress;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + 7.1;
    a *= 0.5;
  }
  return v;
}

void main() {
  float asp = uRes.x / uRes.y;
  vec2 p = (vUv - 0.5) * vec2(asp, 1.0);
  float t = uTime * 0.05;
  float dm = distance(p, uMouse);
  vec2 push = (p - uMouse) * exp(-dm * dm * 6.0) * (0.18 + 0.25 * uPress);

  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p * 2.0 + 2.5 * q + vec2(1.7, 9.2) + t * 1.4),
                fbm(p * 2.0 + 2.5 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.3 + 2.6 * r + push);

  vec3 paper = vec3(0.933, 0.918, 0.867);
  vec3 sage  = vec3(0.663, 0.725, 0.682);
  vec3 clay  = vec3(0.784, 0.529, 0.404);
  vec3 slate = vec3(0.620, 0.686, 0.741);

  vec3 col = mix(paper, sage, smoothstep(0.30, 0.80, f));
  col = mix(col, slate, smoothstep(0.55, 0.95, r.y) * 0.35);
  col = mix(col, clay, smoothstep(0.60, 1.00, q.x * r.x * 1.7) * 0.30);
  col = mix(col, paper, 0.28);

  float c = abs(fract(f * 11.0) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.025, c);
  col = mix(col, vec3(0.145, 0.153, 0.125), line * 0.085);

  float vig = smoothstep(1.25, 0.2, length(vUv - 0.5) * 1.2);
  col = mix(paper, col, 0.55 + 0.45 * vig);
  gl_FragColor = vec4(col, 1.0);
}`

export function HeroScene() {
  const { gl, size, viewport } = useThree()
  const orb = useRef(), tilt = useRef(), core = useRef(), mat = useRef(), sat = useRef(), ringB = useRef()
  const mouse = useRef({ u: 0.5, v: 0.5, press: 0, energy: 0 })
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uPress: { value: 0 },
  }), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const m = mouse.current
    const rect = gl.domElement.getBoundingClientRect()
    const u = (pointer.x - rect.left) / Math.max(rect.width, 1)
    const v = 1 - (pointer.y - rect.top) / Math.max(rect.height, 1)
    const k = 1 - Math.pow(0.002, dt)
    m.u += (u - m.u) * k
    m.v += (v - m.v) * k
    m.press += ((pointer.down ? 1 : 0) - m.press) * k
    m.energy += (Math.min(Math.hypot(pointer.vx, pointer.vy) / 45, 1) - m.energy) * k
    sceneState.boost = Math.max(0, sceneState.boost - dt * 0.45)

    // background field
    const asp = size.width / size.height
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uRes.value.set(size.width, size.height)
    uniforms.uMouse.value.set((m.u - 0.5) * asp, m.v - 0.5)
    uniforms.uPress.value = m.press

    // responsive layout of the orb (right-hand side on desktop, lower centre on phones)
    const narrow = size.width < 820
    const s = narrow ? Math.min(viewport.width * 0.31, 1.2) : Math.min(viewport.height * 0.3, viewport.width * 0.17)
    const tx = narrow ? 0 : viewport.width * 0.25
    const ty = narrow ? -viewport.height * 0.2 : 0
    const o = orb.current
    if (!o) return
    o.position.x += (tx - o.position.x) * k
    o.position.y += (ty - o.position.y) * k
    o.scale.setScalar(o.scale.x + (s * (1 - m.press * 0.06) - o.scale.x) * k)

    // pointer-driven tilt and spin
    tilt.current.rotation.x += ((m.v - 0.5) * -0.9 - tilt.current.rotation.x) * k
    tilt.current.rotation.y += ((m.u - 0.5) * 0.8 - tilt.current.rotation.y) * k
    core.current.rotation.y += dt * (0.14 + sceneState.boost * 6)
    if (sat.current) sat.current.rotation.z += dt * (0.7 + m.energy * 2 + sceneState.boost * 5)
    if (ringB.current) ringB.current.rotation.z -= dt * (0.12 + sceneState.boost * 2)

    // liquid response: faster pointer = wobblier surface
    if (mat.current) mat.current.distort = 0.26 + m.energy * 0.3 + m.press * 0.18 + sceneState.boost * 0.3
  })

  return (
    <>
      <mesh frustumCulled={false} renderOrder={-1}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthTest={false} depthWrite={false} />
      </mesh>

      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.8} />
      <pointLight position={[-4, -1, 3]} intensity={30} color="#c88767" />

      <group ref={orb} scale={0.001}>
        <group ref={tilt}>
          <mesh ref={core}>
            <sphereGeometry args={[1, 96, 96]} />
            <MeshDistortMaterial
              ref={mat}
              color="#b6c6ba"
              roughness={0.12}
              metalness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.08}
              iridescence={1}
              iridescenceIOR={1.5}
              iridescenceThicknessRange={[120, 520]}
              envMapIntensity={1.2}
              distort={0.28}
              speed={1.3}
            />
          </mesh>
          <group rotation={[Math.PI / 2.2, 0, 0.3]}>
            <mesh>
              <torusGeometry args={[1.5, 0.012, 8, 200]} />
              <meshStandardMaterial color="#c88767" metalness={0.8} roughness={0.3} />
            </mesh>
            <group ref={sat}>
              <mesh position={[1.5, 0, 0]}>
                <sphereGeometry args={[0.07, 24, 24]} />
                <meshStandardMaterial color="#e8d8b8" metalness={0.6} roughness={0.2} />
              </mesh>
            </group>
          </group>
          <group rotation={[1.0, 0.5, 0]}>
            <group ref={ringB}>
              <mesh>
                <torusGeometry args={[1.85, 0.008, 8, 200]} />
                <meshStandardMaterial color="#6f8577" metalness={0.7} roughness={0.35} />
              </mesh>
              <mesh position={[0, 1.85, 0]}>
                <sphereGeometry args={[0.045, 16, 16]} />
                <meshStandardMaterial color="#c88767" metalness={0.6} roughness={0.25} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
      <StudioEnv />
    </>
  )
}
