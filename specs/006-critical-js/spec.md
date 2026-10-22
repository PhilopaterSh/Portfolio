# Feature Specification: LCP Critical-Path Reduction

**Feature Branch**: `006-critical-js`

**Created**: 2026-10-19

**Status**: Draft

**Input**: Spec 004 proved this stack's mobile LCP is gated on client-side JavaScript execution (CPU-bound), and that DOM-level fixes (prerender without hydration, image preload) do not help. Two levers remain inside the measured-benefit rules: (1) the hero image wrapper animates `opacity: 0 → 1` over 0.8 s, and the LCP algorithm ignores opacity-0 elements, so the measured LCP fires only after the entrance animation completes on top of the JS wait; (2) ~40 kB of the main chunk (below-fold section components + the EmailJS SDK imported by the footer) executes before the hero can paint although nothing above the fold needs it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hero Image Eligible for LCP at First Render (Priority: P1)

The hero image must be fully opaque the moment React first paints it: the entrance animation may still scale/subtle-transform the image, but must not start it at opacity 0. The hero text column keeps its existing fade-in (it is not the LCP element).

**Why this priority**: Removes up to one full animation-duration (0.8 s) from the measured LCP with a two-line change and no design change; it is the documented "don't animate the LCP element from opacity 0" guidance.

**Independent Test**: In the production preview, the computed opacity of `.hero-image-wrapper-container` is ≥ 0.99 immediately after first paint (no settle wait); the scale entrance still plays.

### User Story 2 - Below-Fold JavaScript Off the Critical Path (Priority: P1)

Every section below About, plus the ContactFooter (and therefore the EmailJS SDK), loads through `React.lazy` after the hero-bearing shell paints. Above-the-fold imports (Navbar, Hero, About, ThemeContext, router) stay eager. Total initial JavaScript drops by a recorded, deterministic byte margin; all 40 tests and the preview smoke suite still pass (the smoke suite's project/writeup selectors resolve once lazy chunks land).

**Why this priority**: Deterministic bundle-bytes win that shortens the CPU-bound critical path established by spec 004's analysis; consistent with constitution Principle IX (lazy non-initial-route code).

**Independent Test**: `npm run build` shows the new lazy chunks and a smaller `index-*.js`; `verify:preview` passes including content-link checks; no console errors and both themes still settle during a full scroll-through.

## Requirements

- Only `src/components/Hero.tsx` animation values and `src/pages/Home.tsx` imports/composition change; no data, styles, or behavior edits.
- The lazy boundary must not change section order or DOM structure once loaded.
- All gates pass with `pipefail` discipline: lint, format, tsc, 40 tests, build, verify:preview.
- Lighthouse mobile interleaved A/B (3× each arm) is recorded as lab data next to deterministic bundle bytes.

## Success Criteria

- Main chunk raw/gzip delta recorded; hero opacity verified at first paint; interleaved Lighthouse medians recorded honestly (noise floor ±1 s acknowledged).
- `ARCHITECTURE.md` dated entry; tasks ticked; branch pushed.
