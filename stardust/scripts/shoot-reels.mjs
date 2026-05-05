import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('file:///Users/paolo/excat/tmp/migrate-enterprisetechprovider/stardust/prototypes/home-proposed-v06.html', { waitUntil: 'networkidle', timeout: 30000 });
// Give YouTube + noembed time to load
await page.waitForTimeout(8000);
// Scroll to the Watch & learn section
await page.evaluate(() => {
  const el = document.querySelector('[data-section="reels"]');
  if (el) el.scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(3000);
await page.screenshot({ path: 'stardust/prototypes/v06-reels-zoomed.png', fullPage: false });
await page.evaluate(() => window.scrollTo(0,0));
await page.waitForTimeout(800);
await page.screenshot({ path: 'stardust/prototypes/v06-reels-fold.png', fullPage: false });
console.log('OK');
await browser.close();
