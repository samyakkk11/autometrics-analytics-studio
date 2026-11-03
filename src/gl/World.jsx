import * as THREE from 'three'
import gsap from 'gsap'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ST, useUI } from '../state'
import { DATA, N } from './layouts'
import { drawLogo } from '../logos.jsx'
import { SKILLS } from '../data'
import { SHOWCASE_SHOTS } from '../showcase.js'

const STEP = 40, TAN = Math.tan((38 * Math.PI) / 360)
const sm = (t) => t * t * (3 - 2 * t), cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const BONE = [245, 247, 250], ACC = [244, 185, 66], BLUE = [54, 169, 255]

/* ------------------------------------------------------------------ data cloud (GPU morph) */
const VS = `attribute vec3 aA;attribute vec3 aB;attribute vec3 aPA;attribute vec3 aPB;attribute vec3 aFl;attribute float aSeed;
uniform float uMix,uTime,uW4,uScale,uSize,uAmp,uRep,uFade;uniform vec2 uPtr;uniform vec3 uCol0,uCol1,uCol2;
varying float vA,vH;varying vec3 vC;
vec3 pick(float i){return uCol0*(1.-step(.5,i))+uCol1*step(.5,i)*(1.-step(1.5,i))+uCol2*step(1.5,i);}
void main(){vec3 p=mix(aA,aB,uMix);
p.xy+=aFl.xy*(sin((aFl.z+uTime*.12)*6.2831853)-sin(aFl.z*6.2831853))*.06*uW4;
p+=uAmp*vec3(sin(uTime*.9+aSeed*40.),cos(uTime*.8+aSeed*53.),sin(uTime*.7+aSeed*29.));
vec2 d=p.xy-uPtr;float r=length(d);p.xy+=normalize(d+vec2(1e-4))*uRep*exp(-r*r*14.);
vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
float h=mix(aPA.y,aPB.y,uMix);gl_PointSize=max(2.,uSize*uScale/(-mv.z))*(1.+1.2*h);
vA=mix(aPA.x,aPB.x,uMix)*uFade*clamp(1.2-(-mv.z-4.)*.12,.3,1.);vH=h;vC=mix(pick(aPA.z),pick(aPB.z),uMix);float blueGrain=step(.72,fract(sin(aSeed*193.4)*43758.5));vC=mix(vC,uCol2,blueGrain*.58);}`
const FS = `varying float vA,vH;varying vec3 vC;
void main(){vec2 q=gl_PointCoord-.5;float d=length(q);float s=smoothstep(.5,.3,d);float band=smoothstep(.5,.42,d)*smoothstep(.28,.36,d);float a=vA*mix(s,band,vH);if(a<.01)discard;gl_FragColor=vec4(pow(vC,vec3(2.2))*1.5,a);}`

