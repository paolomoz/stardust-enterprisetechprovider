<!--
_provenance:
  writtenBy: stardust:direct
  writtenAt: 2026-05-05
  basis: resolved direction (Mode A — brand-faithful refresh) + stardust/current/PRODUCT.md
  inferredFields: [Brand Personality, Design Principles] — derived from resolved axes
-->

# PRODUCT.md — Enterprise Tech Provider (target)

## Register
**brand**

A content destination, not a tool. No accounts, no dashboard — an
editorial surface published for a specific professional audience.

## What it is

A co-branded trade publication run by **The Channel Company** and
sponsored by **Dell Technologies** — the destination Dell partners
read to keep up with the Dell catalogue, partner programmes, and
sales motions. Articles, newsletters, and short-form video. The
redesign treats it as a proper trade publication ("a small *Bloomberg
Businessweek* for the Dell channel") rather than as a templated
sponsored-content microsite.

## Users
- **Primary:** Dell channel partners — resellers, solution providers,
  MSPs, distributors — looking for sales enablement and product
  briefings (PowerStore, PowerMax, PowerEdge, PowerProtect,
  NativeEdge, AI Factory, OptiPlex, Latitude, Precision).
  Skim-readers; want to see what is current, what's relevant to their
  customer, and what's worth opening — without clicking.
- **Secondary:** Channel marketing staff at Dell using the surface
  for syndication and partner enablement.
- **Tertiary:** SEO arrivals — IT decision-makers researching Dell
  products who land on individual articles via Google.

## Product Purpose

Help Dell partners turn each new Dell announcement into the next
customer conversation. Newsletter signup is the secondary KPI;
individual-article time-on-page is the primary engagement signal.
The redesign serves the **scan-then-dive** behaviour: the home page
shows what's current; cards carry the metadata you need to decide
whether to open them; the article body reads as editorial, not as a
press release.

## Brand Personality
- **Trade-press confident.** Reads as a publication with editorial
  judgement, not as a stock-photo content microsite.
- **Direct-address.** Headlines speak to the partner — "you" and
  "your customers" — preserved from the existing voice.
- **Refined enterprise, not consumer.** Type and palette are
  premium-B2B (Bloomberg Businessweek / Stripe Press / IBM annual
  report), not consumer (Vercel docs, Apple marketing).
- **Co-branded but not intermediated.** "Enterprise Tech Provider"
  is the destination; The Channel Company and Dell Technologies are
  named explicitly but at supporting weight.
- **Restrained colour, considered type.** Dark teal `#003049`
  remains the brand anchor; new secondaries (a deeper navy, a muted
  brass, a deep cordovan) carry editorial accents. Type uses three
  families with distinct functions — display grotesk, editorial
  serif, UI sans — replacing the single-family Roboto skin.

## Anti-references
- A consumer Dell.com store page.
- A Dell internal partner portal (no login flow, no entitlements UI).
- A general IT news site like CRN.com (this is a Dell-only vertical).
- A blog (no individual-author voice; bylines exist for credit, not
  for "personal essay").
- **Generic-2026-SaaS silhouette** — centered hero with split-CTA on
  primary blue + 3-column feature grid + testimonial slider +
  pricing cards. The redesign is editorial, not landing-page.
- **Editorial-register larping** — words like *atelier*, *the
  studio*, *mise-en-place*, *the journal* belong on different
  brands. ETP voice stays trade-press direct.

## Design Principles
1. **Cards earn opens.** Every card carries the metadata a partner
   needs to decide whether to read: topic chip · date · read-time ·
   author. No card is a thumbnail-and-title gamble.
2. **Hierarchy by type, not by colour band.** Page structure reads
   through the type scale and through deliberate spacing — not
   through full-bleed dark teal strips repeated as section dividers.
3. **Mixed-case article titles.** Reserve UPPERCASE for short
   eyebrow labels, topic chips, primary CTAs, and the utility strip
   only. Article titles, section openers, and decks render
   mixed-case in the display face.
4. **Identity over interstitial.** Site mark and name are the
   dominant header element; co-brand markers are present but not
   loud. The persistent global hero band is removed from inner
   pages; each page owns its own first viewport.
5. **Token-driven, single source of truth.** Every colour, type
   step, spacing value, radius, and shadow lives in `:root` design
   tokens. No hard-coded values in component CSS.

## Accessibility & Inclusion

- AA contrast minimum on every text-on-surface combination —
  validated per token pair, not per-component.
- Mixed-case body and headings (uppercase reserved for ≤3-word
  eyebrows / labels) — uppercase reduces letter-shape recognition
  for low-vision and dyslexic readers.
- All article-card thumbnails carry meaningful `alt`; empty `alt`
  is a content error, not a stylistic choice.
- Every interactive element has a non-colour focus indicator (≥3 px
  outline in `--ink`, with offset).
- Reduced-motion respected on every animated element (carousel
  auto-advance, hover micro-animations).

## Content surfaces (IA — target)
- **Home (`/`)** — single hero (lead story, not stock photo) +
  Featured (1+4) + By Topic (6 tiles) + Latest (chronological list)
  + Newsletter / Reels.
- **Section index (`/storage`, `/server`, `/commercial-pcs`,
  `/newsroom`, `/artificial-intelligence`, `/edge`, `/security`,
  `/sustainability`, `/modern-workplace`, `/modern-datacenter`,
  `/apex-multicloud`, `/multicloud`, `/dell-technologies-advantage`,
  `/intel`, `/cloud`, `/microsoft`, `/hybrid-work`)** — single
  canonical taxonomy. The existing `/category/<slug>` URLs 301 to
  their primary peer or are dropped from internal nav.
- **Article (`/<section>/<slug>`)** — compact chrome bar (breadcrumb
  + section eyebrow + page H1) on the first viewport; editorial
  body in serif at comfortable measure; in-article cross-sells
  appear as text links inside the body, not as another co-branded
  card row.
- **Author (`/users/<name>`)** — proper author layout: portrait,
  bio in serif, list of articles with full card metadata.
- **Topic tag (`/technologies/<slug>`)** — same listing template as
  section indexes.
- **Sitemap (`/sitemap`)** — built; full IA visible.
- **Videos (`/videos`)** — built; existing YouTube playlist rendered.
- **Newsletter archive (`/newsletter-archive`)** — built; back issues
  visible.
- **Search (`/search/node`)** — kept; given proper styling.

## Distribution
- Sourcepoint consent overlay still loads (compliance requirement,
  not optional). Treated as a known UX cost, mitigated by ensuring
  the host page underneath has nothing critical above the fold to
  obscure on first paint.
- Newsletter capture remains the primary ongoing-engagement
  mechanism — moved out of the right rail into a dedicated home
  block + a per-article footer block.
- YouTube playlist embed remains for "Reels"; treated as a
  first-class block, not a section-strip with an embed inside.
- The Channel Company form embed remains for newsletter signup.
