# Implementation Plan: Portfolio Improvements

**Branch**: `main` | **Date**: 2026-10-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-portfolio-improvements/spec.md`

## Summary

Improve visitor trust and correctness first, then route-level discoverability, accessibility, measured performance, deployment reliability, and evidence quality. Keep the existing React 19, TypeScript, Vite, React Router, plain CSS, and GitHub Pages architecture. Avoid new runtime dependencies and analytics. Generate route-aware static metadata for the known routes, retain the interactive SPA, disclose the current optional IP lookup before use, and make deployment conditional on the existing verification checks.

## Technical Context

**Language/Version**: TypeScript 5.9, JavaScript/Node.js 24 for build and CI scripts
**Primary Dependencies**: React 19, React Router 7, Vite 7, Vitest, ESLint, Prettier; no planned runtime dependency additions
**Storage**: None; static content and build output only
**Testing**: Existing Vitest, Testing Library, ESLint, TypeScript compiler, Prettier check, Vite production build, manual browser/accessibility review
**Target Platform**: Modern desktop/mobile browsers; static GitHub Pages project site at `/Portfolio/`
**Project Type**: Static React web application
**Performance Goals**: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75 when representative field data exists; lab measurements reported separately
**Constraints**: Preserve `/Portfolio/` base path and GitHub Pages hosting; no backend, paid hosting, IP analytics, or new long-lived runtime service; keep mobile layout usable from 360 CSS px
**Scale/Scope**: Three current public routes, one optional external IP trace, static portfolio data, existing PDF generation and Pages deployment

## Constitution Check

- **Type Safety First**: Pass. Type new route metadata and trace states; do not introduce `any`; require `npx tsc --noEmit`.
- **Component Isolation & Data/UI Separation**: Pass. Keep page metadata data separate from route rendering; keep trace disclosure and states in the NetworkTrace component or a small extracted component if reuse is justified.
- **Responsive & Overflow-Safe by Default**: Pass. Check the existing 360–390 px mobile range for changed UI.
- **Frontend Safety & Graceful Degradation**: Pass with explicit criteria. No lookup before visitor action; handle provider failure/partial data; local demo does not call external services; use existing SPA fallback safely.
- **Performance-First Assets**: Pass. Measure first and preserve eager/high-priority hero loading, explicit dimensions, route splitting, and lazy loading below the fold.
- **Test Before Merge**: Pass. Tests and quality gates are required by the constitution. Add focused tests for non-trivial trace state changes and generated route metadata behavior; run lint, format-check, test, typecheck, and build before merge.
- **Google-Style JSDoc**: Pass. New exported functions/types/components in `src/` must carry the required JSDoc; build-only helpers should also follow local conventions when exported.
- **Accessibility Baseline (WCAG 2.2 AA)**: Pass. Manual keyboard/screen-reader review plus contrast checks required; keep focus visible and status messages programmatically available.
- **Core Web Vitals**: Pass. Report lab and field results distinctly; do not infer field INP from Lighthouse.
- **Design Tokens**: Pass. Reuse current tokens; use the existing spacing/type scale if available and avoid new one-off styling values.
- **Deployment**: Pass. Keep deployment gated behind verification and preserve least-privilege Pages permissions.

**Pre-design gate**: No new service, data store, framework, or production integration is proposed. The solution stays within the existing stack.

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-improvements/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/requirements.md
```

### Source Code (repository root)

```text
index.html                         # shared document template and home metadata
vite.config.ts                     # /Portfolio/ base and build configuration
scripts/                            # build-time route metadata generation if needed
public/
├── favicon .svg                    # rename/reference correction
├── 404.html                        # GitHub Pages SPA fallback
├── robots.txt
└── sitemap.xml                     # canonical routes and truthful lastmod
src/
├── App.tsx                         # route metadata and catch-all behavior
├── data/portfolioData.ts           # typed static portfolio data; avoid editing existing user changes
├── components/NetworkTrace.tsx     # disclosure, live/demo states, accessible feedback
├── pages/                          # route-specific content and page identities
└── styles/                         # existing focus/contrast/responsive rules
.github/workflows/
├── ci.yml                           # verification triggers/checks
└── deploy.yml                       # candidate consolidation into gated workflow
```

**Structure Decision**: Single existing Vite application. The `scripts/` directory may receive one Node build helper if required to emit route-specific static head documents. No backend or application API is added. Generated files must honor Vite's project base path.

## Implementation Strategy

1. **P1 visitor trust and correctness**: Add the NetworkTrace disclosure, idle-state demo, neutral errors, partial response handling, and accessible status feedback. Fix the favicon asset name/reference and verify the output path.
2. **P2 route discoverability**: Define metadata for `/`, `/Resume`, and `/Cybersecurity_Awareness`; generate distinct static initial HTML heads for canonical URLs and social previews. Keep the Pages fallback and add a catch-all not-found UI. Validate `dist` paths and direct route refresh. Prototype route output before selecting the smallest reliable build mechanism; avoid full SSR migration.
3. **P2 accessibility**: Review controls, form fields, error/success status, focus, contrast, reduced motion, and 360 px reflow in both themes; fix verified failures and audit image dimensions.
4. **P2 measured performance**: Capture a repeatable mobile/desktop baseline. Optimize only measured LCP image, large assets, or expensive initial modules. Preserve the existing route splitting and hero priority.
5. **P3 verified delivery**: Run verification before deployment in one workflow; use `npm ci`, pass the verified artifact to the Pages deploy job, retain least-privilege permissions, and consider reviewed action SHA pins.
6. **P3 credibility**: Verify project links and outcome evidence. Correct or qualify unsupported metrics without inventing results.