function DataCloud({ mode }) {
  const cloud = useRef(), pts = useRef(), cur = useRef({ a: -1, b: -1, e: 0 }), lastHero = useRef(-1)
  const { geo, U, lines } = useMemo(() => {
    const g = new THREE.BufferGeometry(), at = (n = 3) => new THREE.BufferAttribute(new Float32Array(N * n), n).setUsage(THREE.DynamicDrawUsage)
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3))
    ;['aA', 'aB', 'aPA', 'aPB'].forEach((k) => g.setAttribute(k, at()))
    g.setAttribute('aFl', new THREE.BufferAttribute(DATA.FL, 3)); g.setAttribute('aSeed', new THREE.BufferAttribute(Float32Array.from({ length: N }, (_, i) => (i * 0.61803) % 1), 1))
    const v = (c) => new THREE.Vector3(c[0] / 255, c[1] / 255, c[2] / 255)
    const u = { uMix: { value: 0 }, uTime: { value: 0 }, uW4: { value: 0 }, uScale: { value: 800 }, uSize: { value: 0.02 }, uAmp: { value: ST.rm ? 0 : 0.0018 }, uRep: { value: 0 }, uFade: { value: 1 }, uPtr: { value: new THREE.Vector2(9, 9) }, uCol0: { value: v(BONE) }, uCol1: { value: v(ACC) }, uCol2: { value: v(BLUE) } }
    const ln = (pp, col) => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pp.map((p) => new THREE.Vector3(...p))), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0 })); l.frustumCulled = false; return l }
    return { geo: g, U: u, lines: { 4: ln([[-0.8, 0.25, -0.2], [-0.4, -0.2, 0.1], [0, 0.25, 0.3], [0.4, -0.2, 0.1], [0.8, 0.25, -0.2]], '#36a9ff') } }
  }, [])
  useFrame((state) => {
    const t = state.clock.elapsedTime, par = pts.current.parent, c = cur.current
    if (!par.visible) return
    let a, b, e
    if (mode === 'hero') {
      const seq = [0, 1, 3, 4, 5], progress = ST.rm ? 0 : ST.heroAuto ? (t / 7) % seq.length : ST.hero
      if (ST.heroAuto) ST.heroIdle = progress
      const k = Math.floor(progress) % seq.length, u = progress - Math.floor(progress)
      a = ST.rm ? 5 : seq[k]; b = ST.rm ? 5 : seq[(k + 1) % seq.length]
      e = ST.rm ? 0 : sm(cl((u - 0.68) / 0.32))
      const j = ST.rm ? 3 : (u > 0.84 ? (k + 1) % seq.length : k); if (j !== lastHero.current) { lastHero.current = j; useUI.setState({ heroStage: j }) }
    } else { const p = ST.proc, seq = [0, 2, 4, 5], step = Math.min(2, Math.floor(p)); a = seq[step]; b = seq[step + 1]; e = sm(cl((p - step - 0.2) / 0.6)) }
    if (a !== c.a || b !== c.b) { c.a = a; c.b = b; const g = geo.attributes; g.aA.array.set(DATA.P[a]); g.aB.array.set(DATA.P[b]); g.aPA.array.set(DATA.Q[a]); g.aPB.array.set(DATA.Q[b]); ;['aA', 'aB', 'aPA', 'aPB'].forEach((k) => (g[k].needsUpdate = true)) }
    U.uMix.value = e; U.uTime.value = t; U.uW4.value = (a === 4 ? 1 - e : 0) + (b === 4 ? e : 0)
    const explore = (mode === 'process' || mode === 'hero') ? (a === 2 ? 1 - e : 0) + (b === 2 ? e : 0) : 0
    U.uAmp.value = ST.rm ? 0 : 0.0018 * (1 - explore)
    U.uScale.value = (state.size.height * state.gl.getPixelRatio()) / (2 * TAN)
    const dist = Math.max(1, state.camera.position.z - par.position.z), hh = dist * TAN, asp = state.size.width / state.size.height, sc = par.scale.x
    const near = cl(1 - Math.abs(ST.s - (mode === 'hero' ? 0 : 2)) * 1.1)
    U.uPtr.value.set((state.camera.position.x + ST.mx * 2 * hh * asp - par.position.x) / sc, (state.camera.position.y - ST.my * 2 * hh - par.position.y) / sc)
    U.uRep.value += ((ST.rm ? 0 : 0.09 * near * (1 - explore)) - U.uRep.value) * 0.08
    Object.entries(lines).forEach(([k, l]) => { const w = (a === +k ? 1 - e : 0) + (b === +k ? e : 0); l.material.opacity = w * 0.6; l.visible = w > 0.01 })
    const exploreY = 1 + explore * 2.6
    pts.current.scale.set(1, exploreY, 1)
    pts.current.position.set(0, explore * 1.68, 0)
    // Rotate the points and their matching line together. The overview rocks
    // through a restrained 45-degree arc instead of accumulating full turns.
    cloud.current.rotation.y = ST.rm ? 0 : Math.sin(t * 0.15) * (mode === 'hero' ? Math.PI / 8 : 0.18)
  })
  return (
    <group ref={cloud}>
      <points ref={pts} geometry={geo} frustumCulled={false}>
        <shaderMaterial vertexShader={VS} fragmentShader={FS} uniforms={U} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      {Object.values(lines).map((l, i) => <primitive key={i} object={l} />)}
    </group>
  )
}

