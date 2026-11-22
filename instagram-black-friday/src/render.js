// Renders the Black Weeks Instagram graphics: node src/render.js (from instagram-black-friday/)
const { chromium } = require('playwright');
const path = require('path');
const hero = 'file://' + path.resolve(__dirname, 'hero.jpg');
const sizes = [
  ['post-feed-1080x1350', 1080, 1350, 0.50],
  ['post-quadrat-1080x1080', 1080, 1080, 0.42],
  ['story-1080x1920', 1080, 1920, 0.48],
];
const logo = (sz) => `<svg width="${sz*0.66}" height="${sz}" viewBox="0 0 66 100" fill="none" stroke="#3a3a3a" stroke-width="9"><rect x="4.5" y="4.5" width="57" height="91" rx="4"/><line x1="4.5" y1="40" x2="61.5" y2="40"/><line x1="33" y1="40" x2="33" y2="95"/></svg>`;
const html = (w, h, photoRatio) => {
  const story = h > 1500, sq = h === w;
  const ph = Math.round(h * photoRatio);
  const k = sq ? 0.8 : 1; // type scale
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Jost:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${w}px;height:${h}px;background:#fff;font-family:Jost,sans-serif;color:#3a3a3a;overflow:hidden;display:flex;flex-direction:column}
.bar{background:#3a3a3a;color:#fff;text-align:center;font-weight:500;font-size:${30*k}px;padding:${22*k}px 0;letter-spacing:.5px}
.photo{position:relative;height:${ph}px;background:url('${hero}') center ${sq?'42%':'45%'}/cover}
.brand{display:flex;align-items:center;gap:${16*k}px}
.tag{position:absolute;left:${80*k}px;bottom:${-30*k}px;background:#3a3a3a;color:#fff;font-weight:600;font-size:${28*k}px;letter-spacing:${4*k}px;text-transform:uppercase;padding:${14*k}px ${26*k}px}
.panel{flex:1;padding:${(sq?60:80)*k}px ${80*k}px ${(story?180:50)*k}px;display:flex;flex-direction:column;justify-content:${story?'flex-start':'center'}}
h1{font-family:'Abril Fatface',serif;font-weight:400;font-size:${(sq?150:170)*k}px;line-height:1;color:#1f1f1f;letter-spacing:-1px}
.sub{font-size:${34*k}px;margin-top:${18*k}px;color:#555}
.row{display:flex;gap:${24*k}px;margin-top:${(story?60:40)*k}px;align-items:stretch}
.code{border:${3*k}px dashed #3a3a3a;padding:${18*k}px ${30*k}px;font-size:${30*k}px;font-weight:500;display:flex;align-items:center}
.code b{font-weight:600;letter-spacing:${3*k}px;margin-left:${12*k}px;color:#1f1f1f}
.btn{background:#2d90c7;color:#fff;font-family:'Abril Fatface',serif;text-transform:uppercase;letter-spacing:${2*k}px;font-size:${30*k}px;padding:${22*k}px ${40*k}px;border-radius:2px;display:flex;align-items:center}
.foot{align-items:center;margin-top:${(story?70:36)*k}px;font-size:${28*k}px;font-weight:500;display:flex;justify-content:space-between;color:#3a3a3a;border-top:1px solid #e3e3e3;padding-top:${22*k}px}
</style></head><body>
${story?'':'<div class="bar">Black Weeks: 10 % auf alles mit Code BLACK10. Nur bis 30.11.</div>'}
<div class="photo"><div class="tag">Black Weeks</div></div>
<div class="panel">
 <h1>10 % auf alles</h1>
 <div class="sub">Schläger, Saiten, Griffbänder, Schuhe &amp; mehr.</div>
 <div class="row"><div class="code">Code:<b>BLACK10</b></div><div class="btn">Jetzt shoppen</div></div>
 <div class="foot"><span class="brand">${logo(44*k)}the-tennisbase.de</span><span>Nur bis 30.11.</span></div>
</div>
</body></html>`;
};
(async () => {
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  for (const [n, w, h, r] of sizes) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const f = path.resolve(__dirname, `_${n}.html`);
    require('fs').writeFileSync(f, html(w, h, r));
    await p.goto('file://' + f, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.resolve(__dirname, '..', `${n}.png`) });
    require('fs').unlinkSync(f);
    await p.close();
  }
  await b.close();
})();
