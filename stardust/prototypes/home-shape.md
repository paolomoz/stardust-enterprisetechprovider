<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-05-05T00:00:00Z
  page:             home
  pageUrl:          https://www.enterprisetechprovider.com/
  againstDirection: stardust/direction.md (Active 2026-05-05T00:00:00Z)
  consumedBy:       impeccable:craft
  readArtifacts:
    - stardust/current/pages/home.json
    - stardust/current/_brand-extraction.json
    - DESIGN.md
    - DESIGN.json
    - stardust/direction.md
    - stardust/prototypes/home-improvements.md
  stardustVersion:  0.3.0
-->
---
slug: home
url: https://www.enterprisetechprovider.com/
register: brand
---

# Page shape: home

Anchor for the entire redesign. The improvements list defines the
gap; this brief defines the deployment.

## Sections (in render order)

0. **utility-strip** (system-component role: `utility-strip`) — site-
   wide attribution. ~28 px tall, `--vellum` background,
   `--graphite-mute` text in `--mono` 11 px / 0.12 em tracking,
   uppercase. Verbatim copy from captured home:
   `PRODUCED BY THE CHANNEL COMPANY · SPONSORED BY DELL TECHNOLOGIES`.
   Replaces the current site's loud co-branded header band — co-brand
   acknowledged, not asserted.

1. **header** (system-component role: `header`) — sticky on scroll
   (~64 px). Composition:
   - Left: site mark "Enterprise Tech Provider" wordmark in
     `--display` face, 20 px, `--ink` colour. Dominant element.
   - Centre: primary nav inline at desktop, mixed-case in `--ui`
     face, 14 px. From captured nav: **AI · Modern Datacenter ·
     Storage · Modern Workplace · Intel · Dell Tech Advantage**.
     "HOME" link removed (the wordmark links home — convention).
   - Right: search input (always visible, not buried in a MENU
     drawer — `iaPriorities[search-led IA]` mandates) + "Subscribe"
     `button-secondary`.
   - Mobile: site mark + hamburger; nav collapses to drawer.

2. **hero** (the lead-story hero — not the persistent stock-photo
   band) — full-width section, ~480 px tall on desktop. 7/5 split.
   - Left column (7/12): eyebrow `FEATURED` (mono, `--brass`); H1 in
     `--display` mixed-case at 48 px = lead article title from
     captured: *"How Dell Is Accelerating Partners' Success in the
     Era of AI PC Computing"*; deck in `--editorial` italic 20 px /
     1.45 (a 2-line excerpt — sourced from `og:description` /
     `metaDescription` if present in
     `current/pages/modern-workplace/how-dell-is-accelerating-partners-success-in-the-era-of-ai-pc-computing.json`;
     **NOT captured here, mark as placeholder if not derivable from
     the title**); meta row (topic chip · date · read-time · author —
     **all placeholders**); primary CTA "Read article" linking to
     `/modern-workplace/how-dell-is-accelerating-partners-success-in-the-era-of-ai-pc-computing`.
   - Right column (5/12): hero image (16:9) — captured thumbnail
     `assets/media/05109-20251024-Dell-windows-refresh-blog-309x309_202-2e033d3c.jpg`
     **upscaled / promoted** from card thumbnail to hero. The
     captured 309 px source is sub-optimal for hero treatment;
     migrate will need to source the higher-resolution original from
     the article page. For prototype, use the captured asset.
   - No carousel, no auto-advance. Single static lead.

3. **By Topic** (`data-section="by-topic"`) — 6-tile topic grid
   linking to section indexes. Replaces the current site's "STORAGE
   · ARTIFICIAL INTELLIGENCE · VIDEOS · MODERN DATA CENTER · DELL
   TECH ADVANTAGE · MODERN WORK" trailing strip-stack.
   - 3-column grid at desktop (2 rows), 2-col tablet, 1-col mobile.
   - Tiles, in this order (from sitemap counts):
     1. **Newsroom** — 147 articles · `--platinum` / `--graphite`
     2. **Storage** — 97 articles · `--ink-haze` / `--ink`
     3. **Commercial PCs** — 55 articles · `--cordovan-10` /
        `--cordovan`
     4. **Server** — 48 articles · `--ink-haze` / `--ink`
     5. **Modern Workplace** — 37 articles · `--cordovan-10` /
        `--cordovan`
     6. **Artificial Intelligence** — 36 articles · `--brass-12` /
        `--brass`
   - Each tile: topic name in `--display` 24 px, mono article-count
     subtitle ("147 ARTICLES"), 1-line description in `--editorial`
     14 px italic, full tile is the click target → section index
     (e.g. `/storage`).
   - Article counts: **derived from `sitemap.xml`**, not invented;
     allowed source.

