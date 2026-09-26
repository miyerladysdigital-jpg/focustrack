// Captura la demostración «antes → imprevisto → después» de la landing en sus 3 estados y mide
// desborde horizontal y áreas táctiles. Requiere `next start -p 3055` corriendo.
// Uso: node scripts/captura-demo.mjs [ancho]   (default 375)
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ancho = Number(process.argv[2] ?? 375);
const alto = 812;
const base = process.env.URL_BASE ?? 'http://localhost:3055';
fs.mkdirSync('docs/revisiones', { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.setViewport({ width: ancho, height: alto, deviceScaleFactor: 2 });
await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
await new Promise((r) => setTimeout(r, 3000));

// La barra fija de CTA (sticky) se cuela en la captura del elemento: se oculta solo para fotografiar.
await page.addStyleTag({ content: '.fixed{display:none !important}' });
const seccion = await page.evaluateHandle(() => document.querySelector('[role=tablist]').closest('section'));
await seccion.evaluate((el) => el.scrollIntoView({ block: 'start' }));
await new Promise((r) => setTimeout(r, 1200));

const medidas = await page.evaluate(() => {
  const botones = [...document.querySelectorAll('[role=tab], [role=tablist] ~ div button')].map((b) => {
    const r = b.getBoundingClientRect();
    return { texto: b.textContent.trim(), alto: Math.round(r.height), ancho: Math.round(r.width) };
  });
  return { scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, botones };
});
console.log(JSON.stringify(medidas));

for (let i = 0; i < 3; i++) {
  const tabs = await page.$$('[role=tab]');
  await tabs[i].click();
  await new Promise((r) => setTimeout(r, 700));
  const out = `docs/revisiones/landing-demo-etapa${i + 1}-${ancho}.png`;
  await seccion.screenshot({ path: out });
  const filas = await page.$$eval('ul[aria-label="Agenda de hoy"] li', (ls) => ls.map((l) => l.innerText.replace(/\n/g, ' | ')));
  const panel = await page.$eval('#demo-panel', (p) => Math.round(p.getBoundingClientRect().height));
  console.log(out, 'altura del panel:', panel, JSON.stringify(filas));
}

// Estado de éxito: en «Reorganizado» se confirma y aparece el CTA final.
const confirmar = await page.evaluateHandle(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Confirmar horas nuevas')));
await confirmar.click();
await new Promise((r) => setTimeout(r, 900));
const salida = `docs/revisiones/landing-demo-etapa4-${ancho}.png`;
await seccion.screenshot({ path: salida });
const panelFinal = await page.$eval('#demo-panel', (p) => Math.round(p.getBoundingClientRect().height));
console.log(salida, 'altura del panel:', panelFinal, 'scrollWidth:', await page.evaluate(() => document.documentElement.scrollWidth));
await browser.close();
