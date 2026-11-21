// Rendert das Carousel: PNG-Standbilder und MP4-Animationen (1080x1350, 30 fps).
// Aufruf: node render.js [png|mp4|all] [slides, z. B. 1,3]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const mode = process.argv[2] || 'all';
const only = (process.argv[3] || '1,2,3,4,5,6').split(',').map(Number);
const DUR = 6, FPS = 30, STILL_T = 5.5;
const out = path.join(__dirname, 'export');
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'carousel.html'));
  await page.evaluate(() => document.fonts.ready);
  for (const n of only) {
    await page.evaluate(n => { show(n); render(n, 0); }, n);
    await page.waitForLoadState('networkidle');
    const el = await page.$('#s' + n);
    if (mode === 'png' || mode === 'all') {
      await page.evaluate(([n, t]) => render(n, t), [n, STILL_T]);
      await el.screenshot({ path: path.join(out, `slide-${n}.png`) });
      console.log('png', n);
    }
    if (mode === 'mp4' || mode === 'all') {
      const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-crf', '18', '-preset', 'slow',
        '-movflags', '+faststart', path.join(out, `slide-${n}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
      for (let f = 0; f < DUR * FPS; f++) {
        await page.evaluate(([n, t]) => render(n, t), [n, f / FPS]);
        const buf = await el.screenshot({ type: 'jpeg', quality: 95 });
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      }
      ff.stdin.end();
      await new Promise(r => ff.on('close', r));
      console.log('mp4', n);
    }
  }
  await browser.close();
})();
