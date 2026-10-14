# Tasks: Portfolio Improvements

**Input**: Design documents from `/specs/001-portfolio-improvements/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`
**Total tasks**: 43
**Tests**: Focused tests are included where the project constitution requires coverage for non-trivial behavior. Manual regression checks are listed for browser, SEO, accessibility, and deployment behavior.

## Phase 1: Setup and Baseline

**Purpose**: Record current behavior before editing so each later change can be compared with a known baseline.

- [X] T001 Capture current build size, route URLs, favicon output, route refresh behavior, and mobile Lighthouse results in `specs/001-portfolio-improvements/quickstart.md` before implementation; record unavailable field metrics as unavailable.

## Phase 2: Foundational Route Metadata

**Purpose**: Establish one typed/static data source shared by browser metadata, generated HTML, and the sitemap.

- [X] T002 Create the route metadata manifest for `/`, `/Resume/`, and `/Cybersecurity_Awareness/` in `src/data/siteMetadata.json`, including unique title, description, canonical URL, social image, and social image alt text under the `/Portfolio/` base; define trailing-slash normalization here as the single canonical policy.
- [X] T003 Add Vitest coverage in `src/data/siteMetadata.test.ts` for unique paths, non-empty descriptions, supported route membership, absolute canonical URLs, and canonical/sitemap path consistency rules.

**Checkpoint**: Downstream route, document-head, and sitemap edits consume the same metadata values rather than maintaining separate copies.

## Phase 3: User Story 1 - Trust the Network Trace Tool (Priority: P1)

**Goal**: Explain the live data flow, preserve explicit opt-in, and provide a local demo that works without external requests.

**Independent Test**: The visitor sees the disclosure before live use; demo mode makes no requests; live lookup and failures do not break the Awareness page.

### Implementation

- [X] T004 [P] [US1] Add component tests in `src/components/NetworkTrace.test.tsx` for idle/no-request behavior, live lookup, local demo without fetch, provider failure, and simulated-data labeling.
- [X] T005 [P] [US1] Extract typed provider response validation and normalization into `src/utils/networkTrace.ts`, including missing/null fields, malformed JSON shapes, ipify failures, HTTP failures, and ipapi `{error: true}` responses.
- [X] T006 [US1] Add unit tests in `src/utils/networkTrace.test.ts` for valid, partial, malformed, rate-limited, and provider-level error responses without making network requests.
- [X] T007 [US1] Update `src/components/NetworkTrace.tsx` to disclose ipify/ipapi and the public-IP/data flow before the live button, expose the local demo while idle, keep demo handling independent from `fetch`, and replace the extension-blaming message with neutral retry/demo guidance.
- [X] T008 [US1] Update `src/components/NetworkTrace.tsx` and `src/styles/awareness.css` so progress and concise success/error states are announced accessibly without moving focus or making the whole result grid a live region.
- [ ] T009 [US1] Verify both NetworkTrace modes inside `src/pages/CybersecurityAwareness.tsx` at mobile widths and with keyboard/screen-reader navigation; confirm unrelated password, brute-force, checklist, and entropy tools retain their behavior.

## Phase 4: User Story 2 - Fix Site Identity and Sitemap (Priority: P1)

**Goal**: Correct the favicon URL and make sitemap URLs and dates trustworthy.

**Independent Test**: The built favicon reference resolves, and each sitemap entry exactly matches a canonical route with truthful `lastmod`.

- [X] T010 [P] [US2] Rename `public/favicon .svg` to `public/favicon.svg` without altering SVG content or other asset files.
- [X] T011 [P] [US2] Update the favicon link in `index.html` to use Vite's base-aware public URL, then confirm the built file and link resolve under `/Portfolio/`.
- [X] T012 [US2] Update `public/sitemap.xml` from the canonical route manifest, remove Google-ignored `changefreq` and `priority`, and set `lastmod` only for pages with a verifiable significant content change.
- [X] T013 [US2] Check `public/robots.txt` and the built root document so the sitemap URL remains the project-site URL and the favicon does not lose the `/Portfolio/` base.

