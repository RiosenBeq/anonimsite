# Anonim

> Ask what you can't ask anywhere else.

A quiet, anonymous Q&A experience. Anonim is a place for the questions you carry around but never quite say out loud — answered by people who have been there.

This repo holds the production-ready Next.js implementation **and** the Supabase backend (Postgres schema, RLS, RPC layer, realtime) of the original `Anonim.html` design prototype.

---

## ✨ Highlights

- **Cinematic 1440px desktop layout** — dark, atmospheric, ambient gradients with film grain.
- **Orbital question galaxy** — three concentric orbits of live questions floating around a glowing core.
- **Realtime ticker** — Supabase Realtime feeds new questions into the landing-page pulse as they arrive.
- **Reading experience** — AI thread summary, helpfulness rings, four-key reactions with optimistic updates, anonymous-presence grid that uses Supabase Presence to count co-readers.
- **Ask flow** — three-step emotional-safety moment with full server-action wiring (compose → AI refinement → "out into the quiet" confirmation).
- **Knowledge map** — interactive eight-room galaxy on the Explore page, hydrated from Supabase.
- **Privacy-first identity** — no avatars, no follower counts, no auth screens; each visitor gets an HTTP-only cookie session UUID, every question gets a one-time pseudonym.

## 🧱 Stack

