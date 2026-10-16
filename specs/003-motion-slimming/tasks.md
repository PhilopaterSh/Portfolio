# Tasks: Motion Bundle Slimming (LazyMotion)

**Input**: `./spec.md`, `./plan.md`
**Total tasks**: 8

## Phase 1: Provider and Conversion

- [X] T001 Wrap the routed tree in `<LazyMotion features={domAnimation} strict>` once in `src/App.tsx`, importing both from `framer-motion`.
- [X] T002 Convert `motion.*` → `m.*` (imports and JSX) in all 14 components listed in `plan.md` without changing any animation prop, variant, timing, or threshold.
- [X] T003 Render `TestimonialsSection` inside `<LazyMotion features={domAnimation} strict>` in `src/components/TestimonialsSection.test.tsx` so slider tests exercise the real provider.

## Phase 2: Measurement

- [X] T004 Rebuild and record the main-chunk raw/gzip delta in `plan.md` next to the 430.79/153.18 kB baseline and the 305.05/112.30 kB shim floor.
- [X] T005 Verify animations visually (scroll-through, both themes, console-error capture) and confirm reduced-motion and keyboard checks still pass.
- [X] T006 Run Lighthouse mobile 3× against the spec 002 head and this branch (medians) and record the comparison in spec 001 `quickstart.md` as lab data.

## Phase 3: Validation and Documentation

- [X] T007 Run `npm run lint`, `npm run format:check`, `npx tsc --noEmit`, `npm run test`, `npm run build`, and `npm run verify:preview`.
- [X] T008 Add the dated `ARCHITECTURE.md` change-log entry, tick this list, commit, and push.
