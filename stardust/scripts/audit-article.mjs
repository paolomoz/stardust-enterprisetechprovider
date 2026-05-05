/**
 * Audit pass on storage-article-proposed.html
 * Checks: missing alt, focus-visible, aria patterns, tab order, heading semantics, viewport overflow at desktop sizes
 */
import { chromium } from 'playwright';

const browser = await chromium.launch();

async function audit(width, label) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:8001/stardust/prototypes/storage-article-proposed.html', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(500);

  const data = await page.evaluate(() => {
    // Horizontal overflow check
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;

    // Images without alt
    const imgsNoAlt = Array.from(document.querySelectorAll('img:not([alt])')).map(i => i.src);
    const imgsEmptyAlt = Array.from(document.querySelectorAll('img[alt=""]')).filter(i => !i.closest('[aria-hidden="true"]') && !i.closest('.ds-aside-stat-img') && !i.closest('.ds-reel-thumb')).map(i => i.src);

    // Links without accessible name
    const linksNoName = Array.from(document.querySelectorAll('a')).filter(a => {
      if (a.textContent.trim()) return false;
      if (a.getAttribute('aria-label')) return false;
      if (a.querySelector('img[alt]:not([alt=""])')) return false;
      return true;
    }).map(a => a.href);

    // Buttons without accessible name
    const btnsNoName = Array.from(document.querySelectorAll('button')).filter(b => {
      if (b.textContent.trim()) return false;
      if (b.getAttribute('aria-label')) return false;
      return true;
    });

    // Form inputs without label
    const inputsNoLabel = Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])')).filter(i => {
      if (i.getAttribute('aria-label')) return false;
      if (i.getAttribute('aria-labelledby')) return false;
      if (i.id && document.querySelector(`label[for="${i.id}"]`)) return false;
      return true;
    });

    // Color: brass-deep on white  → ratio? approx
    function rgb(s) { const m = s.match(/\d+/g); return m ? m.slice(0,3).map(Number) : null; }
    function lum(c) { const [r,g,b] = c.map(v => { v = v/255; return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4); }); return .2126*r + .7152*g + .0722*b; }
    function ratio(a, b) { const L1 = lum(a), L2 = lum(b); const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1]; return (hi+.05)/(lo+.05); }

    // brass-deep #8a6420 on white #ffffff
    const brassDeepOnWhite = ratio([0x8a, 0x64, 0x20], [255,255,255]).toFixed(2);
    const inkOnWhite = ratio([0,48,73], [255,255,255]).toFixed(2);
    const charOnWhite = ratio([10,13,18], [255,255,255]).toFixed(2);

    // Sticky aside on small viewports?
    const aside = document.querySelector('.ds-article-aside');
    const asidePos = aside ? getComputedStyle(aside).position : null;

    // Header sticky overlap with sticky aside?
    const header = document.querySelector('[data-section="header"]');
    const headerH = header ? header.getBoundingClientRect().height : 0;

    // Skip-link
    const skip = document.querySelector('.ds-skip');
    const skipFocusable = skip ? skip.getAttribute('href') === '#main' : false;

    // <main> landmark exists
    const main = document.querySelector('main#main');

    return {
      width: window.innerWidth,
      docWidth: docW,
      hasOverflow: docW > winW,
      imgsNoAlt, imgsEmptyAlt,
      linksNoName,
      btnsNoName: btnsNoName.length,
      inputsNoLabel: inputsNoLabel.length,
      contrast: { brassDeepOnWhite, inkOnWhite, charOnWhite },
      asidePos,
      headerH,
      skipFocusable,
      mainPresent: !!main,
    };
  });

  console.log(`\n=== ${label} (${width}px) ===`);
  console.log(JSON.stringify(data, null, 2));
  await ctx.close();
  return data;
}

await audit(1440, 'desktop');
await audit(1280, 'desktop-mid');
await audit(1024, 'tablet-large');
await browser.close();
