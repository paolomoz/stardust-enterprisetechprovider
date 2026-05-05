import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:8001/stardust/prototypes/home-proposed-v08.html', { waitUntil: 'networkidle', timeout: 25000 });
await page.waitForTimeout(2500);
await page.evaluate(() => document.querySelector('[data-section="departments"]').scrollIntoView({ block: 'start' }));
await page.waitForTimeout(800);
// Hover the second item in the second column for a clear shot
const items = await page.$$('.ds-dept-item');
if (items.length > 4) {
  await items[4].hover();
  await page.waitForTimeout(500);
}
const dept = await page.$('[data-section="departments"]');
const box = await dept.boundingBox();
await page.screenshot({ path: 'stardust/prototypes/v08-deps-zoom.png', clip: { x: 0, y: box.y, width: 1440, height: Math.min(box.height, 700) } });
await browser.close();
console.log('OK');
