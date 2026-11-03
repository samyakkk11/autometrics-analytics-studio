import { submitContactInquiry } from '../server/contact-handler.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed.' })
  }
  const result = await submitContactInquiry(req.body, req.headers)
  return res.status(result.status).json(result.body)
}
