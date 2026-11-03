import { Logo } from './logos.jsx'

export function ContactIcon({ type }) {
  if (type === 'github') return <span className="contact-icon github"><Logo k="github" /></span>
  if (type === 'linkedin') return <span className="contact-icon linkedin"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6.2" r="1.5" fill="white"/><path fill="white" d="M4.5 9h3v10h-3zM10 9h2.9v1.4c.6-1 1.6-1.7 3.4-1.7 3.1 0 4.2 1.9 4.2 5V19h-3v-4.7c0-1.7-.3-2.9-2-2.9s-2.4 1.2-2.4 2.9V19h-3z"/></svg></span>
  if (type === 'phone') return <span className="contact-icon phone"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.1 3.8 4.7 5.1c-.8.5-.9 1.5-.6 2.4 2 5.9 6.5 10.4 12.4 12.4.9.3 1.9.2 2.4-.6l1.3-2.4-4.3-3.1-2 2c-2.5-1.1-4.5-3.1-5.6-5.6l2-2z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
  return <span className="contact-icon gmail"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.4v11.2" stroke="#4285F4" strokeWidth="2.6" strokeLinecap="round"/><path d="M4 6.4 12 12.5 20 6.4" stroke="#EA4335" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 6.4v11.2" stroke="#34A853" strokeWidth="2.6" strokeLinecap="round"/><path d="M4 17.6h2.3M17.7 17.6H20" stroke="#FBBC04" strokeWidth="2.6" strokeLinecap="round"/></svg></span>
}
