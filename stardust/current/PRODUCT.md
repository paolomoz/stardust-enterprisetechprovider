<!--
_provenance:
  writtenBy: stardust:extract
  writtenAt: 2026-05-04
  basis: 5-page sample from https://www.enterprisetechprovider.com/
  inferredFields: [Users, Anti-references, Design Principles] — extracted, not authored
-->

# PRODUCT.md — Enterprise Tech Provider (current state, descriptive)

## Register
**brand**

The site reads as a sponsored content destination, not a tool. There is
no account, no settings, no dashboard — just an editorial surface
serving articles, video reels, and newsletters. Treat as a marketing /
content brand for redesign purposes.

## What it is

A co-branded content hub published by **The Channel Company** (the
publisher behind CRN) and **sponsored by Dell Technologies**. The
site exists to brief Dell's channel partners — resellers, solution
providers, system integrators — on Dell product launches, sales plays,
and partner-program updates, in a press-style trade format.

## Users
- **Primary:** Dell channel partners (resellers, solution providers,
  MSPs, distributors) looking for sales enablement and product
  briefings on the Dell catalogue (PowerStore, PowerMax, PowerEdge,
  PowerProtect, NativeEdge, AI Factory, OptiPlex, Latitude,
  Precision, etc.).
- **Secondary:** Channel marketing staff at Dell looking for a
  syndication surface for partner-facing content.
- **Tertiary:** SEO/search arrivals — IT decision-makers researching
  Dell products who land on individual articles via Google.

## Product Purpose

Drive Dell partners toward the next sales motion by translating Dell's
product roadmap into "what this means for you and your customers"
articles. Newsletter capture is a secondary KPI. The site is **not**
trying to convert end-customers — it is trying to keep partners
informed and engaged.

## Brand Personality
- Earnest, sponsored-content trade press
- Headline-driven, benefit-first ("How Dell Is Helping Partners…",
  "5 Ways…", "Win Customer PC Refresh Deals")
- Direct address — every headline points at "you" (the partner)
- No editorial voice or opinion; no humor; no sharp visual point of view
- Co-branded throughout: publisher and sponsor are visible on every
  surface (header, footer, "Produced by / Sponsored by" markers)

## Anti-references (what it should not feel like)
- A consumer Dell.com store page
- A Dell internal portal (no login, no entitlements)
- A general IT news site (CRN.com is the publisher; this is a Dell-only
  vertical and should feel like one)
- A blog (it has no author voice; "users/KJ" exists but is barely a
  byline page)

## Design Principles (currently observed)
- **Co-branding above content.** Header dedicates ~190px above the
  fold to publisher + sponsor + tagline + stock photo, before the
  page's actual title appears.
- **Maximum density on the home page.** 13+ section-label bands stack
  on the home page (RECOMMENDED, ESSENTIAL READING, LATEST, POPULAR,
  NEWSLETTERS, ARTIFICIAL INTELLIGENCE, VIDEOS, MODERN DATA CENTER,
  STORAGE, DELL TECH ADVANTAGE, MODERN WORK, INNOVATION & IMPACT,
  REEL HIGHLIGHTS).
- **Cards are flat and metadata-light.** No date, no author, no
  topic chip — just a thumbnail and an uppercase title.
- **Uppercase as visual hierarchy.** Section labels and even article
  H1s are rendered in ALL CAPS to read as "important."
- **Two-column traditional editorial.** Article body left, narrow
  right rail with ad + newsletter form.
- **No design tokens.** Theme ships one CSS custom property
  (`--sa-uid`, an analytics ID) and zero color/spacing/type tokens.

## Content surfaces (IA observed)
- Home (`/`) — densely-stacked recommended/latest/popular grids
  segmented by topic
- Section listings — `/storage`, `/server`, `/commercial-pcs`,
  `/newsroom` (working) **and** `/category/<slug>` (parallel taxonomy:
  `/category/storage`, `/category/ai`, `/category/dta`,
  `/category/edge`, `/category/hybrid-work`, `/category/intel`,
  `/category/mdi`, `/category/microsoft`, `/category/multicloud`)
- Article — uppercase title band on dark teal, then body, then
  "Accelerate with Dell Technologies" cross-sell card row
- Author profile (`/users/<name>`) — sparse, no styling distinct
  from a generic article
- Topic tag pages — `/technologies/<slug>` (e.g. `/technologies/ai`,
  `/technologies/poweredge`, `/technologies/optiplex`)
- Sitemap (`/sitemap`) — returns 403 (broken)
- Videos (`/videos`) — returns 404 (broken; nav links to it)
- Newsletter archive (`/newsletter-archive`) — returns 404 (broken;
  nav links to it)

## Total content surface
- 614 article URLs in `/sitemap.xml`
- Largest sections: newsroom (147), storage (97), commercial-pcs (55),
  server (48), modern-workplace (37), modern-datacenter (36),
  artificial-intelligence (36), apex-multicloud (34), multicloud (28),
  security (24)

## Distribution
- Sourcepoint consent overlay (full-viewport iframe) blocks all
  content on first visit
- Newsletter capture is the primary ongoing-engagement mechanism
- YouTube playlist embed serves "REEL HIGHLIGHTS" video reel
- The Channel Company form embed (`pages.thechannelco.com`) handles
  newsletter signup