/* ------------------------------------------------------------------ persistent depth field */
function DeepField() {
  const ref = useRef()
  const geo = useMemo(() => {
    let seed = 9127
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
    const count = 7200, a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) a.set([(rand() - 0.5) * 34, (rand() - 0.5) * 22, 18 - rand() * 420], i * 3)
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3)); return g
  }, [])
  useFrame((state) => { if (ref.current && !ST.rm) ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.025) * 0.012 })
  return <points ref={ref} geometry={geo} frustumCulled={false}><pointsMaterial size={0.014} color="#82958b" transparent opacity={0.22} sizeAttenuation depthWrite={false} /></points>
}

/* ------------------------------------------------------------------ skills orbit */
function Orbit() {
  const g = useRef(), sprites = useRef([]), core = useRef(), inner = useRef()
  const tex = useMemo(() => SKILLS.map((s) => { const t = new THREE.CanvasTexture(drawLogo(s[0])); t.colorSpace = THREE.SRGBColorSpace; return t }), [])
  const dust = useMemo(() => { const a = new Float32Array(900 * 3); for (let i = 0; i < 900; i++) { const th = Math.random() * 6.283, r = 1.7 + (Math.random() - 0.5) * 0.5; a.set([Math.cos(th) * r, (Math.random() - 0.5) * 0.18, Math.sin(th) * r], i * 3) } const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(a, 3)); return geo }, [])
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime, h = useUI.getState().hover
    if (!ST.rm) g.current.rotation.y += dt * (h >= 0 ? 0.04 : 0.16)
    sprites.current.forEach((s, i) => { if (!s) return; const k = h === i ? 0.98 : 0.62, d = h === i ? 1.0 : h >= 0 ? 0.35 : 0.9; s.scale.x += (k - s.scale.x) * 0.1; s.scale.y = s.scale.x; s.material.opacity += (d - s.material.opacity) * 0.1 })
    core.current.rotation.y = t * 0.3; core.current.rotation.x = t * 0.2; inner.current.scale.setScalar(1 + Math.sin(t * 2) * 0.06)
  })
  return (
    <group rotation={[0.45, 0, 0.18]}>
      <mesh ref={core}><icosahedronGeometry args={[0.55, 2]} /><meshBasicMaterial wireframe color={new THREE.Color(0.45, 1.25, 2.4)} toneMapped={false} /></mesh>
      <mesh ref={inner}><sphereGeometry args={[0.28, 32, 32]} /><meshBasicMaterial color={new THREE.Color(2.4, 1.5, 0.45)} toneMapped={false} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.7, 0.004, 8, 160]} /><meshBasicMaterial color={new THREE.Color(0.5, 0.7, 2)} toneMapped={false} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[2.25, 0.003, 8, 160]} /><meshBasicMaterial color={new THREE.Color(0.25, 0.3, 0.7)} toneMapped={false} /></mesh>
      <group ref={g}>
        {SKILLS.map((s, i) => { const a = (i / SKILLS.length) * 6.283; return <sprite key={s[0]} ref={(el) => (sprites.current[i] = el)} position={[Math.cos(a) * 1.7, 0, Math.sin(a) * 1.7]} scale={[0.62, 0.62, 1]}><spriteMaterial map={tex[i]} transparent toneMapped={false} depthWrite={false} /></sprite> })}
        <points geometry={dust}><pointsMaterial size={0.018} color={new THREE.Color(0.6, 0.8, 2)} transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></points>
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ project viewer (dissolve + chromatic shift) */
const PVS = `varying vec2 vUv;uniform float uTime,uHover;uniform vec2 uPtr;
void main(){vUv=uv;vec3 p=position;float d=distance(uv,uPtr);p.z+=sin(uv.x*6.+uTime*.8)*.035*(.4+uHover)+exp(-d*d*9.)*.28*uHover;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`
const PFS = `uniform sampler2D uA,uB;uniform float uMix,uHover,uVel,uAA,uAB,uPA;varying vec2 vUv;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
vec2 cover(vec2 uv,float ia){vec2 s=vec2(1.);if(ia>uPA)s.x=uPA/ia;else s.y=ia/uPA;return (uv-.5)*s+.5;}
void main(){float m=smoothstep(0.,1.,clamp(uMix*1.5-n(vUv*5.)*.5,0.,1.));
vec2 off=(vUv-.5)*(uVel*.02+m*(1.-m)*.12);vec2 ua=cover(vUv,uAA),ub=cover(vUv,uAB);float sp=.004+abs(uVel)*.004+m*(1.-m)*.03;
vec3 ca=vec3(texture2D(uA,ua+off+vec2(sp,0.)).r,texture2D(uA,ua+off).g,texture2D(uA,ua+off-vec2(sp,0.)).b);
vec3 cb=vec3(texture2D(uB,ub-off+vec2(sp,0.)).r,texture2D(uB,ub-off).g,texture2D(uB,ub-off-vec2(sp,0.)).b);
vec3 col=mix(ca,cb,m);col=pow(col,vec3(2.2))*mix(.62,.95,uHover);
vec2 q=abs(vUv-.5)-.5+.025;float r=length(max(q,0.))-.025;gl_FragColor=vec4(col,1.-smoothstep(-.002,.004,r));}`
function ProjectViewer({ scope = 'selected' }) {
  const mesh = useRef(), shown = useRef({ project: 0, shot: 0 }), [, setLoadedRevision] = useState(0)
  const selectedActive = useUI((s) => s.active)
  const active = scope === 'client' ? 0 : Math.min(selectedActive, 5)
  const projectShots = useMemo(() => scope === 'client' ? [SHOWCASE_SHOTS[6]] : SHOWCASE_SHOTS.slice(0, 6), [scope])
  const { U, texs } = useMemo(() => {
    const loader = new THREE.TextureLoader(), u = { uA: { value: null }, uB: { value: null }, uMix: { value: 0 }, uHover: { value: 0 }, uVel: { value: 0 }, uTime: { value: 0 }, uPtr: { value: new THREE.Vector2(0.5, 0.5) }, uAA: { value: 1.78 }, uAB: { value: 1.78 }, uPA: { value: 1.78 } }
    const ts = projectShots.map((shots, project) => shots.map((src, shot) => loader.load(src, (t) => {
      t.anisotropy = 4; t.userData.asp = t.image.width / t.image.height
      if (project === 0 && shot === 0) { u.uA.value = u.uB.value = t; u.uAA.value = u.uAB.value = t.userData.asp }
      setLoadedRevision((n) => n + 1)
    })))
    return { U: u, texs: ts }
  }, [projectShots])
  useEffect(() => {
    if (shown.current.project === active) return
    const to = texs[active]?.[0]
    if (!to?.image) return
    const from = texs[shown.current.project]?.[shown.current.shot] || U.uB.value
    if (!from?.image) { U.uA.value = U.uB.value = to; U.uAA.value = U.uAB.value = to.userData.asp; U.uMix.value = 1; shown.current = { project: active, shot: 0 }; return }
    gsap.killTweensOf(U.uMix); U.uA.value = from; U.uAA.value = from.userData.asp; U.uB.value = to; U.uAB.value = to.userData.asp; U.uMix.value = 0
    shown.current = { project: active, shot: 0 }
    gsap.to(U.uMix, { value: 1, duration: ST.rm ? 0.01 : 0.55, ease: 'power2.inOut' })
  }, [active, texs, U, setLoadedRevision])
  useEffect(() => {
    if (ST.rm) return
    const timer = setInterval(() => {
      const images = texs[active] || [], current = shown.current
      if (current.project !== active || images.length < 2) return
      const nextShot = (current.shot + 1) % images.length, from = images[current.shot], to = images[nextShot]
      if (!from?.image || !to?.image) return
      gsap.killTweensOf(U.uMix); U.uA.value = from; U.uAA.value = from.userData.asp; U.uB.value = to; U.uAB.value = to.userData.asp; U.uMix.value = 0
      shown.current = { project: active, shot: nextShot }
      gsap.to(U.uMix, { value: 1, duration: 0.55, ease: 'power2.inOut' })
    }, 2000)
    return () => clearInterval(timer)
  }, [active, texs, U])
  useFrame((state) => {
    const t = state.clock.elapsedTime, m = mesh.current; if (!m.parent.visible) return
    U.uTime.value = t; U.uVel.value += (cl(ST.vel * 0.15, -1, 1) - U.uVel.value) * 0.1
    U.uHover.value += ((useUI.getState().rowHover ? 1 : 0.25) - U.uHover.value) * 0.08
    U.uPtr.value.set(0.5 + ST.mx * 0.9, 0.5 - ST.my * 0.9)
    m.rotation.y += ((ST.rm ? -0.12 : -ST.mx * 0.45 - 0.12) - m.rotation.y) * 0.06; m.rotation.x += ((ST.rm ? 0 : ST.my * 0.3) - m.rotation.x) * 0.06
    m.position.x = ST.rm ? 0 : Math.sin(t * 0.34) * 0.035
    m.position.y = ST.rm ? 0 : Math.sin(t * 0.48) * 0.025
  })
  return (
    <group>
      <mesh ref={mesh}><planeGeometry args={[3.4, 1.9, 40, 22]} /><shaderMaterial vertexShader={PVS} fragmentShader={PFS} uniforms={U} transparent /></mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ contact network (converges to a point) */
function Network() {
  const pts = useRef(), lines = useRef(), core = useRef(), rings = useRef([])
  const base = useMemo(() => Array.from({ length: 180 }, () => { const u = Math.random() * 2 - 1, th = Math.random() * 6.283, r = 1.6 + Math.random() * 1.8, s = Math.sqrt(1 - u * u); return [Math.cos(th) * s * r, u * r * 0.7, Math.sin(th) * s * r, Math.random() * 6.283] }), [])
  const pg = useMemo(() => new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(180 * 3), 3)), [])
  const lg = useMemo(() => new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(180 * 6), 3)), [])
  useFrame((state) => {
    if (!core.current.parent.visible) return
    const t = state.clock.elapsedTime, k = sm(cl(1 - Math.abs(ST.s - 6))), P = pg.attributes.position.array, L = lg.attributes.position.array, c = ST.rm ? 0 : t
    base.forEach((b, i) => { const s = 1 - 0.8 * k, x = (b[0] * Math.cos(c * 0.1 + b[3] * 0.05) - b[2] * Math.sin(c * 0.1)) * s, z = (b[0] * Math.sin(c * 0.1) + b[2] * Math.cos(c * 0.1)) * s, y = b[1] * s + Math.sin(c + b[3]) * 0.04; P.set([x, y, z], i * 3); L.set([x, y, z, 0, 0, 0], i * 6) })
    pg.attributes.position.needsUpdate = true; lg.attributes.position.needsUpdate = true
    lines.current.material.opacity = 0.04 + 0.2 * k; core.current.scale.setScalar(0.12 + 0.15 * k + Math.sin(t * 2) * 0.006)
    rings.current.forEach((r, i) => { r.scale.setScalar(0.3 + k * (0.4 + i * 0.24) + ((t * 0.3 + i * 0.5) % 1) * 0.12 * k); r.material.opacity = 0.28 * k * (1 - ((t * 0.3 + i * 0.5) % 1)) })
  })
  return (
    <group>
      <points ref={pts} geometry={pg}><pointsMaterial size={0.03} color={new THREE.Color(0.72, 0.82, 1.0)} transparent opacity={0.72} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></points>
      <lineSegments ref={lines} geometry={lg}><lineBasicMaterial color={new THREE.Color(2, 0.45, 0.25)} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></lineSegments>
      <mesh ref={core}><sphereGeometry args={[1, 32, 32]} /><meshBasicMaterial color={new THREE.Color(1.6, 0.48, 0.24)} toneMapped={false} /></mesh>
      {[0, 1, 2].map((i) => <mesh key={i} ref={(el) => (rings.current[i] = el)} rotation={[Math.PI / 2.4, 0, 0]}><torusGeometry args={[1.2, 0.006, 8, 120]} /><meshBasicMaterial color={new THREE.Color(0.6, 0.8, 2.4)} transparent toneMapped={false} /></mesh>)}
    </group>
  )
}

