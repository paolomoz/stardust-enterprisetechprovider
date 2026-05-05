import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('http://localhost:8001/stardust/prototypes/storage-article-proposed.html', { waitUntil: 'networkidle', timeout: 25000 });
await page.waitForTimeout(800);

// 1. Body with drop cap (scroll past hero image)
const bodyEl = await page.$('[data-section="article-body"]');
await bodyEl.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await bodyEl.screenshot({ path: 'stardust/prototypes/storage-article-body.png' });

// 2. Pullquote section (mid-article)
const pullquote = await page.$('.ds-pullquote');
await pullquote.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: 'stardust/prototypes/storage-article-pullquote.png', fullPage: false });

// 3. Article footer (tag pile + share + author card)
const articleFoot = await page.$('[data-section="article-footer"]');
await articleFoot.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await articleFoot.screenshot({ path: 'stardust/prototypes/storage-article-footer.png' });

// 4. Related grid
const related = await page.$('[data-section="related"]');
await related.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await related.screenshot({ path: 'stardust/prototypes/storage-article-related.png' });

await browser.close();
console.log('OK');
