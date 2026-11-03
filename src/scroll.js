import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ST } from './state'
gsap.registerPlugin(ScrollTrigger)
const IDS = ['top', 'services', 'about', 'process', 'projects', 'freelance', 'stack', 'contact']
const STATION = [0, 0, 1, 2, 3, 4, 5, 6]
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), sm = (t) => t * t * (3 - 2 * t)
let tops = [], story, engagement, lenis = null, last = 0, heroWasAuto = true, heroStartY = 0, heroBase = 0
function measure() { tops = IDS.map((id) => { const e = document.getElementById(id); return e ? e.getBoundingClientRect().top + scrollY : 0 }); story = document.getElementById('story'); engagement = document.getElementById('engagement') }
function update() {
  const y = scrollY; let i = 0
  if (y <= 1) { ST.heroAuto = true; heroWasAuto = true }
  else {
    if (heroWasAuto) { heroBase = ST.heroIdle; heroStartY = y; heroWasAuto = false }
    ST.heroAuto = false
    const distance = Math.max(1, (tops[1] || innerHeight) - heroStartY)
    ST.hero = cl(heroBase + Math.max(0, y - heroStartY) / distance, 0, 4.999)
  }
  ST.heroExit = y <= 1 ? 0 : sm(cl(y / Math.max(1, tops[1] || innerHeight)))
  ST.hideHeroVisual = y >= (tops[1] || Infinity)
  const engagementTop = engagement?.getBoundingClientRect().top ?? Infinity
  const engagementAbsoluteTop = engagement ? engagementTop + y : 0
  ST.engagementExit = engagement ? sm(cl((innerHeight * 0.8 - engagementTop) / (innerHeight * 0.8))) : 0
  ST.hideProcessVisual = !!engagement && engagementTop <= 0
  ST.hideProjectVisual = !!engagement && y < engagementAbsoluteTop + engagement.offsetHeight * 0.5
  while (i < tops.length - 1 && y >= tops[i + 1] - 1) i++
  if (i >= tops.length - 1) ST.s = STATION[STATION.length - 1]
  else {
    let f = (y - tops[i]) / Math.max(1, tops[i + 1] - tops[i])
    const start = i === 1 || i === 2 ? 0.76 : i === 3 ? 0.72 : i === 4 || i === 5 ? 0.78 : i === 6 ? 0.5 : 0.55
    if (i === 3 && engagement) {
      const transitionStart = engagementAbsoluteTop + engagement.offsetHeight * 0.5
      f = cl((y - transitionStart) / Math.max(1, tops[i + 1] - transitionStart))
      ST.s = STATION[i] + (STATION[i + 1] - STATION[i]) * sm(f)
    } else ST.s = STATION[i] + (STATION[i + 1] - STATION[i]) * sm(cl((f - start) / (1 - start)))
  }
  if (story) { const r = story.getBoundingClientRect(); ST.proc = cl(-r.top / Math.max(1, story.offsetHeight - innerHeight)) * 3 }
  const v = lenis ? lenis.velocity : scrollY - last; last = scrollY; ST.vel += (v - ST.vel) * 0.12
}
export function scrollToId(id) {
  const el = id === 'top' ? 0 : document.getElementById(id)
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.8 }); else scrollTo({ top: el ? el.getBoundingClientRect().top + scrollY : 0 })
}
export const scrollToY = (y) => (lenis ? lenis.scrollTo(y, { duration: 1.6 }) : scrollTo({ top: y }))
export const stopScroll = () => lenis && lenis.stop()
export const startScroll = () => lenis && lenis.start()
export function initScroll() {
  if (!ST.rm) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 }); window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)
  }
  addEventListener('scroll', update, { passive: true })
  addEventListener('resize', () => { measure(); update() })
  ScrollTrigger.addEventListener('refresh', () => { measure(); update() })
  new ResizeObserver(() => { measure(); update() }).observe(document.body)
  addEventListener('pointermove', (e) => { ST.mx = e.clientX / innerWidth - 0.5; ST.my = e.clientY / innerHeight - 0.5 }, { passive: true })
  measure(); update(); return lenis
}
