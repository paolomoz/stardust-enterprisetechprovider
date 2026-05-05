#!/usr/bin/env node
// stardust:extract Phase 2 capture per playwright-recipe.md + current-state-schema.md
import { chromium } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync, createWriteStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';
import { URL } from 'node:url';

const ROOT = '/Users/paolo/excat/tmp/migrate-enterprisetechprovider';
const CURRENT = path.join(ROOT, 'stardust/current');
const PAGES = path.join(CURRENT, 'pages');
const MEDIA = path.join(CURRENT, 'assets/media');
const SHOTS = path.join(CURRENT, 'assets/screenshots');
for (const d of [PAGES, MEDIA, SHOTS]) await mkdir(d, { recursive: true });

const TARGETS = [
  { slug: 'home',             url: 'https://www.enterprisetechprovider.com/' },
  { slug: 'category-storage', url: 'https://www.enterprisetechprovider.com/category/storage' },
  { slug: 'storage-article',  url: 'https://www.enterprisetechprovider.com/storage/how-dell-is-helping-partners-navigate-an-unprecedented-memory-shortage' },
  { slug: 'newsroom-article', url: 'https://www.enterprisetechprovider.com/newsroom/dell-technologies-world-2021-get-ready-to-be-inspired' },
  { slug: 'user-profile',     url: 'https://www.enterprisetechprovider.com/users/KJ' },
];

const WAIT_MODE = 'medium';
const WAIT_UNTIL = 'domcontentloaded';
const GRACE_MS = 2000;
const HARD_CAP = 8000;

const successes = [];
const failures = [];

function shortHash(buf) {
  return createHash('sha256').update(buf).digest('hex').slice(0, 8);
}

async function downloadOnce(url, ctx) {
  try {
    const res = await ctx.request.get(url, { timeout: 15000 });
    if (!res.ok()) return { ok: false, status: res.status() };
    const buf = await res.body();
    return { ok: true, buf, contentType: res.headers()['content-type'] || '' };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  }
}

function safeBasename(u) {
  try {
    const x = new URL(u);
    const base = path.basename(x.pathname).slice(0, 80) || 'asset';
    return base.replace(/[^a-zA-Z0-9._-]/g, '_');
  } catch { return 'asset'; }
}

async function saveMedia(url, buf) {
  const hash = shortHash(buf);
  let base = safeBasename(url);
  const ext = path.extname(base);
  if (!ext) base += '.bin';
  const named = base.replace(ext || '', '') + '-' + hash + (ext || '.bin');
  const fp = path.join(MEDIA, named);
  if (!existsSync(fp)) await writeFile(fp, buf);
  return path.relative(ROOT, fp);
}

