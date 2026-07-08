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

## Development Workflow

- Deployment is automatic: a push to `main` triggers
  `.github/workflows/deploy.yml`, which builds and publishes to GitHub
  Pages. There is no staging environment — `main` is production.
- Before pushing: run `npm run lint`, `npm run test`, and `npm run build`
  locally (or via a Spec Kit `/speckit-implement` task) and fix failures
  rather than pushing broken states.
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

**Version**: 1.0.0 | **Ratified**: 2026-07-08 | **Last Amended**: 2026-07-08
