# LET Reviewer — Product Requirements Document

**Goal:** Bring the proven NLE.ph review-platform flows into the LET Reviewer, adapted for the
Licensure Examination for Teachers (LET), while keeping the app's "study journal" identity and
its offline-first, single-API-key simplicity.

**Reference product:** `https://app.nle.ph` (flows captured from a logged-in session, June 2026).
**This product:** `let-reviewer` — Express static server + vanilla JS PWA (`public/`).

---

## 1. Context

### 1.1 What NLE.ph does (captured flows)

| Area | What it does |
|------|--------------|
| **Dashboard** | "Your Ranking" (global rank by unique correct questions), "Readiness Rating" (avg of last 3 mock exams per subject), **Progress Tracker** (subject dropdown → per-topic mastery %), Community + Referral cards. |
| **Practice Tests** | Subject selector → topic groups (each with mastery %) → subtopics. Each launches a **10-item test** with a **countdown timer**, **Bloom's cognitive-level tag** (Remembering / Applying / Analyzing…), A–D card choices, prev/next pagination, live "answered / total" counter. **Detailed rationale review** after the test. History tab. |
| **Mock Exams** | One card per subject + a comprehensive set; each shows a **circular readiness gauge** ("avg of last 3"). Full timed exam. History tab. |
| **Collections** | Bookmark any question into named **collections** for later review. |
| **Profile** | Account, **Subscription** (freemium → premium), **Referrals** (earn ₱100 per upgrade). |

### 1.2 What LET Reviewer already has (`public/app.js`, `index.html`)

- Onboarding: name, track (Elementary / Secondary), specialization, optional exam date.
- Home: rotating Taglish greeting, stats (questions answered, day streak), **component scores with a 50% "floor" check**, practice launchers (Quick / Topic drill / Mock).
- Mode select: component + difficulty + mode.
- Quiz: counter, progress bar, component/difficulty tags, stem, A–D choices, **inline rationale shown immediately after answering**.
- Results: score %, correct count, **50% floor pass/fail**, weak-area list.
- Progress: totals, accuracy, by-component bars, recent sessions.
- "Study journal" design system (`public/style.css`): Fraunces + Hanken Grotesk, cream paper, emerald ink, lettered choices, staggered entrance motion.

### 1.3 Gap analysis (NLE.ph → LET Reviewer)

| # | Capability | NLE.ph | LET today | Gap |
|---|-----------|:------:|:---------:|-----|
| G1 | **Persistence** (progress survives reload) | Yes (account) | **No** (in-memory only) | Critical |
| G2 | **Topic-level Progress Tracker** (component → topic → mastery %) | Yes | Component-level only | High |
| G3 | **Post-test rationale review** screen | Yes | Inline only | Medium |
| G4 | **Mock Exams + Readiness Rating** (avg last 3) | Yes | Mock mode exists; no readiness metric | High |
| G5 | **History** of past attempts (reviewable) | Yes | Recent sessions list only (not reviewable) | Medium |
| G6 | **Collections / bookmarks** | Yes | No | Medium |
| G7 | **Test timer** | Yes | No | Low/Med |
| G8 | **Cognitive-level tags** (Bloom's) | Yes | Difficulty only | Low |
| G9 | Ranking / Community / Referrals / Subscription | Yes | No | Out of MVP scope |

### 1.4 LET-specific domain mapping

- **"Subject" (NLE)** → **"Component" (LET)**: General Education, Professional Education, Specialization.
- **"Topic group / subtopic" (NLE)** → existing `q.topic` field, to be grouped under each component.
- **Readiness / floor**: keep LET's distinctive **50% per-component floor** rule (an automatic fail
  below 50% on any component) — this is a real LET rule and a differentiator we should keep front and center.

---

## 2. Goals & non-goals

**Goals (MVP):** durable local progress, topic-level mastery tracking, a polished practice-test flow
with a reviewable rationale screen, mock exams with a readiness gauge, reviewable history, and a
collections/bookmarks feature — all offline-first.

**Non-goals (for now):** real accounts/auth, global leaderboard, payments/subscription, referrals,
external community. These require a backend + user base and are deferred (see Sprint 6, optional).

**Success metrics:**
- Progress and history persist across reloads (0 data loss).
- A user can: pick a component → drill a topic → finish a test → review every item's rationale → bookmark a missed item → see topic mastery move.
- Mock exam produces a per-component readiness rating and a 50%-floor verdict.

---

## 3. Design language (frontend-design)

Keep the existing **"study journal"** system as the source of truth; do **not** regress to system fonts
or flat fills. New surfaces must reuse the established tokens in `public/style.css`.

- **Type:** Fraunces (display) + Hanken Grotesk (body).
- **Palette:** cream paper, emerald ink, amber/red for warning/fail states (already aligned with JS).
- **New components to design within the system:**
  - **Mastery ring** (circular % gauge) — emerald→amber→red by score, used on Dashboard + Mock cards.
  - **Topic accordion** — component header (with ring) → topic rows with mini floor-bars + play affordance.
  - **Rationale review card** — per-question: your answer vs. correct, color-coded, with explanation and a "Bookmark" action.
  - **Readiness gauge card** — large ring + "avg of last 3" caption + 50%-floor badge.
  - **Timer pill** — optional countdown in the quiz top bar (calm, not anxiety-inducing; respects `prefers-reduced-motion`).
- Mobile-first (PWA), 44px tap targets, all motion behind `prefers-reduced-motion`.

---

## 4. Architecture decisions

- **Persistence:** `localStorage` (single JSON blob under one key, e.g. `letReviewer.v1`) with a
  small `store` module: `load()`, `save()`, `migrate(version)`. No backend required for MVP.
