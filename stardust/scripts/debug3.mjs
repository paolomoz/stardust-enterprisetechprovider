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
const dump = await page.evaluate(() => {
  // ESSENTIAL READING section children
  const er = document.querySelector('.view-id-essential_reading.view-display-id-block .essential-reading-section');
  const er_children = er ? Array.from(er.children).map(c => ({ tag: c.tagName, classes: Array.from(c.classList).slice(0, 4).join(' '), id: c.id || null, html: c.innerHTML.replace(/\s+/g, ' ').slice(0, 200) })) : 'NOT FOUND';
  // Carousel items
  const vs = document.querySelector('.view-id-video_slideshow.view-display-id-block');
  const carousel_items = vs ? Array.from(vs.querySelectorAll('.carousel-inner > .item')).map((it, i) => ({
    idx: i,
    classes: Array.from(it.classList).join(' '),
    aHref: it.querySelector('a[href]')?.href,
    aTitle: it.querySelector('a[href]')?.title || it.querySelector('a[href]')?.innerText?.trim().slice(0,80),
    imgSrc: it.querySelector('img')?.src,
    imgAlt: it.querySelector('img')?.alt,
    snippet: it.outerHTML.replace(/\s+/g, ' ').slice(0, 250),
  })) : 'NOT FOUND';
  return { er_children, carousel_items };
});
console.log('=== ESSENTIAL READING children ===');
console.log(JSON.stringify(dump.er_children, null, 2).slice(0, 3500));
console.log('\n=== INNOVATION & IMPACT carousel items ===');
console.log(JSON.stringify(dump.carousel_items, null, 2).slice(0, 4000));
await browser.close();
