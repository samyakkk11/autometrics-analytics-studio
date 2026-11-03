import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ST, useUI } from './state'
import { SKILLS, STACK, STAGES } from './data'
import { SELECTED_WORK, FREELANCE_SHOWCASE } from './showcase.js'
import { CONFIG } from './config'
import { Logo, NAMES } from './logos.jsx'
import { ContactIcon } from './contact-icons.jsx'
import { scrollToY } from './scroll'
import { splitEl, useReveal, Magnetic, go } from './ui.jsx'
import samyakPortrait from './img/samyak.jpg'
import shantilalPortrait from './img/shantilal.png'

/* ============================== HERO */
export function Hero() {
  const ref = useRef(), ready = useUI((s) => s.ready), stage = useUI((s) => s.heroStage)
  useLayoutEffect(() => { if (ST.rm) return; const w = splitEl(ref.current.querySelector('h1')); gsap.set(w, { yPercent: 115 }); gsap.set(ref.current.querySelectorAll('[data-h]'), { opacity: 0, y: 24 }); gsap.set(ref.current.querySelector('.hero-foot'), { opacity: 0 }) }, [])
  useEffect(() => {
    if (!ready || ST.rm) return
    const w = ref.current.querySelectorAll('h1 .wi'), tl = gsap.timeline({ delay: 0.5, defaults: { ease: 'power3.out' } })
    tl.to(w, { yPercent: 0, duration: 1.3, stagger: 0.1, ease: 'power4.out' }, 0).to(ref.current.querySelectorAll('[data-h]'), { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0.4).to(ref.current.querySelector('.hero-foot'), { opacity: 1, duration: 1 }, 1.2)
  }, [ready])
  useLayoutEffect(() => { if (ST.rm) return; const t = gsap.to(ref.current.querySelector('.hero-copy'), { yPercent: -14, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } }); return () => t.scrollTrigger && t.scrollTrigger.kill() }, [])
  return (
    <section id="top" className="hero" ref={ref}>
      <div className="hero-copy">
        <h1 aria-label="Turn your business data into decisions.">Turn your business data into <em>decisions.</em></h1>
        <p className="sub" data-h>We help businesses transform raw data into actionable insights through business intelligence, data analysis, interactive dashboards, and reporting automation.</p>
        <div className="cta" data-h><Magnetic><a className="btn solid" href="#contact" onClick={go('contact')}>Discuss Your Project</a></Magnetic><Magnetic><a className="btn ghost" href="#projects" onClick={go('projects')}>Explore Our Work</a></Magnetic></div>
      </div>
      <div className="hero-foot" aria-hidden="true">
        <span className="mono">scroll</span>
        <ul className="chips">{['Raw Data', 'Prepare', 'Analyze', 'Insights', 'Decisions'].map((c, i) => <li key={c} className={stage === i ? 'on' : ''}>{c}</li>)}</ul>
        <span className="mono right">analytics · dashboards · reporting</span>
      </div>
    </section>
  )
}

/* ============================== SERVICES */
export function Services() {
  const ref = useRef(); useReveal(ref)
  const services = [
    ['01', 'Business Intelligence & Dashboards', 'Transform scattered business data into clear, interactive dashboards that make performance easier to understand.', 'Power BI · KPI reporting · sales and revenue · operational reporting'],
    ['02', 'Business & Customer Analytics', 'Explore business data to identify patterns, understand customer behavior, and uncover opportunities for improvement.', 'Exploratory analysis · segmentation · profitability · trends'],
    ['03', 'Reporting & Workflow Automation', 'Reduce repetitive reporting work by improving data preparation, consolidation, and analytical workflows.', 'Excel · Power Query · Python · SQL workflows'],
    ['04', 'Advanced & Predictive Analytics', 'Use statistical methods and suitable predictive models to investigate patterns and support informed planning.', 'Statistical analysis · forecasting · anomaly detection · retention'],
  ]
  return <section id="services" className="sec services" ref={ref}>
    <div className="section-heading"><p className="eyebrow">HOW WE CAN HELP</p><h2 data-split>Practical analytics for real business questions.</h2><p className="lead" data-fade>Start with the decision you need to make. We shape the analysis and deliverables around your data and requirements.</p></div>
    <div className="service-grid">{services.map(([n,t,d,tools]) => <article className="service-card" key={n} data-fade><span className="service-number">{n}</span><div><h3>{t}</h3><p>{d}</p><p className="service-tools">{tools}</p><a className="text-link" href="#contact" onClick={go('contact')}>Discuss this service <span aria-hidden="true">↗</span></a></div></article>)}</div>
  </section>
}

