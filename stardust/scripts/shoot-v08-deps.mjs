import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('http://localhost:8001/stardust/prototypes/home-proposed-v08.html', { waitUntil: 'networkidle', timeout: 25000 });
await page.waitForTimeout(2500);
// Scroll to departments
await page.evaluate(() => document.querySelector('[data-section="departments"]').scrollIntoView({ block: 'start' }));
await page.waitForTimeout(800);
await page.screenshot({ path: 'stardust/prototypes/v08-deps-rest.png', fullPage: false });
// Hover one item to capture the affordance
const item = await page.$('.ds-dept-item');
if (item) {
  await item.hover();
  await page.waitForTimeout(450);
  await page.screenshot({ path: 'stardust/prototypes/v08-deps-hover.png', fullPage: false });
}
await browser.close();
console.log('OK');
