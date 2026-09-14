import { chromium } from 'playwright-core';
import { executablePath } from './browser.mjs';
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4173/?t=day', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const read = () => page.evaluate(() => [...document.querySelectorAll('span[aria-label^="Altitude"]')].map(s => s.textContent));
const who = await page.evaluate(() => document.getElementById('who').offsetTop);
for (const y of [0, who - 700, who - 350, who - 100, who + 300]) {
  await page.evaluate((v) => window.scrollTo(0, v), Math.max(0, y));
  await page.waitForTimeout(250);
  console.log(`y=${y}:`, (await read()).join(' | '));
}
await browser.close();