4. **Latest** (`data-section="latest"`) — 6 most recent articles
   from captured home (excluding the lead story already in hero).
   - 2-column grid at desktop, 1-col tablet/mobile.
   - Each card: 16:9 cover image (captured thumbnail), topic chip,
     `--display` 20 px title (mixed-case), `--editorial` italic
     16 px deck (placeholder if title is the only captured value),
     mono meta row (topic chip · date · read-time · author —
     **placeholders for date / read-time / author**).
   - Cards in render order (preserved from captured home `LATEST`
     section + adjacent grids):
     1. *PowerStore's Latest Release Proves the Future of IT Is
        Smarter Storage* — `/storage/...`
     2. *Why Dell's PowerMaxOS 10.4 Enhancements Are Vital for Your
        Enterprise Customers' Mission-Critical Storage* — `/storage/...`
     3. *5 Ways Dell PowerProtect Helps You Grow Your Business by
        Protecting Your Customers* — `/dell-technologies-advantage/...`
     4. *How Dell PowerEdge Single-Socket Servers With AMD EPYC
        Processors Help Partners Grow* — `/modern-datacenter/...`
     5. *Help Customers Build the Best Workplace Experience for
        Productivity and Collaboration* — `/modern-workplace/...`
     6. *Leverage Dell's Powerful Client Device Security to Win
        Customer PC Refresh Deals* — `/modern-workplace/...`
   - "View all latest →" link beneath the grid (right-aligned, mono
     11 px) → `/newsroom`.

5. **engagement** (`data-section="engagement"`) — combined
   newsletter + reels block, 2-column split at desktop. Replaces the
   current site's right-rail newsletter form + carousel of reels.
   - Left column: newsletter signup. Eyebrow "STAY IN THE LOOP"
     (mono, `--graphite-mute`). H2 "The ETP newsletter" (`--display`
     30 px). Body copy (`--editorial` 16 px): captured home does not
     provide a description for the newsletter — derive from the
     captured nav label "NEWSLETTERS" only — **mark
     newsletter-description as placeholder**. Inline form: 1 email
     input + `button-primary` "Subscribe" (verbatim CTA from captured
     newsletter form).
   - Right column: "Reels" — 3-up grid of YouTube thumbnails from
     the captured `youtube.com/embed/videoseries?list=...` playlist.
     Each thumbnail uses captured `mqdefault-*.jpg` assets. Click
     opens the reel in a `<dialog>` with the YouTube iframe (no
     auto-play). "View all reels →" link beneath. **Reel titles are
     placeholders** — captured home shows thumbnails but no titles.

