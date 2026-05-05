#!/usr/bin/env node
// Drupal-view-aware home-IA extractor for enterprisetechprovider.com.
// Each section is a Drupal `.view` block with a unique view-id+display.
// Item DOM templates differ per view-id, so the extractor switches on view-id.
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const URL = 'https://www.enterprisetechprovider.com/';
const OUT = '/Users/paolo/excat/tmp/migrate-enterprisetechprovider/stardust/current/pages/home-ia.json';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  locale: 'en-US',
  reducedMotion: 'reduce',
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
});
const page = await ctx.newPage();
console.log('goto', URL);
await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2500);
await page.evaluate(async () => {
  const step = window.innerHeight;
  for (let i = 1; i <= 8; i++) { window.scrollTo({ top: step * i, behavior: 'instant' }); await new Promise(r => setTimeout(r, 250)); }
  window.scrollTo({ top: 0, behavior: 'instant' }); await new Promise(r => setTimeout(r, 400));
});

const ia = await page.evaluate(() => {
  function clean(s) { return (s || '').replace(/\s+/g, ' ').trim(); }
  function pathOf(href) { try { const u = new URL(href, location.href); return u.host === location.host ? u.pathname + (u.search || '') : u.href; } catch { return href; } }
  function imgInfo(img) {
    if (!img) return null;
    const o = {
      src: img.currentSrc || img.src,
      alt: clean(img.getAttribute('alt') || ''),
      naturalWidth: img.naturalWidth || null,
      naturalHeight: img.naturalHeight || null,
    };
    if (img.getAttribute('srcset')) o.srcset = img.getAttribute('srcset');
    return o;
  }
  function visible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) !== 0;
  }
  function regionOf(el) {
    let cur = el;
    while (cur && cur !== document.body) {
      if (cur.classList) {
        for (const c of cur.classList) if (c.startsWith('region-')) return c.replace(/^region-/, '');
      }
      cur = cur.parentElement;
    }
    return null;
  }
  function unique(arr, key) {
    const seen = new Set();
    return arr.filter(x => { const k = key(x); if (!k || seen.has(k)) return false; seen.add(k); return true; });
  }

  // ---------- Identity ----------
  const identity = {
    title: document.title,
    canonical: location.href,
    metaDescription: document.querySelector('meta[name="description"]')?.content || null,
    og: {
      title: document.querySelector('meta[property="og:title"]')?.content || null,
      description: document.querySelector('meta[property="og:description"]')?.content || null,
      type: document.querySelector('meta[property="og:type"]')?.content || null,
      siteName: document.querySelector('meta[property="og:site_name"]')?.content || null,
    },
    publisher: 'The Channel Company',
    sponsor: 'Dell Technologies',
  };

  // ---------- Site chrome ----------
  const chrome = {};

  // co-brand marks
  chrome.cobrand = unique(
    Array.from(document.querySelectorAll('img'))
      .filter(i => /produced by|sponsored by|the channel company|dell technologies/i.test(i.alt || ''))
      .map(imgInfo),
    o => o.src
  );

  // persistent hero band (in .region-top)
  const regionTop = document.querySelector('.region-top');
  chrome.persistentHero = (() => {
    const out = { siteName: null, tagline: null, photoSrc: null, photoAlt: null, region: 'top' };
    if (!regionTop) return out;
    const h1 = regionTop.querySelector('h1');
    if (h1) out.siteName = clean(h1.innerText);
    // tagline: header-cover h2 / p / .tagline / .sub-title
    const tagEl = regionTop.querySelector('h2, .tagline, .sub-title, .header-cover h2');
    if (tagEl) out.tagline = clean(tagEl.innerText);
    // hero photo (img inside the persistent band — etp-header-people-standing)
    const heroImg = regionTop.querySelector('img[src*="etp-header"], img[src*="people-standing"], img[alt*="people"]');
    if (heroImg) {
      out.photoSrc = heroImg.currentSrc || heroImg.src;
      out.photoAlt = clean(heroImg.getAttribute('alt') || '');
    }
    if (!out.photoSrc) {
      // CSS background fallback
      const candidates = [regionTop, ...regionTop.querySelectorAll('*')];
      for (const el of candidates) {
        const bi = getComputedStyle(el).backgroundImage;
        if (bi && bi !== 'none') {
          const m = bi.match(/url\((['"]?)([^'")]+)\1\)/);
          if (m && /etp-header|people-standing|highway/i.test(m[2])) {
            out.photoSrc = new URL(m[2], location.href).href;
            break;
          }
        }
      }
    }
    return out;
  })();

  // primary nav
  const navRegion = document.querySelector('.region-navigation');
  chrome.primaryNav = navRegion ? unique(
    Array.from(navRegion.querySelectorAll('a'))
      .map(a => ({ label: clean(a.innerText), href: pathOf(a.getAttribute('href') || '') }))
      .filter(x => x.label && !/^(home|menu|search|×|sign in|×)$/i.test(x.label)),
    x => x.href + '|' + x.label
  ) : [];

  // search affordance — Drupal renders a <form> with action="/search/node"
  const searchForm = document.querySelector('form[action*="search"]');
  chrome.search = {
    visible: !!searchForm,
    actionUrl: searchForm ? searchForm.getAttribute('action') : '/search/node',
    placeholder: searchForm ? (searchForm.querySelector('input[type="search"], input[type="text"]')?.placeholder || null) : null,
  };

  // ---------- Per-view extractors ----------
  function extractCategoriesBlock4(v) {
    // RECOMMENDED — featured story: image + h3 link + tag chips
    const titleA = v.querySelector('h3.index-title a, h3 a');
    const img = v.querySelector('img');
    const tagAs = Array.from(v.querySelectorAll('a[href*="/category/"], a[href*="/technologies/"]'));
    return [{
      kind: 'featured-story',
      title: titleA ? clean(titleA.innerText) : null,
      href: titleA ? pathOf(titleA.getAttribute('href') || '') : null,
      image: imgInfo(img),
      tags: tagAs.map(a => ({ label: clean(a.innerText), href: pathOf(a.getAttribute('href') || '') })),
    }];
  }

  function extractEssentialReadingBlock(v) {
    // ESSENTIAL READING — 4 cards in a horizontal row inside .essential-reading-section.
    // Each card is a PAIR: a .col-lg-3 (the image) followed by a .col-lg-9 (the title + tags).
    const section = v.querySelector('.essential-reading-section');
    if (!section) return [];
    const cols = Array.from(section.children);
    const cards = [];
    for (let i = 0; i < cols.length; i += 2) {
      const imgCol = cols[i];
      const txtCol = cols[i + 1];
      if (!imgCol || !txtCol) continue;
      const img = imgCol.querySelector('img');
      const titleA = txtCol.querySelector('h3 a, h4 a, .index-title a, .essential-reading-title a, a[href]');
      const tagAs = Array.from(txtCol.querySelectorAll('a[href*="/category/"], a[href*="/technologies/"]'));
      if (!titleA) continue;
      cards.push({
        kind: 'card',
        title: clean(titleA.innerText),
        href: pathOf(titleA.getAttribute('href') || ''),
        image: imgInfo(img),
        tags: tagAs.map(a => ({ label: clean(a.innerText), href: pathOf(a.getAttribute('href') || '') })),
      });
    }
    return cards;
  }

  function extractEssentialReadingBlock3(v) {
    // wrapper view that holds block_1 + block_2 — skip
    return null; // signal "skip this section"
  }

  function extractEssentialReadingBlock1Or2(v) {
    // 2 items per block, each = h4 with image + title
    const rows = Array.from(v.querySelectorAll('.views-row')).filter(visible);
    return rows.map(row => {
      const img = row.querySelector('img');
      const titleA = row.querySelector('.essential-reading-title a, h4 a, h3 a');
      const tagAs = Array.from(row.querySelectorAll('a[href*="/category/"], a[href*="/technologies/"]'));
      return {
        kind: 'card',
        title: titleA ? clean(titleA.innerText) : null,
        href: titleA ? pathOf(titleA.getAttribute('href') || '') : null,
        image: imgInfo(img),
        tags: tagAs.map(a => ({ label: clean(a.innerText), href: pathOf(a.getAttribute('href') || '') })),
      };
    }).filter(r => r.title && r.href);
  }

  function extractCategoriesBlock2(v) {
    // LATEST — 3 items each in .row.col-4 with image + title link + tags
    const rows = Array.from(v.querySelectorAll('.row.col-4, .row.col-md-4, .col-md-4')).filter(visible);
    return rows.map(row => {
      const img = row.querySelector('img');
      // primary link is the first non-tag link
      const allAs = Array.from(row.querySelectorAll('a[href]'));
      const primary = allAs.find(a => !/\/(category|technologies|users)\//.test(a.getAttribute('href') || ''));
      const tagAs = allAs.filter(a => /\/(category|technologies)\//.test(a.getAttribute('href') || ''));
      return {
        kind: 'card',
        title: primary ? clean(primary.getAttribute('title') || primary.innerText) : null,
        href: primary ? pathOf(primary.getAttribute('href') || '') : null,
        image: imgInfo(img),
        tags: tagAs.map(a => ({ label: clean(a.innerText), href: pathOf(a.getAttribute('href') || '') })),
      };
    }).filter(r => r.title && r.href);
  }

  function extractCategoriesBlock5(v) {
    // POPULAR — numbered list, .row.border-bottom each with .popular-number + .popular-title link
    const rows = Array.from(v.querySelectorAll('.row.border-bottom, .row')).filter(visible);
    return rows.map(row => {
      const numEl = row.querySelector('.popular-number, p:first-child');
      const titleA = row.querySelector('.popular-title a, p.popular-title a, a[href]');
      const num = numEl ? clean(numEl.innerText) : null;
      if (!titleA) return null;
      return {
        kind: 'numbered-list-item',
        rank: num ? parseInt(num, 10) || num : null,
        title: clean(titleA.innerText),
        href: pathOf(titleA.getAttribute('href') || ''),
      };
    }).filter(Boolean);
  }

  function extractVideoSlideshow(v) {
    // INNOVATION & IMPACT — Bootstrap carousel; only the .active slide is visible at a time
    // so do NOT apply the visibility filter. Use only `.carousel-inner > .item` (the
    // canonical slide root) — `.video-slideshow-slide-small` lives inside `.item` and
    // would double-count.
    const slides = Array.from(v.querySelectorAll('.carousel-inner > .item'));
    const seenHrefs = new Set();
    const out = [];
    slides.forEach((slide, i) => {
      const a = slide.querySelector('a[href]');
      const img = slide.querySelector('img');
      const captionEl = slide.querySelector('.caption, .carousel-caption, h3, h4');
      const href = a ? a.getAttribute('href') || '' : '';
      if (!href) return;
      if (seenHrefs.has(href)) return; seenHrefs.add(href);
      // alt is often empty on these promo slides; fall back to hostname of the link.
      let title = captionEl ? clean(captionEl.innerText) : '';
      if (!title) title = clean(img?.getAttribute('alt') || '');
      if (!title && /^https?:\/\//.test(href)) {
        try { title = new URL(href).hostname.replace(/^www\./, ''); } catch {}
      }
      if (!title) title = 'Slide ' + (i + 1);
      out.push({
        kind: 'carousel-slide',
        title,
        href: pathOf(href),
        image: imgInfo(img),
        external: /^https?:\/\//.test(href),
      });
    });
    return out;
  }

  function extractOutcomes(v) {
    // Topic tiles (AI, MODERN DATA CENTER, STORAGE, MODERN WORK, DELL TECH ADVANTAGE, VIDEOS)
    // 3 plain links each, no images. Each = .outcome-blog-title > a
    const titleAs = Array.from(v.querySelectorAll('.outcome-blog-title a')).filter(visible);
    return titleAs.map(a => ({
      kind: 'text-link',
      title: clean(a.getAttribute('title') || a.innerText),
      href: pathOf(a.getAttribute('href') || ''),
    })).filter(i => i.title && i.href);
  }

  // Map: viewId -> extractor (checks display where needed)
  function extractorFor(viewId, viewDisplay) {
    if (viewId === 'categories' && viewDisplay === 'block_4') return extractCategoriesBlock4;
    if (viewId === 'categories' && viewDisplay === 'block_2') return extractCategoriesBlock2;
    if (viewId === 'categories' && viewDisplay === 'block_5') return extractCategoriesBlock5;
    if (viewId === 'essential_reading' && viewDisplay === 'block') return extractEssentialReadingBlock;
    if (viewId === 'essential_reading' && viewDisplay === 'block_3') return extractEssentialReadingBlock3;
    if (viewId === 'essential_reading' && (viewDisplay === 'block_1' || viewDisplay === 'block_2')) return extractEssentialReadingBlock1Or2;
    if (viewId === 'video_slideshow') return extractVideoSlideshow;
    if (viewId === 'outcomes') return extractOutcomes;
    return null;
  }

  // ---------- Walk all views ----------
  const sections = [];
  function viewMeta(v) {
    const idClass = Array.from(v.classList).find(c => c.startsWith('view-id-'));
    const displayClass = Array.from(v.classList).find(c => c.startsWith('view-display-id-'));
    return {
      viewId: idClass ? idClass.replace('view-id-', '') : null,
      viewDisplay: displayClass ? displayClass.replace('view-display-id-', '') : null,
    };
  }
  function pushSection(v, items) {
    const { viewId, viewDisplay } = viewMeta(v);
    const labelEl = v.querySelector(':scope > .view-header h2, :scope > .view-header h3, :scope > .view-header strong, :scope > .view-content > .view-header h2');
    let label = labelEl ? clean(labelEl.innerText) : '';
    if (!label) {
      // Search up to one parent for a heading (e.g., .panel-pane title)
      const t = v.parentElement?.querySelector?.(':scope > .pane-title, :scope > h2.pane-title, :scope > h2');
      if (t && visible(t)) label = clean(t.innerText);
    }
    const footerLinkEl = v.querySelector(':scope > .view-footer a, :scope .more-link a');
    sections.push({
      idx: sections.length,
      viewId, viewDisplay,
      label: label || null,
      labelSlug: (label || ('view-' + sections.length)).toUpperCase().replace(/[^A-Z0-9]+/g, '-').toLowerCase(),
      region: regionOf(v),
      itemCount: (items || []).length,
      items: items || [],
      footerLink: footerLinkEl ? { label: clean(footerLinkEl.innerText) || 'View all', href: pathOf(footerLinkEl.getAttribute('href') || '') } : null,
    });
  }

  Array.from(document.querySelectorAll('.view')).forEach((v) => {
    if (!visible(v)) return;
    const { viewId, viewDisplay } = viewMeta(v);

    // Skip nested views — they are processed via their wrapper's special-case handler
    if (v.parentElement && v.parentElement.closest('.view')) return;

    // Special-case: essential_reading/block_3 is a wrapper around block_1 + block_2
    if (viewId === 'essential_reading' && viewDisplay === 'block_3') {
      Array.from(v.querySelectorAll('.view-id-essential_reading')).forEach(innerV => {
        const { viewDisplay: innerDisplay } = viewMeta(innerV);
        const innerExtractor = extractorFor('essential_reading', innerDisplay);
        if (!innerExtractor) return;
        pushSection(innerV, innerExtractor(innerV));
      });
      return;
    }

    const extractor = extractorFor(viewId, viewDisplay);
    if (!extractor) return; // unknown view type — skip
    const items = extractor(v);
    if (items === null) return; // wrapper signaled skip
    pushSection(v, items);
  });


  // ---------- Right rail ----------
  const rightRailRegion = document.querySelector('.region-right25, .region-right33');
  const rightRail = {
    region: rightRailRegion ? Array.from(rightRailRegion.classList).find(c => c.startsWith('region-')).replace('region-', '') : null,
    blocks: [],
  };
  if (rightRailRegion) {
    Array.from(rightRailRegion.querySelectorAll(':scope > div, :scope > .panel-pane, :scope > .block')).forEach(b => {
      if (!visible(b)) return;
      const newsletterFrame = b.querySelector('iframe[src*="thechannelco.com"]');
      const adImgs = Array.from(b.querySelectorAll('img')).filter(i => i.naturalWidth >= 280 && i.naturalWidth <= 320 && i.naturalHeight >= 230 && i.naturalHeight <= 270);
      const heading = b.querySelector('h2, h3');
      const allLinks = unique(
        Array.from(b.querySelectorAll('a[href]')).slice(0, 12).map(a => ({ label: clean(a.innerText), href: pathOf(a.getAttribute('href') || '') })).filter(l => l.label),
        l => l.href + '|' + l.label
      );
      // Skip blocks that contain a view we've already captured as a top-level section
      if (b.querySelector('.view-id-categories[class*="view-display-id-block_5"]')) {
        return;
      }
      rightRail.blocks.push({
        heading: heading ? clean(heading.innerText) : null,
        kind: newsletterFrame ? 'newsletter-embed' : (adImgs.length ? 'ad-slot' : (allLinks.length ? 'link-list' : 'unknown')),
        embedSrc: newsletterFrame ? newsletterFrame.src : null,
        ads: adImgs.map(imgInfo),
        links: allLinks,
      });
    });
  }

  // ---------- Footer ----------
  const footerEl = document.querySelector('footer, .region-footer');
  const footer = (() => {
    if (!footerEl) return null;
    // ETP-specific: footer columns use <p class="footer-title"> + sibling <a class="footer-link"> elements
    // inside a flat .row.footer container. Walk each .col-lg-3 / .col-md-3 column and pull title + links.
    const cols = [];
    const colEls = Array.from(footerEl.querySelectorAll('.col-lg-3, .col-md-3, .footer-col, .col-md-2, .col-lg-2'));
    colEls.forEach(col => {
      const titleEl = col.querySelector('.footer-title, .pane-title, h3, h4, h5');
      if (!titleEl) return;
      const heading = clean(titleEl.innerText);
      if (!heading || heading.length > 60) return;
      const links = Array.from(col.querySelectorAll('a.footer-link, a[href]'))
        .map(a => ({ label: clean(a.innerText), href: pathOf(a.getAttribute('href') || '') }))
        .filter(l => l.label && l.label !== heading);
      if (links.length) cols.push({ heading, links });
    });
    // Fallback to the older heading-walk approach if column-based extraction yields nothing
    if (cols.length === 0) {
      const headingEls = Array.from(footerEl.querySelectorAll('h3, h4, h5, .pane-title, .footer-col-heading, p.footer-title'));
      headingEls.forEach(h => {
        if (!visible(h)) return;
        const heading = clean(h.innerText);
        if (!heading || heading.length > 60) return;
        let listEl = h.nextElementSibling;
        while (listEl && listEl.tagName !== 'UL' && !listEl.querySelector?.('ul, a')) listEl = listEl.nextElementSibling;
        const links = listEl ? Array.from(listEl.querySelectorAll('a'))
          .map(a => ({ label: clean(a.innerText), href: pathOf(a.getAttribute('href') || '') }))
          .filter(l => l.label) : [];
        if (links.length) cols.push({ heading, links });
      });
    }
    // Social icons
    const social = unique(
      Array.from(footerEl.querySelectorAll('a[href]'))
        .filter(a => /instagram|youtube|twitter|x\.com|linkedin|facebook/i.test(a.href || ''))
        .map(a => ({
          label: clean(a.querySelector('img')?.alt || a.title || a.getAttribute('aria-label') || ''),
          href: a.href,
          icon: a.querySelector('img') ? imgInfo(a.querySelector('img')) : null,
        })),
      x => x.href
    );
    // Legal
    const legal = unique(
      Array.from(footerEl.querySelectorAll('a[href]'))
        .filter(a => /privacy|cookie|do not sell|terms of service/i.test(a.innerText || ''))
        .map(a => ({ label: clean(a.innerText), href: pathOf(a.getAttribute('href') || '') })),
      x => x.href
    );
    // Footer co-brand marks (TheChannelCo + Dell at intended scale)
    const footerCobrand = Array.from(footerEl.querySelectorAll('img'))
      .filter(i => /channel|dell|technologies/i.test(i.alt || i.src))
      .map(imgInfo);
    return { columns: cols, social, legal, cobrand: footerCobrand };
  })();

  return { identity, chrome, sections, rightRail, footer };
});

await browser.close();

// ---------- Post-process & write ----------
function isArticlePath(href) {
  if (!href || !href.startsWith('/')) return false;
  if (/^\/(category|technologies|users)\//.test(href)) return false;
  const parts = href.split('?')[0].split('/').filter(Boolean);
  if (parts.length < 2) return false;
  const slug = parts[parts.length - 1];
  return slug.length >= 8 && /[a-z]/.test(slug);
}

ia.sections.forEach(s => {
  // Keep items that carry at least an href OR an image (some carousel slides have neither title nor caption).
  s.items = (s.items || []).filter(it => it.href || it.image);
  s.itemCount = s.items.length;
});

// Label the unlabeled essential_reading sub-sections so reviewers can read the JSON
// without consulting the view-id metadata.
ia.sections.forEach(s => {
  if (s.viewId === 'essential_reading' && !s.label) {
    if (s.viewDisplay === 'block_1') s.label = 'Essential Reading (sub: lower-left)';
    else if (s.viewDisplay === 'block_2') s.label = 'Essential Reading (sub: lower-right)';
    else s.label = 'Essential Reading (sub)';
    s.labelSlug = s.label.toUpperCase().replace(/[^A-Z0-9]+/g, '-').toLowerCase();
  }
});

// Dedupe right-rail blocks: the right-rail walker re-discovers views (INNOVATION & IMPACT,
// POPULAR) that we already captured as top-level sections. Drop those.
ia.rightRail.blocks = (ia.rightRail.blocks || []).filter(b => {
  if (!b.heading) return true;
  return !ia.sections.some(s => s.label && s.label.toLowerCase() === b.heading.toLowerCase());
});

// Merge essential_reading sub-sections into a single logical "Essential Reading" view too,
// for consumers who want the visual grouping rather than the Drupal sub-block split.
const erParent = ia.sections.find(s => s.viewId === 'essential_reading' && s.viewDisplay === 'block');
if (erParent) {
  const erSubs = ia.sections.filter(s => s.viewId === 'essential_reading' && s.viewDisplay !== 'block');
  erParent.merged = {
    description: 'Visual grouping of all Essential Reading items (block + block_1 + block_2 sub-views) into one section.',
    items: [...erParent.items, ...erSubs.flatMap(s => s.items)],
  };
}

const out = {
  _provenance: {
    writtenBy: 'stardust:custom (extract-ia.mjs v3 — Drupal-view-aware)',
    writtenAt: new Date().toISOString(),
    sourceUrl: URL,
    purpose: 'Section-by-section IA snapshot of the current home page; consumed downstream by V04-applied-to-exact-IA prototype',
    stardustVersion: '0.3.0',
    notes: [
      'Each section corresponds to a Drupal .view block on the home page.',
      'Every view-id has a custom item template; the extractor switches on view-id to pull the right item shape (featured-story, card, numbered-list-item, carousel-slide, text-link).',
      'Tag chips on each item come from /category/* and /technologies/* links inside the row.',
    ],
  },
  ...ia,
};

await writeFile(OUT, JSON.stringify(out, null, 2));
console.log('\nWrote', OUT);
console.log('\nSections (label · region · view · items · kinds):');
ia.sections.forEach(s => {
  const kinds = [...new Set((s.items || []).map(i => i.kind))].join(',');
  console.log('  -', (s.label || '(unlabeled)').padEnd(28), '|', (s.region || '').padEnd(10), '|', (s.viewId || '').padEnd(20), '/', (s.viewDisplay || '').padEnd(8), '|', s.itemCount, kinds);
});
console.log('\nRight rail blocks:', ia.rightRail.blocks.length);
ia.rightRail.blocks.forEach(b => console.log('  -', (b.heading || '(no heading)').padEnd(28), '|', b.kind, '| ads:', b.ads?.length || 0, '| links:', b.links?.length || 0));
console.log('\nFooter columns:', (ia.footer?.columns || []).length);
(ia.footer?.columns || []).forEach(c => console.log('  -', c.heading, '·', c.links.length, 'links'));
console.log('Footer social:', (ia.footer?.social || []).length);
console.log('Footer legal:', (ia.footer?.legal || []).length);
console.log('Primary nav:', (ia.chrome?.primaryNav || []).length);
console.log('Co-brand marks:', (ia.chrome?.cobrand || []).length);
