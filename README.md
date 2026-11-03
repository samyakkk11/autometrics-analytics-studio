# Independent Data Analytics Studio

A collaborative analytics website built on the original Samyak portfolio project. It preserves the original dark, space-themed visual system, typography, Three.js visualizations, GSAP motion, smooth scrolling, and project case-study interactions while presenting studio services and six personal and collaborative projects in Selected Work, followed by a separate freelance client-work section.

## Run locally

Requires Node.js 20 or newer. From this folder:

```sh
npm ci
npm run dev
```

Build for production with `npm run build`; Vite writes the deployable site to `dist/`.

## Site contents

- Hero, service offerings, a shared skills section, four-step process, engagement options, a six-project Selected Work collection, freelance client work, technology marquee, and inquiry form.
- The original three project case studies remain first and in their existing order; three documented GitHub projects follow in the same collection.
- Partner dashboard screenshots are genuine repository assets. Project data sources are not disclosed by their repositories, so the site does not label them real, synthetic, or client data.
- The first three project details retain their existing metrics, screenshot galleries, links, and dataset disclosures.
- Freelance Client Work documents the IndieCraft Business Manager project and uses screenshots from its public repository.

## Selected project repositories

- [GamePulse Market Intelligence](https://github.com/Shantilal657/GamePulse-Market-Intelligence)
- [Vendor Performance Analysis](https://github.com/Shantilal657/Vendor-Performance-Analysis)
- [Credit Card Financial Weekly Dashboard](https://github.com/Shantilal657/Credit-Card-Financial-Weekly-Dashboard)

## Freelance client project

- [IndieCraft Business Manager](https://github.com/samyakkk11/IndieCraft-Business-Manager)
- Verified repository screenshots are included in `public/freelance-indiecraft/`.

## Contact form database setup

The contact form posts to a same-origin serverless function and stores inquiries in Supabase Postgres. Both Netlify and Vercel function handlers are included. The Supabase secret key is used only on the server and must never be added to frontend code or committed to Git.

1. Create a Supabase project.
2. In Supabase **SQL Editor**, run [`supabase/contact_inquiries.sql`](supabase/contact_inquiries.sql). The table has row-level security enabled and grants no access to anonymous or signed-in website visitors.
3. In Supabase **Settings → API Keys**, copy the project URL and a server-side **secret key** (`sb_secret_...`). Supabase secret keys bypass row-level security, so keep this key only in hosting environment variables.
4. Add these environment variables in the host dashboard:
   - `SUPABASE_URL` — your Supabase project URL.
   - `SUPABASE_SECRET_KEY` — the Supabase secret key.
5. Deploy the project. Netlify uses `netlify/functions/contact.mjs` and `netlify.toml`; Vercel uses `api/contact.js`. Both expose the same `/api/contact` route.

For local function testing, install/use the matching CLI and run `netlify dev` or `vercel dev`. Copy `.env.example` to the local env file supported by that CLI and fill in the two values. Do not commit the filled env file. `npm run dev` alone serves the Vite frontend and does not run serverless functions.

Submissions are validated server-side and include a hidden honeypot field. Successful submissions are stored with their name, email, company, requested service, project description, optional budget, and creation timestamp. The form reports errors if the function or database is not configured, rather than pretending to save the inquiry.

## Project structure

- `src/sections.jsx` — page sections and inquiry form.
- `src/partner-projects.js` — partner project information.
- `src/freelance-project.js` — IndieCraft project overview and screenshot labels.
- `src/showcase.js` — shared ordering and screenshots used by the project viewer.
- `src/data.js` — original project case studies, skills, tools, and process stages.
- `src/gl/` — animated Three.js visualizations.
- `server/contact-handler.js` — shared validation and Supabase insert logic.
- `api/contact.js` and `netlify/functions/contact.mjs` — Vercel and Netlify endpoint adapters.
- `supabase/contact_inquiries.sql` — private inquiry table setup.
- `public/partner-projects/` — partner repository dashboard screenshots.
- `public/freelance-indiecraft/` — screenshots from the IndieCraft repository.
