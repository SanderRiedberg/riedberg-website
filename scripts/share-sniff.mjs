import { chromium } from 'playwright-core';
import { executablePath } from './browser.mjs';
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const seen = [];
page.on('request', (req) => {
  const url = req.url();
  if (url.includes('/api/') && !url.includes('/api/share/')) {
    const h = req.headers();
    seen.push({ url: url.slice(0, 130), auth: h.authorization || h['x-umami-share-token'] ? Object.fromEntries(Object.entries(h).filter(([k]) => k.includes('auth') || k.includes('umami') || k.includes('token'))) : '(none)' });
  }
});
await page.goto('https://analytics.riedberg.se/share/5PpyPIFQqiad7T0p', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
console.log(JSON.stringify(seen.slice(0, 6), null, 2));
await browser.close();