## Phase 5: User Story 3 - Navigate and Share Each Portfolio Page Clearly (Priority: P2)

**Goal**: Serve consistent route-specific metadata to browsers and social preview fetchers, keep direct navigation working, and give unknown paths a useful response.

**Independent Test**: Inspect initial HTML for all supported route heads, open and refresh each route with and without a trailing slash, and verify an unknown route is not indexed as valid content.

- [X] T014 [US3] Add a typed route metadata reader in `src/utils/routeMetadata.ts` that reads `src/data/siteMetadata.json` and exposes the matching route record plus a safe not-found result.
- [X] T015 [US3] Add Vitest coverage in `src/utils/routeMetadata.test.ts` for exact route matching, the `/Portfolio/` base, trailing-slash normalization, title/description selection, and unknown routes.
- [X] T016 [US3] Create `scripts/generate-route-html.mjs` to generate `/Resume/index.html` and `/Cybersecurity_Awareness/index.html` in `dist/` from the built `dist/index.html`, replacing only the title, description, canonical, OG, Twitter, and route metadata tags from the shared manifest.
- [X] T017 [US3] Update the `build` script in `package.json` to run `scripts/generate-route-html.mjs` after `vite build`, fail on missing/duplicate route metadata, and leave the existing `generate:cv` script behavior intact.
- [X] T018 [US3] Add `RouteMetadata` and `NotFound` behavior in `src/App.tsx` so client-side navigation updates the same head fields, unknown paths show a useful link back home, and unknown routes receive `noindex` without leaving duplicate canonical tags.
- [X] T019 [US3] Remove conflicting per-page title effects from `src/pages/Home.tsx`, `src/pages/Resume.tsx`, and `src/pages/CybersecurityAwareness.tsx` after the shared route metadata behavior is wired.
- [X] T020 [US3] Update internal route links in `src/components/Navbar.tsx` and `src/components/Hero.tsx` to use the canonical trailing-slash policy while preserving legacy no-slash URLs through the existing `public/404.html` redirect; do not add a second copy of metadata or sitemap values.
- [X] T021 [US3] Verify generated HTML heads and direct route navigation with the `/Portfolio/` base using `npm run build`, `npm run preview`, and the scenarios in `specs/001-portfolio-improvements/quickstart.md`; confirm `scripts/generate-pdf.cjs` still opens the Resume route and writes `dist/CV_Philopater.pdf`.
- [X] T022 [US3] Update `ARCHITECTURE.md` with the route metadata source, build-time HTML generation, fallback behavior, and dated change-log entry after the implementation is confirmed.

## Phase 6: User Story 4 - Accessibility and Responsive Use (Priority: P2)

**Goal**: Correct verified WCAG 2.2 AA gaps without regressing theme styling, mobile layout, or motion behavior.

**Independent Test**: Complete navigation, theme switching, contact, trace, and carousel tasks using keyboard and screen reader; verify contrast and layout in both themes.

- [X] T023 [US4] Restore visible `:focus-visible` indicators for contact inputs in `src/styles/content.css` and password inputs in `src/styles/awareness.css`, retaining the current focus color language and checking both themes.
- [X] T024 [US4] Audit and correct semantic names, field error/status announcements, and mobile-menu state in `src/components/ContactFooter.tsx` and `src/components/Navbar.tsx` without changing EmailJS field names or submission contract.
- [X] T025 [US4] Add reduced-motion handling and a pause/resume control for auto-advancing testimonials in `src/components/TestimonialsSection.tsx` and the related rules in `src/styles/content.css`; preserve manual slide selection and keyboard access.
- [X] T026 [US4] Inventory rendered images in `src/components/ExperienceSection.tsx`, `src/components/EducationSection.tsx`, `src/components/CertificationsSection.tsx`, `src/components/VolunteeringSection.tsx`, and `src/components/TestimonialsSection.tsx`; add intrinsic dimensions/aspect ratios only where missing and do not change the already sized/high-priority hero image in `src/components/Hero.tsx`.
- [X] T027 [US4] Review and fix text, control, focus, and non-text contrast in `src/styles/base.css`, `src/styles/navbar.css`, `src/styles/content.css`, `src/styles/awareness.css`, and `src/styles/responsive.css` in both themes, limiting selectors to the confirmed failing components.
- [ ] T028 [US4] Complete the manual checks in `specs/001-portfolio-improvements/quickstart.md` at 360 px and 390 px, with keyboard-only and screen-reader navigation, reduced motion, and contact/trace error states; record remaining browser-specific limitations there.

