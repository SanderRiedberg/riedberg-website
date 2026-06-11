import { chromium } from 'playwright-core';
import { homedir } from 'node:os';
const exe = `${homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4173/#below', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const scroller = page.locator('div.fixed.inset-0.z-40');
await scroller.evaluate((el) => {
  const target = [...el.querySelectorAll('section')].find(s => s.textContent.includes('counting house'));
  target?.scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(1200);
const sec = [...await page.locator("div.fixed.inset-0.z-40 section").all()].at(-2); await page.locator("div.fixed.inset-0.z-40 svg[viewBox="0 0 320 240"]").screenshot({ path: "/tmp/vattenlinjen-shots/clerk-close.png" });
await browser.close();