| Layer        | Choice                                                                |
| ------------ | --------------------------------------------------------------------- |
| Framework    | [Next.js 16](https://nextjs.org) (App Router, Turbopack, RSC)         |
| Language     | TypeScript (strict)                                                   |
| UI runtime   | React 19                                                              |
| Backend      | [Supabase](https://supabase.com) — Postgres 17, Realtime, RLS         |
| Auth model   | Cookie-based anonymous session UUID + SECURITY DEFINER RPC layer      |
| Validation   | [zod](https://zod.dev)                                                |
| Forms        | `react-hook-form` + `@hookform/resolvers` (available where needed)    |
| Time         | `date-fns`                                                            |
| Styling      | Hand-tuned CSS with design tokens (CSS custom properties)             |
| Fonts        | `next/font` — Geist, Geist Mono, Instrument Serif                     |
| Animation    | Pure CSS keyframes (orbits, pulses, twinkle, drift)                   |

## 🗂️ Structure

```
src/
├── app/                          # App Router routes
│   ├── layout.tsx                # Fonts, metadata, AppShell
│   ├── globals.css               # Tokens, base styles
│   ├── page.tsx                  # Landing (live trending questions)
│   ├── feed/page.tsx             # Feed (live questions, sidebar)
│   ├── explore/page.tsx          # Galaxy + topic stats
│   ├── ask/page.tsx              # Ask flow (server actions)
│   └── q/[id]/page.tsx           # Question detail (server-rendered)
├── components/
│   ├── AppShell.tsx              # Ambient bg + nav + grain
│   ├── Nav.tsx                   # Top nav
│   ├── Logo.tsx                  # Orbital aperture mark
│   ├── QuestionCard.tsx          # Reusable question card
│   ├── icons.tsx                 # Inline SVG icons (typed)
│   ├── primitives.tsx            # Tag, PulseDot, Eyebrow, AiMark
│   ├── landing/                  # OrbitalGalaxy, LiveTicker (realtime)
│   ├── feed/                     # FeedTabs, FeedSidebar, FeedFeatured
│   ├── detail/                   # AnswersList, AnswerBlock, ComposerInline,
│   │                             #   HelpfulnessRing, SaveButton, Presence
│   ├── ask/                      # AskFlow (3-step state machine)
│   └── explore/                  # ExploreGalaxy
├── lib/
│   ├── supabase/
│   │   ├── env.ts                # Env var loader
│   │   ├── browser.ts            # createBrowserClient (singleton)
│   │   ├── server.ts             # createServerClient (cookie-aware)
│   │   ├── database.types.ts     # Generated DB types
│   │   └── realtime.ts           # useLiveQuestions, useLiveAnswerCounts,
│   │                             #   useThreadPresence
│   ├── data.ts                   # FALLBACK_TOPICS (offline tone resolver)
│   ├── types.ts                  # Shared TS types
│   ├── queries.ts                # Server-side query helpers
│   ├── actions.ts                # Server actions (Supabase RPC wrappers)
│   ├── validators.ts             # Zod schemas
│   ├── pseudonyms.ts             # Adjective + noun pseudonym generator
│   └── session.ts                # Cookie-based session UUID
├── styles/                       # Per-page CSS modules
└── middleware.ts                 # Issues anonim_session cookie

supabase/
└── migrations/                   # Versioned SQL — re-runnable anywhere
    ├── 20260508052536_anonim_init_schema.sql
    ├── 20260508052554_anonim_rls_policies.sql
    ├── 20260508052642_anonim_seed_topics_and_demo.sql
    ├── 20260508052735_anonim_lock_down_trigger_fns.sql
    └── 20260508053043_anonim_app_rpc_functions.sql
```

## 🚀 Getting started

```bash
# 1. Install
npm install

# 2. Configure Supabase
cp .env.example .env.local
# Edit .env.local with your project URL + publishable key

# 3. Apply schema (Supabase CLI; or paste SQL into the Supabase SQL editor)
supabase link --project-ref YOUR-REF
supabase db push

# 4. Run
npm run dev      # → http://localhost:3000
npm run build    # production build
npm run lint     # ESLint flat config
```

## 🗺️ Routes

| Path        | Render mode | Description                                            |
| ----------- | ----------- | ------------------------------------------------------ |
| `/`         | Dynamic     | Landing — hero + live trending + privacy + final CTA   |
| `/feed`     | Dynamic     | Featured thread + tabs + wanderable rail + sidebar     |
| `/explore`  | Dynamic     | Interactive topic galaxy + moments + picks             |
| `/ask`      | Dynamic     | Multi-step ask flow with server-action submission      |
| `/q/[id]`   | Dynamic     | Reading view — server-rendered with realtime overlays  |

All pages set short `revalidate` windows (10–60s) so server-cached HTML feels alive without saturating the database.

## 🗄️ Data model

| Table          | Purpose                                                        |
| -------------- | -------------------------------------------------------------- |
| `topics`       | Eight reference rooms (relationships, mind, money, …)          |
| `questions`    | Asker-authored threads with denormalized counters and pulse    |
| `answers`      | Threaded replies with per-kind reaction counters and badges    |
| `reactions`    | Per-session reaction (`honest`, `warm`, `useful`, `deep`)      |
| `saves`        | Per-session bookmarks                                          |
| `topic_follows`| Per-session topic subscriptions                                |

Counters (`answers_count`, `saves_count`, `*_count`) are kept in sync by `AFTER INSERT/DELETE` triggers — every realtime subscriber gets a single accurate UPDATE per change.

## 🔐 Security model

- **RLS is on for every Anonim table.**
  - `topics`: public read.
  - `questions` / `answers`: public read where `deleted_at IS NULL`.
  - `reactions` / `saves` / `topic_follows`: only the owning session can read its rows.
  - Inserts/updates/deletes via PostgREST require `auth.uid() = owner_id` — i.e. impossible from the browser without a Supabase JWT, which we deliberately don't issue.
- **All writes go through SECURITY DEFINER RPC.** `app_ask_question`, `app_post_answer`, `app_toggle_reaction`, `app_toggle_save`, `app_toggle_topic_follow`, `app_register_view`. They take the visitor's cookie UUID as the first argument and validate input length, topic existence, and answer/question liveness server-side.
- **Trigger functions are not callable as RPC.** `bump_answers_count`, `bump_saves_count`, `bump_reaction_count` had their `EXECUTE` revoked from `anon`, `authenticated`, and `public` so they cannot be invoked via `/rest/v1/rpc/`.
- **Identity is a cookie.** `middleware.ts` sets an HTTP-only, `secure`, `sameSite=lax` cookie (`anonim_session`) with a UUID v4. Server actions read it; nothing on the client can.

## 🛰️ Realtime

The browser subscribes to three streams via `@supabase/supabase-js`:

1. **`questions` INSERT** — feeds the landing-page LiveTicker.
2. **`answers` INSERT/UPDATE** filtered by `question_id` — keeps reaction counts in sync across every reader of a thread.
3. **Supabase Presence** keyed by `question_id` — counts how many readers are in the same thread, no PII transmitted.

Hooks live in [`src/lib/supabase/realtime.ts`](src/lib/supabase/realtime.ts).

## 🎨 Design tokens

Tokens live in [`src/app/globals.css`](src/app/globals.css):

- **Surface**: `--bg`, `--bg-1`, `--bg-2`, `--surface`, `--surface-2`, `--surface-3`
- **Text**: `--text`, `--text-2`, `--text-3`, `--text-4`
- **Accent**: `--accent` (cyan), `--violet`, `--lime`, `--warm`
- **Lines**: `--line`, `--line-2`, `--line-3`
- **Type**: `--font-display` (Instrument Serif), `--font-sans` (Geist), `--font-mono` (Geist Mono)
- **Radii**: `--radius-sm`, `--radius`, `--radius-lg`, `--radius-xl`

## 🧭 Notable details

- **Logo** — bespoke orbital aperture mark animated via CSS (`lm-orbit-spin`, `lm-ring-drift`); identical SVG used in nav, footer, and as the favicon.
- **Hero galaxy** — three concentric orbits of "?" pills, counter-rotating so labels stay upright.
- **Pseudonyms** — adjective × noun pool (~825 combinations) generated server-side per question/answer.
- **Optimistic reactions** — clicking a reaction updates counts and active state synchronously; reverts cleanly if the RPC errors.
- **Cookie-only identity** — never a login, never an email, never a profile.

## 📝 License

This is a portfolio / design implementation built from the Anonim design prototype. The original concept and copywriting are part of that handoff bundle.

---

Built quietly, for the questions you carry.
