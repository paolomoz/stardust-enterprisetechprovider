<!--
_provenance:
  writtenBy: stardust:extract
  writtenAt: 2026-05-04
  basis: aggregated from 5 pages — see _brand-extraction.json
-->
---
colors:
  primary:        "#003049"   # dark teal — header band, footer accents, brand label
  surface-dark:   "#191919"   # pre-footer dark band
  background:     "#ffffff"
  surface:        "#e7e7e7"
  text:           "#333333"
  text-strong:    "#181818"
  text-muted:     "#656565"
  link:           "#1d6dab"
  accent-red:     "#cc0000"
typography:
  heading: "Roboto Light / Roboto Condensed (Light + Regular)"
  body:    "Roboto Regular"
  fallbacks: "Arial MT, Arial, sans-serif"
  weights: [300, 400, 500, 700]
  scale: ad-hoc                # not modular — see DESIGN.json.extensions.typeAudit
  casing: heavy-uppercase
rounded: 0px                   # cards, sections, bands all sharp; 3px on Submit, 50% on social icons
spacing:
  scale: ad-hoc
  rhythm: "no consistent vertical rhythm — section bands butt against each other with 0px padding-block"
components:
  - card-grid (image + uppercase title, no metadata)
  - section-label-strip (full-width dark teal band with uppercase H2)
  - hero-band (global, persistent across every page)
  - co-branded header
  - co-branded footer
  - right-rail (ad + newsletter form)
  - article-title-band (page H1 in dark teal hero)
  - newsletter-form (3-field email capture)
  - consent-overlay (Sourcepoint iframe)
---

# DESIGN — Enterprise Tech Provider (current state, descriptive)

## Visual identity in one paragraph

Mid-2010s Drupal + Bootstrap 3 trade-press layout. Dark teal
(`#003049`, Dell-adjacent) and white. Roboto / Roboto Condensed at
multiple weights with no modular scale. Sharp corners on every
surface; near-zero shadow language. The brand impression is read
through **co-branding** rather than through the design itself: the
publisher logo + sponsor logo + Dell-product nomenclature do all the
brand work, while the visual system is a generic CMS skin.

## Color

A two-color scheme — Dark teal `#003049` on white `#ffffff` — extended
by neutrals (`#181818`, `#333333`, `#656565`, `#e7e7e7`). A black-ish
`#191919` band runs across the page just before the footer. Inline
links inside articles render as a different blue (`#1d6dab`); nothing
else in the system uses that blue.

## Type

Single-family system: **Roboto** (Regular for body) and **Roboto
Condensed** (Light + Regular for display). Sizes do not follow a
modular ratio. The semantic page H1 on article templates is **25 px**;
unrelated decorative H2s elsewhere on the page reach **41 px** — so
the heading hierarchy reads upside-down. Heavy use of ALL-CAPS for
section labels and even article titles, which flattens scannability.

## Shape

Sharp corners. `border-radius: 0` everywhere except the **Submit**
button (`3px`) and social icons in the footer (`50%`). No card
borders, no cards-on-elevated-surface — flat tiles directly on white.

## Shadow

Effectively absent. Cards lay flat. The newsletter signup is the only
component shipping a soft drop shadow.

## Spacing

Ad-hoc. Section bands have 0 px padding-block on most landmarks; the
visual breathing room comes from the height of the dark teal label
strips themselves, not from spacing.

## Motifs

- **Co-branded header band** (publisher + sponsor)
- **Persistent hero band** with stock photo + tagline (every page)
- **Dark teal section-label strips** as the primary navigational rhythm
- **Square card-grid tiles**, image + uppercase title, no metadata
- **Right-rail ad slot + newsletter form**
- **Pre-footer dark band → black footer** (3-band finish)

## What ships zero design tokens

`getComputedStyle(:root)` returns one CSS custom property — `--sa-uid`,
an analytics user-id — and zero design tokens. There is no color
token, no spacing token, no type token. Every value in the design is
hard-coded in the legacy Drupal theme stylesheet
(`/sites/all/themes/tpz_theme_2020`).

## Framework signals

- **Drupal** (theme path `/sites/all/themes/tpz_theme_2020`)
- **Bootstrap 3.3.7** (loaded from jsDelivr CDN; Bootstrap 3 reached
  EOL in 2019)
- **lightSlider** (carousel library; 5 carousels detected on home)
- **Sourcepoint** consent (`cdn.privacy-mgmt.com`)
- **The Channel Company** form embed
  (`pages.thechannelco.com/index.php/form/XDFrame`)
- **Adobe Audience Manager** (`tcc.demdex.net`)
- **YouTube** playlist embed for video reel