- **Question metadata:** extend each item in `public/questions.js` with `topicGroup` (and optionally
  `bloom`) so topic-level tracking and the accordion work. Backfill existing items.
- **State shape (additions):**
  - `stats.byTopic[component][topic] = { total, correct }`
  - `history[] = { id, date, mode, component, topic, score, items:[{qId, chosen, correct}] }`
  - `collections[] = { id, name, qIds:[] }`
- **No framework change.** Keep vanilla JS + the existing screen-router pattern (`goTo`/`navTo`).
- **Out-of-scope server bits** (ranking/subscription) would later reuse the existing Express server.

---

## 5. Sprint breakdown

> Sprints are scoped to be independently shippable. Each lists tasks, the files touched, and
> acceptance criteria (AC).

### Sprint 0 — Foundation: persistence & data model (enables everything)
**Why first:** without persistence, every other feature loses its data on reload.

- [x] Add a `store` module (load/save/migrate) wrapping `localStorage` key `letReviewer.v1`.
- [x] Persist `state.user`, `state.stats`, `history`, `collections`; hydrate on boot; skip onboarding if a profile exists.
- [x] Real **day-streak** logic (compare last-active date; increment/reset).
- [x] Add `topicGroup` to every question in `questions.js` (backfill); add `bloom` field (optional, default null).
- Files: `public/app.js`, new `public/store.js` (loaded in `index.html`), `public/questions.js`.
- **AC:** Reload preserves stats, history, collections, and skips onboarding. Streak increments once/day, resets after a gap.

### Sprint 1 — Progress Tracker (topic-level mastery)
- [ ] Track `stats.byTopic` on every answer.
- [ ] Dashboard/Progress: **component selector** → **topic accordion** with per-topic mastery % and mini floor-bars.
- [ ] Mastery ring component on component headers; color thresholds (≥75 emerald, 50–74 amber, <50 red).
- [ ] Keep + surface the **50% floor** per component prominently.
- Files: `public/app.js` (`renderProgress`, `renderHome`), `public/index.html`, `public/style.css`.
- **AC:** Answering questions in a topic moves that topic's % and the component ring. Topics below 50% are visibly flagged.

### Sprint 2 — Practice Test flow upgrade + Rationale Review
- [ ] Launch tests **from a topic** (not just component), pre-pick N items from that topic pool.
- [ ] Quiz top bar: question counter + (optional) **timer pill**; show **Bloom tag** when present.
- [ ] New **post-test Review screen**: list every item, your answer vs. correct (color-coded), full rationale, and a per-item **Bookmark** button.
- [ ] Keep optional inline "instant feedback" mode as a toggle (Practice) vs. review-at-end (Exam).
- Files: `public/app.js`, `public/index.html`, `public/style.css`.
- **AC:** Finishing a test opens a review where each question's correctness + rationale is visible and bookmarkable.

### Sprint 3 — Mock Exams + Readiness Rating + History
- [ ] **Mock Exams screen**: one card per component (+ a "Full LET" comprehensive set) with a **readiness ring** = avg of last 3 mock scores for that component.
- [ ] Timed mock (longer item count), end-of-exam summary with **50%-floor verdict per component**.
- [ ] **History screen/tab**: list past attempts (practice + mock) with score, date, component; tap to **re-open the Review screen**.
- Files: `public/app.js`, `public/index.html`, `public/style.css`.
- **AC:** Completing mocks updates the readiness ring (last-3 avg). History persists and each entry re-opens its rationale review.

### Sprint 4 — Collections (bookmarks)
- [ ] "Add to Collection" on any question (during review/quiz) → choose/create a named collection.
- [ ] **Collections screen**: list collections; open one to **re-practice just those questions**.
- [ ] Empty state mirrors NLE ("Use Add to Collection on any question…").
- Files: `public/app.js`, `public/index.html`, `public/style.css`.
- **AC:** A bookmarked question appears in its collection and can be re-practiced as its own session.

### Sprint 5 — Dashboard & Profile polish
- [ ] Dashboard parity: greeting, **readiness summary**, progress tracker, "days until exam" countdown (already partly present), quick-resume of last topic.
- [ ] **Profile/Settings screen**: edit name/track/spec/exam date, reset progress, export/import JSON backup (stand-in for "account").
- [ ] Local "personal best" / rank-substitute (e.g., percentile vs. own history) — no global leaderboard.
- Files: `public/app.js`, `public/index.html`, `public/style.css`.
- **AC:** User can edit their profile, back up/restore data, and see a coherent dashboard summary.

### Sprint 6 — Growth & monetization (OPTIONAL, requires backend)
> Deferred. Only pursue once there's a user base; needs auth + DB + payments.
- [ ] Accounts/auth, global **ranking/leaderboard**.
- [ ] **Subscription** (freemium gating of mock exams / question volume).
- [ ] **Referrals** + community link.
- Files: `server.js` (+ DB), `public/*`.
- **AC:** Defined per-feature when scoped.

---

## 6. Suggested sequencing & dependencies

```
Sprint 0 (persistence)  ──► Sprint 1 (topic tracker) ──► Sprint 2 (test + review)
                                                   └──► Sprint 3 (mock + readiness + history)
Sprint 2 ──► Sprint 4 (collections, needs the review/bookmark hook)
Sprint 1+3 ──► Sprint 5 (dashboard/profile polish)
Sprint 6 optional, independent (backend).
```

## 7. Open questions

1. **Timer:** include a countdown in Practice, or only in Mock? (NLE times both.) Default proposal: Mock only; Practice untimed.
2. **Bloom tags:** worth backfilling across the existing question bank, or only tag new items?
3. **Comprehensive "Full LET" mock:** mix all components in exam ratio, or keep per-component only?
4. **Backup/restore** (Sprint 5) as the MVP stand-in for accounts — acceptable, or is real auth needed sooner?
