import { chromium } from 'playwright-core';
import { executablePath } from './browser.mjs';
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const t = process.argv[2] || 'day';
await page.goto(`http://localhost:4173/?t=${t}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: `/tmp/vattenlinjen-shots/hero-${t}-v3.png` });
await browser.close();
