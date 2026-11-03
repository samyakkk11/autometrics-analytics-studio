import { submitContactInquiry } from '../../server/contact-handler.js'

export default async (request) => {
  const headers = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
  if (request.method !== 'POST') {
    headers.set('Allow', 'POST')
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed.' }), { status: 405, headers })
  }
  let payload
  try {
    payload = await request.json()
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Please check the form and try again.' }), { status: 400, headers })
  }
  const result = await submitContactInquiry(payload, Object.fromEntries(request.headers.entries()))
  return new Response(JSON.stringify(result.body), { status: result.status, headers })
}
