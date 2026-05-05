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
  const out = [];
  document.querySelectorAll('.view').forEach((v, i) => {
    const labelEl = v.querySelector('.view-header h2, .view-header h3');
    const label = labelEl ? labelEl.innerText.trim() : (v.querySelector('h2')?.innerText.trim() || '');
    const cls = Array.from(v.classList).join(' ');
    // children of .view-content
    const cc = v.querySelector('.view-content');
    let childTags = [];
    if (cc) {
      childTags = Array.from(cc.children).map(c => c.tagName.toLowerCase() + '.' + Array.from(c.classList).slice(0,3).join('.'));
    }
    // count inner elements
    const innerImgs = v.querySelectorAll('img').length;
    const innerLinks = Array.from(v.querySelectorAll('a[href]')).length;
    out.push({
      idx: i,
      label,
      cls: cls.slice(0, 100),
      contentChildren: childTags.slice(0, 3),
      innerImgs, innerLinks,
      sample: cc ? cc.innerHTML.replace(/\s+/g, ' ').slice(0, 350) : '',
    });
  });
  return out;
});
console.log(JSON.stringify(dump, null, 2));
await browser.close();
