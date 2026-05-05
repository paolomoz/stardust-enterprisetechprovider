import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
async function shoot(name) {
  const page = await ctx.newPage();
  await page.goto('file:///Users/paolo/excat/tmp/migrate-enterprisetechprovider/stardust/prototypes/' + name + '.html', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'stardust/prototypes/' + name + '-fold.png', fullPage: false });
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let i = 1; i <= 10; i++) { window.scrollTo({ top: step*i, behavior: 'instant' }); await new Promise(r => setTimeout(r, 200)); }
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise(r => setTimeout(r, 400));
  });
  await page.screenshot({ path: 'stardust/prototypes/' + name + '-shot.png', fullPage: true });
  await page.close();
  console.log('OK', name);
}
await shoot('home-proposed-v06');
await browser.close();
