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
- Topic mastery accordion and localStorage persistence (`letReviewer.v1`)
- Gemini proxy at `POST /api/ask` (key stays on the server)
