import puppeteer from 'puppeteer-core';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

const targets = [
  // Screenshots REALES para el hero y el carrusel de la landing (19 §5 / 55 §1.3) —
  // van PRIMERO: la landing los referencia como <img>, tienen que existir en disco antes.
  { url: 'http://localhost:3001/app', out: 'public/screenshots/hoy.png', width: 375, height: 812, fullPage: false, waitUntil: 'domcontentloaded' },
  { url: 'http://localhost:3001/app/buzon', out: 'public/screenshots/buzon.png', width: 375, height: 812, fullPage: false, waitUntil: 'domcontentloaded' },
  { url: 'http://localhost:3001/app/semana', out: 'public/screenshots/semana.png', width: 375, height: 812, fullPage: false, waitUntil: 'domcontentloaded' },
  { url: 'http://localhost:3001/app/cuenta', out: 'public/screenshots/cuenta.png', width: 375, height: 812, fullPage: false, waitUntil: 'domcontentloaded' },
  {
    url: 'http://localhost:3001',
    out: 'docs/revisiones/landing-375.png',
    width: 375,
    height: 812,
    fullPage: true,
    // Google Fonts over this network is unreliable (404s/timeouts seen), and
    // both 'load' (waits on <link rel=stylesheet>) and 'networkidle0' (HMR
    // websocket never idles) hang indefinitely. domcontentloaded + a fixed
    // grace period is the only wait that doesn't depend on that network call.
    waitUntil: 'domcontentloaded',
  },
  {
    url: 'file:///' + path.resolve('direcciones-abc.html').replace(/\\/g, '/'),
    out: 'docs/revisiones/direcciones-abc.png',
    width: 1280,
    height: 900,
    fullPage: true,
    waitUntil: 'domcontentloaded',
  },
  {
    url: 'http://localhost:3001/onboarding',
    out: 'docs/revisiones/onboarding-375.png',
    width: 375,
    height: 812,
    fullPage: false, // pantalla de pregunta única — no hay scroll (A2, una pregunta por pantalla)
    waitUntil: 'domcontentloaded',
  },
  {
    url: 'http://localhost:3001/paywall',
    out: 'docs/revisiones/paywall-375.png',
    width: 375,
    height: 812,
    fullPage: true,
    waitUntil: 'domcontentloaded',
    // El paywall real siempre llega DESPUÉS del onboarding (con respuestas guardadas) —
    // sembrar localStorage para que la captura muestre la experiencia personalizada real,
    // no el estado de fallback (acceso directo sin completar el quiz).
    seedLocalStorage: {
      focustrack_onboarding: JSON.stringify({
        dolor: 'Una interrupción desordena todo mi día',
        momento: 'Al empezar la mañana',
        energia: 'Alta — puedo con lo difícil',
        prioridad: 'Escribir propuesta para cliente nuevo',
        diasSemana: 5,
      }),
    },
  },
  {
    url: 'http://localhost:3001/app',
    out: 'docs/revisiones/app-principal-375.png',
    width: 375,
    height: 812,
    fullPage: false, // Hoy no debe tener scroll en el caso típico (32 — estructura sin vacío)
    waitUntil: 'domcontentloaded',
  },
];

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  timeout: 120000,
});

for (const t of targets) {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width: t.width, height: t.height });
  if (t.seedLocalStorage) {
    // localStorage solo se puede setear en el ORIGEN correcto: cargar la página primero,
    // sembrar, y recargar para que el componente la lea al montar.
    await page.goto(t.url, { waitUntil: t.waitUntil, timeout: 120000 });
    await page.evaluate((seed) => {
      for (const [k, v] of Object.entries(seed)) window.localStorage.setItem(k, v);
    }, t.seedLocalStorage);
  }
  await page.goto(t.url, { waitUntil: t.waitUntil, timeout: 60000 });
  // Grace period for fonts/CSS to arrive opportunistically — best effort,
  // not a hard requirement (see waitUntil comment above).
  await new Promise((r) => setTimeout(r, 4000));

  // Scroll through the whole page in SMALL overlapping steps so every
  // whileInView reveal actually crosses its 20% visibility threshold and has
  // time to finish animating (duration ~450ms + stagger) before we move on.
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = Math.round(t.height * 0.4);
  for (let y = 0; y < scrollHeight; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await new Promise((r) => setTimeout(r, 500));
  }
  // Hold at the bottom so the last sections (which had the least time above)
  // finish their reveal, then scroll back to top for the final capture.
  await new Promise((r) => setTimeout(r, 800));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 500));

  await page.screenshot({ path: t.out, fullPage: t.fullPage });
  console.log('Saved', t.out);
  await page.close();
}

await browser.close();
