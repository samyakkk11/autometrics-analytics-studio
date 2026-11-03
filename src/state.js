import { create } from 'zustand'
// hot values read every frame by the 3D scene (no React re-renders)
export const ST = { s: 0, hero: 0, heroAuto: true, heroIdle: 0, heroExit: 0, hideHeroVisual: false, engagementExit: 0, hideProcessVisual: false, hideProjectVisual: false, proc: 0, vel: 0, mx: 0, my: 0, rm: matchMedia('(prefers-reduced-motion:reduce)').matches }
// UI state that React components subscribe to
export const useUI = create(() => ({ ready: false, hover: -1, active: 0, rowHover: false, open: -1, heroStage: 0 }))
