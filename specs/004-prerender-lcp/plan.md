# Plan: Build-Time Route Prerendering (LCP)

**Branch**: `004-prerender-lcp` | **Spec**: `./spec.md` | **Created**: 2026-10-16

## Approach

Reuse the proven `generate-pdf.cjs` server pattern (free port → spawn `vite preview` →
poll readiness → puppeteer → teardown) in a new `scripts/prerender.mjs` that captures
each route's settled DOM and writes it back over the generated route documents.
`createRoot` keeps replacing the container on load, so captured markup is a
first-paint preview, not a hydration source — no hydration-mismatch surface exists.

## Mechanics

1. Read `src/data/siteMetadata.json` for the route list (`/`, `/Resume/`,
   `/Cybersecurity_Awareness/`) — same manifest the head generator consumes.
2. For each route: `goto(waitUntil: "networkidle0")`, wait for the route's root
   selector, scroll through in steps (fires `whileInView` + lazy images under
   `content-visibility`), wait ~800 ms for animations to settle, then serialize
   `document.documentElement.outerHTML` and write it to the route's `dist/**/index.html`.
3. Post-capture assertions per route: canonical link present, `#root` innerHTML
   length > 5,000 chars (blank-render guard). Any failure exits non-zero.
4. `package.json` build chain gains the prerender step after `generate-route-html.mjs`.

## Baseline (2026-10-16, spec 003 head, Vite 7.3.6)

| Metric (mobile, interleaved medians of 3) | Spec 003 head | Prerendered build | Hero-preload build |
|---|---|---|---|
| Main chunk (raw / gzip) | 384.35 kB / 140.50 kB | unchanged | unchanged |
| dist/index.html | ~1.7 kB shell | 70.0 kB rendered (28.5 kB gzip) | ~1.7 kB + preload link |
| Lighthouse score | 78–80 (run-set medians) | **70** | **75** |
| LCP | 4.2–5.4 s | **4.6 s** | **5.6 s** |
| FCP | 1.7 s | **2.6 s** | 1.7 s |
| TBT | 120–180 ms | **390 ms** | **210 ms** |
| Total transfer | 472 kB | 498 kB | 472 kB |

## Outcome (2026-10-17): nothing retained

Both levers were built, verified functional, and measured — and both failed the
"measured benefit" bar, so neither shipped:

- **Prerender** (worked exactly as designed — full hero in HTML, correct route
  heads, `verify:preview` green, zero console errors) regressed the lab profile:
  TBT ×3 (React re-renders the full captured tree over the existing DOM) and FCP
  +0.9 s (larger HTML blocks first paint). Classic prerender-without-hydration
  trade-off; fixing it properly needs hydration or SSG, out of scope for this
  stack. The `scripts/prerender.mjs` step was removed from the build chain.
- **Hero-image preload** (hash-rewritten correctly by Vite, home-only via the
  route-metadata block) showed no benefit beyond the ±1 s lab noise in
  interleaved A/B (base: score 78 / LCP 5.4 s / TBT 160 ms vs preload: 75 / 5.6 s
  / 210 ms). The LCP element paints only after React executes, and the 57 kB
  image already downloads inside the shadow of the 140 kB-gzip JS bundle, so
  earlier discovery moves nothing. Reverted.

The one honest conclusion for future work: this stack's mobile LCP is bounded by
client-side rendering itself. Material improvement requires hydration-capable
prerendering (react-dom/hydrateRoot with stable markup) or a framework SSG
migration — both architecture-level changes, recorded here as the follow-up
options rather than attempted again incrementally.

## Risks

- **Animation replay on load:** captured hero is at final opacity; React's
  re-render replays the entrance animation. Accepted trade-off (standard SPA
  prerender behavior); verified visually.
- **CI environment:** puppeteer + Chrome already proven in CI by `generate:cv`;
  the prerender step uses the same dependency and fails the build on error rather
  than deploying a degraded artifact.
- **Stale capture:** prerender runs on every build, so captures can't drift from
  the deployed bundle (same pipeline, same artifact).

## Verification

Gates per constitution Principle VI; rendered-markup grep on dist artifacts;
Lighthouse mobile 3× medians versus the baseline above; `verify:preview` on the
prerendered output; two-theme scroll-through with console-error capture.
