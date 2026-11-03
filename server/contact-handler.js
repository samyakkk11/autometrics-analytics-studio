const services = new Set([
  'Business Intelligence & Dashboards',
  'Business & Customer Analytics',
  'Reporting & Workflow Automation',
  'Advanced & Predictive Analytics',
  'Ongoing Analytics Support',
  'Other',
])

const text = (value) => (typeof value === 'string' ? value.trim() : '')
const reply = (status, message) => ({ status, body: { ...(status < 400 ? { ok: true } : { ok: false }), ...(message ? { error: message } : {}) } })

export async function submitContactInquiry(payload, headers = {}) {
  const origin = headers.origin
  const host = headers.host
  if (origin && host) {
    try {
      if (new URL(origin).host.toLowerCase() !== String(host).toLowerCase()) return reply(403, 'This form can only be submitted from the Autometrics website.')
    } catch {
      return reply(403, 'This form can only be submitted from the Autometrics website.')
    }
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return reply(400, 'Please check the form and try again.')
  // Quietly accept honeypot submissions without saving them.
  if (text(payload.website)) return reply(200)

  const inquiry = {
    name: text(payload.name),
    email: text(payload.email).toLowerCase(),
    company: text(payload.company),
    service: text(payload.service),
    description: text(payload.description),
    budget: text(payload.budget),
  }

  if (!inquiry.name || inquiry.name.length > 120) return reply(400, 'Enter your name (up to 120 characters).')
  if (inquiry.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) return reply(400, 'Enter a valid business email address.')
  if (inquiry.company.length > 160) return reply(400, 'Keep the company name under 160 characters.')
  if (!services.has(inquiry.service)) return reply(400, 'Choose one of the listed services.')
  if (!inquiry.description || inquiry.description.length > 5000) return reply(400, 'Add a project description (up to 5,000 characters).')
  if (inquiry.budget.length > 80) return reply(400, 'Keep the budget under 80 characters.')

  const supabaseUrl = text(process.env.SUPABASE_URL).replace(/\/+$/, '')
  const secretKey = text(process.env.SUPABASE_SECRET_KEY)
  if (!supabaseUrl || !secretKey) {
    console.error('Contact form is missing SUPABASE_URL or SUPABASE_SECRET_KEY.')
    return reply(503, 'The inquiry form is temporarily unavailable. Please email us directly.')
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/contact_inquiries`, {
      method: 'POST',
      headers: {
        apikey: secretKey,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(inquiry),
    })
    if (!response.ok) {
      console.error(`Contact form storage returned HTTP ${response.status}.`)
      return reply(502, 'We could not save your inquiry just now. Please try again or email us directly.')
    }
    return reply(201)
  } catch (error) {
    console.error('Contact form could not reach the database.', error?.name || 'NetworkError')
    return reply(502, 'We could not save your inquiry just now. Please try again or email us directly.')
  }
}
