import { existsSync } from 'node:fs';
import { homedir } from 'node:os';

const candidates = [
  process.env.CHROME_PATH,
  `${homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell`,
  '/usr/bin/chromium',
  '/snap/bin/chromium',
];

export const executablePath = candidates.find(
  (candidate) => candidate && existsSync(candidate),
);

if (!executablePath) {
  throw new Error('Chromium not found. Set CHROME_PATH to its executable.');
}
