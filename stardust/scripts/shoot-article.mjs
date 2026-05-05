import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const url = 'http://localhost:8001/stardust/prototypes/storage-article-proposed.html';
await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: 'stardust/prototypes/storage-article-fold.png', fullPage: false });
await page.evaluate(async () => {
  const step = window.innerHeight;
  for (let i = 1; i <= 12; i++) { window.scrollTo({ top: step*i, behavior: 'instant' }); await new Promise(r => setTimeout(r, 200)); }
  window.scrollTo({ top: 0, behavior: 'instant' });
  await new Promise(r => setTimeout(r, 400));
});
await page.screenshot({ path: 'stardust/prototypes/storage-article-shot.png', fullPage: true });
await browser.close();
console.log('OK');
