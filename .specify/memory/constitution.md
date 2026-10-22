# Philopater Shenouda Portfolio Constitution

## Core Principles

### I. Type Safety First
All application code is TypeScript with strict typing. Data shapes (experience,
projects, certifications, etc.) are defined as explicit interfaces in
`src/data/portfolioData.ts`; components consume typed props, not `any`.
`npx tsc --noEmit` must pass with zero errors before any feature is considered
done.

### II. Component Isolation & Data/UI Separation
Every UI section lives in its own component under `src/components/`, composed
by a thin page orchestrator (`src/pages/Home.tsx`,
`src/pages/CybersecurityAwareness.tsx`). Content and static data stay in
`src/data/portfolioData.ts` with no UI logic; components read from it but
never hardcode content that belongs there. Pages stay orchestration-only
(imports + composition), not implementation.

### III. Responsive & Overflow-Safe by Default
Every new section must remain usable from ~360px mobile widths through
desktop without horizontal scrolling. Use `minmax(min(..., 100%), 1fr)` for
grids, `clamp()` for fluid typography, and global overflow guards
(`max-width`, `min-width: 0`, `overflow-wrap`) rather than fixed pixel
minimums. Verify at a mobile viewport (~390px) before calling a UI change
done.

### IV. Frontend Safety & Graceful Degradation
Browser APIs and third-party integrations (clipboard, geolocation/IP lookups,
Credly embeds, EmailJS) must never leave the UI in a broken or misleading
state when they fail or are blocked. Prefer explicit state machines (e.g.
IDLE → SUCCESS/FAILURE → IDLE) and a documented fallback/demo mode over
silent failure. External links using `target="_blank"` always carry
`rel="noopener noreferrer"`.

### V. Performance-First Assets
Images are optimized before commit (target: web-sized, not camera/export
originals). Above-the-fold media (hero image) uses explicit dimensions, high
fetch priority, and eager/async decoding; everything else is lazy-loaded.
Rely on Vite's build-time hashing and code-splitting rather than manual
bundling tricks.

### VI. Test Before Merge (NON-NEGOTIABLE)
Pure logic — entropy/formula calculations, formatters, non-trivial state
transitions — must have Vitest unit tests. Shared state providers (e.g.
`ThemeContext`) must have React Testing Library coverage for their default
state, persistence, and update paths. `npm run test`, `npm run lint`, and
`npm run build` must all pass locally before a change is pushed to `main`
(which auto-deploys via GitHub Actions).

