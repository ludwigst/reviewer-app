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

## Supabase

Progress is cached in `localStorage` and synced to `public.reviewer_saves`.

1. Confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`.
2. In the [SQL Editor](https://supabase.com/dashboard/project/ljkxgryzrfunlbnbymga/sql/new), run the migration at `supabase/migrations/20260813130532_reviewer_saves.sql`.
3. Reload the app and complete onboarding — a row keyed by `device_id` should appear in Table Editor.

Until that migration is applied, the app still works offline; sync attempts log `Supabase pull/push skipped` in the browser console.

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
