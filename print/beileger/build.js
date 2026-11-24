// Erzeugt den druckfertigen PDF (mit 3 mm Beschnitt) und eine PNG-Vorschau.
// Aufruf: node build.js
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ deviceScaleFactor: 2 });
  const url = 'file://' + path.join(__dirname, 'beileger.html');
  await p.goto(url); await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: path.join(__dirname, 'EVER8TE-Beileger-A6-druck.pdf'), width: '111mm', height: '154mm', printBackground: true, preferCSSPageSize: true });
  await p.setViewportSize({ width: 1000, height: 700 });
  await p.screenshot({ path: path.join(__dirname, 'vorschau.png'), fullPage: true });
  await b.close();
})();
