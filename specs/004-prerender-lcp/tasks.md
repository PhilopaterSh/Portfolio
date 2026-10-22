# Tasks: Build-Time Route Prerendering (LCP)

**Input**: `./spec.md`, `./plan.md`
**Total tasks**: 7

> **Outcome (2026-10-17): CLOSED — NOTHING RETAINED.** The pipeline was built and
> measured (T001–T006 executed), regressed TBT/FCP, and was reverted; a hero-preload
> variant was also measured with no benefit beyond lab noise and reverted. The build
> chain is unchanged from spec 003. Numbers and reasoning in `./plan.md`.

## Phase 1: Pipeline

- [X] T001 Create `scripts/prerender.mjs` following the `generate-pdf.cjs` server pattern: free port, spawned `vite preview`, readiness polling, per-route capture with scroll-through and settle wait, serialization, and teardown. *(Built and working; removed after the negative measurement.)*
- [X] T002 Add post-capture guards (canonical link present, non-empty rendered `#root`) that fail the build on any missing/blank capture, and wire the step into the `build` script after `generate-route-html.mjs`. *(Worked, including a real fix for base-relative route URLs; unwired after the measurement.)*

## Phase 2: Verification and Measurement

- [X] T003 Verify `dist/index.html` contains the rendered hero (headline text, hashed hero image URL with high fetch priority) and each route document contains its rendered subtree.
- [X] T004 Run `npm run lint`, `npm run format:check`, `npx tsc --noEmit`, `npm run test`, `npm run build`, and `npm run verify:preview` on the prerendered output.
- [X] T005 Capture a two-theme scroll-through with console-error capture confirming animations settle and no section stays hidden.
- [X] T006 Run Lighthouse mobile 3× against the prerendered build and record medians plus byte deltas in `plan.md` and the spec 001 `quickstart.md` lab section.

## Phase 3: Documentation

- [X] T007 Add the dated `ARCHITECTURE.md` change-log entry, tick this list, commit, and push.
