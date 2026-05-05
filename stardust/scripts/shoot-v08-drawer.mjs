import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 414, height: 800 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:8001/stardust/prototypes/home-proposed-v08.html', { waitUntil: 'networkidle', timeout: 25000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'stardust/prototypes/v08-drawer-closed.png', fullPage: false });
// Tap hamburger
await page.click('#ds-menu-toggle');
await page.waitForTimeout(500);
await page.screenshot({ path: 'stardust/prototypes/v08-drawer-open.png', fullPage: false });
await browser.close();
console.log('OK');
