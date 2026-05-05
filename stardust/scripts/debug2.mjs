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
  // ESSENTIAL READING (block)
  const er = document.querySelector('.view-id-essential_reading.view-display-id-block');
  let er_dump = 'NOT FOUND';
  if (er) {
    const cards = er.querySelectorAll('[id^="essential-reading-"]');
    const cols = er.querySelectorAll('.col-lg-3');
    er_dump = { cardsByID: cards.length, colLg3: cols.length, html: er.innerHTML.replace(/\s+/g, ' ').slice(0, 800) };
  }
  // INNOVATION & IMPACT
  const vs = document.querySelector('.view-id-video_slideshow.view-display-id-block');
  let vs_dump = 'NOT FOUND';
  if (vs) {
    const items = vs.querySelectorAll('.carousel-inner > .item, .item');
    vs_dump = { itemCount: items.length, html: vs.innerHTML.replace(/\s+/g, ' ').slice(0, 800) };
  }
  // FOOTER
  const f = document.querySelector('footer, .region-footer');
  let f_dump = 'NOT FOUND';
  if (f) {
    f_dump = {
      cls: Array.from(f.classList).join(' '),
      childTags: Array.from(f.children).map(c => c.tagName + '.' + Array.from(c.classList).slice(0,3).join('.')),
      heads: Array.from(f.querySelectorAll('h2,h3,h4,h5')).map(h => ({ tag: h.tagName, text: h.innerText.trim().slice(0, 50), classes: Array.from(h.classList).join(' ') })),
      panels: Array.from(f.querySelectorAll('.panel-pane, .pane')).map(p => ({ classes: Array.from(p.classList).slice(0,4).join(' '), title: p.querySelector('.pane-title, h2, h3, h4')?.innerText.trim().slice(0,40) || '' })).slice(0, 12),
      sample: f.innerHTML.replace(/\s+/g, ' ').slice(0, 1400),
    };
  }
  return { er_dump, vs_dump, f_dump };
});
console.log('=== ESSENTIAL READING (block) ===');
console.log(JSON.stringify(dump.er_dump, null, 2));
console.log('\n=== INNOVATION & IMPACT (video_slideshow) ===');
console.log(JSON.stringify(dump.vs_dump, null, 2));
console.log('\n=== FOOTER ===');
console.log(JSON.stringify(dump.f_dump, null, 2));
await browser.close();
