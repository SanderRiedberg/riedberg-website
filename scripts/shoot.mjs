// Verification harness: full-page and viewport screenshots plus layout
// metrics, using the locally cached Playwright chromium build.
// Usage: node scripts/shoot.mjs <url> <outPrefix> [width] [height]
import { chromium } from 'playwright-core';
import { homedir } from 'node:os';

const [, , url, prefix, w = '1440', h = '900'] = process.argv;
if (!url || !prefix) {
  console.error('usage: node scripts/shoot.mjs <url> <outPrefix> [w] [h]');
  process.exit(1);
}

const exe = `${homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell`;

const browser = await chromium.launch({ executablePath: exe });
try {
  const page = await browser.newPage({
    viewport: { width: Number(w), height: Number(h) },
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const metrics = await page.evaluate(() => {
    const ids = ['who', 'values', 'projects', 'waterline'];
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
