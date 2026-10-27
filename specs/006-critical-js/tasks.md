# Tasks: LCP Critical-Path Reduction

**Input**: `./spec.md`
**Total tasks**: 6

- [x] T001 In `src/components/Hero.tsx`, remove the opacity gate from the hero image wrapper's entrance (`initial`/`animate` keep the scale motion only) so the LCP image is eligible at first paint; the text column keeps its fade.
- [x] T002 In `src/pages/Home.tsx`, move Experience, Education, Projects, Writeups, Testimonials, Certifications, Volunteering, Skills, Languages, and ContactFooter behind `React.lazy` under one `Suspense` boundary; keep Navbar, Hero, About, and ScrollToTop eager.
- [x] T003 Verify first-paint hero opacity ≥ 0.99 without settle waits, animation still plays, zero console errors, and both themes settle in a full scroll-through.
- [x] T004 Record deterministic chunk deltas (main + new lazy chunks, raw and gzip) in `plan.md`.
- [x] T005 Interleaved Lighthouse mobile A/B ×3 (branch vs 005-jsdoc head), medians recorded in `plan.md` and spec 001 `quickstart.md` as lab data.
- [x] T006 Gates green (`pipefail`), `ARCHITECTURE.md` entry, tasks ticked, commit, push.