## Phase 7: User Story 5 - Measured Performance (Priority: P2)

**Goal**: Improve only bottlenecks supported by repeatable measurements while preserving current loading priorities.

**Independent Test**: Compare baseline and final runs under identical mobile/desktop profiles and report lab versus field data accurately.

- [ ] T029 [US5] Record before/after LCP, CLS, transfer size, initial JavaScript, and largest image findings in `specs/001-portfolio-improvements/quickstart.md`; record INP only from field data and use TBT only as a labeled lab proxy.
- [ ] T030 [US5] Optimize only images shown by the audit to be material in `src/assets/` and update references in `src/assets/index.ts` and the affected image components; preserve alt text, image dimensions, hero eager/high-priority loading, and below-fold lazy loading.
- [X] T031 [US5] Inspect the route bundle report and keep existing lazy routes in `src/App.tsx`; split another module only if the baseline identifies a significant initial-route cost, otherwise record the no-change result in `specs/001-portfolio-improvements/quickstart.md`.
- [ ] T032 [US5] Re-run matched mobile/desktop performance checks and document asset/bundle deltas and any CWV limitations in `specs/001-portfolio-improvements/quickstart.md` before retaining an optimization.

## Phase 8: User Story 6 - Reproducible, Gated Deployment (Priority: P3)

**Goal**: Deploy only the same verified site artifact, while keeping pull requests non-deploying and permissions scoped to the deploy job.

**Independent Test**: A pull request runs checks only; a failing main verification cannot deploy; a passing main run deploys the built route files and generated PDF.

- [X] T033 [US6] Consolidate `.github/workflows/ci.yml` and `.github/workflows/deploy.yml` into one workflow with a verification job and a dependent main-only Pages deployment job; preserve pull-request verification and remove duplicate push pipelines.
- [X] T034 [US6] Configure the verification job in `.github/workflows/ci.yml` to run `npm ci`, lint, `npm run format:check`, TypeScript, Vitest, build, and PDF generation; upload the final `dist/` artifact only on main pushes.
- [X] T035 [US6] Configure the deploy job in `.github/workflows/ci.yml` to download the verified artifact, publish it to Pages, and receive `pages: write`/`id-token: write` only in that job; retain `contents: read` and add safe deployment concurrency.
- [X] T036 [US6] Review every `uses:` reference and pin Actions to verified full commit SHAs in `.github/workflows/ci.yml`, documenting the upstream release/version for each pin in workflow comments.
- [X] T037 [US6] Validate the workflow graph and artifact contents in `.github/workflows/ci.yml`, confirming PRs cannot deploy and deploy requires verification; verify the PDF and all generated routes are in the uploaded `dist/` artifact.

## Phase 9: User Story 7 - Verify Project Evidence (Priority: P3)

**Goal**: Make project outcomes verifiable and accurate without inventing evidence or overwriting existing user edits.

**Independent Test**: Review every featured project metric and writeup destination; a visitor can identify the contribution and inspect the supporting resource.

