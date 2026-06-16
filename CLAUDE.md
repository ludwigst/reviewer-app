# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # install dependencies (first time)
npm start        # run the server at http://localhost:3000
```

No test runner or linter is configured.

## Environment

Requires a `.env` file in the project root:
```
GEMINI_API_KEY=your_key_here
```

Get a free key at https://aistudio.google.com. The `.env` is gitignored.

## Architecture

This is a mobile-first PWA (installable to phone home screen) for Filipino teacher-licensing exam (LET) practice. The stack is a thin Node/Express backend serving a vanilla JS single-page app.

**Backend (`server.js`)** — one route only: `POST /api/ask` proxies requests to the Gemini 2.0 Flash API. Its sole purpose is to keep the API key off the client. It normalizes Gemini's response shape into `{ content: [{ text }] }` before returning it.

**Frontend (`public/`)** — entirely vanilla JS with no build step:
- `index.html` — single HTML file with all screens pre-rendered as `<div id="screen-*">` blocks, shown/hidden via the `hidden` CSS class. Screen IDs: `screen-onboarding`, `screen-home`, `screen-mode`, `screen-quiz`, `screen-results`, `screen-progress`.
- `app.js` — all application logic. Global `state` object holds everything (user profile, cumulative stats, active quiz). State is **not persisted** — it resets on page reload. Navigation is handled by `goTo(id)` / `navTo(id, btn)`. The quiz engine pre-picks all questions at session start (no mid-session repeats).
- `questions.js` — static question bank loaded as globals. `QUESTION_BANK` holds Gen Ed and Prof Ed questions; `SPEC_QUESTIONS` is a keyed object for Secondary specializations. Each question: `{id, component, topic, difficulty, stem, choices[], answer, explanation}` where `answer` is a zero-based index into `choices`.

**Question pool selection** (`getPool` in `app.js`): filters `QUESTION_BANK` by `component` and `difficulty`, or pulls from `SPEC_QUESTIONS[state.user.spec]` for Specialization. `pickQuestion` prefers unseen questions; resets the used-set when the pool is exhausted.

**LET exam structure** reflected in the app: three components (Gen Ed, Prof Ed, Specialization), a 50% floor per component (scoring below 50% on any component fails the exam regardless of overall average). Elementary track has no Specialization component.

**PWA** — `manifest.json` + Apple/Android meta tags in `index.html` enable "Add to Home Screen" installation. The app is designed to be accessed from a phone over the same local network as the laptop running the server.