/* ------------------------------------------------------------------ camera, stations, effects */
const LAYOUT = [{ d: [2.1, 0, 1.45], m: [0, -1.0, 1.0] }, { d: [1.95, -0.1, 0.74], m: [0, 1.5, 0.62] }, { d: [-2.3, 0, 1.5], m: [0, 1.4, 1.0] }, { d: [1.85, 0, 0.86], m: [0, 1.45, 0.8] }, { d: [1.85, 0, 0.86], m: [0, 1.45, 0.8] }, { d: [0, 0, 1.25], m: [0, 0, 0.9] }, { d: [0, 0, 1.25], m: [0, 0, 0.9] }]
function Station({ i, children }) {
  const g = useRef()
  useFrame(({ size }) => { const ratio = size.width / size.height, mob = ratio < 0.9 || size.width < 860, useMobile = mob && !(ratio >= 0.9 && size.width >= 600 && i < 2), l = LAYOUT[i][useMobile ? 'm' : 'd'], heroZoom = i === 0 ? ST.heroExit : 0, processZoom = i === 2 ? ST.engagementExit : 0; g.current.position.set(l[0], l[1], -STEP * i + heroZoom * 12 + processZoom * 12); g.current.scale.setScalar(l[2] * (1 + heroZoom * 3.5 + processZoom * 3.5)); g.current.visible = Math.abs(ST.s - i) < 0.97 && !(i === 0 && ST.hideHeroVisual) && !(i === 2 && ST.hideProcessVisual) && !(i === 3 && ST.hideProjectVisual) })
  return <group ref={g}>{children}</group>
}
function Rig() {
  useFrame(({ camera, size }, dt) => {
    const mob = size.width / size.height < 0.9 || size.width < 860, tz = -STEP * ST.s + (mob ? 8.2 : 6.5), k = ST.rm ? 1 : 1 - Math.exp(-dt * 3.2)
    camera.position.z += (tz - camera.position.z) * k
    camera.position.x += ((mob ? 0 : ST.mx * 0.6) - camera.position.x) * k * 0.7; camera.position.y += ((mob ? 0 : -ST.my * 0.35) - camera.position.y) * k * 0.7
    camera.lookAt(camera.position.x * 0.3, camera.position.y * 0.3, camera.position.z - 10); if (!ST.rm) camera.rotateZ(-ST.vel * 0.0035)
  })
  return null
}
function Effects() {
  const ca = useRef(), mob = useThree((s) => s.size.width < 700)
  const off = useMemo(() => new THREE.Vector2(0, 0), [])
  useFrame(() => { if (ca.current) { const v = ST.rm ? 0 : cl(Math.abs(ST.vel) * 0.00035, 0, 0.004); ca.current.offset.set(0.0004 + v, 0.0003 + v * 0.6) } })
  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom mipmapBlur intensity={mob ? 0.35 : 0.48} luminanceThreshold={0.35} luminanceSmoothing={0.4} />
      <ChromaticAberration ref={ca} offset={off} radialModulation={false} modulationOffset={0} />
      <Noise premultiply opacity={0.012} />
      <Vignette eskil={false} offset={0.25} darkness={0.16} />
    </EffectComposer>
  )
}
export default function World() {
  return (
    <Canvas flat dpr={[1, 1.75]} gl={{ antialias: false, powerPreference: 'high-performance' }} camera={{ fov: 38, near: 0.1, far: 400, position: [0, 0, 6.5] }} onCreated={({ gl }) => gl.setClearColor('#050609')} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <DeepField />
      <Rig />
      <Station i={0}><DataCloud mode="hero" /></Station>
      <Station i={1}><Orbit /></Station>
      <Station i={2}><DataCloud mode="process" /></Station>
      <Station i={3}><ProjectViewer /></Station>
      <Station i={4}><ProjectViewer scope="client" /></Station>
      <Station i={6}><Network /></Station>
      <Effects />
    </Canvas>
  )
}
