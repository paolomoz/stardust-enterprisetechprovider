import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.enterprisetechprovider.com/storage/how-dell-is-helping-partners-navigate-an-unprecedented-memory-shortage', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(5000);
const data = await page.evaluate(() => {
  // Get every <p> on the page with substantive text
  const allP = Array.from(document.querySelectorAll('p')).filter(p => {
    const t = p.innerText.trim();
    return t.length > 100 && !/your e-?mail|consent|cookie|privacy|terms|©|copyright|rights reserved/i.test(t);
  }).map(p => p.innerText.trim());
  return { paragraphCount: allP.length, paragraphs: allP };
});
console.log(JSON.stringify(data, null, 2).slice(0, 12000));
await browser.close();
