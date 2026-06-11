import { chromium } from 'playwright-core';
import { homedir } from 'node:os';
const exe = `${homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4173/#below', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
const scroller = page.locator('[data-depths-scroller]');
await scroller.evaluate((el) => {
  const target = [...el.querySelectorAll('section')].find(s => s.textContent.includes('counting house'));
  target?.scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(3500); // let the odometer roll
await page.screenshot({ path: '/tmp/vattenlinjen-shots/clerk-live.png' });
await browser.close();
