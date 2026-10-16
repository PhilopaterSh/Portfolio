# Quickstart: Portfolio Improvements

Use this guide after implementation to install locked dependencies, run quality gates, and check browser behavior.

## Baseline (2026-10-13)

- `npm.cmd run build` passed before implementation with Vite 7.3.1.
- Initial JavaScript: `dist/assets/index-DtxJteJF.js`, 401.45 kB (134.21 kB gzip); lazy route chunks: Resume 9.93 kB and Cybersecurity Awareness 10.33 kB.
- Largest emitted image: profile image, 106.96 kB. Lighthouse mobile/desktop metrics are unavailable because no browser audit was run.
- The source configures `/Portfolio/` as the Vite base and React Router basename. Source routes are `/`, `/Resume`, and `/Cybersecurity_Awareness`; direct refresh behavior has not yet been manually verified.
- `index.html` requests `/favicon.svg`, but `public/` contains `favicon .svg` (space before `.svg`); the built output therefore has no matching favicon. This confirms the P1 asset issue.
- Field CWV data is unavailable. Record lab measurements separately if a repeatable browser audit becomes available.
- Refresh the baseline after a clean lockfile install before comparing bundle sizes: the pre-implementation build used local Vite 7.3.1, while the lockfile install uses Vite 7.3.6.
- A final Lighthouse/DevTools comparison was not available in this environment, so no LCP, CLS, TBT, or CWV improvement is claimed. The existing Resume and Awareness route chunks remain lazy-loaded; the available build report did not justify adding another split. Re-measure bundle deltas against a baseline built from the lockfile before claiming a size change.

## Prerequisites

- Node.js version 24, matching the current CI workflow.
- Dependencies installed from the repository lockfile.
- A local browser for route, keyboard, and screen-reader checks.

## Build and Quality Gates

From the repository root, run:

```powershell
npm ci
npm run lint
npx tsc --noEmit
npm run format:check
npm run test
npm run build
```

Expected result: all checks pass; build output is written to `dist/`.

For automated route, metadata, no-fetch demo, and 360 px overflow smoke checks, start `npm run preview` in one terminal and run `npm run verify:preview` in another.

Final smoke results (2026-10-13): supported route titles/canonicals and unknown-route `noindex` passed; eight project/writeup resource links rendered with HTTPS destinations, including all four supplied Medium articles; major project outcomes matched between the portfolio and Resume; mobile navigation toggled with Enter; password entropy/checklist interaction passed; demo mode made zero provider requests; and all three routes plus project/writeup cards fit at 360 px. Screen-reader checks, 390 px manual review, full contrast review, reduced-motion/contact error-state review, and Lighthouse comparisons remain outstanding.

Contrast review (2026-10-14, branch `002-p1-hardening`): an automated WCAG 2.2 AA text-contrast audit (computed styles with translucent-background compositing, both themes, Home and Awareness pages) found 12 dark and 9 light failures. Fixes: dark `--accent-blue` lightened `#0077ff` → `#3b82f6` (4.41 → 4.96 on card backgrounds); a theme-aware `--entropy-*` palette replaced hardcoded signal colors in `PasswordEntropyLab`, `BruteForceAnalysis`, `TimeToCrack`, `CybersecurityAwareness`, and `awareness.css` (bright yellow/orange/red failed badly in light); typewriter cursor given `color: var(--bg-black)`; light overrides added for `.featured-badge` (white text) and `.time-scale-row--active` (visible tint). Re-audit: 0 findings on both pages in both themes. Screen-reader and 390 px manual checks remain outstanding.

Performance comparison (2026-10-15, branch `002-p1-hardening` vs `main` at f1a7ba8, LAB DATA ONLY): Lighthouse 13.5, performance category only, three runs per state per profile against local `vite preview` builds, medians reported. Run-to-run spread was large on this machine (mobile LCP ranged 2.7–5.9 s), so single runs are not meaningful. Mobile: score 77 → 84, total transfer 604 → 485 kB (−20 %), LCP 5.9 → 4.2 s, FCP 1.7 → 1.7 s, Speed Index 1.7 → 1.7 s, TBT 120 → 180 ms (all runs well under the 200 ms "good" lab threshold), CLS 0.0012 → 0.0014 (both negligible). Desktop: score 92 → 93, transfer 652 → 525 kB, LCP 1.8 → 1.7 s, FCP 500 → 400 ms, TBT 50 → 30 ms, CLS ≈ 0. The transfer reduction comes from the spec 002 WebP/OG-image conversion; the A/B stash build in `specs/002-p1-hardening/plan.md` isolated this spec's JavaScript delta to +0.56 kB. Lighthouse's modern-image-format and oversized-image audits passed on both states (the source images never crossed its reporting threshold) — total-byte-weight is the decisive measure here. Mobile LCP remains above the 2.5 s "good" threshold under throttling; the LCP path is the client-rendered hero gated behind JavaScript execution, so JS slimming (framer-motion reduction) is the identified next lever. No field CWV/INP data exists; nothing is claimed beyond these lab numbers.

