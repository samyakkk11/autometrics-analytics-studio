import { PROJECTS, IMG } from './data.js'
import { PARTNER_PROJECTS } from './partner-projects.js'
import { FREELANCE_PROJECT } from './freelance-project.js'

const personal = PROJECTS.map((p, index) => ({
  type: 'personal',
  title: p.t,
  category: p.k,
  summary: p.prob,
  repo: p.repo,
  stats: p.stats,
  originalIndex: index,
  shots: p.shots.map(([name, label]) => ({ src: IMG(name), label })),
}))

const partners = PARTNER_PROJECTS.map((p, caseIndex) => ({
  type: 'partner',
  caseIndex,
  caseOpenIndex: PROJECTS.length + caseIndex,
  title: p.title,
  category: p.category,
  summary: p.summary,
  repo: p.repo,
  stats: p.stats,
  data: p.data,
  tools: p.tools,
  proof: p.proof,
  shots: [{ src: p.image, label: p.alt }],
}))

const freelance = {
  type: 'freelance',
  caseOpenIndex: PROJECTS.length + PARTNER_PROJECTS.length,
  client: FREELANCE_PROJECT.client,
  title: FREELANCE_PROJECT.title,
  category: FREELANCE_PROJECT.category,
  summary: FREELANCE_PROJECT.summary,
  repo: FREELANCE_PROJECT.repo,
  data: FREELANCE_PROJECT.data,
  tools: FREELANCE_PROJECT.tools,
  challenge: FREELANCE_PROJECT.challenge,
  solution: FREELANCE_PROJECT.solution,
  features: FREELANCE_PROJECT.features,
  shots: FREELANCE_PROJECT.shots,
}

export const SELECTED_WORK = [...personal, ...partners]
export const SHOWCASE_PROJECTS = [...SELECTED_WORK, freelance]
export const SHOWCASE_SHOTS = SHOWCASE_PROJECTS.map((project) => project.shots.map((shot) => shot.src))
export const FREELANCE_SHOWCASE = freelance
