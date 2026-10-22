# Research: Portfolio Improvements

**Date**: 2026-10-13
**Scope**: Evidence-based implementation choices for the existing React/Vite site on GitHub Pages.

## Decision 1: Keep the current static hosting and client application; generate route-aware HTML metadata at build time

**Decision**: Keep GitHub Pages, Vite, and React Router. For the three known public routes, provide distinct initial HTML metadata (title, description, canonical, Open Graph and Twitter fields) in generated build output, while keeping the current client application for interactive behavior. Use the existing SPA deep-link redirect only as a fallback, add a React catch-all not-found experience, and mark a not-found route as `noindex` where applicable.

**Rationale**:

- `index.html` currently supplies the home page canonical and social metadata for all routes. The route components set `document.title` after JavaScript loads, which cannot give non-JavaScript social preview fetchers page-specific metadata.
- Google can render JavaScript, but this happens after crawling and may be delayed; Google recommends server-side or static rendering for discoverability and notes that other crawlers may not execute JavaScript. Vite supports pre-rendering known routes to static HTML. For this three-route, static portfolio, route-specific generated documents provide a smaller operational change than introducing a continuously running server.
- The initial increment should generate route-specific HTML/head metadata and verify actual `dist` output and GitHub Pages deep links. Do not claim full content pre-rendering unless the generated HTML contains the route content. If search testing later demonstrates that client-rendered page content is not indexed sufficiently, evaluate full Vite static pre-rendering as a separate expansion.
- Keep the existing `/Portfolio/` base path. Vite requires a repository subpath base for GitHub Pages project sites.

**Alternatives considered**:

- Client-side metadata updates only: smallest code change, but metadata is absent or generic in the initial HTML and may not be used by social crawlers.
- Full SSR with a Node server: unnecessary for static GitHub Pages hosting and would require changing the deployment model.
- Dynamic rendering for crawlers: Google describes it as a workaround with added complexity, not the recommended long-term solution.