Automated accessibility checks (2026-10-15, branch `002-p1-hardening`): all three routes produce no horizontal overflow at 360 px and 390 px in both themes; Tab reaches navigation and interactive elements; `prefers-reduced-motion: reduce` yields `transition: none` on the testimonial slider track; an empty contact submit is blocked by native `required` validation, and a configured-but-failing submit renders `.form-feedback.error` carrying `role="alert"` (implicitly assertive live-region semantics) while success feedback carries explicit `aria-live="polite"`; the Network Trace local demo at 360 px, triggered by keyboard only, announces completion through an `aria-live="polite"` status paragraph and sends zero provider requests. A human screen-reader session (NVDA/VoiceOver walkthrough per the checklist above) remains the only outstanding T028 item.

Motion slimming addendum (2026-10-16, branch `003-motion-slimming`): converting all `motion.*` to `m.*` under `<LazyMotion features={domAnimation} strict>` reduced the main chunk 430.79 → 384.35 kB raw (153.18 → 140.50 kB gzip, −8.3 %) with identical animation output (verified by console-error capture and a full scroll-through reaching final opacity everywhere). Lighthouse mobile medians of 3: transfer 485 → 472 kB, TBT 180 → 120 ms; score/LCP deltas remain inside the ±1.1 s lab noise floor. Details in `specs/003-motion-slimming/plan.md`.

## Visitor Trust and Trace

1. Open the canonical Cybersecurity Awareness route at `/Portfolio/Cybersecurity_Awareness/`.
2. Confirm the disclosure names the two lookup providers and the public IP/location/network fields involved.
3. Before selecting live trace, inspect browser Network tools and confirm no lookup request has been sent.
4. Select the local demo while offline or with requests blocked; confirm no call to ipify or ipapi occurs and every value is marked simulated.
5. Try live lookup with the providers blocked. Confirm the error is neutral and does not advise disabling privacy protections.
6. Use keyboard navigation; confirm progress and error/success messages are announced without focus moving unexpectedly.

## Routes, Metadata, and Sitemap

1. Inspect `dist/index.html` and any generated route documents for unique titles, descriptions, canonical links, and Open Graph/Twitter metadata.
2. Confirm all canonical URLs use `https://philopatersh.github.io/Portfolio/` and match entries in `public/sitemap.xml`.
3. Confirm `changefreq` and `priority` are removed unless a non-Google consumer has a documented need; only update `lastmod` for significant content changes.
4. Confirm the configured favicon path resolves to the expected file in `dist/`.
5. Serve the production output with `npm run preview`; open `/Portfolio/`, `/Portfolio/Resume/`, and `/Portfolio/Cybersecurity_Awareness/` directly and refresh each route. Also open each legacy no-slash URL and confirm it reaches the canonical route through the existing redirect behavior.
6. Open an unknown route and confirm a not-found experience appears and is not indexed as a valid content page.

## Accessibility and Responsive Review

1. Repeat the main navigation, theme switch, contact form, trace demo, and trace retry using only Tab, Shift+Tab, Enter, and Space.
2. Confirm visible focus is not obscured by fixed navigation and is distinguishable in both themes.
3. Check representative text and controls for WCAG 2.2 AA contrast; include focus indicators and component boundaries.
4. With a screen reader, verify image alternatives, form labels, trace disclosure, loading/status/error feedback, and error association.
5. Check `prefers-reduced-motion` and viewports at 360 px and 390 px; confirm no essential content is clipped or horizontally scrollable.

## Performance Review

1. Record Lighthouse/Chrome DevTools results on the same mobile and desktop profiles before and after changes.
2. Record LCP, CLS, transferred resources, initial JavaScript, and largest images. Use TBT only as a lab proxy for responsiveness; do not label it INP.
3. Check Search Console/CrUX for field data only if available; report device-specific p75 and mark missing metrics unavailable.
4. Confirm the hero image stays eager/high priority and secondary images remain lazy with dimensions/aspect ratios.
5. Keep only changes with a measured benefit and no regression in route behavior or layout.

## Deployment Review

1. Open a pull request and confirm verification runs without deployment.
2. Push a verified change to `main` in the normal release process and confirm deployment waits for verification.
3. Confirm the deploy job consumes the artifact from the verified revision, uses `npm ci`, and has only the Pages permissions it needs.

## Project Evidence Review

For each featured project, verify the destination link and source for any numeric claim. Add the measurement context, qualify the claim, or remove unsupported precision.

### Evidence audit queue

- `Ph.Sh_URL` (`https://github.com/PhilopaterSh/Ph.Sh_url`): removed the unsubstantiated 60% reconnaissance-time and 25% endpoint-discovery claims; retained a qualitative description of its multi-source collection and deduplication workflow.
- `Ph.Sh-Subdomain` (`https://github.com/PhilopaterSh/Ph.Sh-Subdomain`): removed the unsubstantiated 40% comparison; retained a qualitative description of passive-source and concurrent discovery.
- The author supplied direct Medium articles for Basic Pentesting, TryHackMe Blue, Hack The Box Cap, and Google XSS Game. The first two existing cards now link to their article pages, and the latter two are new cards. The Linux Administration card still links to the author profile and should be replaced when its direct article URL is available.
- Existing user-edited experience claims about the DEPI program, 1,330 hours, and Argus were preserved and now match the author-provided Obsidian career dossier. Treat that dossier as an author reference; retain primary program documentation if independent verification is required.
