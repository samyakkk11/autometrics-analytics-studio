import ICONS from './icons.json'
const A = '#f4b942'
// Each logo = list of [svgPath, fill, stroke, strokeWidth]. Same data drives the DOM SVGs and the 3D textures.
const si = (k, c) => [[ICONS[k], c]]
export const LOGOS = {
  python: si('python', '#4B8BBE'),
  pandas: si('pandas', '#e8e8ee'),
  git: si('git', '#F05032'),
  github: si('github', '#e8e8ee'),
  duckdb: si('duckdb', '#FFE600'),
  scikitlearn: si('scikitlearn', '#F7931E'),
  scipy: si('scipy', '#8CAAE6'),
  apacheparquet: si('apacheparquet', '#50ABF1'),
  sql: [['M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3z', 'none', A, 1.8], ['M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6', 'none', A, 1.8], ['M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6', 'none', A, 1.8]],
  powerbi: [['M3 13h5v8H3z', '#F2C811'], ['M9.5 8h5v13h-5z', '#E8A700'], ['M16 3h5v18h-5z', '#C98400']],
  excel: [['M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3z', '#1D6F42'], ['M8 8l8 8M16 8l-8 8', 'none', '#fff', 2.2]],
  dax: [['M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3z', '#F2C811'], ['M10 17v-6a2.5 2.5 0 012.500-2.500H14M8 12.500h5M14.500 12l4.500 5M19 12l-4.500 5', 'none', '#111', 1.8]],
  powerquery: [['M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z', 'none', '#E8A700', 1.8], ['M3 9h18M9 9v11', 'none', '#E8A700', 1.8], ['M13 14.500h5m-2-2 2 2-2 2', 'none', '#E8A700', 1.8]],
}
export const NAMES = { python: 'Python', sql: 'SQL', pandas: 'pandas', duckdb: 'DuckDB', powerbi: 'Power BI', dax: 'DAX', powerquery: 'Power Query', excel: 'Excel', scikitlearn: 'scikit-learn', scipy: 'SciPy', apacheparquet: 'Parquet', git: 'Git', github: 'GitHub' }

export function drawLogo(key, size = 256) {
  const c = document.createElement('canvas'); c.width = c.height = size
  const x = c.getContext('2d'); const u = size / 2
  x.fillStyle = 'rgba(255,255,255,0.05)'; x.beginPath(); x.arc(u, u, u * .94, 0, 7); x.fill()
  x.strokeStyle = 'rgba(255,255,255,0.22)'; x.lineWidth = 3; x.stroke()
  const s = size * .56 / 24; x.save(); x.translate(size * .22, size * .22); x.scale(s, s)
  x.lineCap = 'round'; x.lineJoin = 'round'
  for (const [d, f, st, lw] of LOGOS[key]) { const p = new Path2D(d); if (f && f !== 'none') { x.fillStyle = f; x.fill(p) } if (st) { x.strokeStyle = st; x.lineWidth = lw; x.stroke(p) } }
  x.restore(); return c
}
export function Logo({ k, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {LOGOS[k].map(([d, f, st, lw], i) => <path key={i} d={d} fill={f || 'none'} stroke={st || 'none'} strokeWidth={lw} strokeLinecap="round" strokeLinejoin="round" />)}
    </svg>
  )
}