const captureScript = () => {
  // Runs in page context; returns capture object.
  function rectOf(el) {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
  }
  function domPath(el) {
    const parts = [];
    let cur = el;
    while (cur && cur.nodeType === 1 && parts.length < 8 && cur !== document.documentElement) {
      let sel = cur.tagName.toLowerCase();
      if (cur.id) { sel += '#' + cur.id; parts.unshift(sel); break; }
      const cls = (cur.className && typeof cur.className === 'string') ? cur.className.trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.') : '';
      if (cls) sel += '.' + cls;
      const parent = cur.parentElement;
      if (parent) {
        const sib = Array.from(parent.children).filter(c => c.tagName === cur.tagName);
        if (sib.length > 1) sel += `:nth-child(${Array.from(parent.children).indexOf(cur) + 1})`;
      }
      parts.unshift(sel);
      cur = cur.parentElement;
    }
    return parts.join(' > ');
  }
  function visible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) return false;
    return true;
  }
  function purposeFor(section) {
    const cls = (section.className || '').toLowerCase();
    const id = (section.id || '').toLowerCase();
    const t = (section.innerText || '').toLowerCase().slice(0, 200);
    if (cls.includes('hero') || id.includes('hero')) return 'hero';
    if (section.querySelector('form')) return 'form';
    if (cls.includes('cta') || id.includes('cta')) return 'cta-band';
    if (cls.includes('feature') || cls.includes('list')) return 'feature-list';
    if (cls.includes('testimonial') || cls.includes('logo') || cls.includes('proof')) return 'social-proof';
    if (cls.includes('footer-nav') || cls.includes('utility')) return 'footer-nav';
    if (section.querySelectorAll('p').length >= 3) return 'rich-text';
    return 'unknown';
  }

  const headings = [];
  document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
    if (!visible(h)) return;
    const cs = getComputedStyle(h);
    headings.push({
      level: parseInt(h.tagName.slice(1), 10),
      text: (h.innerText || '').trim().slice(0, 240),
      id: h.id || null,
      domPath: domPath(h),
      style: {
        fontFamily: cs.fontFamily,
        fontWeight: parseInt(cs.fontWeight) || cs.fontWeight,
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
      },
    });
  });

  // Landmarks
  const landmarkSelectors = ['header','nav','main','aside','footer',
    '[role="banner"]','[role="navigation"]','[role="main"]','[role="complementary"]','[role="contentinfo"]','[role="region"]'];
  const landmarks = [];
  const seen = new Set();
  landmarkSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (seen.has(el)) return;
      seen.add(el);
      const tag = el.tagName.toLowerCase();
      const role = el.getAttribute('role');
      const children = [];
      Array.from(el.children).forEach(c => {
        if (!visible(c)) return;
        const ctag = c.tagName.toLowerCase();
        const innerText = (c.innerText || '').trim();
        children.push({
          tag: ctag,
          role: c.getAttribute('role'),
          id: c.id || null,
          classes: typeof c.className === 'string' ? c.className.trim().split(/\s+/).filter(Boolean) : [],
          purpose: ctag === 'section' || ctag === 'div' ? purposeFor(c) : 'unknown',
          headlineRef: null,
          innerTextSummary: innerText.slice(0, 240),
          wordCount: innerText.split(/\s+/).filter(Boolean).length,
        });
      });
      landmarks.push({
        tag,
        role,
        id: el.id || null,
        classes: typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean) : [],
        innerText: (el.innerText || '').trim().slice(0, 1200),
        children,
      });
    });
  });

  // CTAs
  const ctas = [];
  const ctaCandidates = document.querySelectorAll('button, [role="button"], a');
  ctaCandidates.forEach(el => {
    if (!visible(el)) return;
    const cs = getComputedStyle(el);
    const bg = cs.backgroundColor;
    const br = parseFloat(cs.borderRadius) || 0;
    const padTop = parseFloat(cs.paddingTop) || 0;
    const padLeft = parseFloat(cs.paddingLeft) || 0;
    const isButtonLike = (el.tagName === 'BUTTON') || (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && br > 2 && (padTop >= 4 || padLeft >= 4));
    if (!isButtonLike) return;
    const r = el.getBoundingClientRect();
    ctas.push({
      label: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 120),
      href: el.getAttribute('href'),
      tag: el.tagName.toLowerCase(),
      domPath: domPath(el),
      style: {
        backgroundColor: bg,
        color: cs.color,
        fontFamily: cs.fontFamily,
        fontWeight: parseInt(cs.fontWeight) || cs.fontWeight,
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        boxShadow: cs.boxShadow,
      },
      appearsAbove: r.top < 900 ? 'fold' : 'below-fold',
    });
  });

  // Links
  const internal = [], external = [];
  const linkSeen = new Set();
  const host = location.host;
  document.querySelectorAll('a[href]').forEach(a => {
    let href = a.getAttribute('href') || '';
    if (!href || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    let url;
    try { url = new URL(href, location.href); } catch { return; }
    const cleanHref = url.origin + url.pathname + (url.search || '');
    const text = (a.innerText || '').trim().slice(0, 120);
    const key = cleanHref + '|' + text;
    if (linkSeen.has(key)) return;
    linkSeen.add(key);
    const entry = { href: url.host === host ? url.pathname + url.search : cleanHref, text, domPath: domPath(a) };
    (url.host === host ? internal : external).push(entry);
  });

  // Media
  const images = [];
  document.querySelectorAll('img').forEach(img => {
    if (!visible(img)) return;
    images.push({
      src: img.currentSrc || img.src,
      srcset: img.getAttribute('srcset') || '',
      alt: img.getAttribute('alt') || '',
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      domPath: domPath(img),
      rect: rectOf(img),
    });
  });
  const inlineSvgs = [];
  document.querySelectorAll('svg').forEach(svg => {
    inlineSvgs.push({
      viewBox: svg.getAttribute('viewBox') || null,
      domPath: domPath(svg),
      width: svg.getBoundingClientRect().width,
      hasText: !!svg.querySelector('text'),
      ariaLabel: svg.getAttribute('aria-label') || null,
    });
  });
  const cssBackgrounds = [];
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    const bi = cs.backgroundImage;
    if (!bi || bi === 'none') return;
    const r = el.getBoundingClientRect();
    if (r.width < 100 || r.height < 80) return;
    if (!visible(el)) return;
    const urls = [...bi.matchAll(/url\((['"]?)([^'")]+)\1\)/g)].map(m => m[2]);
    urls.forEach(u => {
      try {
        const abs = new URL(u, location.href).href;
        cssBackgrounds.push({
          url: abs,
          domPath: domPath(el),
          boundingClientRect: { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) },
          backgroundSize: cs.backgroundSize,
          backgroundPosition: cs.backgroundPosition,
          backgroundRepeat: cs.backgroundRepeat,
        });
      } catch {}
    });
  });
  const videos = Array.from(document.querySelectorAll('video')).map(v => ({ src: v.currentSrc || v.src || (v.querySelector('source')?.src) || '', poster: v.poster || null }));
  const iframes = Array.from(document.querySelectorAll('iframe')).map(f => {
    const r = f.getBoundingClientRect();
    return { src: f.src, title: f.title, rect: { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) } };
  });

  // Forms
  const forms = Array.from(document.querySelectorAll('form')).map(f => {
    const fields = Array.from(f.querySelectorAll('input,select,textarea')).map(i => {
      const lbl = (i.labels && i.labels[0] && i.labels[0].innerText) || i.getAttribute('aria-label') || i.getAttribute('placeholder') || '';
      return { type: (i.tagName.toLowerCase() === 'input' ? (i.type || 'text') : i.tagName.toLowerCase()), name: i.name || i.id || '', label: lbl, required: !!i.required };
    });
    const action = f.getAttribute('action') || '';
    let thirdParty = null;
    if (action.includes('mailchimp')) thirdParty = 'mailchimp';
    else if (action.includes('hsforms')) thirdParty = 'hubspot';
    return { action, method: (f.getAttribute('method') || 'get').toLowerCase(), fields, thirdParty };
  });

  // Widgets
  const widgets = {
    modals: Array.from(document.querySelectorAll('dialog,[role="dialog"]')).map(d => ({ trigger: null, domPath: domPath(d) })),
    accordions: Array.from(document.querySelectorAll('details, [role="region"][aria-labelledby]')).map(a => ({ domPath: domPath(a), itemCount: a.querySelectorAll(':scope > summary, :scope > [aria-expanded]').length })),
    tabs: Array.from(document.querySelectorAll('[role="tablist"], .tabs')).map(t => ({ domPath: domPath(t), tabCount: t.querySelectorAll('[role="tab"]').length })),
  };

  // Components
  function count(sel) { return document.querySelectorAll(sel).length; }
  function examples(sel) { return Array.from(document.querySelectorAll(sel)).slice(0, 2).map(domPath); }
  const components = {
    cards:           { count: count('.card, [class*="card"]:not([class*="card-grid"])'), examples: examples('.card, [class*="card"]:not([class*="card-grid"])').slice(0,2) },
    grids:           { count: count('.grid, [class*="grid"], .row'), examples: examples('.grid, .row').slice(0,2) },
    accordions:      { count: count('details, [role="region"][aria-labelledby]'), examples: examples('details') },
    tabs:            { count: count('[role="tablist"], .tabs'), examples: examples('[role="tablist"], .tabs') },
    tables:          { count: count('table:not([role="presentation"])'), examples: examples('table') },
    modals:          { count: count('dialog, [role="dialog"]'), examples: examples('dialog, [role="dialog"]') },
    carousels:       { count: count('[class*="carousel"], [class*="swiper"], [class*="slick"], [class*="lightSlider"], [class*="lightslider"]'), examples: examples('[class*="carousel"], [class*="lightSlider"], [class*="lightslider"]') },
    videos:          { count: count('video'), examples: examples('video') },
    iframes:         { count: count('iframe'), examples: examples('iframe') },
    dataVizEmbeds:   { count: count('iframe[src*="datawrapper"], iframe[src*="flourish"], iframe[src*="tableau"], [class*="chart"]'), examples: examples('iframe[src*="datawrapper"], [class*="chart"]') },
    teamTiles:       { count: 0, examples: [] },
    pricingTiles:    { count: 0, examples: [] },
    testimonialCards:{ count: count('[class*="testimonial"], blockquote'), examples: examples('blockquote') },
    logoStrip:       { count: 0, examples: [] },
    timeline:        { count: count('[class*="timeline"]'), examples: examples('[class*="timeline"]') },
    breadcrumbs:     { count: count('nav[aria-label*="breadcrumb" i], [class*="breadcrumb"]'), examples: examples('[class*="breadcrumb"]') },
    statRow:         { count: 0, examples: [] },
    ctaBand:         { count: 0, examples: [] },
    formFields:      { count: count('form input, form select, form textarea'), examples: examples('form input, form textarea') },
    other:           [],
  };

  // Per-section style — direct children of <main>; if no <main>, use first body-level container
  const mainEl = document.querySelector('main') || document.querySelector('#main') || document.body;
  const perSectionStyle = [];
  Array.from(mainEl.children).forEach((c, idx) => {
    if (!visible(c)) return;
    const cs = getComputedStyle(c);
    const fonts = new Set();
    c.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,span,li,button').forEach(t => {
      if (!visible(t)) return;
      const f = getComputedStyle(t).fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '');
      if (f) fonts.add(f);
    });
    const shadows = new Set();
    c.querySelectorAll('*').forEach(t => {
      const sh = getComputedStyle(t).boxShadow;
      if (sh && sh !== 'none') shadows.add(sh);
    });
    perSectionStyle.push({
      sectionRef: domPath(c),
      purpose: purposeFor(c),
      background: { color: cs.backgroundColor, hasImage: cs.backgroundImage !== 'none', hasGradient: /gradient/i.test(cs.backgroundImage) },
      text: { dominantColor: cs.color },
      spacing: { paddingBlock: cs.paddingTop + ' / ' + cs.paddingBottom, paddingInline: cs.paddingLeft + ' / ' + cs.paddingRight, gap: cs.gap || '0px' },
      borderRadius: cs.borderRadius,
      fontFamilies: Array.from(fonts).slice(0, 6),
      shadowsUsed: Array.from(shadows).slice(0, 6),
    });
  });

  // CSS custom properties at :root
  const cssCustomProperties = [];
  const rootStyle = getComputedStyle(document.documentElement);
  for (let i = 0; i < rootStyle.length; i++) {
    const name = rootStyle[i];
    if (name.startsWith('--')) cssCustomProperties.push({ name, value: rootStyle.getPropertyValue(name).trim() });
  }

  // Embed dominance
  let embedDominance = { dominated: false, iframeSrc: null, viewportCoveragePct: null, mainHeightCoveragePct: null };
  if (iframes.length) {
    const mainH = mainEl.getBoundingClientRect().height || document.body.scrollHeight;
    let best = null;
    iframes.forEach(f => {
      const area = f.rect.width * f.rect.height;
      if (!best || area > best.area) best = { ...f, area };
    });
    if (best) {
      const vp = (best.rect.width * best.rect.height) / (1440 * 900) * 100;
      const mh = (best.rect.height / mainH) * 100;
      embedDominance = { dominated: vp > 50 || mh > 80, iframeSrc: best.src, viewportCoveragePct: Math.round(vp), mainHeightCoveragePct: Math.round(mh) };
    }
  }

  // OG / theme color / language
  const ogGet = (p) => document.querySelector(`meta[property="${p}"]`)?.content || null;
  const themeColor = {
    light: document.querySelector('meta[name="theme-color"][media*="light"]')?.content || document.querySelector('meta[name="theme-color"]')?.content || null,
    dark: document.querySelector('meta[name="theme-color"][media*="dark"]')?.content || null,
  };

  // Heading-driven nav fingerprint (for system-component detection later)
  const navHeader = document.querySelector('header') || document.querySelector('[role="banner"]');
  const navLinks = navHeader ? Array.from(navHeader.querySelectorAll('a')).map(a => (a.innerText || '').trim()).filter(Boolean).slice(0, 30) : [];
  const footerEl = document.querySelector('footer') || document.querySelector('[role="contentinfo"]');
  const footerLinks = footerEl ? Array.from(footerEl.querySelectorAll('a')).map(a => (a.innerText || '').trim()).filter(Boolean).slice(0, 60) : [];

  const bodyText = (document.body.innerText || '').trim();
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  return {
    title: document.title,
    metaDescription: document.querySelector('meta[name="description"]')?.content || null,
    og: { title: ogGet('og:title'), description: ogGet('og:description'), image: ogGet('og:image'), type: ogGet('og:type'), siteName: ogGet('og:site_name') },
    themeColor,
    language: document.documentElement.lang || null,
    headings, landmarks, ctas, internal, external,
    images, inlineSvgs, cssBackgrounds, videos, iframes,
    forms, widgets, components, perSectionStyle, cssCustomProperties, embedDominance,
    navLinks, footerLinks,
    stats: {
      wordCount,
      ctaCount: ctas.length,
      internalLinkCount: internal.length,
      externalLinkCount: external.length,
      imageCount: images.length,
    },
  };
};

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: 'light',
  locale: 'en-US',
  reducedMotion: 'reduce',
  ignoreHTTPSErrors: true,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
});

