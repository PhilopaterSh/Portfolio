# Data Model: Portfolio Improvements

This feature adds no persistent storage. The entities below describe static build data and transient UI state.

## RouteMetadata

Represents the search and sharing identity for one public route.

| Field | Type | Rules |
|---|---|---|
| `path` | string | One of the three supported routes, relative to `/Portfolio/` |
| `title` | string | Non-empty, unique per route, describes page content |
| `description` | string | Non-empty, accurate summary of that route |
| `canonicalUrl` | URL string | Absolute URL under `https://philopatersh.github.io/Portfolio/`; matches sitemap location |
| `socialImageUrl` | URL string | Absolute, publicly available preview image |
| `socialImageAlt` | string | Meaningful text alternative |

**Relationships**: One record per supported route. Sitemap entries and generated head metadata use the same canonical URL values.

## NetworkTraceState

Transient, in-memory state for the educational network trace.

| State | Meaning | External request allowed? |
|---|---|---|
| `idle` | Disclosure is visible; no lookup is running | No |
| `live-loading` | Visitor explicitly started live lookup | Yes |
| `demo-loading` | Visitor explicitly started local simulation | No |
| `live-success` | Valid live response available | Already completed |
| `demo-success` | Clearly marked simulated result available | No |
| `error` | Live request failed or response was unusable | No additional request until retry |

**Transitions**: `idle → live-loading → live-success/error`; `idle/error/live-success/demo-success → demo-loading → demo-success`; `error → live-loading` only after explicit retry. Demo data must never call `fetch`.

**Live result fields**: public IP, city, region, country name/code, postal code, timezone, and organization. Each field may be missing/null and should render an explicit unavailable state.

## PerformanceBaseline

An audit record, not a visitor profile or analytics event.

| Field | Type | Rules |
|---|---|---|
| `route` | string | Tested supported route |
| `deviceClass` | `mobile` or `desktop` | Record audit configuration |
| `measurementType` | `lab` or `field` | Never mix results |
| `lcpMs` | number or unavailable | Field target ≤ 2500 ms |
| `inpMs` | number or unavailable | Field target ≤ 200 ms; lab Lighthouse cannot directly measure INP |
| `cls` | number or unavailable | Field target ≤ 0.1 |
| `notes` | string | Browser, throttling, date, and observed bottlenecks |

No IP address, identifier, or user-level event is stored for this feature.

## ProjectEvidence

Static portfolio content backing a featured project or writeup claim.

| Field | Type | Rules |
|---|---|---|
| `claim` | string | Clear description of contribution or outcome |
| `basis` | string | Method/context for any precise quantitative result, or explicitly unavailable |
| `evidenceUrl` | URL or absent | Public link directly supporting the claim where available |
| `reviewStatus` | `verified`, `qualified`, or `remove-precision` | Editorial review result; not rendered as a technical badge |

No claim or metric should be invented to fill missing evidence.
