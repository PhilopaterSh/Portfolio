# Feature Specification: Build-Time Route Prerendering (LCP)

**Feature Branch**: `004-prerender-lcp`

**Created**: 2026-10-16

**Status**: Closed — investigated, not retained (see `plan.md` outcome; both levers measured negative/no-benefit and were reverted on 2026-10-17)

**Input**: Spec 002/003 lab measurements leave mobile LCP as the one Core Web Vitals metric above the 2.5 s "good" threshold (4.2–5.1 s medians). Root cause is architectural: the LCP element (hero image and headline) is produced by client-side React, so the browser cannot paint it until ~380 kB of JavaScript is downloaded, parsed, and executed. All image and bundle optimizations are exhausted; the remaining lever is shipping rendered HTML.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Instant First Paint of the Hero (Priority: P1)

A visitor opening any of the three routes must see the fully laid-out hero (headline, subtitle, profile image) painted from the HTML document itself, before any JavaScript executes. The build pipeline renders each route in headless Chrome after the static build, serializes the settled DOM, and writes it back as the route's `index.html`, preserving the generated route `<head>` (title, description, canonical, OG/Twitter, JSON-LD) exactly as produced by `generate-route-html.mjs`.

**Why this priority**: It is the documented root-cause fix for the only failing Core Web Vital, and it also gives no-JS/crawler clients a complete document.

**Independent Test**: `dist/index.html` contains the rendered hero markup (headline text, hashed hero image URL with `fetchpriority="high"`) without loading any script; Lighthouse mobile medians (3 runs) are recorded against the spec 003 head with the deterministic bytes documented.

### User Story 2 - Identical Behavior After Hydration Re-Render (Priority: P1)

The app keeps `createRoot(...).render(...)` (no hydration): the prerendered markup is a first-paint preview that React replaces with an identical tree once loaded. Route metadata updates, theme switching, the trace demo's zero-request idle state, keyboard navigation, 360/390 px overflow behavior, and all 40 tests must be unchanged. The prerender step must fail the build (non-zero exit) if any route's capture is missing, empty, or lacks its canonical link.

**Why this priority**: Constitution IV and VI — the optimization must not change behavior and must fail loudly rather than deploy a broken artifact.

**Independent Test**: `npm run verify:preview` passes on the prerendered output; a scroll-through with console-error capture shows all sections animating and reaching final opacity in both themes; build fails when the prerender script cannot capture a route (simulated by an unreachable selector in a dry run).

## Requirements

- `scripts/prerender.mjs` reads the route manifest from `src/data/siteMetadata.json` (single source of truth), starts its own `vite preview` on a free port (the `generate-pdf.cjs` pattern), renders every manifest route plus the root, scrolls through to fire `whileInView` animations, waits for settle, and serializes `document.documentElement.outerHTML`.
- The build script becomes `vite build && node scripts/generate-route-html.mjs && node scripts/prerender.mjs` — prerendering runs strictly after route-HTML generation so captured heads are final.
- Captured HTML must include the route's canonical `<link>` and a non-empty `#root` subtree; otherwise the build fails.
- `robots.txt`, `sitemap.xml`, `security.txt`, the SPA-redirect script, and PDF generation are untouched.
- No source-component changes: prerendering is a build-pipeline concern only.

## Success Criteria

- All quality gates pass (`lint`, `format:check`, `tsc --noEmit`, `test`, `build`, `verify:preview`).
- Rendered-hero presence is verified in the built artifacts; byte deltas and Lighthouse mobile medians (3 runs) are recorded in `plan.md` and the spec 001 `quickstart.md` lab section.
- `ARCHITECTURE.md` gains a dated change-log entry; `tasks.md` is ticked as work completes.
