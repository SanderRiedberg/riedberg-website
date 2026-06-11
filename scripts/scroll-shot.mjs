import { chromium } from 'playwright-core';
import { homedir } from 'node:os';
const exe = `${homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4173/?t=day', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
for (const id of ['who', 'values', 'projects']) {
  await page.evaluate((i) => document.getElementById(i)?.scrollIntoView({ behavior: 'instant', block: 'center' }), id);
  await page.waitForTimeout(1600); // allow reveal + altimeter tick
  await page.screenshot({ path: `/tmp/vattenlinjen-shots/scroll-${id}.png` });
}
// reveal sanity: are the reveal nodes revealed after scrolling?
const states = await page.evaluate(() =>
  [...document.querySelectorAll('.reveal')].map((n) => n.getAttribute('data-revealed')));
console.log('reveal states:', states.join(','));
await browser.close();
