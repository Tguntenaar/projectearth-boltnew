import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(12000);

await page.screenshot({ path: '/opt/cursor/artifacts/after-fix-desktop.png' });

// Scrub to a US leg: click first Austin flight in list (2023)
const austinBtn = page.getByRole('button', { name: /Austin/i }).first();
if (await austinBtn.count()) {
  await austinBtn.click();
  await page.waitForTimeout(4000);
}
await page.screenshot({ path: '/opt/cursor/artifacts/after-fix-americas.png' });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(2000);
await page.screenshot({ path: '/opt/cursor/artifacts/qa-fix-mobile.png' });

await browser.close();
console.log('screenshots saved');
