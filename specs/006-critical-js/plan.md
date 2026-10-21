# Plan: LCP Critical-Path Reduction

**Branch**: `006-critical-js` | **Spec**: `./spec.md` | **Created**: 2026-10-19

## Approach

Two surgical levers on the CPU-bound critical path established by spec 004:

1. **Hero opacity gate**: `.hero-image-wrapper-container` animates opacity 0→1
   over 0.8 s; the LCP algorithm ignores opacity-0 elements, so measured LCP
   waits out the entrance animation after the JS wait. Keep only the scale
   motion on the image wrapper (transform never gates LCP eligibility).
2. **Lazy below-fold sections**: everything after About plus ContactFooter
   (which top-level-imports the ~13 kB EmailJS SDK) moves behind React.lazy
   with a single Suspense boundary; ~40 kB of section code leaves the chunk
   that must execute before the hero paints. Sections are below the fold and
   content-visibility-hidden until scroll, so load pop-in is not observable.

## Baseline (2026-10-19, spec 005-jsdoc head)

| Build | Main chunk raw | gzip |
|---|---|---|
| Baseline | 384.35 kB | 140.50 kB |
| After levers (main + shared chunk on critical path) | 360.55 + 10.41 = 370.96 kB | 130.45 + 7.54 = 137.99 kB |

Ten new lazy chunks (sections + ContactFooter, 0.5–2.7 kB each) load after the
shell paints; the EmailJS SDK now rides the deferred shared chunk instead of the
critical path.

## Measured Outcome (2026-10-20): RETAINED

Lighthouse mobile, interleaved A/B ×3 with build fingerprints verified per arm:

| Metric (median) | Base | Change |
|---|---|---|
| LCP | 3.9 s (runs 4.7/3.9/3.9) | **2.9 s (runs 2.9/2.9/2.9 — zero variance)** |
| Performance score | 87 | **95** |
| TBT | 100 ms | **60 ms** |
| FCP / SI | 1.7 s / 1.7 s | 1.7 s / 1.7 s |
| Total transfer | 472 kB | 481 kB (+9 kB chunk overhead) |

The three identical 2.9 s runs are the decisive signal: the previous spread came
from the variable opacity-animation wait gating LCP eligibility; removing it made
the LCP fire at a deterministic paint. First-paint opacity of the hero wrapper is
1 at DOMContentLoaded, all ten lazy sections mount with zero console errors
(after fixing one broken named-import lazy wrapper the first implementation
carried — surfaced as React error #306 and diagnosed via a dev-mode build), and
the full gates + preview smoke suite pass. Mobile LCP now measures 2.9 s — from
5.9 s when measurement started (−51 % cumulative in the lab) — just above the
2.5 s "good" threshold.

## Risks

- Lazy chunks must land fast enough for the smoke suite selectors — the suite
  waits on selectors with generous timeouts and chunks load same-origin
  immediately after the shell; verified by running it.
- React 19 lazy/Suspense under LazyMotion strict is standard composition;
  console-error capture guards it.

## Verification

Gates with pipefail; deterministic chunk table above; first-paint opacity
check; scroll-through both themes; interleaved Lighthouse medians.
