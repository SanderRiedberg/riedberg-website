import { chromium } from 'playwright-core';
import { homedir } from 'node:os';
const exe = `${homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4173/#below', { waitUntil: 'networkidle' });
await page.waitForTimeout(9000); // let a couple of thoughts arrive
const scroller = page.locator('div.fixed.inset-0.z-40');
await page.screenshot({ path: '/tmp/vattenlinjen-shots/depths-top.png' });
await scroller.evaluate((el) => el.scrollTo(0, 1400));
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/vattenlinjen-shots/depths-mid.png' });
await scroller.evaluate((el) => el.scrollTo(0, el.scrollHeight));
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/vattenlinjen-shots/depths-end.png' });
await browser.close();
