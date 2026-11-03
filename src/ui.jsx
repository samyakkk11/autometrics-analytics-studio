import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ST, useUI } from './state'
import { PROJECTS, IMG } from './data'
import { PARTNER_PROJECTS } from './partner-projects.js'
import { FREELANCE_PROJECT } from './freelance-project.js'
import { Logo, NAMES } from './logos.jsx'
import { scrollToId, stopScroll, startScroll } from './scroll'

/* ---- word-split helper keeps <em> markup ---- */
export function splitEl(el) {
  if (el.dataset.done) return []
  el.dataset.done = '1'; const out = []
  const walk = (n) => [...n.childNodes].forEach((c) => {
    if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach((t) => { if (!t.trim()) { f.append(t); return } const m = document.createElement('span'), i = document.createElement('span'); m.className = 'wm'; i.className = 'wi'; i.textContent = t; m.append(i); f.append(m); out.push(i) }); c.replaceWith(f) }
    else if (c.nodeType === 1) walk(c)
  })
  walk(el); return out
}
export function useReveal(ref) {
  useLayoutEffect(() => {
    if (ST.rm) return
    const ctx = gsap.context(() => {
      ref.current.querySelectorAll('[data-split]').forEach((el) => { const w = splitEl(el); gsap.from(w, { yPercent: 115, duration: 1.1, stagger: 0.06, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }) })
      ref.current.querySelectorAll('[data-fade]').forEach((el) => gsap.from(el, { y: 36, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }))
    }, ref)
    return () => ctx.revert()
  }, [])
}
export const Magnetic = ({ children }) => {
  const r = useRef()
  useEffect(() => {
    if (ST.rm || !matchMedia('(pointer:fine)').matches) return
    const el = r.current, x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
    const mv = (e) => { const b = el.getBoundingClientRect(); x((e.clientX - b.left - b.width / 2) * 0.28); y((e.clientY - b.top - b.height / 2) * 0.36) }, lv = () => { x(0); y(0) }
    el.addEventListener('pointermove', mv); el.addEventListener('pointerleave', lv); return () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerleave', lv) }
  }, [])
  return <span className="mag" ref={r}>{children}</span>
}
export const go = (id) => (e) => { e.preventDefault(); scrollToId(id) }

/* ---- preloader ---- */
export function Preloader() {
  const [n, setN] = useState(0), ref = useRef(), done = useRef(false)
  useEffect(() => {
    let loaded = 0; const total = PROJECTS.length + 1, t0 = performance.now()
    const bump = () => { loaded++ }
    PROJECTS.forEach((p) => { const i = new Image(); i.src = IMG(p.shots[0][0]); i.decode().then(bump, bump) })
    ;(document.fonts ? document.fonts.ready : Promise.resolve()).then(bump)
    let raf; const tick = () => {
      const target = Math.min(100, (loaded / total) * 100), min = Math.min(1, (performance.now() - t0) / 1300) * 100
      setN((v) => Math.round(v + (Math.min(target, min) - v) * 0.2 + 0.4))
      if ((loaded >= total && performance.now() - t0 > 1300 || performance.now() - t0 > 4500) && !done.current) { done.current = true; setN(100); finish(); return }
      raf = requestAnimationFrame(tick)
    }
    const finish = () => { const el = ref.current; useUI.setState({ ready: true }); if (ST.rm) { el.remove(); return } gsap.to(el, { yPercent: -100, duration: 1.1, ease: 'power4.inOut', delay: 0.25, onComplete: () => el.remove() }) }
    tick(); return () => cancelAnimationFrame(raf)
  }, [])
  return <div className="pre" ref={ref} aria-hidden="true"><span className="pre-n">{Math.min(100, n)}</span><span className="mono">loading the dataset</span></div>
}

