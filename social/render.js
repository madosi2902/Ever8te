// Rendert einen Clip Frame für Frame als PNG.
//   node render.js <arbeitsordner> all                → frames/f0000.png …
//   node render.js <arbeitsordner> stills 1.5,4.2,…   → stills/s_1.50.png …
// Der Arbeitsordner muss clip.html, clip.js, fonts/, bag.webp und logo.png enthalten (siehe build.sh).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), http = require('http');
(async () => {
  const dir = path.resolve(process.argv[2]), mode = process.argv[3] || 'all';
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };
  // Lokaler HTTP-Server, damit der Canvas nicht "tainted" ist (toDataURL funktioniert sonst nicht).
  const srv = http.createServer((q, r) => {
    const f = path.join(dir, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(dir) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
  }).listen(0);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.error('PAGEERR', e.message));
  await p.goto(`http://127.0.0.1:${srv.address().port}/clip.html`);
  await p.evaluate(() => window.ready);
  const grab = async (t, file) => {
    const data = await p.evaluate(t => { window.draw(t); return document.getElementById('c').toDataURL('image/png'); }, t);
    fs.writeFileSync(file, Buffer.from(data.split(',')[1], 'base64'));
  };
  if (mode === 'stills') {
    fs.mkdirSync(path.join(dir, 'stills'), { recursive: true });
    for (const t of process.argv[4].split(',').map(Number)) await grab(t, path.join(dir, 'stills', `s_${t.toFixed(2)}.png`));
  } else {
    fs.mkdirSync(path.join(dir, 'frames'), { recursive: true });
    const n = Math.round((await p.evaluate(() => window.DUR)) * 30);
    for (let i = 0; i < n; i++) await grab(i / 30, path.join(dir, 'frames', `f${String(i).padStart(4, '0')}.png`));
    console.log('frames', n);
  }
  await b.close(); srv.close();
})();