Stories 1 and 2 touch separate UI/assets and can be implemented independently, subject to the shared final quality gates. The later stories should follow the priority order because route generation, audit results, and evidence review may change their task scope.

## Integration and Regression Map

| Change | Existing parts it touches | Safe integration rule | Regression checks |
|---|---|---|---|
| Trace disclosure and state handling | `NetworkTrace.tsx`, `awareness.css`, ipify/ipapi calls, screen-reader announcements | Keep both requests behind the live-action handler; the local demo path must not call that handler. Do not alter the password lab or other awareness tools. Validate provider status, JSON shape, and nullable fields before rendering. | Idle makes zero requests; live mode makes only the documented calls; demo works offline; blocked/rate-limited/partial responses leave the rest of Awareness usable; keyboard and SR status remain understandable. |
| Favicon correction | `public/favicon .svg`, `index.html`, Vite `base` | Rename to a URL-safe filename and reference it through Vite's base placeholder so both project-site root and emitted assets resolve under `/Portfolio/`. | Built output contains the exact referenced file; inspect the root and nested route output; no unrelated image import paths change. |
| Route metadata and static HTML heads | `src/App.tsx`, three page components, `index.html`, `vite.config.ts`, `scripts/`, `public/404.html`, `public/sitemap.xml`, navbar links, PDF generator | Keep one JSON metadata manifest consumable by both the browser and Node build helper. Generate only route-specific HTML head metadata into route documents; keep the existing empty mount root and `createRoot` client app, avoiding an SSR/hydration migration. Preserve `/Portfolio/` absolute asset URLs. Decide trailing slash/canonical format once and update generated output, sitemap, internal links, and PDF navigation together. | Inspect built HTML, preview exact URLs with and without trailing slash, refresh direct route, test old SPA redirect behavior, verify CSS/JS and CV PDF load, check catch-all noindex, verify canonical and sitemap match. |
| Accessibility corrections | `content.css`, `awareness.css`, `navbar.css`, `responsive.css`, `Navbar.tsx`, `ContactFooter.tsx`, `TestimonialsSection.tsx`, image sections | Scope focus/contrast changes to controls; keep themes and mobile breakpoints intact. Announce concise status changes, not whole result panels. Respect reduced motion and provide a way to pause auto-advancing content. Inventory existing image dimensions instead of redoing already-correct hero handling. | Keyboard-only navigation, visible focus in both themes, screen-reader labels/errors/status, reduced-motion behavior, 360/390 px viewports, and image aspect-ratio stability. |
| Performance changes | `src/assets/`, `src/assets/index.ts`, image components, `App.tsx` lazy routes | Capture baseline before optimization. Change only assets/chunks identified by the audit; preserve hero high priority and current lazy routes. Do not add analytics or a new dependency without a demonstrated need. | Compare equivalent mobile/desktop runs; check LCP candidate, CLS, transferred bytes, route chunk fetches, and all image references after conversion. |
| Deployment gating | `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, PDF generation | Consolidate verification and deployment into one workflow; PR runs stay verification-only, main deploy depends on successful verify, and only the deploy job gets Pages write/id-token permissions. Transfer the built `dist` artifact so PDF and generated route documents are the exact verified outputs. | Confirm format/lint/typecheck/test/build/PDF steps; a failed verify blocks deployment; a PR never deploys; successful main run serves the built app, route pages, favicon, and CV PDF. |
| Project evidence review | `src/data/portfolioData.ts`, projects/writeups sections, outbound links | Inspect the current diff before editing this data file, since it already contains user changes. Keep verified claims, add context/source only when available, and qualify/remove unsupported precision without inventing outcomes. | Review rendered project cards, links, mobile text wrapping, and Resume data for unintended copy or layout changes. |

The route generation step deliberately emits route-specific metadata in separate static HTML documents but does not pre-render React page content. Vite documents full SSG as possible for known routes, while React hydration requires the client render to match the server HTML. A full SSG migration is therefore outside this plan; if later required, scope it separately and validate every component that uses browser state before adopting hydration. [Vite pre-rendering guidance](https://vite.dev/guide/ssr.html), [React hydration requirements](https://react.dev/reference/react-dom/client/hydrateRoot).

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Generated route HTML breaks the `/Portfolio/` subpath or SPA redirect | Test built asset URLs and direct loads at the exact project paths; keep a single route metadata source. |
| Route metadata updates in JS but social crawlers see only generic shell metadata | Verify the generated HTML head itself, not only the live DOM. |
| Trace disclosure wording overstates provider retention or guarantees | Describe only request flow and fields; link provider policies if useful; make no retention promises. |
| Provider returns throttling, provider-level error, malformed JSON, or null fields | Validate response shape, render unavailable values clearly, and retain a local-only demo. |
| Lighthouse lab score is treated as real-user p75 | Label lab vs field data; report INP as unavailable unless field data exists. |
| Consolidated workflow expands Pages permissions in PR runs | Keep verification on read-only token permissions; grant Pages permissions only to the conditional deploy job. |
| Existing user changes are overwritten | Avoid changes to current modifications in `README.md` and `src/data/portfolioData.ts`; review diff before implementation. |

## Constitution Check (Post-Design)

All gates remain satisfied. The only conditional design item is static route document generation: implement the smallest build-time approach that emits route-specific metadata without changing hosting or adding a runtime dependency. If that cannot be validated cleanly, fall back to route-level metadata while documenting the social-crawler limitation and propose full SSG separately.

## Complexity Tracking

No constitution violations or new long-lived services are proposed.