/* ---- cursor ---- */
export function Cursor() {
  const r = useRef()
  useEffect(() => {
    if (ST.rm || !matchMedia('(pointer:fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const el = r.current, x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })
    const mv = (e) => { x(e.clientX); y(e.clientY) }, ov = (e) => el.classList.toggle('big', !!e.target.closest('a,button,[data-cursor]'))
    addEventListener('pointermove', mv); addEventListener('pointerover', ov); return () => { removeEventListener('pointermove', mv); removeEventListener('pointerover', ov) }
  }, [])
  return <div className="cursor" ref={r} aria-hidden="true" />
}

/* ---- nav ---- */
export function Nav() {
  const [isHome, setIsHome] = useState(() => typeof window === 'undefined' || window.scrollY <= 1)
  useEffect(() => {
    const update = () => setIsHome((current) => {
      const next = window.scrollY <= 1
      return current === next ? current : next
    })
    addEventListener('scroll', update, { passive: true })
    update()
    return () => removeEventListener('scroll', update)
  }, [])
  const items = [['top','Home'],['services','Services'],['projects','Our Work'],['freelance','Client Work'],['process','Our Process'],['about','About Us'],['contact','Contact']]
  return (
    <header className={`nav${isHome ? ' is-home' : ' is-scrolled'}`}>
      <a href="#top" onClick={go('top')} className="nav-name">Autometrics</a>
      <nav aria-label="Main navigation">{items.map(([id,label]) => <a key={id} href={'#'+id} onClick={go(id)}>{label}</a>)}</nav>
      <a className="nav-cta" href="#contact" onClick={go('contact')}>Discuss Your Project</a>
    </header>
  )
}

/* ---- case study modal ---- */
export function Modal() {
  const open = useUI((s) => s.open), ref = useRef(), btn = useRef(), prev = useRef(), [zoom, setZoom] = useState(null)
  const close = () => { const el = ref.current; if (ST.rm) return fin(); gsap.to(el, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.7, ease: 'power4.inOut', onComplete: fin }) }
  const fin = () => { useUI.setState({ open: -1 }); startScroll(); prev.current && prev.current.focus && prev.current.focus() }
  useEffect(() => {
    if (open < 0) return
    prev.current = document.activeElement; stopScroll(); btn.current.focus()
    if (!ST.rm) { gsap.fromTo(ref.current, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power4.inOut' }); gsap.from('.cs > *', { y: 40, opacity: 0, duration: 0.9, stagger: 0.05, delay: 0.45, ease: 'power3.out' }) }
    const k = (e) => { if (e.key === 'Escape') { zoom ? setZoom(null) : close() } }; addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [open, zoom])
  if (open < 0) return null
  const freelanceIndex = PROJECTS.length + PARTNER_PROJECTS.length
  if (open === freelanceIndex) {
    const p = FREELANCE_PROJECT
    const S = (h, b) => <section className="cs-sec"><h3>{h}</h3>{b}</section>
    return (
      <div className="modal" ref={ref} role="dialog" aria-modal="true" aria-labelledby="mt" data-lenis-prevent>
        <button className="btn ghost modal-x" ref={btn} onClick={close}>Close</button>
        <div className="cs">
          <p className="mono">{p.category}</p><h2 id="mt">{p.title}</h2>
          {S('Client and business challenge', <><p>{p.summary}</p><ul>{p.challenge.map((item) => <li key={item}>{item}</li>)}</ul></>)}
          {S('Solution delivered', <ul>{p.solution.map((item) => <li key={item}>{item}</li>)}</ul>)}
          {S('Project capabilities', <ul>{p.features.map((item) => <li key={item}>{item}</li>)}</ul>)}
          {S('Data and scope', <p>{p.data}</p>)}
          {S('Tools and platforms', <div className="tools">{p.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>)}
          {S('Project screenshots', <div className="gal">{p.shots.map((shot) => <figure key={shot.src}><img src={shot.src} alt={`${p.title}: ${shot.label}`} loading="lazy" onClick={() => setZoom({ src: shot.src, label: shot.label })} data-cursor /><figcaption>{shot.label}</figcaption></figure>)}</div>)}
          <div className="cta"><a className="btn solid" href={p.repo} target="_blank" rel="noopener noreferrer">Open project repository</a></div>
        </div>
        {zoom && <div className="zoom" onClick={() => setZoom(null)}><img src={zoom.src} alt={zoom.label} /></div>}
      </div>
    )
  }
  if (open >= PROJECTS.length) {
    const p = PARTNER_PROJECTS[open - PROJECTS.length]
    if (!p) return null
    const S = (h, b) => <section className="cs-sec"><h3>{h}</h3>{b}</section>
    return (
      <div className="modal" ref={ref} role="dialog" aria-modal="true" aria-labelledby="mt" data-lenis-prevent>
        <button className="btn ghost modal-x" ref={btn} onClick={close}>Close</button>
        <div className="cs">
          <p className="mono">{p.category}</p><h2 id="mt">{p.title}</h2>
          <div className="cs-stats">{p.stats.map((stat) => <div key={stat[2]}><b>{stat[0]}{stat[1]}</b><span>{stat[2]}</span></div>)}</div>
          {S('Project overview', <p>{p.summary}</p>)}
          {S('Data and scope', <p>{p.data}</p>)}
          {S('Tools', <div className="tools">{p.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>)}
          {S('Key findings and outputs', <ul>{p.proof.map((finding) => <li key={finding}>{finding}</li>)}</ul>)}
          {S('Dashboard preview', <div className="gal"><figure><img src={p.image} alt={p.alt} onClick={() => setZoom({ src: p.image, label: p.alt })} data-cursor /><figcaption>{p.alt}</figcaption></figure></div>)}
          <div className="cta"><a className="btn solid" href={p.repo} target="_blank" rel="noopener">Open repository on GitHub</a></div>
        </div>
        {zoom && <div className="zoom" onClick={() => setZoom(null)}><img src={zoom.src} alt={zoom.label} /></div>}
      </div>
    )
  }
  const p = PROJECTS[open], c = p.cs
  const S = (h, b) => <section className="cs-sec"><h3>{h}</h3>{b}</section>
  return (
    <div className="modal" ref={ref} role="dialog" aria-modal="true" aria-labelledby="mt" data-lenis-prevent>
      <button className="btn ghost modal-x" ref={btn} onClick={close}>Close</button>
      <div className="cs">
        <p className="mono">{p.k}</p><h2 id="mt">{p.t}</h2>
        <div className="cs-stats">{p.stats.map((s) => <div key={s[2]}><b>{s[0]}{s[1]}</b><span>{s[2]}</span></div>)}</div>
        {S('Business problem', <p>{c.problem}</p>)}{S('Objective', <p>{c.obj}</p>)}{S('Dataset and source', <p>{c.data}</p>)}{S('Data preparation', <p>{c.prep}</p>)}{S('Analytical methods', <p>{c.meth}</p>)}
        {S('Tools', <div className="tools">{c.tools.map((t) => <span key={t} title={NAMES[t]}><Logo k={t} />{NAMES[t]}</span>)}</div>)}
        {S('Key findings', <ul>{c.find.map((f) => <li key={f}>{f}</li>)}</ul>)}{S('Recommendations and implications', <ul>{c.rec.map((f) => <li key={f}>{f}</li>)}</ul>)}
        {S('Dashboard screenshots', <div className="gal">{p.shots.map((s) => <figure key={s[0]}><img src={IMG(s[0])} alt={`${p.t}: ${s[1]}`} loading="lazy" onClick={() => setZoom({ src: IMG(s[0]), label: s[1] })} data-cursor /><figcaption>{s[1]}</figcaption></figure>)}</div>)}
        <div className="cta"><a className="btn solid" href={p.repo} target="_blank" rel="noopener">Open repository on GitHub</a></div>
      </div>
      {zoom && <div className="zoom" onClick={() => setZoom(null)}><img src={zoom.src} alt={zoom.label} /></div>}
    </div>
  )
}
