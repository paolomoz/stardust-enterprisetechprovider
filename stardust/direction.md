<!--
_provenance:
  writtenBy: stardust:direct
  writtenAt: 2026-05-05T00:00:00Z
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/brand-review.html
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/pages/*.json
  stardustVersion: 0.3.0
-->

# Direction — 2026-05-05

## User phrase

> "Redesign Enterprise Tech Provider. Constraint: keep the current
> primary colors (the dark teal #003049, black, white) — these are
> non-negotiable as the primary anchor. Secondary colors are open and
> the redesign should introduce them to fix the current monochrome
> flatness. All other tensions from
> stardust/current/brand-review.html are in scope: ad-hoc type scale,
> no design tokens, persistent ~190px hero band, ALL-CAPS headings,
> card-metadata-empty grids, 13+ section glut on home, broken nav
> links, two parallel taxonomies. Content (copy + images) is
> preserved exactly; only the design system changes."

Plus follow-up clarifications:
- Density: **balanced**
- Secondaries direction: **enterprise refined**
- Type: **open** (multi-family system; current Roboto reads
  templated)

## Restatement in dimensional vocabulary

A **brand-faithful refresh** (Mode A) of an existing trade publication
in the Dell-channel-partner audience. Primary palette pinned by user;
secondary palette opened with an enterprise-refined direction. Type
fully opened with explicit user direction toward a multi-family
system. IA cleanup, system-tokenization, and the full tensions list
in scope. Content preserved exactly.

## Movements

| Axis              | From                                    | To                                                              |
|-------------------|-----------------------------------------|-----------------------------------------------------------------|
| `expressive`      | restrained (CMS template)               | committed (deliberate type, deliberate colour, deliberate motifs) |
| `distinctiveness` | familiar (Bootstrap 3 generic)          | distinctive (editorial trade-press chrome)                      |
| `color-energy`    | monochrome (teal + neutrals only)       | moderate (3 enterprise secondaries: navy-deep, brass, cordovan) |
| `density`         | chaotic-stacked                         | **balanced** (64/48/32 px section padding) — user-confirmed     |
| `tone`            | serious B2B trade-press                 | unchanged (appropriate for audience)                            |
| `audience`        | Dell channel partners                   | unchanged                                                        |
| `register`        | brand                                   | unchanged                                                        |
| `IA-priority`     | chaotic — 13 section labels, dual taxonomy | simplified canonical — 4 home blocks, single taxonomy        |

## Mode resolution

**Mode A (brand-faithful) active.** Captured brand signal is
`signal-strong` (palette has 9 distinct colours after clustering;
type families are named). User explicitly pinned primary palette and
content. Type is explicitly opened — recorded as a Mode-A inversion.

**Mode B (anchor-implied) composes.** The "enterprise refined"
direction implies a tight reference set: *Bloomberg Businessweek*
(editorial-trade craft, 2025-now decade, stark-white ground), *Stripe
Press* (multi-family type, distinctive but not loud), *IBM annual
report* (brand register, moderate colour energy).

**Mode C (ground-family override).** Seed would have rolled
`stark-white`; brand pin agrees. No conflict.

## Divergence inputs (resolved)

| Dimension       | Value                                  | Picked by                                        |
|-----------------|----------------------------------------|--------------------------------------------------|
| Decade          | 2025-now                               | anchor-reference: Bloomberg Businessweek         |
| Craft           | editorial-trade                        | anchor-reference: Bloomberg Businessweek         |
| Register        | brand                                  | inherited from PRODUCT.md                        |
| Ground-family   | stark-white (#ffffff)                  | user-constraint (pinned) — Mode C override       |
| Font deck       | editorial-trade-multi (Geist + Source Serif 4 + Inter + Geist Mono) | user-direction (multi-family)                    |
| Palette primary | #003049 ink + #000000 obsidian + #ffffff vellum | user-constraint (pinned)                |
| Palette secondary | #0b1f3a navy-deep + #b88830 brass + #5b1116 cordovan | direction-roll (enterprise refined)    |

## Brand-faithful inversions

Mode A normally pins type AND palette, and forbids pure black/white.
This run records three inversions, each with reason:

| ID                     | Rule overridden        | Reason                                                                   |
|------------------------|------------------------|--------------------------------------------------------------------------|
| `pure-black-allowed`   | no-pure-black          | User pinned `#000000` — used in footer container                         |
| `pure-white-allowed`   | no-pure-white          | User pinned `#ffffff` — used as primary page background                  |
| `type-fully-open`      | Mode A pins type       | User explicitly opened the type system; current Roboto reads as template |

Mitigations: body text uses `#0a0d12` (warmer than pure black) on
`#ffffff` to soften pure-black-on-white harshness.

## Anti-toolbox audit

Run on the resolved direction. Potential toolbox hits and rulings:

| Move                                            | Verdict   | Reason                                                                 |
|-------------------------------------------------|-----------|------------------------------------------------------------------------|
| Generic-2026-SaaS silhouette                    | not present | Editorial-trade composition planned — left-anchored hero, mixed-case headings, deck under H1; not centered hero + dual CTA + 3-col features |
| Editorial-register vocabulary on non-editorial brand | not applicable | Brand IS editorial trade-press; vocabulary is appropriate            |
| Hero text on photographic background without scrim | not present | Prototype shape brief mandates contrast scrim where photo + text overlap |
| Pure black / pure white                         | overridden | See brand-faithful-inversions above                                    |
| Type ratio < 1.25                               | not present | 1.25 modular scale chosen                                              |
| Side-stripe motif                               | not present | No side stripes planned                                                |
| Glassmorphism                                   | not present | Restrained shadow vocabulary, no glass                                  |
| Gradient text                                   | not present | Solid colour fills only                                                 |

No anti-toolbox hits remain unresolved.

## Improvements list

Written to `stardust/prototypes/home-improvements.md`. Five items:

1. **[dated-pattern]** Persistent ~190 px global hero band on every
   page → kill on inner pages; home gets a single editorial hero;
   inner pages get a 56 px page-chrome-bar.
2. **[ia-clutter]** 13 section-label strips on home → consolidate to
   4 editorial blocks (Featured · By Topic · Latest · Newsletter).
3. **[cliché]** ALL-CAPS article H1s → mixed-case in display face
   (~36.6 px); UPPERCASE reserved for ≤3-word eyebrows + CTAs.
4. **[contrast / accessibility]** Cards have no metadata, thumbnails
   4× oversized, 25% empty alt → metadata row (chip · date ·
   read-time · author), srcset, alt-as-content-error.
5. **[missed-opportunity]** Co-brand chrome dominates header → site
   mark + name owns top-left; co-brand markers move to a quiet
   12 px utility strip.

## Plan presented to user

> Mode A (brand-faithful) active. Pinned: primary palette + content.
> Open: type, secondaries, IA, motifs.
> Movements: expressive committed · distinctiveness distinctive ·
> colour-energy moderate · density balanced · IA simplified canonical.
> Two questions: density tier (a/b/c) and secondaries direction
> (a/b/c). Plus assumption: type is open.

User answered: **density balanced**, **secondaries enterprise
refined**, **type open** ("Roboto looks very template, let's explore
other fonts even more than one for the different functions").

## Resolution after user answers

- Density tier: **balanced** → `sectionPadding.desktop = 64px`,
  `tablet = 48px`, `mobile = 32px`. Hard floor (multi-audience IA
  with 17 sections) holds.
- Secondaries: **enterprise refined** → `--navy-deep` `#0b1f3a`,
  `--brass` `#b88830`, `--cordovan` `#5b1116`. Topic-chip palette
  cycles by category cluster (datacenter / AI / workplace /
  neutral).
- Type system: **multi-family**:
  - **Geist** (display, free/open) — H1, H2, hero, section openers,
    card titles. Replaces Roboto Condensed.
  - **Source Serif 4** (editorial, free/open) — article body, decks,
    pullquotes, byline, author bio. Adds the trade-press reading
    texture missing today.
  - **Inter** (UI, free/open) — nav, card meta, captions, forms,
    footer.
  - **Geist Mono** (data, free/open) — topic chips, dates,
    read-time, counters, technical strings.
- Modular scale: **1.25 (perfect fourth)** on 16 px base. Steps 12,
  14, 16, 18, 20, 24, 30, 36, 48, 60.
- Casing: **mixed-case** default. UPPERCASE only for ≤3-word
  eyebrows, topic chips, primary CTAs, utility strip.

## Artifacts written

| Path                                          | Purpose                                                |
|-----------------------------------------------|--------------------------------------------------------|
| `PRODUCT.md`                                  | Target strategy (impeccable format)                    |
| `DESIGN.md`                                   | Target visual system (Stitch frontmatter + sections)   |
| `DESIGN.json`                                 | Sidecar with extensions (divergence, componentStyle, voice, iaPriorities) |
| `stardust/prototypes/home-improvements.md`    | Variant A brief (5 specific weaknesses + fixes)        |
| `stardust/direction.md`                       | This file — full reasoning trace                       |
| `stardust/state.json`                         | Updated: 5 pages `extracted` → `directed`              |

## State changes

- 5 pages: `extracted` → `directed`
- 0 stale prototypes (none exist yet)
- 0 stale migrated pages (none exist yet)

## Next

`$stardust prototype` — render the home page against this direction
first. The improvements list is the brief for variant A.