6. **footer** (system-component role: `footer`) — site-wide. Render
   per `_brand-extraction.json#systemComponents.footer`.
   - Top accent: 1 px `--navy-deep` line.
   - Background: `--obsidian` (#000000, user-pinned).
   - 4 columns at desktop, stacked at mobile:
     - **About** — links: "About The Channel Company", "About CRN",
       "Sitemap" (verbatim).
     - **Contact** — "Contact Dell Technologies", "Contact The
       Channel Company".
     - **CRN Awards** — "Subscribe", "CRN Lists & Awards".
     - **Follow** — Instagram, YouTube, X, LinkedIn icons (captured
       SVGs from `assets/media/`).
   - Below the 4-col: legal strip ("The Channel Company Privacy
     Policy · The Channel Company Cookie Policy · Do Not Sell or
     Share My Personal Information"), then the **co-brand lockup
     row at intended scale**: "TheChannelCo" mark + "DELL
     Technologies" mark side by side. This is where co-brand earns
     its real estate.

## Layout strategy

- Density: **balanced** (per DESIGN.md `spacing.sectionPadding`: 64 /
  48 / 32 px). Each editorial section uses 64 px vertical padding
  desktop.
- Columns: 12-col CSS grid with 24 px gutter at desktop. Hero 7/5
  split. By-Topic 3-col. Latest 2-col. Engagement 2-col.
- Max content width: 1280 px (per DESIGN.md `spacing.contentMaxWidth`).
- Hero photo column collapses **below** the headline column at
  <1024 px (text first, image second).
- Cards: 8 px radius (`--radius-lg`), 1 px `--platinum-edge` border,
  `--shadow-sm` resting / `--shadow-md` on hover. Hover also tints
  border to `--ink-haze`.

## Key states

- Default — described above.
- Hover (cards) — shadow lifts to `--shadow-md`; cover image scales
  1.02 over 200 ms (`--motion-duration-base`); topic chip background
  intensifies one shade; respects `prefers-reduced-motion: reduce`
  (no scale).
- Hover (inline article links in body) — 1 px `--ink` underline at
  descender thickens to 2 px and shifts to `--brass`.
- Hover (CTA primary) — `--ink` fill darkens to `--ink-deep`.
- Sticky header on scroll — gains `--shadow-md`; utility strip
  scrolls away.
- Empty / Loading / Error — N/A for this static page.

## Interaction model

- Header search input — submits to `/search/node` (existing).
- Header "Subscribe" — anchor link to `#engagement`.
- Hero "Read article" → captured article URL.
- Topic tile → captured section URL.
- Card title link → captured article URL.
- Reel thumbnail click → opens `<dialog>` (CSS-only `:target` or
  light JS toggle) with the YouTube iframe; ESC closes; respects
  reduced motion (no fade).
- Footer social icons → `target="_blank"` external profiles
  (captured external links).
- No auto-advancing carousels. No modals on first paint. No popups.

## Data attributes

```html
<header data-section="utility-strip"
        data-intent="attribute"
        data-layout="full-width-thin"
        data-items="2"></header>

<header data-section="header"
        data-intent="navigate"
        data-layout="full-width-sticky"
        data-items="6"></header>

<main>
  <section data-section="hero"
           data-intent="lead-story"
           data-layout="split-7-5"
           data-items="1"></section>

  <section data-section="by-topic"
           data-intent="taxonomy"
           data-layout="grid-3-2"
           data-items="6"></section>

  <section data-section="latest"
           data-intent="recent-content"
           data-layout="grid-2"
           data-items="6"></section>

  <section data-section="engagement"
           data-intent="convert"
           data-layout="split-2"
           data-items="2"></section>
</main>

<footer data-section="footer"
        data-intent="navigate"
        data-layout="mega"
        data-items="4"></footer>
```

## Unsourced content (placeholder list)

Per F-002 contract. Each item below renders with the mandatory
PLACEHOLDER signature in `<slug>-proposed.html` and appears in
`_provenance.unsourcedContent[]`.

- `section[data-section="hero"] .meta .date` — date of lead article.
  Captured home cards carry no publication date. Type: `other`.
- `section[data-section="hero"] .meta .read-time` — read-time
  estimate. Captured home cards carry no read-time. Type: `other`.
- `section[data-section="hero"] .meta .author` — author byline.
  Captured home cards carry no byline (KJ Jacoby is captured as an
  author profile but cards on home have no author attribution).
  Type: `other`.
- `section[data-section="hero"] .deck` — deck under the lead story
  H1. Captured home shows only the title; the article excerpt is not
  on the home page. Type: `other`.
- `section[data-section="latest"] .card[*] .meta .date` — same
  metadata gap repeated for each of 6 cards.
- `section[data-section="latest"] .card[*] .meta .read-time` — same.
- `section[data-section="latest"] .card[*] .meta .author` — same.
- `section[data-section="latest"] .card[*] .deck` — short summary
  beneath card title; not captured.
- `section[data-section="engagement"] .newsletter p` — newsletter
  description. Captured home shows the form and the heading
  "NEWSLETTERS" but no body copy. Type: `other`.
- `section[data-section="engagement"] .reels .reel-title[*]` — titles
  for the 3 reel thumbnails. Captured home shows thumbnails but
  YouTube playlist titles are not in the home JSON. Type: `other`.

**Counts:** ~24 placeholders total (4 hero meta + 18 card meta
across 6 cards + 1 newsletter copy + 3 reel titles − some overlap).
Each shown with `2 px dashed --brass` outline + `PLACEHOLDER · other`
mono eyebrow + an example shape.

**Article-count integers in the By-Topic block are NOT placeholders
— they derive from `_crawl-log.json#discovery.ia_observations.by_section_count`.**

## Open questions for craft

- **Hero composition: split-7-5 vs full-bleed photo with overlay?**
  The 7/5 split is editorial-newspaper (Bloomberg Businessweek
  style). Full-bleed photo with type overlay reads more "hero"
  and asserts the lead story harder, but requires a contrast scrim
  and the captured image is small. Recommendation: split-7-5 on
  this initial render; revisit during live iteration if the lead
  doesn't feel "lead enough".
- **Topic-tile differentiation: cluster background tint or unified?**
  DESIGN.json defines a 4-cluster topic-chip palette. The brief
  proposes applying the cluster colour as the tile background tint
  (8% opacity). Alternative: keep all tiles `--vellum` and tint only
  the chip. Recommendation: tint tiles for distinctiveness;
  reviewer to confirm.
- **Newsletter description.** Authentic copy is missing. Brief
  treats this as placeholder; user may want to author canonical
  copy in `direction.md` before approval to ship a real
  description ("Weekly digest for Dell partners — sales plays,
  product launches, and the partner programme news worth knowing").
