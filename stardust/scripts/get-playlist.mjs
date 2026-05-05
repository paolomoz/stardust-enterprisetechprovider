import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
  viewport: { width: 1280, height: 900 },
  locale: 'en-US',
  extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
});
const page = await ctx.newPage();
// Try the full watch page with playlist param — usually shows the first video + playlist sidebar
await page.goto('https://www.youtube.com/watch?list=PLwSFLsD6NhIjdM5ncVJxfcOCYsCuOmGeI', { waitUntil: 'load', timeout: 45000 });
await page.waitForTimeout(4000);
// dismiss consent
try {
  const btns = await page.$$('button');
  for (const b of btns) {
    const txt = (await b.innerText().catch(() => '')).toLowerCase();
    if (/accept all|reject all/.test(txt)) {
      await b.click();
      await page.waitForTimeout(3000);
      break;
    }
  }
} catch {}
await page.waitForTimeout(3000);
const data = await page.evaluate(() => {
  const out = [];
  const seen = new Set();
  // any anchor with watch?v= and the playlist param
  document.querySelectorAll('a[href*="watch?v="]').forEach(a => {
    const m = (a.href || '').match(/[?&]v=([A-Za-z0-9_-]{11})/);
    if (!m || seen.has(m[1])) return;
    seen.add(m[1]);
    let title = '';
    // try to find title text near the link
    const titleEl = a.querySelector('#video-title, [id="video-title"], .ytp-title-link');
    if (titleEl) title = titleEl.textContent.trim();
    if (!title) title = (a.title || a.getAttribute('aria-label') || '').trim().slice(0, 100);
    if (out.length < 12) out.push({ id: m[1], title });
  });
  // also search current video
  const m = location.href.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (m && !seen.has(m[1])) {
    out.unshift({ id: m[1], title: document.title });
  }
  return { url: location.href, items: out };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
