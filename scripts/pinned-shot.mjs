import { chromium } from 'playwright-core';
import { homedir } from 'node:os';
const exe = `${homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4173/?t=golden', { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
// find waterline section top + height
const geo = await page.evaluate(() => {
  const s = document.querySelector('section[aria-label="The waterline"]');
  const r = s.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: s.offsetHeight, docH: document.documentElement.scrollHeight, vh: window.innerHeight };
});
console.log(JSON.stringify(geo));
const track = geo.height - geo.vh;
for (const [name, frac] of [['p0',0],['p33',0.33],['p66',0.66],['p100',1.0]]) {
  await page.evaluate((y) => window.scrollTo(0, y), geo.top + track * frac);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `/tmp/vattenlinjen-shots/pin-${name}.png` });
}
await browser.close();
