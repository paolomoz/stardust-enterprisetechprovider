import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
async function shoot(name) {
  const page = await ctx.newPage();
  await page.goto(`http://localhost:8001/stardust/prototypes/${name}.html`, { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(2000);
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let i = 1; i <= 12; i++) { window.scrollTo({ top: step*i, behavior: 'instant' }); await new Promise(r => setTimeout(r, 200)); }
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise(r => setTimeout(r, 400));
  });
  await page.screenshot({ path: `stardust/prototypes/${name}-shot.png`, fullPage: true });
  await page.close();
  console.log('OK', name);
}
await shoot('font-explorations');
await shoot('accent-explorations');
await shoot('button-explorations');
await browser.close();
