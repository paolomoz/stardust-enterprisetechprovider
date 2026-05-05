/**
 * Heuristic critique pass on storage-article-proposed.html
 * Checks: AA contrast, hierarchy regressions, anti-pattern reflexes, body line length, sticky aside behavior
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('http://localhost:8001/stardust/prototypes/storage-article-proposed.html', { waitUntil: 'networkidle', timeout: 25000 });
await page.waitForTimeout(800);

const findings = [];

// Pull computed styles + DOM facts in one batch
const data = await page.evaluate(() => {
  function get(el, prop) { return getComputedStyle(el)[prop]; }
  function rect(el) { return el ? el.getBoundingClientRect() : null; }
  function readable(el) { if (!el) return null; const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; }

  const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => ({
    tag: h.tagName, text: h.textContent.trim().slice(0, 60),
    fontSize: get(h, 'fontSize'), fontWeight: get(h, 'fontWeight'),
    visible: h.offsetParent !== null
  }));
  const headingSequence = headings.filter(h => h.visible).map(h => h.tag);

  const main = document.querySelector('.ds-article-main');
  const mainRect = readable(main);
  const mainPara = document.querySelector('.ds-article-main > p:not(.ds-body-notice):not([class])') ||
                   document.querySelector('.ds-article-main > p[data-placeholder="true"]');

  const aside = document.querySelector('.ds-article-aside');
  const asideRect = readable(aside);

  const pullquote = document.querySelector('.ds-pullquote');
  const pqStyle = pullquote ? { fontSize: get(pullquote, 'fontSize'), borderTop: get(pullquote, 'borderTopColor'), borderBottom: get(pullquote, 'borderBottomColor') } : null;

  // Color samples
  const dock = document.querySelector('.ds-aside-stat .ds-stat-headline');
  const dockBg = document.querySelector('.ds-aside-stat');
  const dockColor = dock ? get(dock, 'color') : null;
  const dockBgColor = dockBg ? get(dockBg, 'backgroundColor') : null;

  const linkInBody = document.querySelector('.ds-article-main a');
  const linkColor = linkInBody ? get(linkInBody, 'color') : null;
  const linkBg = linkInBody ? get(document.querySelector('.ds-article-main'), 'backgroundColor') : null;

  // Heading promotions: did we skip any H levels?
  const allHeadings = Array.from(document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6'))
                          .filter(h => h.offsetParent !== null);
  const skipped = [];
  let prev = 0;
  for (const h of allHeadings) {
    const lvl = +h.tagName.substring(1);
    if (prev && lvl > prev + 1) skipped.push({ from: 'h' + prev, to: 'h' + lvl, text: h.textContent.trim().slice(0, 40) });
    prev = lvl;
  }

  // Aside sticky check
  const asideTop = aside ? get(aside, 'position') : null;

  // Body line length (px and approx ch)
  let bodyLine = null;
  if (main) {
    const r = main.getBoundingClientRect();
    const pStyle = mainPara ? get(mainPara, 'fontSize') : null;
    bodyLine = { px: Math.round(r.width), fontSize: pStyle };
  }

  return {
    headings: headingSequence,
    mainRect, asideRect,
    pullquote: pqStyle,
    dockColor, dockBgColor,
    linkColor, linkBg,
    skippedHeadingLevels: skipped,
    asideTop,
    bodyLine
  };
});

console.log(JSON.stringify(data, null, 2));

// Screenshot of fold + body for the report
await page.screenshot({ path: 'stardust/prototypes/critique-article-fold.png', fullPage: false });

await browser.close();
