# Plan: P1 Hardening Quick Wins

**Branch**: `002-p1-hardening` | **Spec**: `./spec.md` | **Created**: 2026-10-13

## Approach

Small, verifiable hardening changes executed on a feature branch (main auto-deploys).
No new runtime dependencies; image conversion uses one-off local tooling with results
committed. Every change is data/CSS/static-file scoped — no component behavior changes
except the hero image source import, which keeps identical semantics.

## Measurement Baseline (2026-10-13, lockfile build)

| Asset | Before | After | Delta |
|---|---|---|---|
| `public/og-image.jpg` (recompressed JPEG q85 mozjpeg, same 1376×768) | 417.5 kB | 78.3 kB | −339.2 kB |
| `src/assets/profile.jpg` → WebP q82 | 104.5 kB | 56.8 kB | −47.7 kB |
| `src/assets/testimonials/*.png` (11 files) → WebP | 303.8 kB | 154.0 kB | −149.8 kB |
| `src/assets/experience/deci.png` → WebP q82 | 54.8 kB | 47.6 kB | −7.2 kB |
| `src/assets/experience/depi.png` → WebP lossless | 22.7 kB | 20.8 kB | −1.9 kB |
| `src/assets/experience/nti.png` → WebP q82 | 32.3 kB | 4.2 kB | −28.1 kB |
| `src/assets/education/eelu.png` → WebP q82 | 22.2 kB | 3.3 kB | −18.9 kB |
| Remaining logos (digilians, asorc, fortress, yat, mostaql, khamsat, hackerone, scout) → WebP | 38.9 kB | 20.8 kB | −18.1 kB |
| `src/assets/experience/BugCrowd.png` | 9.5 kB | kept PNG | +0 (WebP larger) |
| Main JS bundle (A/B: HEAD data vs new data, same Vite 7.3.6 toolchain) | 430.23 kB / 152.97 kB gzip | 430.79 kB / 153.18 kB gzip | +0.56 kB (writeup data only) |

The 401–402 kB baseline recorded in spec 001 was produced by a local Vite 7.3.1
install; this spec's tooling install synced `node_modules` to the lockfile (Vite
7.3.6), which alone accounts for the ~28 kB raw difference. The A/B stash build
isolates this spec's source delta to +0.56 kB of writeup data.

Conversion rule applied: keep the smallest of {source, WebP q82, WebP lossless} per
file; `BugCrowd.png` stayed PNG because both WebP variants were larger. All pixel
dimensions are unchanged, so `imageDimensions` and HTML width/height attributes stay
truthful. Converted images were visually spot-checked in the production preview
(hero, experience logos, testimonial screenshot) and every asset URL returns HTTP 200.

## Decisions

- **Writeup fix is a data-only edit** in `src/data/portfolioData.ts`: correct title to
  the real article title, rewrite description, point `link` at the Medium article URL
  verified from the RSS feed. A second published article ("HCIA - Routing", Jan 2026)
  is added as a new non-featured card using the existing `Writeup` shape.
- **Schema dates** move to `2026-10-13` in both `WebPage.dateModified` and
  `ProfilePage.dateModified`; four 2026 credentials are appended to `hasCredential`
  mirroring `src/data/portfolioData.ts` `certs` entries.
- **`content-visibility: auto`** applies to below-fold Home section wrappers only,
  each with `contain-intrinsic-size: auto <estimated height>` so scrollbars stay
  stable. The hero and navbar are excluded. A `@supports` guard is unnecessary:
  the property is ignored by older engines without layout impact.
- **`security.txt`** fields: `Contact: mailto:Philopater.Pentester@outlook.com`
  (already public on the site), `Expires: 2027-10-13`, `Preferred-Languages: en, ar`.
- **No phone-number removal in this spec**: it is a content/privacy decision owned by
  the site owner, tracked as an open question, not silently changed.

## Risks

- WebP testimonial screenshots could lose small-text legibility at q80 — mitigated by
  per-image visual check and q85 fallback for the smallest text.
- `contain-intrinsic-size` guesses that are too small cause scrollbar jitter; values
  are set from measured rendered heights at desktop width and rounded up.

## Verification

Quality gates per constitution Principle VI plus `npm run verify:preview` route smoke;
byte deltas recorded above; ARCHITECTURE.md changelog entry added in the same change.
