# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # install dependencies (first time)
npm run dev      # Next.js dev server at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint
npm run db:link  # link CLI to project ljkxgryzrfunlbnbymga (needs SUPABASE_ACCESS_TOKEN)
npm run db:push  # apply supabase/migrations to the linked remote DB
```

## Environment

Requires a `.env.local` file in the project root (see `.env.example`):

```
GEMINI_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=https://ljkxgryzrfunlbnbymga.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

CLI (not for the browser) needs `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD` to push migrations. MCP config is in `.cursor/mcp.json` / `.mcp.json` (project `ljkxgryzrfunlbnbymga`).

```bash
npm run db:link
npm run db:push
```

Get a free Gemini key at https://aistudio.google.com. Env files are gitignored (except `.env.example`).

## Agent plugins

```bash
npx plugins add vercel/vercel-plugin
npx skills add vercel/vercel-plugin -y
```

Project enablement is in `.claude/settings.json` (`vercel-plugin@vercel`). Copied skills are under `.agents/skills/` (Next.js, env vars, deploy, Vercel CLI, etc.).

## Architecture

Mobile-first PWA for Filipino teacher-licensing exam (LET) practice. Stack: Next.js App Router + React client state + shadcn/ui.

**API (`src/app/api/ask/route.ts`)** — `POST /api/ask` proxies prompts to Gemini 2.0 Flash and keeps the API key off the client. Response shape: `{ content: [{ text }] }`.

**App shell (`src/components/app-shell.tsx`)** — client-side screen router (onboarding, home, mode, quiz, results, review, progress). Durable state is cached in `localStorage` (`src/lib/store.ts`, key `letReviewer.v1`) and synced to Supabase table `public.reviewer_saves` via `src/lib/supabase/persist.ts`. Quiz state is ephemeral.

**Supabase** — browser/server clients from the shadcn `@supabase/supabase-client-nextjs` block live in `src/lib/supabase/`. `src/proxy.ts` refreshes the Auth session on each request but does not require login. Apply `supabase/migrations/*.sql` with `npm run db:push` (needs `SUPABASE_ACCESS_TOKEN` + `SUPABASE_DB_PASSWORD`) or the project SQL editor. `public.questions` is the quiz bank (seeded from the NLE nursing workbook); `public.reviewer_saves` stores per-device progress.

**Question bank** — the app loads `public.questions` from Supabase (`src/lib/question-bank.ts`). If that table is empty/unavailable it falls back to `src/data/nursing-questions.json` (20 Nursing Practice I items), then to the legacy LET bank in `src/data/questions.json`. Quiz shape: `{id, component, topic, topicGroup, difficulty, stem, choices[], answer, explanation, bloom}` where `answer` is a zero-based index into `choices`.

**Quiz engine (`src/lib/quiz.ts`)** — `getPool` filters by component/difficulty (or spec for Specialization). Questions are pre-picked at session start (no mid-session repeats). Mock mode is 20 items and timed (~60s/item); practice is 10 items.

**LET exam structure** — three components (Gen Ed, Prof Ed, Specialization), 50% floor per component. Elementary track has no Specialization.

**UI** — shadcn/ui primitives in `src/components/ui`, study-journal tokens in `src/app/globals.css` (Fraunces display + Hanken Grotesk body, cream paper, emerald ink).
