import { chromium } from 'playwright-core';
import { homedir } from 'node:os';
const exe = `${homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
const browser = await chromium.launch({ executablePath: exe });
// reduced motion desktop
const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const p1 = await rm.newPage();
await p1.goto('http://localhost:4173/?t=golden', { waitUntil: 'networkidle' });
await p1.waitForTimeout(700);
const wl = await p1.evaluate(() => { const s=document.querySelector('section[aria-label="The waterline"]'); return {h:s.offsetHeight, vh:window.innerHeight}; });
console.log('reduced-motion waterline height:', wl.h, 'vh:', wl.vh, '(should be ~static, < 1.2*vh)');
await p1.evaluate(() => document.getElementById('who').scrollIntoView({block:'start'}));
await p1.waitForTimeout(500);
await p1.screenshot({ path: '/tmp/vattenlinjen-shots/rm-who.png' });
await p1.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await p1.waitForTimeout(500);
await p1.screenshot({ path: '/tmp/vattenlinjen-shots/rm-waterline.png' });
await rm.close();
// mobile
const mob = await browser.newContext({ viewport: { width: 390, height: 844 } });
const p2 = await mob.newPage();
await p2.goto('http://localhost:4173/?t=day', { waitUntil: 'networkidle' });
await p2.waitForTimeout(800);
await p2.evaluate(() => document.getElementById('who').scrollIntoView({block:'center'}));
await p2.waitForTimeout(1400);
await p2.screenshot({ path: '/tmp/vattenlinjen-shots/m-who-v3.png' });
await mob.close();
await browser.close();
