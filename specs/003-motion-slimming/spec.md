# Feature Specification: Motion Bundle Slimming (LazyMotion)

**Feature Branch**: `003-motion-slimming`

**Created**: 2026-10-15

**Status**: Draft

**Input**: Spec 002 performance comparison identified mobile LCP (4.2 s median, above the 2.5 s "good" threshold) as gated on initial JavaScript execution. An A/B shim build measured framer-motion's share of the initial chunk at 125.7 kB raw / 40.9 kB gzip (430.8 → 305.1 kB without it) — 27 % of initial JavaScript for entry animations, `whileInView`/`whileHover` reveals, and `AnimatePresence` exit transitions only (no drag, no layout animations anywhere in the codebase).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Same Motion, Less JavaScript (Priority: P1)

Visitors must see the same entry/reveal animations (hero entrance, section reveals on scroll, card hover lifts, contact feedback transitions) while the initial JavaScript bundle shrinks materially. The implementation converts every `motion.*` usage to `m.*` and wraps the app once in `<LazyMotion features={domAnimation} strict>`, loading only the feature subset the codebase actually uses. `strict` guarantees any future `motion.*` usage fails loudly at development time instead of silently re-bloating the bundle.

**Why this priority**: It is the single largest measured lever on the documented LCP problem, with no content or design change.

**Independent Test**: All 40 tests pass; the production build's main chunk drops by a recorded margin; a scroll-through of both themes shows every section animating in and reaching full opacity; no console errors from missing motion features.

### User Story 2 - No Accessibility or Behavior Regressions (Priority: P1)

The reduced-motion behavior (`useReducedMotion` pausing testimonial rotation, `prefers-reduced-motion` CSS), `AnimatePresence` exit semantics for contact feedback, and keyboard operability must be unchanged. Tests covering the testimonial slider must keep passing under the new provider by rendering within `LazyMotion`.

**Why this priority**: Constitution VIII (accessibility) and VI (test-before-merge) are non-negotiable constraints on any performance work.

**Independent Test**: `TestimonialsSection.test.tsx` (pause/resume, reduced-motion) passes inside a `LazyMotion` wrapper; automated overflow/keyboard checks still pass; `prefers-reduced-motion` still yields `transition: none` on the slider.

## Requirements

- `App.tsx` wraps the routed tree in `<LazyMotion features={domAnimation} strict>` exactly once, above `ThemeProvider` and `Router`.
- Every component imports `m` (not `motion`) from `framer-motion`; `AnimatePresence` and `useReducedMotion` imports stay as-is.
- No component may pass `drag`/`layout` props (unsupported by `domAnimation`); the inventory confirming none exist is recorded in `plan.md`.
- `src/test/setup.ts` or the specific test file provides the `LazyMotion` context for tests that render `m`-components directly.
- No animation timing, easing, variant, or threshold value changes — this is a loader change, not a redesign.

## Success Criteria

- `npm run lint`, `npm run format:check`, `npx tsc --noEmit`, `npm run test`, `npm run build`, and `npm run verify:preview` pass.
- Main-chunk byte deltas (raw and gzip) are recorded in `plan.md` alongside the shim baseline; a 3-run median mobile Lighthouse comparison is recorded in the spec 001 `quickstart.md` lab-data section.
- `ARCHITECTURE.md` gains a dated change-log entry; this spec's `tasks.md` is ticked as work completes.
