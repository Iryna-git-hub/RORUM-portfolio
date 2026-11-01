# RORUM Website

Corporate website for RORUM — a Next.js app with a Sanity-powered CMS,
supporting English, Danish, and Ukrainian.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Sanity CMS
(Studio embedded at `/studio`) · Playwright + Vitest

## Quick setup

```
npm install
cp .env.example .env.local   # then fill in real values
npm run dev                  # http://localhost:3000
```

Only three variables are required to start the site; each one is explained in `.env.example`:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` — from [sanity.io/manage](https://www.sanity.io/manage) → your project.
- `NEXT_PUBLIC_SANITY_DATASET` — usually `production`.
- `NEXT_PUBLIC_SITE_URL` — a public `https://` origin (for example your Vercel URL). Localhost is
  rejected on purpose, even in development, so canonical and Open Graph URLs are never wrong.

Everything else is optional. `SANITY_API_READ_TOKEN` (a Viewer token from sanity.io/manage → API →
Tokens) enables draft preview in `/studio`. `SANITY_API_WRITE_TOKEN` is only for the local
maintenance scripts — the site never needs it.

## Core commands

```
npm run build          # production build
npm run lint            # ESLint
npm run typecheck       # tsc --noEmit
npm run test:unit       # Vitest
npm run test:e2e        # Playwright
npm run sanity:typegen  # regenerate sanity.types.ts after a schema change
```

## Deployment, environment variables, ownership & maintenance

See **[HANDOFF.md](./HANDOFF.md)** for environment variable names, Sanity/Netlify/Formspree/Billetto
setup, the ownership-transfer checklist, and known limitations.
