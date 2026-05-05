<!--
_provenance:
  writtenBy: stardust:direct
  writtenAt: 2026-05-05T00:00:00Z
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/brand-review.html
    - stardust/current/pages/home.json
    - stardust/current/pages/category-storage.json
    - stardust/current/pages/storage-article.json
    - stardust/current/pages/newsroom-article.json
    - stardust/current/pages/user-profile.json
  stardustVersion: 0.3.0
  mode: A (brand-faithful refresh)
-->

# Improvements — site-wide (anchored on home)

The brief variant A renders against. Each item cites the captured
observation, the design pattern at fault, and the concrete fix.

1. **[dated-pattern]** Persistent ~190 px hero band — site name +
   tagline + lifestyle stock photo of three people at a workstation —
   repeats above-the-fold on every page including category, article,
   and author profile. The brand is asserted by repetition, not by
   design. The page's own H1 doesn't appear until pixel ~280.
   _Fix:_ Hero band lives **only** on the home page (rendered once,
   as a 480 px editorial composition with the lead story as its
   subject — not a stock-photo placeholder). Inner pages get a
   compact 56 px chrome bar with breadcrumb + section eyebrow + page
   H1 in the brand display face, on the first viewport.

2. **[ia-clutter]** Home page stacks 13 section-label strips —
   RECOMMENDED · ESSENTIAL READING · LATEST · POPULAR · NEWSLETTERS ·
   ARTIFICIAL INTELLIGENCE · VIDEOS · MODERN DATA CENTER · STORAGE ·
   DELL TECH ADVANTAGE · MODERN WORK · INNOVATION & IMPACT · REEL
   HIGHLIGHTS — each rendered as a full-bleed dark teal strip
   (`#003049`). Editorial intent dissolves; the same article appears
   in three sections of the same page (per the repeated-headings
   table in `brand-review.html`).
   _Fix:_ Consolidate to **4 editorial blocks**: (1) Featured — 1
   lead story + 4 secondary, (2) By Topic — 6-tile topic grid linking
   to section indexes, (3) Latest — chronological list with date and
   topic chip, (4) Newsletter sign-up + Reels (single combined
   block). Drop "RECOMMENDED · POPULAR · ESSENTIAL READING" as
   separate sections — they describe the same content under different
   rankings.

3. **[cliché]** Article H1s on the storage / newsroom / category
   templates render UPPERCASE on a `#003049` band ("HOW DELL IS
   HELPING PARTNERS NAVIGATE AN UNPRECEDENTED MEMORY SHORTAGE"). 33%
   of all captured headings are fully uppercase. The shout reads
   urgent at first heading and as fatigue by the third article
   visited.
   _Fix:_ Mixed-case article titles in the display face at scale
   (~36.6 px / 1.15 line-height). Reserve UPPERCASE for short eyebrow
   labels ("STORAGE", "AI", "SPONSORED", topic chips), primary CTA
   labels, and the utility strip — never for article titles or
   section openers.

4. **[contrast / accessibility]** Card thumbnails are 309×309 px
   source rendered at 78–195 px on screen, no `srcset`. Cards carry
   only a title — no date, author, topic chip, or read-time. With 614
   articles and the same article promoted across 3 home sections, the
   user cannot tell what is current, who wrote it, or what it is
   about without clicking. 25% of captured images carry empty `alt`.
   _Fix:_ Cards gain a 4-element metadata row — `[topic chip] · date
   · read-time · author`. Thumbnails serve at the rendered size with
   responsive `srcset` (256w, 384w, 512w). Empty `alt` on any image
   used inside a card title link is treated as a content error in
   the migration step.

5. **[missed-opportunity]** Co-branded chrome ("PRODUCED BY THE
   CHANNEL COMPANY" + "SPONSORED BY DELL TECHNOLOGIES") consumes the
   most prominent header real estate on every page; the site's own
   identity competes for attention rather than being asserted. The
   header reads as an interstitial, not a destination.
   _Fix:_ Site mark + "Enterprise Tech Provider" wordmark owns the
   top-left as the dominant element of the header (display face,
   `--ink`, ~24 px). Co-brand markers move to an **unobtrusive
   utility strip** above the header (12 px tall, `--graphite-mute` on
   `--vellum`, set in `--mono` at 11 px / 1.5 px tracking) —
   "Produced by The Channel Company · Sponsored by Dell Technologies"
   is present, not loud. Footer keeps both co-brand lockups at
   intended scale.

## Cross-page improvements (apply to every template)

- **IA cleanup.** Single canonical taxonomy: `/storage/`,
  `/server/`, `/commercial-pcs/`, `/newsroom/`, `/artificial-intelligence/`,
  `/edge/`, `/security/`, `/sustainability/`, etc. — every section
  prefix used by an article URL gets a working section index.
  `/category/<slug>` either 301-redirects to its `/<slug>/` peer or
  is dropped from internal navigation.
- **Broken nav.** `/videos`, `/newsletter-archive`, and `/sitemap`
  either get built (videos: render the existing YouTube playlist
  embed in a dedicated route; newsletter-archive: render the
  newsletter back-catalog from CMS) or get unlinked from header /
  footer / home. No nav promise the site doesn't keep.
- **Author / utility templates.** `/users/<name>` becomes an actual
  layout: portrait at 96 px, role + bio in editorial face, then a
  reverse-chronological grid of the author's articles with the same
  card metadata as everywhere else. No persistent global hero.
- **Token layer.** Site ships zero design tokens today. The target
  introduces a complete `:root` token sheet (color, type, spacing,
  radius, shadow) — see `DESIGN.md`. Every component reads from
  tokens; no hard-coded colors in CSS.
