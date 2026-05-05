<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-05-05T13:30:00Z
  page:             storage-article
  pageUrl:          https://www.enterprisetechprovider.com/storage/how-dell-is-helping-partners-navigate-an-unprecedented-memory-shortage
  consumedBy:       direct authoring (V08 design system)
  designReference:  home-proposed-v08.html
-->
---
slug: storage-article
url: /storage/how-dell-is-helping-partners-navigate-an-unprecedented-memory-shortage
register: brand
type: article
---

# Page shape: storage-article

Article template — the leaf content type, 614 instances of which share this shape.

## Sections (in render order)

0. **utility-strip** — same as V08 (black band, co-brand attribution)
1. **header** — same as V08 (TheChannelCo logo + 7-nav at desktop, hamburger drawer at mobile, search)
2. **publication-banner** (mini-masthead E) — same as V08 (compact, "Enterprise Tech Provider · STAY AHEAD…")
3. **article-header** (NEW)
   - breadcrumb (mono caps): Home › Storage › this article (truncated)
   - topic chip (datacenter cluster): "Storage"
   - H1 (Manrope 700, mixed-case, clamp 36→56 px) — "How Dell Is Helping Partners Navigate an Unprecedented Memory Shortage"
   - deck (Newsreader italic 22) — captured og:description
   - byline row: author name + date + read-time + share affordance (mono caps)
   - tags pile: AI, MDI, PowerMax, PowerStore (chip-style)
4. **article-hero-image** — captured 309×309 native, centered, max-width 480 px (max 1.55× upscale, acceptable for editorial)
5. **article-body** (NEW)
   - max-width 68 ch (~620 px), centered
   - Newsreader serif body 18 / 1.7
   - drop cap on first paragraph (Manrope 700, 5-line float-left)
   - inline links: --ink color + brass-deep underline (thickens on hover)
   - subheads H2 in display (Manrope 700, 24 px)
   - one pullquote example: brass-deep top + bottom hairlines + Newsreader italic 28 (no side stripe — respects impeccable's >1 px ban)
   - bullet list example
6. **article-footer** (NEW)
   - "Tagged with" chip pile (re-show tags)
   - share row (mono caps + social icons)
   - author byline card (avatar 56 px circle + name + date + 1-line bio placeholder)
7. **related** — V08 magazine roster (3 cards, "More from Storage")
8. **engagement** — same as V08 (newsletter sign-off, narrow centered)
9. **footer** — same as V08

## Layout strategy

- 2-zone vertical: chrome stays full-width, content body uses 68 ch reading column
- Header sits inside the .ds-container max 1280, body uses a narrower .ds-reading max 720 (centers the 68 ch column)
- Hero image breaks out slightly to ~480 px wide (sits between header and body)
- Mobile collapses everything to single-column

## Key states

- Default — described above
- Reduced motion — drop cap and inline link transitions disabled

## Interaction model

- Breadcrumb crumbs are clickable links
- Topic chip → /category/storage
- Tags → /technologies/<tag> for technology tags or /category/<slug> for section tags
- Share affordances → mailto, X share, LinkedIn share (placeholder URLs)
- Inline body links → real captured URLs where they exist; placeholders where not

## Data attributes

```html
<header data-section="utility-strip" ...></header>
<header data-section="header" ...></header>
<section data-section="publication-banner" ...></section>
<article data-section="article-header" data-intent="title" data-layout="text-only" data-items="1"></article>
<figure data-section="article-hero-image" data-intent="cover" data-layout="centered"></figure>
<article data-section="article-body" data-intent="long-form" data-layout="single-column-prose"></article>
<section data-section="article-footer" data-intent="byline-share" data-layout="centered"></section>
<section data-section="related" data-intent="recent-content" data-layout="roster-3col" data-items="3"></section>
<section data-section="engagement" ...></section>
<footer data-section="footer" ...></footer>
```

## Unsourced content (placeholders)

The captured page's body text was not extractable (consent-walled / dynamic). The following render with the F-002 ghost signature:

- All article body paragraphs (~6-10 paragraphs) — from real article structure, content is placeholder
- The author bio sentence
- Read-time number ("7 min read" — illustrative)
- Author avatar (linked to captured /users/KJ but real photo not in our capture)

Real content from the captured page:
- Title, deck (og:description), byline ("By KJ Jacoby on February 2, 2026"), section/tag taxonomy, hero image, URL — all verbatim.

## New design elements (vs V08)

These are the NEW patterns that storage-article introduces:
1. **breadcrumb** — mono caps with `›` separator
2. **drop-cap on first paragraph** — Manrope 700 float-left
3. **inline link** — --ink + brass-deep underline (text-decoration thickness 1 → 2 on hover)
4. **subhead H2** — display, no chip-highlight (prose H2 should be subtle, NOT the chip-band style which is for landing pages)
5. **pullquote** — top + bottom brass-deep hairline rules with center-aligned italic
6. **author byline card** — avatar + name + role/bio
7. **tag pile** — repeated tag chips at footer

V08 patterns reused: chrome (utility/header/masthead), magazine roster, newsletter, footer, two-tone CTA.

## Open questions for the build

- Should the article H2 chip-highlight from home/listing pages bleed into article subheads? Recommendation: no. Chip-highlights are for section labels; in long-form prose they would feel chunky every few paragraphs. Subheads stay typographic.
- Should the hero image span full container width or be capped at 480 px? Recommendation: capped at 480 px since the source is 309 native; full-width would reveal pixelation.
