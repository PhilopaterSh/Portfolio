# Feature Specification: Portfolio Improvements

**Feature Directory**: `specs/001-portfolio-improvements`
**Created**: 2026-10-13
**Status**: In Progress
**Input**: User request: "Organize the portfolio improvements by priority and actual need using Spec Kit."

## User Scenarios & Testing

### User Story 1 - Trust the Network Trace Tool (Priority: P1)

As a visitor considering the Network Identity Trace, I want to understand what information will be sent and to whom before I start, so I can make an informed choice about revealing my public IP address to external services.

**Why this priority**: The tool sends visitor network information to third-party services. Clear disclosure and an intentional action are necessary for trust and informed use.

**Independent Test**: A visitor can review the disclosure, choose whether to run the live trace, and use a clearly labeled demo without sending a live request.

**Acceptance Scenarios**:

1. **Given** the trace is idle, **When** a visitor views the tool, **Then** the page explains which information is sent, which external providers receive it, and what results are returned.
2. **Given** the visitor has not chosen to run a live trace, **When** the page loads, **Then** no trace request is sent.
3. **Given** a provider is blocked or unavailable, **When** the visitor attempts a trace, **Then** the page shows a neutral error and offers the demo without asking the visitor to disable privacy tools.
4. **Given** the visitor chooses the demo, **When** it completes, **Then** simulated values are clearly identified as simulated and no external lookup is made.

### User Story 2 - Fix Broken Site Identity and Search Metadata (Priority: P1)

As a visitor or search engine, I want the site's icon and indexed page information to resolve correctly, so the portfolio is recognizable and accurately represented in browser tabs and search results.

**Why this priority**: The current HTML references `/favicon.svg`, while the repository contains a file named `favicon .svg` with an embedded space. The sitemap also uses dates that need to be checked against actual significant content changes.

**Independent Test**: Verify that the configured favicon URL returns the intended asset, each canonical route is represented accurately, and sitemap modification dates reflect real significant updates.

**Acceptance Scenarios**:

1. **Given** the production site is built, **When** a browser requests the configured favicon URL, **Then** it receives the intended icon without a missing-file response.
2. **Given** a supported page is included in the sitemap, **When** its metadata is checked, **Then** its canonical URL and modification date accurately represent the page.
3. **Given** a sitemap entry has no significant content change, **When** the sitemap is maintained, **Then** its `lastmod` value is not advanced merely to appear fresh.

### User Story 3 - Navigate and Share Each Portfolio Page Clearly (Priority: P2)

As a visitor or search engine arriving at the resume or awareness page directly, I want page-specific identity and working navigation, so I can understand the page and share or revisit it reliably.

**Why this priority**: The site has multiple routes but the base document's search and social metadata describes the portfolio home page. Direct-route behavior and metadata should be verified before investing in larger search changes.

**Independent Test**: Open and refresh each supported route directly, then inspect its title, description, canonical URL, social preview metadata, and not-found behavior.

**Acceptance Scenarios**:

1. **Given** a visitor opens a supported route directly, **When** the page loads or is refreshed, **Then** the intended page is shown without a server error or incorrect route.
2. **Given** a supported route is shared, **When** its metadata is inspected, **Then** the title and description accurately describe that route.
3. **Given** a visitor opens an unsupported route, **When** the route cannot be matched, **Then** the visitor sees a clear not-found experience with a path back to the portfolio.

### User Story 4 - Use the Portfolio with Different Access Needs (Priority: P2)

As a visitor using a keyboard, assistive technology, or a small screen, I want all essential portfolio content and controls to remain perceivable and operable, so I can complete the same key tasks.

**Why this priority**: The project constitution targets WCAG 2.2 AA and calls out focus visibility as an existing gap. Image sizing must be audited across the site; the hero image already declares dimensions, so that finding should not be generalized to every image.

**Independent Test**: Complete primary navigation, theme selection, contact form interaction, and awareness tools using keyboard-only navigation and a screen reader; inspect contrast and small-screen layouts.

**Acceptance Scenarios**:

1. **Given** a visitor uses only a keyboard, **When** they navigate interactive controls, **Then** every control is reachable, operable, and has a visible focus indicator.
2. **Given** a visitor uses a screen reader, **When** they encounter images, form feedback, or interactive tools, **Then** meaningful content and state changes are conveyed without relying on visual appearance alone.
3. **Given** a visitor uses a viewport at least 360 CSS pixels wide, **When** they browse the supported pages, **Then** essential content and controls remain usable without horizontal page scrolling.
4. **Given** text, controls, and focus indicators are rendered in either theme, **When** contrast is evaluated, **Then** applicable WCAG 2.2 AA contrast requirements are met.

### User Story 5 - Load the Portfolio Quickly and Reliably (Priority: P2)

As a visitor, I want the portfolio's primary content to load quickly and remain visually stable, so I can review it on mobile and slower connections without unnecessary waiting or movement.

**Why this priority**: The app already splits some routes and lazy-loads secondary images, but the built main JavaScript bundle is approximately 392 KB before transfer compression and images include JPEG/PNG assets. Measure real impact before deciding which changes are worthwhile.

**Independent Test**: Measure mobile and desktop page loads with a repeatable performance audit, inspect image delivery and layout shifts, and compare results to the agreed performance targets.

**Acceptance Scenarios**:

1. **Given** representative mobile and desktop loads, **When** performance is measured at the 75th percentile where field data is available, **Then** LCP is at most 2.5 seconds, INP is at most 200 milliseconds, and CLS is at most 0.1.
2. **Given** images appear on the page, **When** they load, **Then** the browser has reserved layout space and below-the-fold images do not delay the initial viewport.
3. **Given** a performance recommendation is considered, **When** its change is evaluated, **Then** the decision is based on measured user impact and includes an asset or bundle comparison.

