<!--
_provenance:
  writtenBy: stardust:direct
  writtenAt: 2026-05-05
  basis: resolved direction (Mode A — brand-faithful refresh) + improvements list
  divergenceMode: A (brand-faithful) + B (anchor-implied: Bloomberg Businessweek / Stripe Press / IBM annual report)
  brandFaithfulInversions:
    - id: pure-black-allowed
      reason: user-pinned primary palette includes #000000 (footer container, type-strong moments)
    - id: pure-white-allowed
      reason: user-pinned page background and brand surface
    - id: type-fully-open
      reason: user explicitly opened the type system; Roboto reads as templated
-->

---
register: brand
density: balanced              # 64 / 48 / 32 px section padding
colors:
  ink:              "#003049"  # PINNED — brand teal anchor
  ink-deep:         "#001f2f"  # darker ink for hover/active surfaces
  ink-haze:         "#e8eef2"  # palest ink wash, used for chip backgrounds
  obsidian:         "#000000"  # PINNED — footer band, premium type accent
  vellum:           "#ffffff"  # PINNED — primary page surface
  char:             "#0a0d12"  # near-black for body text (warmer than #000)
  graphite:         "#3d4651"  # secondary body text
  graphite-mute:    "#6b7480"  # caption / meta / "by author" / dates
  platinum:         "#f4f5f7"  # alt section surface, card hover
  platinum-edge:    "#dfe3e8"  # 1px borders, dividers
  navy-deep:        "#0b1f3a"  # NEW SECONDARY — large editorial bands, footer accent
  brass:            "#b88830"  # NEW SECONDARY — eyebrow accents, "FEATURED", topic-chip (AI cluster)
  cordovan:         "#5b1116"  # NEW SECONDARY — urgent badges, "LATEST" markers, important inline
typography:
  display:   "Geist, ui-sans-serif, system-ui, sans-serif"           # H1, H2, hero, section openers
  editorial: "'Source Serif 4', 'Iowan Old Style', Charter, Georgia, serif"  # article body, decks, pullquotes
  ui:        "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"  # nav, cards, meta, forms, buttons
  mono:      "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace"  # topic chips, dates, read-time, numerics
  scale: 1.25                                                        # perfect fourth, modular
  baseSize: 16px
  steps: [12, 14, 16, 18, 20, 24, 30, 36, 48, 60]                   # rounded modular scale
  casing: mixed-case                                                  # uppercase reserved for ≤3-word eyebrows + CTAs
  tracking:
    eyebrow: 0.12em
    heading: -0.01em
    body: 0
rounded:
  none: 0px
  sm: 2px            # topic chips, badges
  md: 4px            # buttons, inputs, small surfaces
  lg: 8px            # cards, larger surfaces
  pill: 999px        # status pills only
spacing:
  baseUnit: 4px
  sectionPadding:
    desktop: 64px    # balanced tier
    tablet:  48px
    mobile:  32px
  cardGap:
    desktop: 24px
    tablet:  16px
    mobile:  12px
  contentMaxWidth: 1280px
  proseMeasure: 68ch  # editorial body comfortable reading width
components:
  - button-primary       # ui face, --ink fill, --vellum text, 4px radius
  - button-secondary     # ui face, transparent fill, --ink text + 1px --ink border
  - button-ghost         # ui face, transparent fill, --char text underline-on-hover
  - link-inline          # ui face, --ink text, 1px underline at descender, --brass on hover
  - card-article         # cover image + topic chip + display title + meta row + serif deck
  - chip-topic           # mono face, 11px, 0.12em tracking, 2px radius, 6 named variants
  - badge                # mono face, 10px, --cordovan / --brass / --ink fills
  - eyebrow              # mono face, 11px, 0.12em tracking, --graphite-mute
  - input                # ui face, --vellum surface, --platinum-edge border, --ink focus ring
  - newsletter-form      # 1-line: input + button-primary
---

# DESIGN — Enterprise Tech Provider (target)

## North star in one paragraph

