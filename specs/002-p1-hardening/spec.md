# Feature Specification: P1 Hardening Quick Wins

**Feature Branch**: `002-p1-hardening`

**Created**: 2026-10-13

**Status**: Draft

**Input**: Evaluation findings from the October 2026 portfolio review: content accuracy gaps, stale structured-data dates, unoptimized raster assets, and missing trust/scroll-performance primitives.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Verifiable Writeup Destinations (Priority: P1)

A visitor clicking any writeup card must land on the published article itself, never on a profile or listing page. The Linux Administration card currently links to the author's Medium profile because its direct article URL was unavailable at spec 001 time; the URL is now discoverable via the author's Medium RSS feed (`linux-user-group-permission-management-practical-assignment-guide-a8796f762946`). The card title and description must also match the real article ("Linux User, Group & Permission Management - Practical Assignment Guide").

**Why this priority**: A misdirecting link on a security professional's portfolio is a credibility defect visible to every reviewer, and spec 001 explicitly deferred this fix until the URL became available.

**Independent Test**: Every writeup card's `link` resolves to an article page on its stated platform; no card links to a bare profile root.

### User Story 2 - Truthful Structured Data (Priority: P1)

Search engines reading the deployed `index.html` must see `dateModified` values that reflect the latest significant content change (October 2026, writeups section additions), not the August 2026 SEO pass. The `Person.hasCredential` graph must include the 2026 certifications already listed in `src/data/portfolioData.ts` (Cybersecurity Leadership L1 & L2, GRC Specialist, HTB Information Gathering, Google Cybersecurity Professional).

**Why this priority**: Stale `dateModified` suppresses recency signals for pages whose content demonstrably changed, and missing credentials weaken the rich-result profile.

**Independent Test**: `index.html` declares `dateModified: 2026-10-13` in both the `WebPage` and `ProfilePage` nodes, and the four 2026 certifications appear in `hasCredential`.

### User Story 3 - Web-Sized Social and Content Images (Priority: P1)

Constitution Principle V requires web-sized images. The social preview `public/og-image.jpg` is 427 kB and the emitted raster assets include a 107 kB hero JPEG and PNG screenshots/testimonial captures that compress dramatically in modern formats. Converting the largest emitted assets to WebP (and recompressing the OG image within JPEG, which social crawlers cannot universally decode as WebP) must preserve visual acceptability, alt text, explicit dimensions, the hero's eager/high-priority loading, and below-fold lazy loading.

**Why this priority**: Image bytes dominate this site's transfer weight; the hero JPEG is the LCP image, and the OG image risks crawler fetch timeouts.

**Independent Test**: `og-image.jpg` is ≤ 200 kB; the largest emitted WebP-candidate assets are WebP with byte reductions recorded in `plan.md`; build output lists no unconverted asset above its documented threshold.

### User Story 4 - Trust and Scroll-Rendering Primitives (Priority: P2)

The site publishes a `security.txt` (RFC 9116) under `public/.well-known/` so security researchers have a documented contact channel, and below-fold Home sections declare `content-visibility: auto` with `contain-intrinsic-size` so the browser skips offscreen rendering work without introducing scroll jumps or CLS regressions.

**Why this priority**: Both are small additive changes; security.txt is a credibility signal for a pentester's site, and content-visibility reduces initial render cost without code-splitting trade-offs.

**Independent Test**: `dist/.well-known/security.txt` exists with a future `Expires`; Home sections render correctly when scrolled in both themes with no measurable layout shift introduced by the property.

## Requirements

- Every writeup `link` must point to a specific article URL verified against the author's Medium RSS feed or stated platform.
- `dateModified` values are ISO dates and must be updated whenever a significant content change ships.
- Image conversions must keep filenames referenced through `src/assets/index.ts` (or update that single mapping), never inline new paths inside components.
- The hero image keeps `fetchPriority="high"`, eager decoding, and explicit dimensions; non-hero images keep `loading="lazy"`.
- `content-visibility` additions must include `contain-intrinsic-size` fallbacks sized to each section's typical rendered height.
- `security.txt` must carry `Contact`, `Expires` (a real future date), and `Preferred-Languages` fields.

## Success Criteria

- `npm run lint`, `npm run format:check`, `npx tsc --noEmit`, `npm run test`, `npm run build`, and `npm run verify:preview` all pass.
- Byte deltas for every converted/recompressed asset are recorded in `plan.md` (lab numbers only; no field-CWV claims).
- `ARCHITECTURE.md` carries a dated change-log entry, and this spec's tasks are ticked in `tasks.md`.
