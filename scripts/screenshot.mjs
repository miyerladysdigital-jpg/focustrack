import puppeteer from 'puppeteer-core';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

const targets = [
  {
    url: 'http://localhost:3000',
    out: 'docs/revisiones/landing-375.png',
    width: 375,
    height: 812,
    fullPage: true,
  },
  {
    url: 'file:///' + path.resolve('direcciones-abc.html').replace(/\\/g, '/'),
    out: 'docs/revisiones/direcciones-abc.png',
    width: 1280,
    height: 900,
    fullPage: true,
  },
];

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
});

for (const t of targets) {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width: t.width, height: t.height });
  await page.goto(t.url, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 500));

  // Scroll through the whole page in steps so whileInView reveals fire
  // (framer-motion needs each section to actually enter the viewport).
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = t.height;
  for (let y = 0; y < scrollHeight; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await new Promise((r) => setTimeout(r, 250));
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 300));

  await page.screenshot({ path: t.out, fullPage: t.fullPage });
  console.log('Saved', t.out);
  await page.close();
}

await browser.close();
