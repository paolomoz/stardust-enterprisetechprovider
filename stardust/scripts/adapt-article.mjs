/**
 * Responsive cross-check at desktop wide / desktop / tablet / mobile portrait / mobile small
 * Captures fold + full screenshots for each breakpoint
 */
import { chromium } from 'playwright';

const browser = await chromium.launch();
const URL = 'http://localhost:8001/stardust/prototypes/storage-article-proposed.html';
const sizes = [
  { w: 1920, h: 1080, label: 'wide-1920' },
  { w: 1440, h: 900,  label: 'desktop-1440' },
  { w: 1280, h: 800,  label: 'desktop-1280' },
  { w: 800,  h: 1200, label: 'tablet-800' },
  { w: 414,  h: 896,  label: 'mobile-414' },
  { w: 375,  h: 812,  label: 'mobile-375' },
];

for (const s of sizes) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `stardust/prototypes/article-adapt-${s.label}-fold.png`, fullPage: false });

  // Quick stat: doc width vs viewport, body font size, presence of horizontal scroll
  const data = await page.evaluate(() => {
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;
    const bodyFs = getComputedStyle(document.querySelector('.ds-article-main')).fontSize;
    const aside = document.querySelector('.ds-article-aside');
    const asidePos = aside ? getComputedStyle(aside).position : null;
    const head = document.querySelector('.ds-article-head');
    const headCols = head ? getComputedStyle(head).gridTemplateColumns : null;
    const h1Fs = getComputedStyle(document.querySelector('.ds-article-h1')).fontSize;
    return { docW, winW, overflow: docW > winW + 1, bodyFs, asidePos, headCols, h1Fs };
  });
  console.log(`${s.label.padEnd(15)}`, JSON.stringify(data));

  // Full page only for select sizes
  if (['mobile-375', 'tablet-800', 'wide-1920'].includes(s.label)) {
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let i = 1; i <= 12; i++) { window.scrollTo({ top: step*i, behavior: 'instant' }); await new Promise(r => setTimeout(r, 150)); }
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 250));
    });
    await page.screenshot({ path: `stardust/prototypes/article-adapt-${s.label}-shot.png`, fullPage: true });
  }

  await ctx.close();
}
await browser.close();
console.log('OK');
