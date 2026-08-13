# LET Reviewer

Mobile-first PWA for Licensure Examination for Teachers (LET) practice. Next.js App Router, Tailwind, and shadcn/ui, with the original study-journal look (Fraunces + Hanken Grotesk, cream paper, emerald ink).

## Clone via SSH

```bash
git clone git@github.com:ludwigst/reviewer-app.git
cd reviewer-app
```

HTTPS alternative: `git clone https://github.com/ludwigst/reviewer-app.git`

## Setup

```bash
npm install
cp .env.example .env.local
```

Add a Gemini key (optional — only needed for `POST /api/ask`) from [Google AI Studio](https://aistudio.google.com):

```
GEMINI_API_KEY=your_key_here
```

`.env.example` already includes the Supabase URL and publishable key.

## Agent plugins

Vercel plugin (project-scoped) plus copied skills for Cursor / Claude Code:

```bash
npx plugins add vercel/vercel-plugin
npx skills add vercel/vercel-plugin -y
```

Skills live in `.agents/skills/` (lockfile: `skills-lock.json`). Claude Code enables the plugin via `.claude/settings.json`.

## Supabase

Progress is cached in `localStorage` and synced to `public.reviewer_saves`. The quiz bank lives in `public.questions`.

### Apply schema with the CLI

The publishable key cannot create tables. From this repo:

```bash
export SUPABASE_ACCESS_TOKEN=sbp_...   # https://supabase.com/dashboard/account/tokens
export SUPABASE_DB_PASSWORD=...        # Project Settings → Database
npm run db:link
npm run db:push
```

That applies:

- `supabase/migrations/20260813133505_reviewer_saves.sql`
- `supabase/migrations/20260813133517_questions.sql` (creates `questions` and seeds 20 NLE Nursing Practice I items)

### SQL Editor fallback

If you prefer the dashboard, run those two files in the [SQL Editor](https://supabase.com/dashboard/project/ljkxgryzrfunlbnbymga/sql/new).

MCP config is in `.cursor/mcp.json` (scoped to this project). Authenticate Cloud Agents at [cursor.com/agents](https://cursor.com/agents) → MCP → Connect on Supabase.

The hosted project already has `reviewer_saves` and 20 `questions` rows. If you clone a fresh database, apply the migrations above.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production:

```bash
npm run build
npm start
```

## Add to your phone home screen

The app ships a web app manifest. On the same Wi‑Fi as the machine running the server:

- **iPhone (Safari):** Share → Add to Home Screen
- **Android (Chrome):** menu → Add to Home screen

## What this rewrite keeps

- Onboarding (name, Elementary/Secondary track, specialization, optional exam date)
- Home stats, 50% component floor, Quick / Topic / Mock launchers
- Timed mock exams, instant-feedback practice, answer review + bookmarks
- Topic mastery accordion, localStorage cache, and Supabase sync (`reviewer_saves`)
- Gemini proxy at `POST /api/ask` (key stays on the server)
