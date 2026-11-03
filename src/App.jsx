import { Component, useEffect, useState } from 'react'
import World from './gl/World.jsx'
import { initScroll } from './scroll'
import { Preloader, Cursor, Nav, Modal } from './ui.jsx'
import { Hero, Services, Skills, Process, Stack, Projects, FreelanceClientWork, Contact } from './sections.jsx'

class Boundary extends Component { state = { e: false }; static getDerivedStateFromError() { return { e: true } } render() { return this.state.e ? null : this.props.children } }
const webgl = () => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false } }

export default function App() {
  const [gl] = useState(webgl)
  useEffect(() => { initScroll() }, [])
  return (
    <>
      <a className="skip" href="#services">Skip to content</a>
      {gl ? <Boundary><World /></Boundary> : null}
      <Preloader /><Cursor /><Nav />
      <main className={gl ? '' : 'nogl'}><Hero /><Services /><Skills /><Process /><Projects /><FreelanceClientWork /><Stack /><Contact /></main>
      <Modal />
    </>
  )
}