A small *Bloomberg Businessweek* for the Dell channel. Editorial
chrome, premium B2B colour, considered type. Dark teal `#003049`
remains the brand anchor; new secondaries — a deeper navy, a muted
brass, a deep cordovan — break the current monochrome flatness
without consumer-grade vibrance. Three type families — display
grotesk for moments, editorial serif for body, UI sans for chrome —
replace the single Roboto skin and let typography carry the
hierarchy that full-bleed coloured strips used to fake.

## Colour

A primary anchor pinned by the brand (teal, black, white) extended
by a small set of refined-enterprise secondaries. No consumer-grade
saturation; every colour earns its presence.

| Role             | Token             | Value      | Where it shows |
|------------------|-------------------|------------|----------------|
| Brand anchor     | `--ink`           | `#003049`  | Primary brand surfaces, primary CTA fill, focus rings, large editorial moments |
| Anchor deep      | `--ink-deep`      | `#001f2f`  | `--ink` hover/active, header on scroll |
| Anchor haze      | `--ink-haze`      | `#e8eef2`  | Topic-chip background (datacenter cluster), card hover surface |
| Pure black       | `--obsidian`      | `#000000`  | Footer band; premium type accents (rare) |
| Page surface     | `--vellum`        | `#ffffff`  | Default page background, card surface |
| Body text        | `--char`          | `#0a0d12`  | Article body, card titles, primary copy |
| Secondary text   | `--graphite`      | `#3d4651`  | Decks, captions on white surfaces |
| Meta / muted     | `--graphite-mute` | `#6b7480`  | Bylines, dates, read-time, eyebrow utility text |
| Alt surface      | `--platinum`      | `#f4f5f7`  | Alternating section background, card hover |
| Border / divider | `--platinum-edge` | `#dfe3e8`  | 1 px borders, list dividers, card outlines |
| Editorial deep   | `--navy-deep`     | `#0b1f3a`  | Footer top accent, large editorial bands, "Featured" lockup background |
| Brass accent     | `--brass`         | `#b88830`  | "FEATURED" eyebrow, AI-cluster topic chip, hover underline |
| Cordovan accent  | `--cordovan`      | `#5b1116`  | "LATEST" / "BREAKING" badges, important inline emphasis |

**Topic-chip family** — three muted accents cycle by category cluster:

- **Datacenter cluster** (Storage, Server, Modern DC, Cloud,
  Multicloud, Apex) → `--ink-haze` background + `--ink` text
- **AI cluster** (AI, Intel) → `--brass` at 12% opacity + `--brass` text
- **Workplace cluster** (Modern Workplace, Hybrid Work, Commercial
  PCs) → `--cordovan` at 10% opacity + `--cordovan` text
- **Sustainability / DTA / Microsoft** → `--platinum` background +
  `--graphite` text

## Type

Three families with three distinct functions. The current Roboto
skin reads as a CMS template; the new system reads as a publication.

- **Geist** — *display*. Geometric grotesk for H1, H2, hero moments,
  section openers, card titles. Weights 400, 500, 600, 700.
  Replaces Roboto Condensed at decorative-heading sizes.
- **Source Serif 4** — *editorial*. Open humanist serif for
  long-form article body, decks, pullquotes, byline blocks, and
  author bios. Carries the "trade press article" texture that a
  sans-only system can't.
- **Inter** — *UI*. Workhorse humanist sans for navigation, card
  metadata, captions, forms, buttons, footer.
- **Geist Mono** — *data*. For topic chips, dates, read-time
  ("5 min read"), counters, technical strings (`#poweredge`,
  `#003049`), and any string that benefits from tabular alignment.
  Pairs with Geist for visual coherence.

**Modular scale** — 1.25 (perfect fourth) on a 16 px base. Steps:
12, 14, 16, 18, 20, 24, 30, 36, 48, 60. Article H1 lands at **48 px**
desktop / 36 px mobile. Decorative section openers at **30 px**.
Card titles at **20 px**. Body copy at **18 px** for editorial body
(comfortable measure 68 ch); 16 px for cards / chrome.