for (const t of TARGETS) {
  const started = Date.now();
  const page = await context.newPage();
  try {
    let response;
    try {
      response = await page.goto(t.url, { waitUntil: WAIT_UNTIL, timeout: HARD_CAP });
    } catch (e) {
      // fallback retry to domcontentloaded
      response = await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: HARD_CAP });
    }
    const status = response ? response.status() : 0;
    const headers = response ? response.headers() : {};
    const contentType = (headers['content-type'] || '').split(';')[0].trim();
    if (status >= 400) {
      failures.push({ slug: t.slug, url: t.url, errorClass: 'HTTPError', message: `HTTP ${status}`, ts: new Date().toISOString() });
      await page.close(); continue;
    }
    if (contentType && !contentType.startsWith('text/html') && !contentType.startsWith('application/xhtml+xml')) {
      failures.push({ slug: t.slug, url: t.url, errorClass: 'ContentTypeError', message: `unexpected content-type: ${contentType}`, ts: new Date().toISOString() });
      await page.close(); continue;
    }

    await page.waitForTimeout(GRACE_MS);

    // scroll pass: 4 viewport heights, 300ms pauses
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let i = 1; i <= 4; i++) {
        window.scrollTo({ top: step * i, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 300));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 300));
    });

    const finalUrl = page.url();
    const cap = await page.evaluate(captureScript);

    // Empty-page detection
    if ((!cap.stats.wordCount || cap.stats.wordCount < 5) && cap.headings.length === 0 && cap.images.length === 0 && cap.forms.length === 0 && cap.iframes.length === 0) {
      failures.push({ slug: t.slug, url: t.url, errorClass: 'EmptyPageError', message: 'empty page — possibly soft-404', ts: new Date().toISOString() });
      await page.close(); continue;
    }

    // Screenshot
    const shotPath = path.join(SHOTS, `${t.slug}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });

    // Download images (up to 30 per page) — content-hashed names
    const imgDownloads = cap.images.slice(0, 30);
    for (const img of imgDownloads) {
      if (!img.src) continue;
      const dl = await downloadOnce(img.src, context);
      if (dl.ok) img.localPath = await saveMedia(img.src, dl.buf);
      else { img.localPath = null; img.downloadError = dl.error || ('HTTP ' + dl.status); }
    }
    // Download CSS background images (cap 20)
    const bgDownloads = cap.cssBackgrounds.slice(0, 20);
    for (const bg of bgDownloads) {
      const dl = await downloadOnce(bg.url, context);
      if (dl.ok) bg.localPath = await saveMedia(bg.url, dl.buf);
      else { bg.localPath = null; bg.downloadError = dl.error || ('HTTP ' + dl.status); }
    }

    const provenance = {
      writtenBy: 'stardust:extract',
      writtenAt: new Date().toISOString(),
      readArtifacts: [t.url],
      synthesizedInputs: [],
      stardustVersion: '0.3.0',
      waitMode: WAIT_MODE,
      waitMs: Date.now() - started,
      httpStatus: status,
      contentType,
    };

    const out = {
      _provenance: provenance,
      slug: t.slug,
      url: t.url,
      finalUrl,
      title: cap.title,
      metaDescription: cap.metaDescription,
      og: cap.og,
      themeColor: cap.themeColor,
      language: cap.language,
      headings: cap.headings,
      landmarks: cap.landmarks,
      ctas: cap.ctas,
      links: { internal: cap.internal, external: cap.external },
      media: { images: cap.images, inlineSvgs: cap.inlineSvgs, cssBackgrounds: cap.cssBackgrounds, videos: cap.videos, iframes: cap.iframes },
      forms: cap.forms,
      widgets: cap.widgets,
      components: cap.components,
      perSectionStyle: cap.perSectionStyle,
      embedDominance: cap.embedDominance,
      cssCustomProperties: cap.cssCustomProperties,
      navLinks: cap.navLinks,
      footerLinks: cap.footerLinks,
      screenshot: path.relative(ROOT, shotPath),
      stats: cap.stats,
    };
    await writeFile(path.join(PAGES, `${t.slug}.json`), JSON.stringify(out, null, 2));
    successes.push({ slug: t.slug, url: t.url, finalUrl, status, waitMs: Date.now() - started });
    console.log(`[ok] ${t.slug} (${status}) ${Date.now() - started}ms`);
  } catch (e) {
    failures.push({ slug: t.slug, url: t.url, errorClass: 'TimeoutError', message: String(e.message || e), ts: new Date().toISOString() });
    console.log(`[fail] ${t.slug}: ${e.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();

// Update crawl log
const log = JSON.parse(await (await import('node:fs/promises')).readFile(path.join(CURRENT, '_crawl-log.json'), 'utf8'));
log.crawl.successes = successes;
log.crawl.failures = failures;
await writeFile(path.join(CURRENT, '_crawl-log.json'), JSON.stringify(log, null, 2));

console.log('\nDone. successes=' + successes.length + ' failures=' + failures.length);
