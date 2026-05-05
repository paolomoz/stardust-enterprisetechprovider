import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('http://localhost:8001/stardust/prototypes/home-proposed-v06.html', { waitUntil: 'networkidle', timeout: 25000 });
// Capture the hero reveal mid-animation (~400ms after load)
await page.waitForTimeout(400);
await page.screenshot({ path: 'stardust/prototypes/v06-delight-hero-mid.png', fullPage: false });
// Wait for animation complete
await page.waitForTimeout(2000);
await page.screenshot({ path: 'stardust/prototypes/v06-delight-hero-done.png', fullPage: false });
// Scroll to topic band, wait for counter animation
await page.evaluate(() => document.querySelector('[data-section="topic-band"]').scrollIntoView({ block: 'start' }));
await page.waitForTimeout(300);
await page.screenshot({ path: 'stardust/prototypes/v06-delight-counter-mid.png', fullPage: false });
await page.waitForTimeout(2500);
await page.screenshot({ path: 'stardust/prototypes/v06-delight-counter-done.png', fullPage: false });
console.log('OK');
await browser.close();