Sources: [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Google dynamic rendering guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering), [Vite SSR and pre-rendering](https://vite.dev/guide/ssr.html), [Vite GitHub Pages deployment](https://vite.dev/guide/static-deploy.html), [GitHub Pages custom 404](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site).

## Decision 2: Keep live IP lookup opt-in, disclose the request path, and make demo available before errors

**Decision**: Preserve the current click-triggered live lookup, but put a concise disclosure before it. Name ipify and ipapi.co, explain that the visitor's public IP is involved in both requests, describe the returned data, and avoid claims about retention that are not confirmed. Make local simulation available in idle state. Keep it isolated from `fetch`; use neutral failure wording and handle HTTP, provider-level, malformed, and partial-data cases.

**Rationale**:

- The current component issues a request to ipify to obtain the visitor's public IP and then requests ipapi.co with that IP in the URL. It currently only offers the demo after a failed live request and tells visitors to disable extensions.
- The provider documents response fields and failures, including HTTP errors and error objects returned in a successful HTTP response; fields can be absent or null.
- W3C guidance says status messages such as loading, success, or error should be exposed to assistive technology without requiring focus movement. Use a small status/error announcement rather than turning the result grid into a continuously announced region.

**Alternatives considered**:

- Remove live lookup entirely: strongest privacy, but removes the existing educational demonstration. Retain optional live mode because the user specification keeps it in scope.
- Hide the disclosure in a separate privacy page: rejected because the meaningful choice occurs at the trace control.
- Claim the provider does not log or retain data: rejected; provider statements are not independent guarantees and are unnecessary to explain the immediate request flow.

Sources: [ipify API](https://www.ipify.org/), [ipapi.co API documentation](https://ipapi.co/api/), [ipapi.co privacy FAQ](https://ipapi.co/faq/), [W3C WCAG 2.2 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html), [W3C `role=status` technique](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22.html).

## Decision 3: Audit against WCAG 2.2 AA with manual keyboard and assistive-technology checks

**Decision**: Retain the existing CSS and native controls; first audit keyboard access, visible focus, contrast in both themes, screen-reader names/status updates, reduced-motion behavior, and narrow viewport reflow. Correct confirmed failures in the existing components. Do not add an accessibility dependency unless the manual/automated audit shows a concrete gap an existing tool cannot cover.

**Rationale**:

- The project constitution sets WCAG 2.2 AA as the target and identifies form/password focus treatments as gaps.
- W3C WCAG 2.2 includes keyboard operation, contrast, status messages, focus not obscured, and a 24 CSS-pixel minimum target criterion with exceptions. A lint plugin catches only a subset, so a keyboard and screen-reader review is still necessary.
- The hero image already has width and height. The audit should inventory all image elements and embed dimensions rather than assume every image lacks sizing.

Sources: [W3C WCAG 2.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/), [Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), [Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html), [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## Decision 4: Measure before changing images or bundles

**Decision**: Establish a repeatable Lighthouse/Chrome DevTools baseline for mobile and desktop, inspect the specific largest images and initial route bundle, and make only evidence-backed changes. Keep route-level lazy loading, eager/high-priority hero loading, and below-the-fold lazy images. Convert or resize images only where measurement shows material savings; preserve dimensions/aspect ratio. Do not add field analytics just for this initiative.

**Rationale**:

- The checked-in build shows an approximately 392 KB uncompressed main JavaScript file and images up to roughly 105 KB. These figures justify inspection but do not prove a user-facing performance failure.
- Core Web Vitals good thresholds are LCP ≤ 2.5 seconds, INP ≤ 200 milliseconds, and CLS ≤ 0.1 at the 75th percentile, segmented by device. Lighthouse lab runs cannot establish field INP; total blocking time is a lab proxy, and representative field data should be reported only if available.
- Chrome guidance supports responsive image sizing and modern formats. Do not lazy-load the LCP/hero image.

**Alternatives considered**:

- Add more code splitting immediately: rejected because Resume and Awareness routes are already lazy-loaded and no bundle composition measurement yet identifies another costly boundary.
- Add Web Vitals telemetry: deferred because this privacy-sensitive portfolio has no analytics endpoint today; do not introduce collection to solve a problem that can first be measured with lab tools/Search Console.

Sources: [Core Web Vitals](https://web.dev/articles/vitals), [Lab and field measurement](https://web.dev/articles/vitals-measurement-getting-started), [Responsive images](https://developer.chrome.com/docs/lighthouse/performance/uses-responsive-images), [Modern image formats](https://developer.chrome.com/docs/lighthouse/performance/uses-webp-images).

## Decision 5: Make deploy depend on the same verification checks and install from the lockfile

**Decision**: Make the Pages deployment path run only after the same required checks as CI succeed; use `npm ci` for deployment. Keep current minimal Pages permissions. Review action SHA pinning and deployment concurrency as a separate hardening task with documented update maintenance.

**Rationale**:

- CI already runs `npm ci`, lint, TypeScript, tests, and build for pushes to `main` and pull requests. The separate Pages workflow triggers on `main`, uses `npm install`, and can deploy independently while CI fails.
- npm documents `npm ci` as a clean automated install that fails when the lockfile and manifest disagree and does not rewrite the lockfile.
- GitHub recommends explicit minimum permissions and full-length SHA references for immutable action versions. Current Pages permissions are already narrowly scoped. Pinning is beneficial but creates routine update work; do not widen tokens or add environment approval gates without a stated need.
- Preferred design: combine verification and deployment into a single workflow with a verification job and a dependent deployment job (main pushes only), passing the verified build artifact forward. Keep pull-request runs verification-only. This avoids independent workflows racing and avoids rerunning the build.

**Alternatives considered**:

- Duplicate all verification steps in deploy.yml: reliable gating but wastes CI time and risks drift.
- Depend on a separate `workflow_run` event: possible, but more complex to associate the successful CI run with the exact source revision and artifact.
- Keep current separate push workflows: rejected because deployment is not gated by verification.

Sources: [npm ci](https://docs.npmjs.com/cli/commands/npm-ci/), [GitHub deployment workflows and concurrency](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments), [GitHub workflow security](https://docs.github.com/en/code-security/tutorials/secure-your-organization/protect-against-threats), [GitHub Pages with Actions](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically).

## Decision 6: Verify portfolio claims against available evidence before rewriting them

**Decision**: Audit the visible projects/writeups against repository links or supplied evidence. Keep claims that can be supported; add concise context and links or remove precise metrics that cannot be substantiated. Do not invent benchmarks or outcomes.

**Rationale**: Credibility improves when contributions and results are verifiable. The current portfolio data includes quantified outcomes, but this repository alone does not establish their measurement basis.

**Alternatives considered**: Rewriting all project copy for style alone is deferred; the work is evidence validation, not a general copy refresh.

## Open questions resolved by repository defaults

- **Hosting**: GitHub Pages remains in place; no backend or paid service is introduced.
- **Analytics**: No new visitor analytics or IP logging is introduced.
- **Test policy**: Follow the project constitution. Add focused tests for non-trivial state/logic changes and run the existing lint, typecheck, test, format-check, and build gates before merge.
- **External contracts**: No new public application API is introduced; provider calls are existing outbound browser requests. A separate `/contracts/` directory is not needed.
