// Six layouts of the SAME 2,400 data points: raw nebula -> table -> histogram -> scatter -> pipeline -> dashboard
export const N = 2400
function build() {
  let s = 7; const R = () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const G = () => R() + R() + R() + R() - 2
  const dup = (i) => i % 10 === 5, mis = (i) => i % 8 === 3, nd = []
  for (let i = 0; i < N; i++) if (!dup(i)) nd.push(i)
  const K = nd.length, P = [], Q = []
  for (let k = 0; k < 6; k++) { P.push(new Float32Array(N * 3)); Q.push(new Float32Array(N * 3)) }
  const FL = new Float32Array(N * 3), put = (k, i, x, y, z, al, h, c) => { P[k].set([x, y, z], i * 3); Q[k].set([al, h, c], i * 3) }
  for (let i = 0; i < N; i++) {
    if (dup(i)) { const p = P[0]; put(0, i, p[(i - 1) * 3] + 0.012, p[(i - 1) * 3 + 1] + 0.01, p[(i - 1) * 3 + 2], 1, mis(i) ? 1 : 0, mis(i) ? 1 : 0) }
    else { const a = R() * 6.283, r = 0.25 + Math.abs(G()) * 0.55; put(0, i, Math.cos(a) * r * 1.25 + G() * 0.06, G() * 0.34 * (1 + r), Math.sin(a) * r * 1.25 + G() * 0.06, 1, mis(i) ? 1 : 0, mis(i) ? 1 : 0) }
  }
  const cols = 54, rows = Math.ceil(K / cols)
  nd.forEach((i, k) => put(1, i, -0.88 + 1.76 * (k % cols) / (cols - 1), 0.82 - Math.floor(k / cols) * 1.64 / (rows - 1), 0, 1, mis(i) ? 1 : 0, mis(i) ? 1 : 0))
  const B = 28, wt = [...Array(B).keys()].map((b) => Math.exp(-((b - 13.5) ** 2) / (2 * 3.6 * 3.6))), ws = wt.reduce((a, b) => a + b)
  const key = nd.map(() => R()), ord = nd.map((_, k) => k).sort((a, b) => key[a] - key[b]), peak = wt.indexOf(Math.max(...wt))
  { let k = 0; wt.forEach((w, b) => { const n = b === B - 1 ? K - k : Math.round(K * w / ws); for (let j = 0; j < n && k < K; j++, k++) { const i = nd[ord[k]]; put(2, i, -0.88 + 1.76 * b / (B - 1) + ((j % 6) - 2.5) * 0.01, -0.7 + Math.floor(j / 6) * 0.0105, 0, 1, 0, Math.abs(b - peak) < 2 ? 1 : 0) } }) }
  nd.forEach((i) => { const x = (R() * 2 - 1) * 0.88, y = 0.7 * x + (R() + R() + R() - 1.5) * 0.34; put(3, i, x, y, (R() * 2 - 1) * 0.35, 1, 0, Math.abs(y - 0.7 * x) > 0.3 ? 1 : 0) })
  {
    const nx = [-0.8, -0.4, 0, 0.4, 0.8], ny = [0.25, -0.2, 0.25, -0.2, 0.25], nz = [-0.2, 0.1, 0.3, 0.1, -0.2]
    nd.forEach((i, k) => {
      if (k % 100 < 45) { const n = k % 5, a = R() * 6.28, r = Math.sqrt(R()) * 0.1; put(4, i, nx[n] + Math.cos(a) * r, ny[n] + Math.sin(a) * r, nz[n] + (R() - 0.5) * 0.12, 1, 0, 0) }
      else { const e = k % 4, u = R(), dx = nx[e + 1] - nx[e], dy = ny[e + 1] - ny[e]; FL.set([dx, dy, u], i * 3); put(4, i, nx[e] + dx * u, ny[e] + dy * u, nz[e] + (nz[e + 1] - nz[e]) * u, 1, 0, 1) }
    })
  }
  {
    const hs = [0.28, 0.42, 0.34, 0.58, 0.48, 0.66], top = (x) => -0.55 + 0.35 * (x - 0.2) / 0.75 + 0.12 * Math.sin(x * 9)
    const gen = (g) => { const S = [], add = (x0, x1, y0, y1, z, c) => { for (let x = x0 + g / 2; x < x1; x += g) for (let y = y0 + g / 2; y < y1; y += g) S.push([x + (R() - 0.5) * g * 0.25, y + (R() - 0.5) * g * 0.25, z, c]) }
      ;[[-0.9, -0.52, 1], [-0.32, 0.06, 0], [0.26, 0.64, 0]].forEach((t) => add(t[0], t[1], 0.58, 0.88, 0.16, t[2]))
      hs.forEach((h, b) => add(-0.9 + b * 0.17, -0.9 + b * 0.17 + 0.12, -0.8, -0.8 + h, 0.06, b === 5 ? 1 : 0))
      for (let x = 0.2 + g / 2; x < 0.95; x += g) { const t = top(x); for (let y = -0.8 + g / 2; y < t; y += g) S.push([x, y + (R() - 0.5) * g * 0.25, 0, y > t - 0.07 ? 1 : 0]) } return S }
    let g = 0.0212; for (let it = 0; it < 4; it++) g *= Math.sqrt(gen(g).length / K)
    const S = gen(g); nd.forEach((i, k) => { const q = S[Math.min(S.length - 1, Math.floor(k * S.length / K))]; put(5, i, q[0], q[1], q[2], 1, 0, q[3]) })
  }
  for (let k = 1; k < 6; k++) for (let i = 0; i < N; i++) if (dup(i)) { const p = P[k]; put(k, i, p[(i - 1) * 3], p[(i - 1) * 3 + 1], p[(i - 1) * 3 + 2], 0, 0, 0) }
  return { P, Q, FL }
}
export const DATA = build()
