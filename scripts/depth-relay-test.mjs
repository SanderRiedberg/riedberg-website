import { chromium } from 'playwright-core';
import { executablePath } from './browser.mjs';
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4173/#below', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const scroller = page.locator('[data-depths-scroller]');
const read = () => page.evaluate(() => [...document.querySelectorAll('span[aria-label^="Depth"]')].map(s => s.textContent).join(' | '));
for (const y of [0, 800, 1800, 3000, 5000]) {
  await scroller.evaluate((el, v) => el.scrollTo(0, v), y);
  await page.waitForTimeout(300);
  console.log(`y=${y}:`, await read());
}
await browser.close();
