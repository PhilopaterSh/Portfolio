# Tasks: P1 Hardening Quick Wins

**Input**: `./spec.md`, `./plan.md`
**Total tasks**: 10

## Phase 1: User Story 1 - Verifiable Writeup Destinations (P1)

- [X] T001 Update the Linux Administration writeup in `src/data/portfolioData.ts` to the verified article title ("Linux User, Group & Permission Management - Practical Assignment Guide"), matching description, and direct Medium URL from the author's RSS feed.
- [X] T002 Add the published "HCIA - Routing" article (Jan 2026) as a non-featured writeup card in `src/data/portfolioData.ts` using the existing `Writeup` interface.

## Phase 2: User Story 2 - Truthful Structured Data (P1)

- [X] T003 Set `dateModified: 2026-10-13` on the `WebPage` and `ProfilePage` schema nodes in `index.html`.
- [X] T004 Append the four 2026 certifications from `src/data/portfolioData.ts` to `Person.hasCredential` in `index.html`.

## Phase 3: User Story 3 - Web-Sized Images (P1)

- [X] T005 Recompress `public/og-image.jpg` to a web-sized JPEG (same 1376x768 dimensions) and record the byte delta in `plan.md`.
- [X] T006 Convert the heavy raster assets (hero profile, testimonials, largest experience/education/volunteering PNG/JPEGs) to WebP with per-image visual spot-checks, update `src/assets/index.ts` as the single mapping point, and delete superseded sources.
- [X] T007 Record all byte deltas in `plan.md` and confirm the hero keeps eager/high-priority loading while non-hero images stay lazy.

## Phase 4: User Story 4 - Trust and Scroll-Rendering Primitives (P2)

- [X] T008 Add `public/.well-known/security.txt` with Contact, future Expires, and Preferred-Languages fields.
- [X] T009 Add `content-visibility: auto` + `contain-intrinsic-size` rules for below-fold Home sections in `src/styles/content.css`.

## Phase 5: Validation and Documentation

- [X] T010 Run `npm run lint`, `npm run format:check`, `npx tsc --noEmit`, `npm run test`, `npm run build`, and `npm run verify:preview`; add the dated ARCHITECTURE.md change-log entry; tick this task list.

## Notes

- Open question (out of scope): removing/masking the public phone number in
  `src/data/portfolioData.ts` is a site-owner privacy decision, not taken here.