/* ============================== ABOUT & SKILLS */
export function Skills() {
  const ref = useRef(); useReveal(ref)
  const hover = useUI((s) => s.hover)
  useEffect(() => {
    if (!matchMedia('(pointer:coarse)').matches) return
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) useUI.setState({ hover: +e.target.dataset.i }) }), { rootMargin: '-42% 0px -42% 0px' })
    ref.current.querySelectorAll('.rows li').forEach((l) => io.observe(l)); return () => io.disconnect()
  }, [])
  return (
    <section id="about" className="sec skills" ref={ref}>
      <div className="col about-skills">
        <p className="eyebrow">ABOUT THE STUDIO</p>
        <h2 data-split>A trusted partner for data-led decisions.</h2>
        <p className="lead" data-fade>Autometrics helps businesses turn scattered data into clear, practical insight. We deliver dashboards, reporting, and deeper analysis shaped around the decisions your team needs to make.</p>
        <ul className="rows" onPointerLeave={() => useUI.setState({ hover: -1 })} aria-label="Shared analytical toolkit">
          {SKILLS.map((s, i) => (
            <li key={s[0]} data-i={i} data-fade className={hover === i ? 'on' : ''} onPointerEnter={() => useUI.setState({ hover: i })}>
              <Logo k={s[0]} className="rowlogo" /><div><b>{s[1]}</b><span>{s[2]}</span></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ============================== PROCESS (four client steps; original data animation retained) */
export function Process() {
  const ref = useRef(), [n, setN] = useState(0), last = useRef(0); useReveal(ref)
  useEffect(() => { let raf; const loop = () => { const k = Math.round(ST.proc); if (k !== last.current) { last.current = k; setN(k) } raf = requestAnimationFrame(loop) }; loop(); return () => cancelAnimationFrame(raf) }, [])
  useEffect(() => { if (ST.rm) return; gsap.fromTo('.stg h3,.stg p.d', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'power3.out' }) }, [n])
  const jump = (i) => { const s = document.getElementById('story'), y = s.getBoundingClientRect().top + scrollY + (s.offsetHeight - innerHeight) * (i / 3) + 2; scrollToY(y) }
  const g = STAGES[n]
  const engagements = [
    ['One-Time Analytics Project', 'A defined dashboard, analysis or reporting requirement, scoped together before work begins.'],
    ['Reporting & Automation', 'Streamline recurring data preparation, consolidation and reporting tasks.'],
    ['Ongoing Analytics Support', 'Recurring reporting, analysis or dashboard improvements by agreement.'],
  ]
  return (
    <section id="process" ref={ref}>
      <div className="sec intro"><p className="eyebrow">A CLEAR, COLLABORATIVE WORKFLOW</p><h2 data-split>From first question to <em>useful delivery.</em></h2><p className="lead" data-fade>We keep scope, data limitations and next steps visible throughout the work.</p></div>
      <div className="story" id="story"><div className="stick"><div className="stg" aria-live="polite"><span className="mono acc">step {n + 1} of 4 · {g[0]}</span><h3>{g[1]}</h3><p className="d">{g[2]}</p><p className="key">{g[3]}</p><div className="dots">{STAGES.map((s, i) => <button key={s[0]} className={i === n ? 'on' : ''} aria-label={`Go to step ${i + 1}: ${s[1]}`} aria-current={i === n} onClick={() => jump(i)}>{String(i + 1).padStart(2,'0')}</button>)}</div></div></div></div>
      <div className="engagement sec" id="engagement"><div className="section-heading"><p className="eyebrow">WAYS TO WORK TOGETHER</p><h2 data-split>Start with the scope that fits.</h2></div><div className="engagement-grid">{engagements.map(([t,d],i)=><article className="engagement-card" key={t} data-fade><span className="service-number">0{i+1}</span><h3>{t}</h3><p>{d}</p></article>)}</div><a className="btn solid" href="#contact" onClick={go('contact')}>Request a Project Estimate</a><p className="note">Scope and budget are discussed before any work is agreed.</p></div>
    </section>
  )
}

/* ============================== STACK (marquee reacts to scroll velocity) */
export function Stack() {
  const ref = useRef(), track = useRef(); useReveal(ref)
  useEffect(() => {
    if (ST.rm) return
    const tw = gsap.to(track.current, { xPercent: -50, duration: 50, ease: 'none', repeat: -1 })
    const tick = () => { const v = Math.abs(ST.vel), s = tw.timeScale(), want = 1 + Math.min(8, v * 0.35); tw.timeScale(s + (want - s) * 0.08) }
    gsap.ticker.add(tick); const h = ref.current.querySelector('.mq'), p = () => tw.pause(), r = () => tw.resume()
    h.addEventListener('pointerenter', p); h.addEventListener('pointerleave', r)
    return () => { gsap.ticker.remove(tick); tw.kill(); h.removeEventListener('pointerenter', p); h.removeEventListener('pointerleave', r) }
  }, [])
  const items = (dup) => STACK.map((k) => <div className="mi" key={k + dup} aria-hidden={dup ? 'true' : undefined}><Logo k={k} /><span>{NAMES[k]}</span></div>)
  return (
    <section id="stack" className="stack" ref={ref}>
      <h2 className="stack-heading">Tools behind our analysis.</h2>
      <div className="mq" data-fade><div className="track" ref={track}>{items('')}{items('d')}</div></div>
    </section>
  )
}

/* ============================== PROJECTS (original hover list + floating WebGL viewer) */
function WorkList({ projects, startIndex = 0, numberStart = startIndex }) {
  const active = useUI((s) => s.active)
  const activate = (index) => useUI.setState({ active: index, rowHover: true })
  return (
    <ul className="plist" onPointerLeave={() => useUI.setState({ rowHover: false })}>
      {projects.map((p, localIndex) => {
        const index = startIndex + localIndex
        return (
          <li key={p.title} data-fade className={active === index ? 'on' : ''}>
            <button onPointerEnter={() => activate(index)} onFocus={() => activate(index)} onBlur={() => useUI.setState({ rowHover: false })} onClick={() => { activate(index); if (p.type === 'personal') useUI.setState({ open: p.originalIndex }); if (p.type === 'partner' || p.type === 'freelance') useUI.setState({ open: p.caseOpenIndex }) }} data-cursor aria-expanded={active === index}>
              <span className="mono">{String(numberStart + localIndex + 1).padStart(2, '0')}</span><span className="pt">{p.title}</span><span className="arrow" aria-hidden="true">↗</span>
            </button>
            <div className="pmore"><div>
              <p className="mono">{p.type === 'partner' ? p.tools.join(' · ') : p.category}</p>
              <p>{p.summary}</p>
              {p.type === 'personal' && <div className="pstats">{p.stats.map((stat) => <div key={stat[2]}><b>{stat[0]}{stat[1]}</b><span>{stat[2]}</span></div>)}</div>}
              {p.type === 'partner' && <div className="pstats">{p.stats.map((stat) => <div key={stat[2]}><b>{stat[0]}{stat[1]}</b><span>{stat[2]}</span></div>)}</div>}
              {p.type === 'freelance' && <>
                <div className="client-work-block"><strong className="client-label">ISSUES</strong><ul className="work-facts">{p.challenge.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div className="client-work-block"><strong className="client-label">SOLVED</strong><ul className="work-facts">{p.solution.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </>}
              <div className="prow">
                {p.type === 'personal' && <button className="btn ghost sm" onClick={() => useUI.setState({ open: p.originalIndex })}>Read case study</button>}
                {p.type === 'partner' && <button className="btn ghost sm" onClick={() => useUI.setState({ open: p.caseOpenIndex })}>Read case study</button>}
                {p.type === 'freelance' ? <button className="btn ghost sm" onClick={() => useUI.setState({ open: p.caseOpenIndex })}>Read case study</button> : <a className="btn ghost sm" href={p.repo} target="_blank" rel="noopener">GitHub</a>}
              </div>
            </div></div>
          </li>
        )
      })}
    </ul>
  )
}

export function Projects() {
  const ref = useRef(); useReveal(ref)
  return (
    <section id="projects" className="sec projects" ref={ref}>
      <div className="col">
        <p className="eyebrow">OUR WORK</p>
        <h2 data-split>Selected work</h2>
        <p className="lead" data-fade>Projects covering customer retention, investment research, supply-chain performance, and financial reporting.</p>
        <WorkList projects={SELECTED_WORK} />
      </div>
    </section>
  )
}

export function FreelanceClientWork() {
  const ref = useRef(); useReveal(ref)
  useEffect(() => {
    const section = ref.current
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) useUI.setState({ active: SELECTED_WORK.length, rowHover: true })
      else useUI.setState({ rowHover: false })
    }, { threshold: 0.2 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])
  return (
    <section id="freelance" className="sec projects freelance-work" ref={ref}>
      <div className="col">
        <p className="eyebrow">CLIENT ENGAGEMENT · {FREELANCE_SHOWCASE.client.toUpperCase()}</p>
        <h2 data-split>Client work</h2>
        <p className="lead" data-fade>IndieCraft needed a clearer way to manage orders, invoices, and payments. We delivered an automated business manager and reporting tools.</p>
        <WorkList projects={[FREELANCE_SHOWCASE]} startIndex={SELECTED_WORK.length} numberStart={0} />
      </div>
    </section>
  )
}

/* ============================== CONTACT */
export function Contact() {
  const ref = useRef(), [status, setStatus] = useState(''); useReveal(ref)
  const submit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget, values = Object.fromEntries(new FormData(form).entries())
    setStatus('Sending your inquiry…')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'We could not submit your inquiry. Please try again.')
      form.reset()
      setStatus('Thank you. Your inquiry has been received, and our team will follow up.')
    } catch (error) {
      setStatus(error.message || 'We could not submit your inquiry. Please try again.')
    }
  }
  return (
    <section id="contact" className="sec contact" ref={ref}>
      <div className="contact-layout">
        <div className="contact-copy">
          <p className="eyebrow">PROJECT INQUIRIES</p>
          <h2 data-split>Have data? Let’s put it to work.</h2>
          <p className="lead" data-fade>Tell us about your business challenge, and we’ll discuss the data analytics solution that best fits your requirements.</p>
          <aside className="team" aria-label="Meet the team" data-fade>
            <h3>Meet the Team</h3>
            <div className="team-list">
              <article className="team-member">
                <img className="team-avatar" src={samyakPortrait} alt="Samyak Prabhulkar" />
                <div className="team-info"><h4>Samyak Prabhulkar</h4><p>Data analyst & Engineer, Dashboards, and Decision support.</p>
                  <div className="team-links" aria-label="Samyak Prabhulkar contact links">
                    <a href={`mailto:${CONFIG.email}`} aria-label="Email Samyak" title="Email"><ContactIcon type="gmail" /></a>
                    <a href={`tel:+91${CONFIG.phone}`} aria-label="Call Samyak" title="Phone"><ContactIcon type="phone" /></a>
                    <a href={CONFIG.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Samyak on LinkedIn" title="LinkedIn"><ContactIcon type="linkedin" /></a>
                    <a href={CONFIG.github} target="_blank" rel="noopener noreferrer" aria-label="Samyak on GitHub" title="GitHub"><ContactIcon type="github" /></a>
                  </div>
                </div>
              </article>
              <article className="team-member">
                <img className="team-avatar" src={shantilalPortrait} alt="Shantilal Mali" />
                <div className="team-info"><h4>Shantilal Mali</h4><p>AI-powered analytics with an engineering foundation.</p>
                  <div className="team-links" aria-label="Shantilal Mali contact links">
                    <a href="mailto:shantilalmali657@gmail.com" aria-label="Email Shantilal" title="Email"><ContactIcon type="gmail" /></a>
                    <a href="tel:+919136893245" aria-label="Call Shantilal" title="Phone"><ContactIcon type="phone" /></a>
                    <a href="https://www.linkedin.com/in/shantilal-mali-482697221/" target="_blank" rel="noopener noreferrer" aria-label="Shantilal on LinkedIn" title="LinkedIn"><ContactIcon type="linkedin" /></a>
                    <a href="https://github.com/Shantilal657" target="_blank" rel="noopener noreferrer" aria-label="Shantilal on GitHub" title="GitHub"><ContactIcon type="github" /></a>
                  </div>
                </div>
              </article>
            </div>
          </aside>
        </div>
        <form className="inquiry-form" onSubmit={submit} onInvalid={() => setStatus('Please complete the required fields and enter a valid business email.')}>
          <div className="form-trap" aria-hidden="true"><input name="website" tabIndex="-1" autoComplete="off" /></div>
          <label>Your name<input name="name" autoComplete="name" required /></label>
          <label>Business email<input type="email" name="email" autoComplete="email" required /></label>
          <label>Company or business<input name="company" autoComplete="organization" /></label>
          <label>Service required<select name="service" required defaultValue=""><option value="" disabled>Select a service</option><option>Business Intelligence &amp; Dashboards</option><option>Business &amp; Customer Analytics</option><option>Reporting &amp; Workflow Automation</option><option>Advanced &amp; Predictive Analytics</option><option>Ongoing Analytics Support</option><option>Other</option></select></label>
          <label>Project description<textarea name="description" rows="2" required /></label>
          <label>Estimated budget <span className="optional">(optional)</span><input name="budget" /></label>
          <button className="btn solid" type="submit">Discuss Your Project</button>
          <p className="form-status" aria-live="polite">{status || 'Your inquiry is saved so our team can follow up about your project.'}</p>
        </form>
        <footer className="studio-footer">
          <span>© Autometrics · Mumbai</span>
          <nav aria-label="Footer navigation"><a href="#services" onClick={go('services')}>Services</a><a href="#projects" onClick={go('projects')}>Our Work</a><a href="#process" onClick={go('process')}>Our Process</a><a href="#about" onClick={go('about')}>About Us</a></nav>
    
          <a href="#top" onClick={go('top')}>Back to top ↑</a>
        </footer>
      </div>
    </section>
  )
}