### VII. Google-Style JSDoc on All Code
Every exported function, component, hook, class, and type/interface under
`src/` carries a JSDoc comment following the [Google TypeScript Style
Guide](https://google.github.io/styleguide/tsguide.html), which in turn
defers to §7.1–7.5 of the [Google JavaScript Style
Guide](https://google.github.io/styleguide/jsguide.html) for comment form:

- One-line summary first, blank line, then extended description only if the
  summary alone doesn't explain intent (the *why*, not a restatement of the
  signature).
- `@param name - description` and `@returns description` for non-trivial
  parameters/return values. Per the TS style guide, omit type annotations
  inside `@param`/`@returns` (e.g. no `{string}`) — TypeScript's own types
  are the source of truth, not the comment.
- Do not use `@private`, `@override`, `@enum`, or similar tags on code that
  already uses the equivalent TypeScript keyword (`private`, `override`,
  `enum`) — the two can drift out of sync.
- Internal (non-exported) helpers only need a JSDoc block when their
  behavior isn't obvious from the name and types; trivial one-liners don't
  need one.
- This applies going forward to new and modified code; it is not a mandate
  to retrofit every existing file in one pass — backfill opportunistically
  when a file is touched for other reasons.

### VIII. Accessibility Baseline (WCAG 2.2 AA)
Target [WCAG 2.2](https://www.w3.org/TR/WCAG22/) Level AA on every page —
the level referenced by most accessibility laws and procurement policies,
and the one `eslint-plugin-jsx-a11y` (wired into `eslint.config.js`) checks
automatically as part of `npm run lint`.

- Every `<img>` carries a real, descriptive `alt` (not a filename) — this is
  already the pattern across the codebase; keep it as new images are added.
- Prefer semantic elements (`<section>`, `<article>`, `<nav>`, `<header>`,
  `<footer>`, `<main>`) for structural content instead of an unbroken chain
  of `<div>`s; a `<div>` is fine for a pure layout/styling node with no
  semantic meaning of its own.
- Never remove the focus indicator with `outline: none` unless a
  `:focus-visible` style replaces it with an equally visible one. (Known
  existing gap to fix opportunistically, not a pattern to copy: `.form-group
  input`/`textarea` in `content.css` and `.password-input` in `awareness.css`
  currently drop `outline` and rely only on a `:focus` — not
  `:focus-visible` — box-shadow.)
- Text/background color pairs meet AA contrast (4.5:1 normal text, 3:1 large
  text and UI components/icons).
- New interactive elements (forms, buttons, custom widgets) must be fully
  operable by keyboard alone (Tab / Shift+Tab / Enter / Space) with a
  visible focus state, before being considered done.
- Add ARIA attributes only where semantic HTML or a native control isn't
  sufficient on its own — don't add roles/labels that just restate what the
  element already conveys.

### IX. Performance Budget (Core Web Vitals)
Targets follow [web.dev's Core Web Vitals
thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds) at
the 75th percentile: **LCP < 2.5s**, **INP < 200ms**, **CLS < 0.1**.

- Every `<img>` declares explicit `width`/`height` (or an `aspect-ratio` in
  CSS) so the browser reserves space before the image loads. This is a real,
  current gap — no image in the codebase declares dimensions today — and
  should be closed as images are touched, not deferred indefinitely.
- Below-the-fold images use `loading="lazy"`; the hero/first above-the-fold
  image stays eager per Principle V — that split is already correct in the
  codebase, keep it that way.
- Pages beyond the initial route are code-split with `React.lazy()` +
  `Suspense` rather than bundled into the main chunk.
- Before adding a new client-side dependency with non-trivial size, spot
  check its bundle impact (e.g. `rollup-plugin-visualizer` or an ad hoc
  `vite build` size check) rather than assuming it's free.

### X. Design Tokens for Spacing & Typography
`src/styles/base.css` already defines a full color-token system
(`--bg-black`, `--text-primary`, `--accent-green`, etc., mirrored per theme)
— extend that same approach to spacing and typography instead of hardcoding
new magic numbers. Today, font sizes and padding/margin values are picked
per component with no shared scale (e.g. font sizes scattered across
`0.6rem`–`1.2rem`+ with no steps between, one-off paddings like `160px 8%
100px`); new and edited CSS should draw from a small, bounded scale defined
once:

- Typography: a step scale (e.g. `--font-size-xs` … `--font-size-3xl`)
  declared in `base.css` and referenced via `var()` elsewhere.
- Spacing: a step scale (e.g. `--space-1` … `--space-8`, on a 4px/8px grid)
  for padding/margin/gap, replacing new hardcoded px/rem literals.

This is additive — existing components keep working unmigrated; new
components and sections under active edit adopt the tokens, with old values
migrated opportunistically rather than in one sweeping pass.

## Technology Stack Constraints

- **Framework:** React 19 (functional components + hooks only, no class
  components).
- **Language:** TypeScript (strict mode).
- **Build tool:** Vite 7.
- **Routing:** `react-router-dom`.
- **Animation:** `framer-motion` for entry/interactive animations.
- **Contact form:** EmailJS (`@emailjs/browser`), client-side only. Real
  service/template/public-key values must come from `VITE_EMAILJS_*`
  environment variables (injected via GitHub Actions repository secrets in
  CI). Do not add new hardcoded production credentials as source fallbacks;
  the existing legacy fallback in `ContactFooter.tsx` is a known temporary
  gap, not a pattern to repeat. Abuse protection is enforced via EmailJS
  domain restrictions on the provider dashboard, not application code.
- **Styling:** Plain modern CSS split by concern under `src/styles/`
  (`base`, `navbar`, `hero`, `content`, `awareness`, `responsive`) — no CSS
  framework, no inline `style={{...}}` for anything reusable.
- **Formatting & linting:** Prettier (`.prettierrc.json`) is the single
  source of truth for formatting — run `npm run format` (or
  `npm run format:check` in CI-style checks) rather than hand-formatting or
  debating style in review. ESLint (`eslint.config.js`) is for catching
  bugs and enforcing `eslint-plugin-jsx-a11y` accessibility rules, not
  formatting; `eslint-config-prettier` disables the stylistic rules that
  would otherwise fight Prettier.

## Development Workflow

- Deployment is automatic: a push to `main` triggers
  `.github/workflows/deploy.yml`, which builds and publishes to GitHub
  Pages. There is no staging environment — `main` is production.
- Before pushing: run `npm run lint`, `npm run format:check`, `npm run
  test`, and `npm run build` locally (or via a Spec Kit `/speckit-implement`
  task) and fix failures rather than pushing broken states.
- Any change to the application's structure, cross-cutting concerns, or
  technical decisions must be reflected in `ARCHITECTURE.md` (arc42 + C4
  model), including a dated entry in its "Recent Change Log" section.
- New features should go through the Spec Kit flow
  (`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` →
  `/speckit-implement`) rather than being implemented ad hoc, so the spec
  and the architecture doc stay traceable to what was actually built.

## Governance

This constitution supersedes ad hoc conventions. `ARCHITECTURE.md` remains
the living technical record of *how* the system is built; this document
governs the *principles* that decisions must satisfy. When they conflict,
update both in the same change rather than letting them drift apart.
Amendments to this constitution require a version bump below and a one-line
rationale in the commit message.

**Version**: 1.1.0 | **Ratified**: 2026-07-08 | **Last Amended**: 2026-07-09

<!-- Amendment 1.1.0 (2026-07-09): added Principle VII (Google-Style JSDoc
on All Code) to fix a stable documentation convention going forward, per
the Google TypeScript Style Guide / Google JavaScript Style Guide. -->