### User Story 6 - Publish Only Reproducible, Verified Builds (Priority: P3)

As the site owner, I want deployment to use the locked dependencies and require successful verification, so the published site matches a validated build.

**Why this priority**: The repository already has CI checks for lint, type checking, tests, and builds. The deployment workflow currently installs with `npm install`; aligning deployment with the lockfile and validation workflow reduces avoidable drift.

**Independent Test**: Review a deployment run and confirm it installs from the lockfile, waits for required checks, and uploads only a successfully built site.

**Acceptance Scenarios**:

1. **Given** dependencies are installed during deployment, **When** the workflow runs, **Then** it uses the committed lockfile reproducibly.
2. **Given** a required validation job fails, **When** the deployment workflow is evaluated, **Then** the failing revision is not published.
3. **Given** a workflow requests repository permissions, **When** its permissions are reviewed, **Then** it receives only the permissions required for its job.

### User Story 7 - Evaluate the Portfolio's Professional Evidence (Priority: P3)

As a recruiter or security professional, I want project claims and work samples to be clear and verifiable, so I can assess the candidate's contribution and results.

**Why this priority**: The portfolio describes quantified project outcomes and lists writeups. Reviewing evidence and attribution can improve credibility, but it should follow correctness, privacy, accessibility, and performance work.

**Independent Test**: Review each featured project and writeup to confirm its contribution, evidence, links, and any quantitative claim are understandable and verifiable.

**Acceptance Scenarios**:

1. **Given** a featured project includes a quantified outcome, **When** a visitor reviews it, **Then** the scope and basis of the outcome are explained or the claim is revised to avoid unsupported precision.
2. **Given** a writeup or project is linked, **When** a visitor follows the link, **Then** it opens the relevant resource and has a useful description.

## Edge Cases

- A privacy extension, network policy, or provider outage blocks a live trace request.
- A third-party provider returns partial, malformed, or rate-limited data.
- A visitor refreshes a nested route or enters a nonexistent route directly.
- A visitor has reduced-motion preferences or navigates with keyboard-only input.
- A page has no significant content change even though a deployment or copyright year changes.
- A CI validation job fails while a deployment is queued.

## Requirements

### Functional Requirements

- **FR-001**: The trace tool MUST explain the data flow and third-party recipients before a visitor initiates a live trace.
- **FR-002**: The trace tool MUST NOT send a live lookup before the visitor explicitly starts it.
- **FR-003**: The trace tool MUST distinguish simulated data from live data and MUST offer a demo that makes no external lookup.
- **FR-004**: The trace tool MUST handle blocked, failed, rate-limited, and incomplete provider responses with clear, non-coercive feedback.
- **FR-005**: The published favicon reference MUST resolve to the intended icon asset.
- **FR-006**: Canonical routes, page titles, descriptions, social metadata, and sitemap entries MUST describe the correct page and use accurate significant-change dates.
- **FR-007**: Visitors MUST be able to open and refresh supported routes directly and recover from unsupported routes through a clear not-found experience.
- **FR-008**: Essential content and controls MUST meet the project's WCAG 2.2 AA accessibility baseline and remain usable on narrow mobile viewports.
- **FR-009**: Images MUST reserve their display space and secondary images MUST NOT block initial page content.
- **FR-010**: Performance changes MUST be based on repeatable measurements and the project's Core Web Vitals targets.
- **FR-011**: Deployment MUST install dependencies reproducibly and MUST NOT publish a revision whose required verification failed.
- **FR-012**: Featured project outcomes and writeup links MUST be understandable and verifiable, with unsupported quantitative claims corrected.

### Key Entities

- **Portfolio Route**: A user-accessible page with a path, page identity, canonical URL, title, description, and social preview metadata.
- **Network Trace Request**: A visitor-initiated live lookup or local demo, with a mode, disclosure, request state, and result/error state.
- **Performance Measurement**: A repeatable observation of page-load performance, viewport, device class, and Core Web Vitals results.
- **Project Evidence**: A portfolio claim or work sample with an outcome, explanatory context, and verification link where available.

## Success Criteria

### Measurable Outcomes

- **SC-001**: No live network trace request occurs before an explicit visitor action, and the disclosure identifies the data sent and the external recipients before that action.
- **SC-002**: The favicon URL configured by the site returns the intended asset in the production build.
- **SC-003**: Every supported route passes direct-load and refresh checks and presents route-appropriate metadata.
- **SC-004**: Keyboard-only review finds no essential control that is unreachable or inoperable, and all focused controls have a visible focus indicator.
- **SC-005**: Applicable WCAG 2.2 AA checks pass for contrast, semantic names, keyboard operation, and focus visibility.
- **SC-006**: Performance results are recorded for mobile and desktop; where representative field data exists, Core Web Vitals meet LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1 at the 75th percentile.
- **SC-007**: Deployment consumes the committed dependency lockfile and cannot publish when required verification fails.
- **SC-008**: All featured quantitative project outcomes have supporting context or are revised to remove unsupported precision.

## Assumptions

- The site remains a static portfolio hosted on GitHub Pages; no backend or paid hosting is introduced as part of this initiative.
- Existing React, TypeScript, Vite, React Router, and CSS architecture remain in place unless planning demonstrates a clear need to change them.
- The live network trace remains an optional educational feature; its visitor-facing privacy disclosure is part of its normal flow.
- The first release prioritizes correctness, visitor trust, and accessibility before adding new content or visual features.
- Existing user changes in `README.md` and `src/data/portfolioData.ts` are outside this feature's scope and must be preserved.
- No production deployment, third-party account change, or external service configuration is included in this planning feature.
