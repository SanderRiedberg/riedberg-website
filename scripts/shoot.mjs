// Verification harness: full-page and viewport screenshots plus layout
// metrics, using the locally cached Playwright chromium build.
// Usage: node scripts/shoot.mjs <url> <outPrefix> [width] [height]
import { chromium } from 'playwright-core';
import { executablePath } from './browser.mjs';

const [, , url, prefix, w = '1440', h = '900'] = process.argv;
if (!url || !prefix) {
  console.error('usage: node scripts/shoot.mjs <url> <outPrefix> [w] [h]');
  process.exit(1);
}

const browser = await chromium.launch({ executablePath });
try {
  const page = await browser.newPage({
    viewport: { width: Number(w), height: Number(h) },
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const metrics = await page.evaluate(() => {
    const ids = ['who', 'practice', 'projects', 'waterline'];
    const sections = Object.fromEntries(
      ids.map((id) => {
        const el = document.getElementById(id);
        if (!el) return [id, null];
        const r = el.getBoundingClientRect();
        return [id, { top: Math.round(r.top + window.scrollY), height: Math.round(r.height) }];
      }),
    );
    return {
      docHeight: document.documentElement.scrollHeight,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      sections,
    };
  });
  console.log(JSON.stringify(metrics, null, 2));

  await page.screenshot({ path: `${prefix}-full.png`, fullPage: true });
  await page.screenshot({ path: `${prefix}-fold.png` });
} finally {
  await browser.close();
}
