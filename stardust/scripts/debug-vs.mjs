import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto('https://www.enterprisetechprovider.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2500);
await page.evaluate(async () => {
  const step = window.innerHeight;
  for (let i = 1; i <= 6; i++) { window.scrollTo({ top: step*i, behavior: 'instant' }); await new Promise(r => setTimeout(r, 200)); }
  window.scrollTo({ top: 0 }); await new Promise(r => setTimeout(r, 300));
});
const out = await page.evaluate(() => {
  const v = document.querySelector('.view-id-video_slideshow.view-display-id-block');
  if (!v) return 'NOT FOUND';
  // Replicate extractor
  const slides = Array.from(v.querySelectorAll('.carousel-inner > .item, .carousel .item, .video-slideshow-slide-small'));
  return {
    sliceCount: slides.length,
    slides: slides.slice(0, 3).map(s => ({
      tag: s.tagName, classes: Array.from(s.classList).join(' '),
      aHref: s.querySelector('a[href]')?.getAttribute('href') || null,
      imgSrc: s.querySelector('img')?.src || null,
    })),
  };
});
console.log(JSON.stringify(out, null, 2));
await browser.close();