**Casing rule.** Mixed-case for everything by default. UPPERCASE
**only** for: short eyebrow labels (≤ 3 words, e.g. "STORAGE",
"FEATURED"), topic chips (always mono uppercase at 11 px), primary
CTA labels (e.g. "SUBSCRIBE", "READ MORE"), and the utility strip
("PRODUCED BY THE CHANNEL COMPANY · SPONSORED BY DELL TECHNOLOGIES").
Never for article titles, section openers, decks, body, or card
titles.

## Shape

Three-tier radius system. Sharper than current Bootstrap 3 generic;
not pill-extreme.

- `--radius-none` 0 px — large editorial bands, full-bleed surfaces,
  and the persistent dark navy footer.
- `--radius-sm` 2 px — topic chips, badges. Just enough to feel
  considered.
- `--radius-md` 4 px — buttons, form inputs, small surfaces.
- `--radius-lg` 8 px — cards, larger contained surfaces.
- `--radius-pill` 999 px — status pills only (e.g. "NEW", "UPDATED");
  used sparingly.

## Shadow

Restrained, two levels. Cards get a barely-perceptible elevation;
nothing else casts a shadow.

- `--shadow-sm` `0 1px 2px rgba(10, 13, 18, 0.04), 0 1px 4px rgba(10, 13, 18, 0.04)`
  — default card resting state.
- `--shadow-md` `0 4px 12px rgba(10, 13, 18, 0.08), 0 2px 6px rgba(10, 13, 18, 0.06)`
  — card hover state, sticky chrome on scroll.

No coloured shadows, no neon glows, no glassmorphism, no gradient
fills.

## Spacing

4 px base unit. Section padding deterministically picked from the
**balanced** density tier: 64 / 48 / 32 px (desktop / tablet /
mobile). The captured site has 17 sections and multi-audience IA;
the balanced floor (40–64 px) holds. Card gap: 24 / 16 / 12 px.
Content max-width: 1280 px. Editorial body measure: 68 ch.

## Motifs

The repeated visual gestures the chrome relies on, drawn from the
**enterprise refined** direction:

- **Mono-tracking eyebrow.** Mono face, 11 px, 0.12 em tracking,
  uppercase, `--graphite-mute`. Prefixes every section opener and
  every card meta row. Replaces the current full-bleed teal label
  strip — the eyebrow does the work the strip used to do, at
  one-tenth the visual cost.
- **Editorial serif deck.** Two- or three-line summary in
  `--editorial` italic at 18 px under every article H1 and inside
  every featured-story card. Gives the trade-press feel and gives
  cards real content to display beyond the title.
- **Brass underline accent.** Inline links inside article body
  show 1 px underline at descender height in `--ink`; on hover the
  underline thickens to 2 px and shifts to `--brass`. The accent
  rewards intentional interaction.
- **Topic-chip family.** Mono uppercase at 11 px, 2 px radius,
  4 px x-padding. Six chip variants (per topic cluster). Every
  card has one; every article body shows them in the meta row.
- **Hairline dividers, not strips.** 1 px `--platinum-edge` for
  card and list dividers. `--ink` at 2 px for editorial section
  separators in long articles.

## What this design does not do

- No coloured full-bleed strips as section dividers (the current
  site's load-bearing motif). Hierarchy comes from type and
  spacing.
- No persistent global hero band on inner pages. The home renders
  a single editorial hero; inner pages render a 56 px chrome bar.
- No Bootstrap 3 generic chrome — flat-tile cards, sharp corners
  on everything. The radius system is deliberate.
- No ALL-CAPS H1s on article titles. Casing is reserved.
- No carousel-as-default. The "REEL HIGHLIGHTS" YouTube embed
  becomes a static 3-up grid with the playlist link beneath; the
  user opts in to motion by clicking, not by scrolling past.
- No content-free cards. Every card carries topic chip · date ·
  read-time · author.
- No hard-coded values in component CSS — every colour, spacing,
  type step, and radius reads from `:root` tokens.
