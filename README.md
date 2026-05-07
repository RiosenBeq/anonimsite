# Anonim

> Ask what you can't ask anywhere else.

A quiet, anonymous Q&A experience. Anonim is a place for the questions you carry around but never quite say out loud — answered by people who have been there.

This is the production-ready Next.js implementation of the original `Anonim.html` design prototype.

---

## ✨ Highlights

- **Cinematic 1440px desktop layout** — dark, atmospheric, ambient gradients with film grain.
- **Orbital question galaxy** — animated hero with three concentric orbits of live questions floating around a glowing core.
- **Live activity ticker** — rotating, animated "what's happening right now" pulse.
- **Reading experience** — AI thread summary, helpfulness rings, four-key reactions, anonymous-presence grid.
- **Ask flow** — three-step emotional-safety moment: compose → AI refinement → "out into the quiet" confirmation.
- **Knowledge map** — interactive eight-room galaxy on the Explore page.
- **Privacy-first design system** — no avatars, no follower counts; reputation lives only on helpfulness.

## 🧱 Stack

| Layer        | Choice                                                                |
| ------------ | --------------------------------------------------------------------- |
| Framework    | [Next.js 16](https://nextjs.org) (App Router, Turbopack, RSC)         |
| Language     | TypeScript (strict)                                                   |
| UI runtime   | React 19                                                              |
| Styling      | Hand-tuned CSS with design tokens (CSS custom properties)             |
| Type System  | Tailwind v4 baseline + custom design system                           |
| Fonts        | `next/font` — Geist, Geist Mono, Instrument Serif                     |
| Animation    | Pure CSS keyframes (orbits, pulses, twinkle, drift)                   |
| Linting      | ESLint with `eslint-config-next` flat config                          |

## 🗂️ Structure

```
src/
├── app/
│   ├── layout.tsx           # Fonts, metadata, AppShell wiring
│   ├── globals.css          # Tokens, base, nav, buttons, qcard
│   ├── page.tsx             # Landing
│   ├── feed/page.tsx        # Feed with featured + tabs + sidebar
│   ├── explore/page.tsx     # Galaxy + moments + editor's picks
│   ├── ask/page.tsx         # Multi-step ask flow shell
│   └── q/[id]/page.tsx      # Question detail with SSG
├── components/
│   ├── AppShell.tsx         # Ambient bg + nav + grain wrapper
│   ├── Nav.tsx              # Top nav with active path detection
│   ├── Logo.tsx             # Orbital aperture mark + wordmark
│   ├── QuestionCard.tsx     # Reusable question card
│   ├── icons.tsx            # All inline SVG icons (typed)
│   ├── primitives.tsx       # Tag, PulseDot, Eyebrow, AiMark
│   ├── landing/             # OrbitalGalaxy, LiveTicker
│   ├── feed/                # FeedTabs, FeedSidebar, FeedFeatured
│   ├── detail/              # AnswerBlock, ComposerInline, HelpfulnessRing
│   ├── ask/                 # AskFlow (3-step state machine)
│   └── explore/             # ExploreGalaxy (interactive node map)
├── lib/
│   ├── data.ts              # TOPICS, QUESTIONS, ANSWERS, NOTIFS
│   └── types.ts             # Shared TypeScript types
└── styles/
    ├── landing.css          # Hero, trust strip, how, privacy, CTA
    ├── feed.css             # Featured, rail, sidebar, tabs
    ├── detail.css           # qhead, ai-summary, answer, composer
    ├── ask.css              # Form, refine, sent, right rail
    └── explore.css          # Galaxy, moments, picks
```

## 🚀 Getting Started

```bash
# install
npm install

# dev
npm run dev
# → http://localhost:3000

# production build
npm run build && npm start

# lint
npm run lint
```

## 🗺️ Routes

| Path        | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `/`         | Landing — hero, trust strip, trending, how, privacy, CTA      |
| `/feed`     | Feed — featured thread, tabs, wanderable rail, sidebar       |
| `/explore`  | Explore — interactive topic galaxy, moments, picks           |
| `/ask`      | Ask flow — compose, AI refinement, sent confirmation         |
| `/q/[id]`   | Reading — full thread with answers and inline composer       |

All `/q/[id]` routes are pre-rendered at build time via `generateStaticParams`.

## 🎨 Design tokens

The full token system lives in [`src/app/globals.css`](src/app/globals.css):

- **Surface**: `--bg`, `--bg-1`, `--bg-2`, `--surface`, `--surface-2`, `--surface-3`
- **Text**: `--text`, `--text-2`, `--text-3`, `--text-4`
- **Accent**: `--accent` (cyan), `--violet`, `--lime`, `--warm`
- **Lines**: `--line`, `--line-2`, `--line-3`
- **Type**: `--font-display` (Instrument Serif), `--font-sans` (Geist), `--font-mono` (Geist Mono)
- **Radii**: `--radius-sm`, `--radius`, `--radius-lg`, `--radius-xl`

## 🧭 Notable details

- **Logo** — bespoke orbital aperture mark: ring with one tasteful gap, glowing offset core, orbiting particle. Animated via CSS (`lm-orbit-spin`, `lm-ring-drift`). Identical SVG mark is used in nav, footer, and as the favicon.
- **Hero galaxy** — three concentric orbits of "?" pills, each spinning at a different rate and direction. Pills counter-rotate so labels stay upright.
- **AI thread summary** — animated diagonal sheen on hover, accent left-border, monospaced "AI · summary of N answers" mark.
- **Helpfulness ring** — dynamic SVG arc derived from helpfulness percentage with accent glow filter.
- **Anonymous presence** — twelve staggered pulsing dots showing co-readers in a thread.

## 📝 License

This is a portfolio / design implementation built from the Anonim design prototype. The original concept and copywriting are part of that handoff bundle.

---

Built quietly, for the questions you carry.
