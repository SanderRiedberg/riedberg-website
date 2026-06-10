import { chromium } from 'playwright-core';
import { homedir } from 'node:os';
const exe = `${homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:4173/?t=day', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.screenshot({ path: '/tmp/vattenlinjen-shots/m-hero.png' });
await page.evaluate(() => window.scrollTo(0, document.getElementById('values').offsetTop));
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/vattenlinjen-shots/m-values.png' });
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/vattenlinjen-shots/m-waterline.png' });
// facade crack: wait past FIRST_DELAY (20 s)
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(21000);
await page.screenshot({ path: '/tmp/vattenlinjen-shots/m-crack.png' });
const crack = await page.evaluate(() => document.querySelector('.fixed.bottom-5.left-5')?.textContent);
console.log('crack text:', crack);
// dive on mobile
await page.getByRole('button', { name: /dive below/i }).click({ force: true });
await page.waitForTimeout(1800);
await page.screenshot({ path: '/tmp/vattenlinjen-shots/m-depths.png' });
console.log('hash:', await page.evaluate(() => location.hash));
await browser.close();
