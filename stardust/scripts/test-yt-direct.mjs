import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: false });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('https://www.youtube.com/playlist?list=PLwSFLsD6NhIjdM5ncVJxfcOCYsCuOmGey', { waitUntil: 'load', timeout: 30000 });
await page.waitForTimeout(6000);
try {
  const accept = await page.locator('button:has-text("Accept all"), button:has-text("Reject all")').first();
  if (await accept.isVisible({ timeout: 3000 })) { await accept.click(); await page.waitForTimeout(5000); }
} catch {}
await page.waitForTimeout(3000);
const data = await page.evaluate(() => {
  const ids = [];
  const seen = new Set();
  document.querySelectorAll('a[href*="watch?v="]').forEach(a => {
    const m = (a.href || '').match(/[?&]v=([A-Za-z0-9_-]{11})/);
    if (!m || seen.has(m[1]) || ids.length >= 6) return;
    seen.add(m[1]);
    let title = '';
    const titleEl = a.querySelector('#video-title, h3, span#video-title');
    if (titleEl) title = titleEl.textContent.trim();
    if (!title) title = (a.title || a.getAttribute('aria-label') || '').trim().slice(0, 100);
    ids.push({ id: m[1], title });
  });
  return { exists: !/playlist does not exist|unavailable/i.test(document.body.innerText.slice(0, 500)), title: document.title, items: ids };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