- [X] T038 [US7] Review the current working diff for `src/data/portfolioData.ts` before editing; preserve all existing user changes and list each project metric, linked repository, and writeup destination for verification.
- [X] T039 [US7] Update only verified or appropriately qualified project outcomes and working writeup links in `src/data/portfolioData.ts`; remove unsupported precision instead of inventing a benchmark.
- [X] T040 [US7] Check rendered project/writeup cards and Resume content in `src/components/ProjectsSection.tsx`, `src/components/WriteupsSection.tsx`, and `src/pages/Resume.tsx` for accurate links, wrapping, and consistent project facts.

## Phase 10: Polish and Cross-Cutting Validation

**Purpose**: Confirm integration across the pages and preserve architecture documentation and current user work.

- [X] T041 Update `ARCHITECTURE.md` with confirmed privacy, accessibility, performance, and deployment changes and add a dated change-log entry; document only behavior that was actually implemented.
- [X] T042 Review the complete diff for unrelated edits and confirm the pre-existing user changes in `README.md` and `src/data/portfolioData.ts` are preserved before release.
- [ ] T043 Run `npm run lint`, `npm run format:check`, `npx tsc --noEmit`, `npm run test`, and `npm run build` from the repository root; resolve failures before merge and verify all manual scenarios in `specs/001-portfolio-improvements/quickstart.md`.

## Dependencies and Execution Order

### Phase Dependencies

- Setup baseline (Phase 1) precedes source changes so regressions can be identified.
- Foundational route metadata (Phase 2) precedes sitemap and route HTML generation.
- P1 stories (Phases 3â€“4) can proceed independently after baseline; US2 route references use the shared manifest.
- Route metadata/story 3 follows the manifest and must pass build-output/direct-navigation checks before broad accessibility and performance comparisons.
- Accessibility work follows the NetworkTrace UI changes because the same component and stylesheet are touched.
- Performance optimization follows baseline and route generation; it changes only assets or modules supported by measurements.
- Deployment gating follows all application/build changes so the verified artifact includes generated route pages and PDF output.
- Evidence review is independent of UI infrastructure but must inspect current modifications to `src/data/portfolioData.ts` before editing.
- Final validation runs after all selected stories; never deploy from this task list before verification is green.

### Story Dependencies

- **US1 (P1)**: After baseline; independent from metadata work.
- **US2 (P1)**: Requires shared route manifest T002; the favicon correction can be done alongside US1, and the canonical slash policy is fixed before the sitemap update.
- **US3 (P2)**: Requires T002/T003; includes build helper, route metadata behavior, not-found handling, links, and PDF compatibility as one integration boundary.
- **US4 (P2)**: NetworkTrace accessibility depends on US1; CSS/navigation/contact work can be parallelized only when file overlap is avoided.
- **US5 (P2)**: Baseline starts at T001; optimization waits for the route and accessibility changes to settle.
- **US6 (P3)**: Depends on the final build layout from US2/US3/US5 and PDF generation.
- **US7 (P3)**: Independent, but requires diff inspection before editing current user-modified data.

## Parallel Opportunities

- T004/T005 can be developed independently in different files; T006 follows T005.
- T010/T011 can proceed separately from T004â€“T009, but T012 must consume the final manifest and route policy.
- T023, T024, and T026 can proceed on different files after US1; T025 may overlap only with the testimonials image audit, so assign them sequentially if the same component is being edited.
- T030 and T031 can proceed independently when the performance report identifies separate asset and code-splitting work.
- US7 review can proceed in a separate branch/worktree, after explicitly reconciling the existing `src/data/portfolioData.ts` modifications.

## MVP Recommendation

Deliver **US1 and the favicon portion of US2** first: clarify the data flow, provide a local demo, remove coercive error guidance, and fix the broken icon. Then complete route metadata/sitemap (US2/US3), because all later route-facing checks depend on stable canonical behavior. Do not take on performance optimization until a baseline shows a specific bottleneck.

## Format Validation

All tasks use `- [ ] T###`, include a story label only inside user-story phases, and name concrete repository file paths. No speculative test framework or runtime package is introduced.
