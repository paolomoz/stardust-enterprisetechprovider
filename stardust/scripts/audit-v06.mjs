import { chromium } from 'playwright';
const browser = await chromium.launch();

const results = {};

for (const [name, vp] of [['mobile', {width: 375, height: 667}], ['tablet', {width: 800, height: 1024}], ['desktop', {width: 1440, height: 900}]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('file:///Users/paolo/excat/tmp/migrate-enterprisetechprovider/stardust/prototypes/home-proposed-v06.html', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const out = { viewport: { w: window.innerWidth, h: window.innerHeight } };

    // 1. Horizontal overflow check
    out.bodyWidth = document.body.scrollWidth;
    out.bodyOverflow = document.body.scrollWidth > window.innerWidth ? document.body.scrollWidth - window.innerWidth : 0;

    // 2. Find ALL elements that overflow viewport horizontally
    const allEls = document.querySelectorAll('*');
    const overflows = [];
    allEls.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > window.innerWidth + 2 && r.width > 0) {
        const tag = el.tagName.toLowerCase();
        const cls = (el.className && typeof el.className === 'string' ? el.className.slice(0, 60) : '');
        overflows.push({ tag, cls, right: Math.round(r.right), width: Math.round(r.width) });
      }
    });
    out.overflowingElements = overflows.slice(0, 10);

    // 3. Touch targets (interactive elements ≥44×44 per WCAG AA)
    const interactives = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
    const tinyTouchTargets = [];
    interactives.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return; // skip hidden
      if (r.width < 44 || r.height < 44) {
        const tag = el.tagName.toLowerCase();
        const text = (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 30);
        tinyTouchTargets.push({ tag, text, w: Math.round(r.width), h: Math.round(r.height) });
      }
    });
    out.tinyTouchTargets = { count: tinyTouchTargets.length, samples: tinyTouchTargets.slice(0, 8) };

    return out;
  });

  // Take a screenshot for the audit record
  await page.screenshot({ path: `stardust/prototypes/audit-v06-${name}.png`, fullPage: true });
  results[name] = data;
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
