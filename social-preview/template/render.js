// node render.js <template.html> <data.json> <outdir> [reel]
const { chromium } = require('playwright'); const fs = require('fs'); const { execSync } = require('child_process');
(async () => {
  const [tpl, dataFile, out, reel] = process.argv.slice(2);
  const d = Buffer.from(fs.readFileSync(dataFile, 'utf8')).toString('base64');
  const b = await chromium.launch();
  const open = async (fmt, h) => { const p = await b.newPage({ viewport: { width: 1080, height: h } });
    await p.goto(`file://${tpl}?fmt=${fmt}&d=${encodeURIComponent(d)}`, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); return p; };
  const feed = await open('feed', 1350); await feed.screenshot({ path: `${out}/feed.png` });
  const story = await open('story', 1920); await story.screenshot({ path: `${out}/story.png` });
  if (reel) {
    fs.rmSync(`${out}/frames`, { recursive: true, force: true }); fs.mkdirSync(`${out}/frames`);
    const fps = 30, dur = 8;
    for (let i = 0; i < fps * dur; i++) { await story.evaluate(t => render(t), i / fps);
      await story.screenshot({ path: `${out}/frames/f${String(i).padStart(4,'0')}.jpg`, type: 'jpeg', quality: 92 }); }
    execSync(`ffmpeg -y -loglevel error -framerate ${fps} -i ${out}/frames/f%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart ${out}/reel.mp4`);
  }
  await b.close();
})();
