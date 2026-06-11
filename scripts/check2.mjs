import { chromium } from 'playwright-core';
import { homedir } from 'node:os';
const exe = `${homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const browser = await chromium.launch({ executablePath: exe });
// mobile hero
const mob = await browser.newContext({ viewport: { width: 390, height: 844 } });
const p2 = await mob.newPage();
await p2.goto('http://localhost:4173/?t=day', { waitUntil: 'networkidle' });
await p2.waitForTimeout(1400);
await p2.screenshot({ path: '/tmp/vattenlinjen-shots/m-hero-v4.png' });
await mob.close();
// desktop About (portrait removed)
const d = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p3 = await d.newPage();
await p3.goto('http://localhost:4173/?t=day', { waitUntil: 'networkidle' });
await p3.waitForTimeout(600);
await p3.evaluate(() => document.getElementById('who')?.scrollIntoView({block:'center'}));
await p3.waitForTimeout(1400);
await p3.screenshot({ path: '/tmp/vattenlinjen-shots/about-v4.png' });
await d.close();
await browser.close();
