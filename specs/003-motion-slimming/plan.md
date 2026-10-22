# Plan: Motion Bundle Slimming (LazyMotion)

**Branch**: `003-motion-slimming` | **Spec**: `./spec.md` | **Created**: 2026-10-15

## Approach

Convert the animation loader, not the animations. `motion.*` components carry the full
feature set; `m.*` components receive features from a single `<LazyMotion>` provider.
The codebase uses only the `domAnimation` subset (animate/variants/exit +
whileInView/whileHover), verified by grep inventory below, so the provider loads the
~5 kB feature bundle instead of the full runtime.

## Measurement Baseline (2026-10-15, Vite 7.3.6 lockfile build)

| Build | Main chunk raw | Main chunk gzip |
|---|---|---|
| With framer-motion (current, spec 002 head) | 430.79 kB | 153.18 kB |
| Shim build (framer-motion aliased to a passthrough) | 305.05 kB | 112.30 kB |
| **framer-motion share** | **125.74 kB** | **40.88 kB** |
| After LazyMotion + `m` conversion (2026-10-16) | 384.35 kB | 140.50 kB |

Result: −46.44 kB raw / −12.68 kB gzip (−8.3 % of initial JavaScript) while keeping the
`m` runtime plus the `domAnimation` feature set (~79 kB raw) in the main chunk. The
shim's zero-motion floor is not reachable without abandoning JS animation entirely.
Lighthouse mobile, medians of 3 (2026-10-16, lab data): transfer 485 → 472 kB (matches
the gzip delta) and TBT 180 → 120 ms; score/LCP differences (84 → 80, 4.2 → 5.1 s) sit
inside the established ±1.1 s run-noise floor documented in spec 001 and are not
attributable given run spreads of 3.8–5.5 s within a single build. Console-error capture
and a full scroll-through in both themes show every animation reaching final opacity
(`.awareness-footer` at 0.3 is its intended stylesheet value).

## Feature Inventory (grep, 2026-10-15)

- `whileInView`: 11 uses — in domAnimation.
- `whileHover`: 6 uses — in domAnimation.
- `AnimatePresence`: 6 imports; `exit`: 3 uses — exit animations are part of domAnimation.
- `drag` / `layout` / `layoutId` / `useScroll` / `useMotionValue` / `useTransform` / `useAnimation`: **0 uses** — nothing requires domMax.
- `useReducedMotion` (TestimonialsSection): a hook, not a feature-bundle item; unaffected.

## Steps

1. `src/App.tsx`: import `{ LazyMotion, domAnimation }`; wrap the tree once, outermost inside `ErrorBoundary` → `LazyMotion` → `ThemeProvider` → `Router`.
2. All 14 components (`AboutSection`, `Hero`, `ExperienceSection`, `EducationSection`, `ProjectsSection`, `WriteupsSection`, `TestimonialsSection`, `CertificationsSection`, `VolunteeringSection`, `SkillsSection`, `LanguagesSection`, `ContactFooter`, `ScrollToTop`, `SectionHeader`): change `import { motion }` → `import { m }` and every `motion.` → `m.`. No prop/value changes.
3. `src/components/TestimonialsSection.test.tsx`: render inside `<LazyMotion features={domAnimation} strict>` (the only test file rendering an `m`-component directly).
4. Rebuild and record deltas; verify animation rendering via a scroll-through screenshot check with console-error capture.
5. Lighthouse mobile, 3 runs, median, versus the spec 002 head served the same way.
6. Quality gates, `quickstart.md` lab-data addendum, `ARCHITECTURE.md` changelog, tasks ticked, commit, push.

## Risks

- A missed `motion.*` reference throws under `strict` in development — acceptable: it is the intended loud failure, caught by lint/tests before merge.
- `AnimatePresence` exit under `domAnimation`: documented as supported (domMax adds only drag/layout); the contact-feedback exit path is exercised by automated checks and console-error capture.
- Visual parity: same variants/timings are kept; the screenshot comparison guards against sections stuck at `opacity: 0`.

## Verification

Gates per constitution Principle VI; bundle numbers in this file; Lighthouse medians
in spec 001 `quickstart.md`; visual animation check on both themes; `verify:preview`
route smoke unchanged.
