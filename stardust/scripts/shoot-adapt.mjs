import { chromium } from 'playwright';
const browser = await chromium.launch();
const VPS = [
  ['mobile-375', 375, 800],
  ['mobile-414', 414, 800],
  ['tablet-800', 800, 1024],
  ['desktop-1280', 1280, 900],
  ['desktop-1440', 1440, 900],
  ['wide-1920', 1920, 1080],
];
for (const [name, w, h] of VPS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('file:///Users/paolo/excat/tmp/migrate-enterprisetechprovider/stardust/prototypes/home-proposed-v06.html', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `stardust/prototypes/adapt-${name}-fold.png`, fullPage: false });
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let i = 1; i <= 12; i++) { window.scrollTo({ top: step*i, behavior: 'instant' }); await new Promise(r => setTimeout(r, 200)); }
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise(r => setTimeout(r, 400));
  });
  await page.screenshot({ path: `stardust/prototypes/adapt-${name}-shot.png`, fullPage: true });
  await page.close();
  console.log(`OK ${name} (${w}x${h})`);
}
await browser.close();
