// EVER8TE TikTok – "Satz 3, 38 Grad" – One-Line-Art mit pinken Akzenten
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const W = 1080, H = 1920;
const T = { LAUNCH: 7.6, ORBIT: 10.0, HIT: 10.62, CUT: 10.95, IMPACT: 11.08, END: 11.85, DUR: 14.8 };
window.DUR = T.DUR;
const PINK = '#ff1489', PINK2 = '#ff6db4', INK = '#1a1014', CREAM = '#f4efe8', DARK = '#15101a';
let BG = CREAM, LN = INK;

const imgs = {};
function loadImg(k, src) { return new Promise(r => { const i = new Image(); i.onload = () => { imgs[k] = i; r(); }; i.src = src; }); }
window.ready = Promise.all([
  loadImg('bag', 'bag.webp'), loadImg('logo', 'logo.png'),
  document.fonts.load('italic 900 100px BC'), document.fonts.load('italic 800 100px BC'),
  document.fonts.load('800 40px MR'), document.fonts.load('700 40px MR')]);

// ---------- utils ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = k => 1 - Math.pow(1 - k, 3);
const easeIn = k => k * k * k;
const easeInOut = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const backOut = k => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const elastic = k => k <= 0 ? 0 : k >= 1 ? 1 : Math.pow(2, -10 * k) * Math.sin((k * 10 - .75) * (2 * Math.PI / 3)) + 1;
const rnd = i => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, k) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * clamp(k)).toString(16).padStart(2, '0')).join(''); };

function stroke(w, col) { ctx.strokeStyle = col || LN; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); }
function FS(w, col, fill) { ctx.fillStyle = fill || BG; ctx.fill(); stroke(w, col); }
function tube(x1, y1, x2, y2, w, lw, col) {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.lineCap = 'round'; ctx.strokeStyle = col || LN; ctx.lineWidth = w + 2 * lw; ctx.stroke();
  ctx.strokeStyle = BG; ctx.lineWidth = w; ctx.stroke();
}
function elbowCtrl(sx, sy, hx, hy, L, out) {
  const dx = hx - sx, dy = hy - sy, d = Math.max(1, Math.hypot(dx, dy));
  const h = Math.sqrt(Math.max(0, L * L - d * d / 4));
  const mx = (sx + hx) / 2, my = (sy + hy) / 2, nx = -dy / d, ny = dx / d;
  let ex = mx + nx * h, ey = my + ny * h; const ex2 = mx - nx * h, ey2 = my - ny * h;
  if (out * ex2 > out * ex) { ex = ex2; ey = ey2; }
  return [2 * ex - mx, 2 * ey - my];
}
function limb(sx, sy, hx, hy, L, out, w, lw) {
  const [cx, cy] = elbowCtrl(sx, sy, hx, hy, L, out);
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(cx, cy, hx, hy);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = LN; ctx.lineWidth = w + 2 * lw; ctx.stroke();
  ctx.strokeStyle = BG; ctx.lineWidth = w; ctx.stroke();
}
function txt(str, x, y, size, o = {}) {
  const { col = LN, rot = -0.04, scale = 1, alpha = 1, font = 'italic 900', fam = 'BC', align = 'center', outline = 0 } = o;
  if (scale <= 0.001 || alpha <= 0.001) return;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(scale, scale);
  ctx.font = `${font} ${size}px ${fam}`; ctx.textAlign = align; ctx.textBaseline = 'middle';
  if (outline) { ctx.lineWidth = outline; ctx.strokeStyle = col; ctx.lineJoin = 'round'; ctx.strokeText(str, 0, 0); }
  else { ctx.fillStyle = col; ctx.fillText(str, 0, 0); }
  ctx.restore();
}
// pop-in / fade-out envelope
function env(t, t0, t1) { if (t < t0 || t > t1) return null; return { s: backOut(seg(t, t0, t0 + 0.22)), a: 1 - seg(t, t1 - 0.12, t1) }; }

// ---------- character ----------
const HER = { hair: 'pony', chest: true, bottom: 'skirt' };
const HIM = { hair: 'short', chest: false, bottom: 'shorts' };
const PZ = {
  hang:   { Lx: -118, Ly: -255, Rx: 122, Ry: -255, rAng: 2.75, bAng: 0.25, drop: 0, fs: 62 },
  reach:  { Lx: -205, Ly: -430, Rx: 122, Ry: -255, rAng: 2.75, bAng: 0.6, drop: 0, fs: 62 },
  drink:  { Lx: -128, Ly: -585, Rx: 122, Ry: -262, rAng: 2.65, bAng: 2.1, drop: 0, fs: 62 },
  drink2: { Lx: -118, Ly: -600, Rx: 122, Ry: -262, rAng: 2.65, bAng: 2.6, drop: 0, fs: 62 },
  flex:   { Lx: -168, Ly: -585, Rx: 170, Ry: -585, rAng: 0.35, bAng: -0.25, drop: 0, fs: 80 },
  squat:  { Lx: -170, Ly: -165, Rx: 175, Ry: -165, rAng: 2.4, bAng: -0.4, drop: 95, fs: 100 },
  fly:    { Lx: -112, Ly: -300, Rx: 92, Ry: -662, rAng: 0.05, bAng: 0.15, drop: 0, fs: 22 },
  wind:   { Lx: -112, Ly: -300, Rx: 150, Ry: -600, rAng: -2.3, bAng: 0.15, drop: 0, fs: 22 },
  hit:    { Lx: -112, Ly: -300, Rx: 110, Ry: -650, rAng: 0.15, bAng: 0.15, drop: 0, fs: 22 },
  follow: { Lx: -112, Ly: -300, Rx: 40, Ry: -330, rAng: 2.6, bAng: 0.15, drop: 0, fs: 22 },
  ready:  { Lx: -60, Ly: -330, Rx: 60, Ry: -330, rAng: 0.2, bAng: 0, drop: 20, fs: 80 },
  shock:  { Lx: -175, Ly: -560, Rx: 165, Ry: -560, rAng: 0.35, bAng: 0, drop: 0, fs: 70 },
};
const KF = [[0, 'hang'], [3.38, 'hang'], [3.62, 'reach'], [3.85, 'drink'], [4.15, 'drink2'], [4.3, 'drink'], [4.5, 'drink2'],
  [4.62, 'drink'], [4.82, 'drink2'], [5.0, 'drink2'], [5.25, 'flex'], [6.8, 'flex'], [7.05, 'squat'], [T.LAUNCH, 'squat'],
  [T.LAUNCH + 0.18, 'fly'], [10.25, 'fly'], [10.5, 'wind'], [T.HIT, 'hit'], [T.HIT + 0.2, 'follow'], [99, 'follow']];
function poseAt(t) {
  for (let i = 0; i < KF.length - 1; i++) {
    const [t0, a] = KF[i], [t1, b] = KF[i + 1];
    if (t >= t0 && t <= t1) { const k = easeInOut(seg(t, t0, t1)); const A = PZ[a], B = PZ[b], o = {}; for (const f in A) o[f] = lerp(A[f], B[f], k); return o; }
  }
  return { ...PZ.hang };
}
function meltAt(t) { if (t < 4.75) return 0.55 + 0.45 * easeOut(seg(t, 0, 1.3)) + 0.035 * Math.sin(t * 5); return 1 - elastic(seg(t, 4.75, 5.55)); }
function altAt(t) { if (t < T.LAUNCH) return 0; const x = clamp((t - T.LAUNCH) / 2.4); return 9500 * (1 - Math.pow(1 - x, 2.2)); }
function camAt(t) { const a = altAt(t); return a - 300 * Math.tanh(a / 400); }
function heroX(t) { return 540 + 70 * Math.sin((t - T.LAUNCH) * 5) * seg(t, T.LAUNCH, T.LAUNCH + 0.5) * (1 - seg(t, 9.6, 10.0)); }
function heroAt(t) {
  const a = altAt(t), off = 300 * Math.tanh(a / 400);
  const s = 1 - 0.25 * easeInOut(seg(t, T.LAUNCH + 0.1, T.LAUNCH + 1.3));
  let y = 1560 - off;
  if (t > 5.3 && t < 6.8) y += Math.sin(t * 9) * 6;
  if (t >= T.LAUNCH + 0.2) y += Math.sin(t * 4) * 10 * seg(t, T.LAUNCH + 0.2, T.LAUNCH + 0.8);
  let face = 'melt', pony = 1.45 + 0.05 * Math.sin(t * 3);
  if (t >= 3.82) { face = 'drink'; pony = 1.2; }
  if (t >= 5.05) { face = 'power'; pony = -0.95 + 0.25 * Math.sin(t * 20); }
  if (t >= T.LAUNCH) { face = 'fly'; pony = 1.62 + 0.15 * Math.sin(t * 25); }
  if (t >= 10.3) { face = 'smash'; }
  return { x: heroX(t), y, s, melt: meltAt(t), pose: poseAt(t), face, pony, style: HER, t,
    bottle: t >= 3.62, racket: true, power: t >= 5.1, glow: t >= 5.1 && t < T.LAUNCH,
    racketPink: t >= T.HIT - 0.35 && t < T.HIT + 0.35,
    flame: t >= T.LAUNCH - 0.25 ? (t < T.LAUNCH ? 90 * seg(t, T.LAUNCH - 0.25, T.LAUNCH) : 250) : 0, ground: a < 5 };
}
function xf(P) {
  const m = P.melt || 0, sx = P.s * (1 + 0.28 * m), sy = P.s * (1 - 0.38 * m), r = P.rot || 0, c = Math.cos(r), s = Math.sin(r);
  return (lx, ly) => { const X = lx * sx, Y = ly * sy; return [P.x + X * c - Y * s, P.y + X * s + Y * c]; };
}
function racketHead(P) { const p = P.pose; return xf(P)(p.Rx + 170 * Math.sin(p.rAng), p.Ry - 170 * Math.cos(p.rAng)); }

function drawRacket(hx, hy, ang, lw, col) {
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang);
  tube(0, 22, 0, -95, 14, lw, col);
  ctx.beginPath(); ctx.moveTo(0, -92); ctx.lineTo(-30, -112); ctx.moveTo(0, -92); ctx.lineTo(30, -112); stroke(lw, col);
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, -170, 58, 74, 0, 0, Math.PI * 2); ctx.clip();
  ctx.globalAlpha = 0.45; ctx.beginPath();
  for (let i = -56; i <= 56; i += 16) { ctx.moveTo(i, -250); ctx.lineTo(i, -90); }
  for (let j = -238; j <= -100; j += 16) { ctx.moveTo(-70, j); ctx.lineTo(70, j); }
  stroke(lw * 0.35, col); ctx.restore();
  ctx.beginPath(); ctx.ellipse(0, -170, 62, 78, 0, 0, Math.PI * 2); stroke(lw * 1.2, col);
  ctx.beginPath(); ctx.ellipse(0, -170, 54, 70, 0, 0, Math.PI * 2); stroke(lw * 0.45, col);
  ctx.restore();
}
function drawBottle(x, y, ang, lw) { // Pinker Shaker = erster Pink-Akzent
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.beginPath(); ctx.roundRect(-36, -85, 72, 175, 18); FS(lw, PINK);
  ctx.beginPath(); ctx.roundRect(-30, 10, 60, 74, 12); ctx.fillStyle = 'rgba(255,20,137,0.18)'; ctx.fill();
  ctx.beginPath(); ctx.roundRect(-32, -118, 64, 34, 10); FS(lw, PINK);
  ctx.beginPath(); ctx.roundRect(-9, -142, 18, 26, 6); FS(lw, PINK);
  ctx.font = 'italic 900 78px BC'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = lw * 0.6; ctx.strokeStyle = PINK; ctx.strokeText('8', 0, -28);
  ctx.restore();
}
function drawFlame(len, t, lw) {
  if (len <= 0) return;
  const f = 1 + 0.14 * Math.sin(t * 61) + 0.09 * Math.sin(t * 37);
  for (const [w, l, a] of [[62, len * f, 0.10], [40, len * 0.68 * f, 0.16], [20, len * 0.38 * f, 0.3]]) {
    ctx.beginPath(); ctx.moveTo(-w, -4); ctx.quadraticCurveTo(-w * 0.95, l * 0.45, 0, l); ctx.quadraticCurveTo(w * 0.95, l * 0.45, w, -4);
    ctx.fillStyle = `rgba(255,20,137,${a})`; ctx.fill(); stroke(lw, PINK);
  }
  ctx.beginPath();
  for (let i = 0; i < 4; i++) { const x = (rnd(i + Math.floor(t * 20)) - .5) * 90, y = len * f * (0.7 + rnd(i * 3 + Math.floor(t * 20)) * 0.5); ctx.moveTo(x, y); ctx.lineTo(x * 1.1, y + 40); }
  stroke(lw * 0.7, PINK2);
}
function drawPony(ax, ay, ang, lw, glow) {
  const col = glow ? PINK : LN;
  ctx.save(); ctx.translate(ax, ay); ctx.rotate(ang);
  if (glow) { ctx.shadowColor = PINK; ctx.shadowBlur = 30; }
  ctx.beginPath(); ctx.moveTo(0, -20); ctx.bezierCurveTo(60, -50, 150, -32, 198, 6); ctx.bezierCurveTo(140, 14, 60, 42, 0, 20); ctx.closePath(); FS(lw, col);
  ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.moveTo(24, -2); ctx.quadraticCurveTo(100, -14, 172, 4); ctx.moveTo(30, 10); ctx.quadraticCurveTo(90, 12, 140, 10); stroke(lw * 0.5, col);
  ctx.beginPath(); ctx.ellipse(4, 0, 10, 22, 0, 0, Math.PI * 2); FS(lw, col);
  ctx.restore();
}
function drawFace(P, lw) {
  const f = P.face, t = P.t;
  const eyeY = 2;
  const pinkEyes = () => {
    for (const sg of [-1, 1]) {
      ctx.save(); ctx.shadowColor = PINK; ctx.shadowBlur = 25;
      ctx.beginPath(); ctx.ellipse(sg * 40, eyeY, 19, 24, 0, 0, Math.PI * 2); ctx.fillStyle = PINK; ctx.fill(); ctx.restore();
      ctx.beginPath(); ctx.ellipse(sg * 40, eyeY, 19, 24, 0, 0, Math.PI * 2); stroke(lw * 0.7);
      ctx.beginPath(); ctx.arc(sg * 40 - 6, eyeY - 8, 5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(sg * 70, -40); ctx.lineTo(sg * 16, -26); stroke(lw * 1.1);
    }
  };
  if (f === 'normal' || f === 'ready') {
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.arc(sg * 38, eyeY, 8, 0, Math.PI * 2); ctx.fillStyle = LN; ctx.fill(); ctx.beginPath(); ctx.moveTo(sg * 55, -34); ctx.quadraticCurveTo(sg * 38, -42, sg * 22, -34); stroke(lw * 0.7); }
    ctx.beginPath(); ctx.moveTo(-22, 48); ctx.quadraticCurveTo(0, 62, 22, 48); stroke(lw * 0.8);
  } else if (f === 'melt') {
    for (const sg of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(sg * 62, 2); ctx.quadraticCurveTo(sg * 40, 6, sg * 18, 10); stroke(lw * 0.9);       // schwere Lider
      ctx.beginPath(); ctx.arc(sg * 38, 14, 6, 0, Math.PI); ctx.fillStyle = LN; ctx.fill();
      ctx.beginPath(); ctx.moveTo(sg * 56, 30); ctx.quadraticCurveTo(sg * 40, 38, sg * 24, 30); stroke(lw * 0.5);      // Augenringe
    }
    ctx.beginPath(); ctx.moveTo(-26, 50); ctx.bezierCurveTo(-18, 84, 18, 84, 26, 52); ctx.quadraticCurveTo(0, 44, -26, 50); FS(lw * 0.8);
    const tg = 12 * Math.sin(t * 7);
    ctx.beginPath(); ctx.moveTo(-14, 70); ctx.bezierCurveTo(-18, 112 + tg, 18, 116 + tg, 14, 70); FS(lw * 0.8);  // Zunge
    ctx.beginPath(); ctx.moveTo(0, 78); ctx.lineTo(0, 98 + tg * 0.7); stroke(lw * 0.4);
  } else if (f === 'drink') {
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sg * 58, -6); ctx.lineTo(sg * 30, 6); ctx.lineTo(sg * 58, 16); stroke(lw * 0.9); }
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.arc(sg * 62, 52, 22, sg > 0 ? -0.6 : Math.PI - 1.6, sg > 0 ? 1.6 : Math.PI + 0.6); stroke(lw * 0.6); }
  } else if (f === 'power') {
    pinkEyes();
    ctx.beginPath(); ctx.moveTo(-42, 40); ctx.quadraticCurveTo(0, 96, 42, 40); ctx.closePath(); FS(lw * 0.8);
    ctx.beginPath(); ctx.moveTo(-36, 52); ctx.lineTo(36, 52); stroke(lw * 0.5);
  } else if (f === 'fly') {
    pinkEyes();
    ctx.beginPath(); ctx.ellipse(0, 58, 26, 22 + 4 * Math.sin(t * 30), 0, 0, Math.PI * 2); FS(lw * 0.8);
  } else if (f === 'smash') {
    pinkEyes();
    ctx.beginPath(); ctx.roundRect(-36, 40, 72, 28, 8); FS(lw * 0.8);
    ctx.beginPath(); for (let i = -24; i <= 24; i += 12) { ctx.moveTo(i, 40); ctx.lineTo(i, 68); } ctx.moveTo(-36, 54); ctx.lineTo(36, 54); stroke(lw * 0.4);
  } else if (f === 'shock') {
    for (const sg of [-1, 1]) {
      ctx.beginPath(); ctx.arc(sg * 40, eyeY, 26, 0, Math.PI * 2); FS(lw * 0.7);
      ctx.beginPath(); ctx.arc(sg * 40, eyeY, 5, 0, Math.PI * 2); ctx.fillStyle = LN; ctx.fill();
      ctx.beginPath(); ctx.moveTo(sg * 62, -52); ctx.quadraticCurveTo(sg * 40, -66, sg * 18, -52); stroke(lw * 0.7);
    }
    ctx.beginPath(); ctx.ellipse(0, 62, 14, 22, 0, 0, Math.PI * 2); FS(lw * 0.8);
  } else if (f === 'dazed') {
    for (const sg of [-1, 1]) {
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 5; a += 0.2) { const r = a * 1.6, x = sg * 40 + Math.cos(a + t * 12 * sg) * r, y = eyeY + Math.sin(a + t * 12 * sg) * r; a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      stroke(lw * 0.45);
    }
    ctx.beginPath(); ctx.moveTo(-28, 58); for (let x = -28; x <= 28; x += 4) ctx.lineTo(x, 58 + Math.sin(x * 0.4 + t * 10) * 5); stroke(lw * 0.7);
  }
}
function drawPlayer(P) {
  const st = P.style, m = P.melt || 0, po = P.pose, d = po.drop || 0, t = P.t;
  const lw = Math.max(7, 2.4 / P.s);
  ctx.save(); ctx.translate(P.x, P.y); ctx.rotate(P.rot || 0);
  if (P.ground) {
    ctx.save(); ctx.scale(P.s, P.s); ctx.globalAlpha = 0.55;
    const pr = 110 + 130 * Math.max(0, m);
    ctx.beginPath(); ctx.ellipse(0, 4, pr, 14 + 8 * Math.max(0, m), 0, 0, Math.PI * 2); stroke(lw * 0.6);
    if (m > 0.3) { ctx.beginPath(); ctx.ellipse(-pr * 0.5, 4, 30, 5, 0, 0, Math.PI * 2); ctx.ellipse(pr * 0.55, 6, 22, 4, 0, 0, Math.PI * 2); stroke(lw * 0.4); }
    ctx.restore();
  }
  ctx.scale(P.s * (1 + 0.28 * m), P.s * (1 - 0.38 * m));
  if (P.flame > 0) drawFlame(P.flame, t, lw);
  const hx = 18 * m, hy = -585 + d + 30 * m, shY = -452 + d;
  if (st.hair === 'pony') drawPony(hx + 70, hy - 50, P.pony, lw, P.glow);
  for (const sg of [-1, 1]) {
    limb(sg * 40, -180 + d, sg * po.fs, -26, 100, sg, 34, lw);
    ctx.beginPath(); ctx.ellipse(sg * (po.fs + 12), -16, 46, 22, 0, 0, Math.PI * 2); FS(lw);
    ctx.beginPath(); ctx.moveTo(sg * (po.fs - 18), -22); ctx.quadraticCurveTo(sg * (po.fs + 14), -4, sg * (po.fs + 44), -20); stroke(lw * 0.5);
  }
  if (st.bottom === 'skirt') {
    ctx.beginPath(); ctx.moveTo(-66, -246 + d); ctx.lineTo(66, -246 + d); ctx.lineTo(104, -150 + d); ctx.lineTo(-104, -150 + d); ctx.closePath(); FS(lw);
    ctx.beginPath(); for (const x of [-50, -16, 18, 52]) { ctx.moveTo(x * 0.85, -240 + d); ctx.lineTo(x * 1.35, -156 + d); } stroke(lw * 0.45);
  } else {
    ctx.beginPath(); ctx.moveTo(-70, -246 + d); ctx.lineTo(70, -246 + d); ctx.lineTo(90, -140 + d); ctx.lineTo(10, -140 + d); ctx.lineTo(0, -178 + d); ctx.lineTo(-10, -140 + d); ctx.lineTo(-90, -140 + d); ctx.closePath(); FS(lw);
  }
  tube(0, -470 + d, hx * 0.6, hy + 70, 40, lw);
  ctx.beginPath(); ctx.moveTo(-88, -468 + d); ctx.quadraticCurveTo(0, -486 + d, 88, -468 + d); ctx.lineTo(62, -238 + d); ctx.lineTo(-62, -238 + d); ctx.closePath(); FS(lw);
  if (st.chest) {
    ctx.save(); ctx.font = 'italic 900 120px BC'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (P.power) { ctx.shadowColor = PINK; ctx.shadowBlur = 20; }
    ctx.lineWidth = lw * 0.7; ctx.strokeStyle = P.power ? PINK : LN; ctx.lineJoin = 'round'; ctx.strokeText('8', 0, -350 + d); ctx.restore();
    ctx.beginPath(); ctx.moveTo(-34, -478 + d); ctx.quadraticCurveTo(0, -440 + d, 34, -478 + d); stroke(lw * 0.6);
  } else {
    ctx.beginPath(); ctx.moveTo(-36, -478 + d); ctx.lineTo(0, -430 + d); ctx.lineTo(36, -478 + d); ctx.moveTo(0, -430 + d); ctx.lineTo(0, -380 + d); stroke(lw * 0.6);
  }
  // head
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(0.2 * m + (P.headTilt || 0));
  if (P.frizz) {
    ctx.beginPath();
    for (let i = 0; i <= 18; i++) { const a = Math.PI * 0.85 + i / 18 * Math.PI * 1.3, r = 150 + (i % 2) * 30; const x = Math.cos(a) * r, y = -30 + Math.sin(a) * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.closePath(); FS(lw);
  }
  ctx.beginPath(); ctx.arc(0, 0, 102, 0, Math.PI * 2); FS(lw);
  for (const sg of [-1, 1]) { ctx.beginPath(); ctx.arc(sg * 104, 8, 16, sg > 0 ? -1.4 : Math.PI - 1.7, sg > 0 ? 1.7 : Math.PI + 1.4); FS(lw * 0.8); }
  if (st.hair === 'pony') {
    ctx.beginPath(); ctx.arc(0, -4, 114, Math.PI + 0.05, Math.PI * 2 - 0.05);
    ctx.quadraticCurveTo(70, -10, 20, -56); ctx.quadraticCurveTo(-40, -20, -112, -14); ctx.closePath(); FS(lw);
    ctx.beginPath(); ctx.moveTo(-60, -90); ctx.quadraticCurveTo(-10, -110, 40, -96); stroke(lw * 0.45);
  } else if (!P.frizz) {
    ctx.beginPath(); ctx.arc(0, -4, 110, Math.PI + 0.15, Math.PI * 2 - 0.15);
    for (let i = 0; i <= 6; i++) { const x = 95 - i * 32; ctx.lineTo(x, -40 - (i % 2) * 22); } ctx.closePath(); FS(lw);
  }
  drawFace(P, lw);
  ctx.restore();
  // arms
  if (P.racket) drawRacket(po.Rx, po.Ry, po.rAng, lw, P.racketPink ? PINK : LN);
  limb(82, shY, po.Rx, po.Ry, 108, 1, 28, lw);
  if (P.bottle) drawBottle(po.Lx, po.Ly, po.bAng, lw);
  limb(-82, shY, po.Lx, po.Ly, 108, -1, 28, lw);
  for (const [x, y] of [[po.Rx, po.Ry], [po.Lx, po.Ly]]) { ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); FS(lw); }
  if (st.hair === 'short') for (const sg of [-1, 1]) { ctx.beginPath(); ctx.arc(sg * 84, shY + 10, 32, 0, Math.PI * 2); FS(lw); }
  ctx.restore();
}
function drawAura(P, I, t) {
  if (I <= 0) return;
  const [cx, cy] = xf(P)(0, -330);
  const s = P.s;
  ctx.save(); ctx.globalAlpha = I;
  for (const [rx, ry, lwid, off] of [[300, 470, 7, 0], [250, 410, 4, 50]]) {
    ctx.beginPath();
    const N = 26, fr = Math.floor(t * 14);
    for (let i = 0; i <= N; i++) {
      const a = i / N * Math.PI * 2, spike = i % 2 ? 1 : 0.8 + 0.35 * rnd(i + fr + off);
      let x = cx + Math.cos(a) * rx * s * spike, y = cy + Math.sin(a) * ry * s * spike;
      if (Math.sin(a) < 0) y -= (i % 2 ? 0 : 70 * s * rnd(i * 7 + fr));
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath(); ctx.strokeStyle = PINK; ctx.lineWidth = lwid; ctx.lineJoin = 'round'; ctx.shadowColor = PINK; ctx.shadowBlur = 25; ctx.stroke();
  }
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ph = (t * 1.6 + rnd(i)) % 1, x = cx + (rnd(i + 9) - .5) * 520 * s, y = cy + 300 * s - ph * 800 * s;
    ctx.moveTo(x - 10, y); ctx.lineTo(x + 10, y); ctx.moveTo(x, y - 10); ctx.lineTo(x, y + 10);
  }
  ctx.lineWidth = 4; ctx.strokeStyle = PINK2; ctx.stroke();
  ctx.restore();
}

// ---------- environment ----------
function drawSun(x, y, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(0.78, 0.78);
  ctx.save(); ctx.rotate(t * 0.4); ctx.beginPath();
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r1 = 140, r2 = 190 + (i % 2) * 40 + 10 * Math.sin(t * 6 + i); ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); }
  stroke(7); ctx.restore();
  ctx.beginPath(); ctx.arc(0, 0, 115, 0, Math.PI * 2); FS(8);
  ctx.beginPath(); ctx.roundRect(-82, -30, 70, 44, 14); ctx.roundRect(12, -30, 70, 44, 14); ctx.fillStyle = LN; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-12, -16); ctx.lineTo(12, -16); ctx.moveTo(-82, -20); ctx.lineTo(-112, -30); ctx.moveTo(82, -20); ctx.lineTo(112, -30); stroke(6);
  ctx.beginPath(); ctx.moveTo(-30, 50); ctx.quadraticCurveTo(10, 72, 44, 40); stroke(7);
  ctx.restore();
}
const COURT_Y0 = 1010, COURT_Y1 = 1780;
const sideX = (y, side) => side < 0 ? lerp(250, -250, (y - COURT_Y0) / (COURT_Y1 - COURT_Y0)) : lerp(830, 1330, (y - COURT_Y0) / (COURT_Y1 - COURT_Y0));
function drawCourt(oy, withOpp, t) {
  ctx.save(); ctx.translate(0, oy);
  // Windscreen mit Banner
  ctx.beginPath(); ctx.moveTo(-100, 790); ctx.lineTo(W + 100, 790); ctx.moveTo(-100, 975); ctx.lineTo(W + 100, 975); stroke(6);
  ctx.beginPath(); for (let x = 40; x < W; x += 200) { ctx.moveTo(x, 790); ctx.lineTo(x, 975); } stroke(3);
  ctx.globalAlpha = 0.25; ctx.beginPath(); for (let x = -100; x < W + 100; x += 34) { ctx.moveTo(x, 790); ctx.lineTo(x + 60, 975); } stroke(2); ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.roundRect(330, 835, 420, 96, 10); FS(5);
  txt('EVER8TE', 540, 884, 78, { rot: 0, outline: 3.5 });
  // Platzlinien
  ctx.beginPath();
  ctx.moveTo(sideX(COURT_Y0, -1), COURT_Y0); ctx.lineTo(sideX(COURT_Y0, 1), COURT_Y0);
  ctx.moveTo(sideX(COURT_Y1, -1), COURT_Y1); ctx.lineTo(sideX(COURT_Y1, 1), COURT_Y1);
  ctx.moveTo(sideX(COURT_Y0, -1), COURT_Y0); ctx.lineTo(sideX(COURT_Y1, -1), COURT_Y1);
  ctx.moveTo(sideX(COURT_Y0, 1), COURT_Y0); ctx.lineTo(sideX(COURT_Y1, 1), COURT_Y1);
  for (const y of [1085, 1400]) { const k = 0.12; ctx.moveTo(lerp(sideX(y, -1), sideX(y, 1), k), y); ctx.lineTo(lerp(sideX(y, -1), sideX(y, 1), 1 - k), y); }
  ctx.moveTo(540, 1085); ctx.lineTo(540, 1400);
  stroke(5);
  // Sand-Striche
  ctx.globalAlpha = 0.3; ctx.beginPath();
  for (let i = 0; i < 26; i++) { const x = rnd(i) * W, y = 1020 + rnd(i + 40) * 860, l = 20 + rnd(i + 7) * 50; ctx.moveTo(x, y); ctx.lineTo(x + l, y + 2); }
  stroke(3); ctx.globalAlpha = 1;
  if (withOpp) drawPlayer({ x: 540, y: 1078, s: 0.17, melt: 0, pose: PZ.ready, face: 'normal', style: HIM, t, racket: true, ground: true });
  // Netz
  const ny = 1170, nl = sideX(ny, -1) - 20, nr = sideX(ny, 1) + 20;
  ctx.beginPath(); ctx.rect(nl, ny - 70, nr - nl, 70); ctx.fillStyle = BG; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1;
  ctx.globalAlpha = 0.35; ctx.beginPath();
  for (let x = nl; x < nr; x += 26) { ctx.moveTo(x, ny - 70); ctx.lineTo(x, ny); }
  for (let y = ny - 56; y < ny; y += 16) { ctx.moveTo(nl, y); ctx.lineTo(nr, y); }
  stroke(2); ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.moveTo(nl, ny - 72); ctx.lineTo(nr, ny - 72); stroke(9);
  ctx.beginPath(); ctx.moveTo(nl, ny); ctx.lineTo(nl, ny - 90); ctx.moveTo(nr, ny); ctx.lineTo(nr, ny - 90); ctx.moveTo(nl, ny); ctx.lineTo(nr, ny); stroke(6);
  ctx.restore();
}
function drawCloud(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-160, 40);
  ctx.bezierCurveTo(-200, 40, -200, -20, -140, -20); ctx.bezierCurveTo(-130, -80, -50, -90, -30, -40);
  ctx.bezierCurveTo(-10, -110, 100, -100, 100, -30); ctx.bezierCurveTo(170, -40, 190, 40, 140, 40); ctx.closePath();
  FS(6 / s); ctx.restore();
}
function drawEarth(top, t) {
  const R = 2600, cy = top + R;
  ctx.save();
  ctx.beginPath(); ctx.arc(540, cy, R + 40, 0, Math.PI * 2); ctx.setLineDash([4, 22]); stroke(4); ctx.setLineDash([]);
  ctx.beginPath(); ctx.arc(540, cy, R, 0, Math.PI * 2); FS(7);
  ctx.beginPath(); ctx.arc(540, cy, R, 0, Math.PI * 2); ctx.clip();
  ctx.beginPath();
  const sh = t * 30;
  for (const [x0, y0, w] of [[120, 120, 260], [620, 70, 320], [380, 260, 180], [860, 230, 240]]) {
    const x = x0 - sh, y = top + y0;
    ctx.moveTo(x, y); ctx.bezierCurveTo(x + w * 0.3, y - 60, x + w * 0.7, y + 40, x + w, y - 10);
    ctx.bezierCurveTo(x + w * 0.8, y + 80, x + w * 0.2, y + 90, x, y);
  }
  stroke(5);
  ctx.restore();
}
function drawStars(alpha, t) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.beginPath();
  for (let i = 0; i < 90; i++) {
    const x = rnd(i) * W, y = rnd(i + 300) * H, r = 4 + rnd(i + 77) * 9 * (0.7 + 0.3 * Math.sin(t * 4 + i));
    ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.moveTo(x, y - r); ctx.lineTo(x, y + r);
  }
  stroke(2.5); ctx.restore();
}
function drawBattery(x, y, mode, t, sc) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  const col = mode === 'full' ? PINK : LN;
  ctx.beginPath(); ctx.roundRect(-130, -50, 260, 100, 18); stroke(7, col);
  ctx.beginPath(); ctx.roundRect(132, -20, 16, 40, 5); stroke(7, col);
  if (mode === 'low') {
    if (Math.floor(t * 4) % 2 === 0) { ctx.beginPath(); ctx.roundRect(-116, -36, 14, 72, 5); ctx.fillStyle = LN; ctx.fill(); }
    txt('AKKU 1 %', 14, 2, 44, { rot: 0, font: '800', fam: 'MR' });
  } else {
    ctx.save(); ctx.shadowColor = PINK; ctx.shadowBlur = 25;
    ctx.beginPath(); ctx.roundRect(-116, -36, 232, 72, 10); ctx.fillStyle = PINK; ctx.fill(); ctx.restore();
    ctx.save(); ctx.rotate(Math.PI / 2); txt('8', 0, 0, 120, { rot: 0, col: CREAM }); ctx.restore();   // liegende Acht = unendlich
  }
  ctx.restore();
}
function drawFocusLines(alpha, t) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.beginPath();
  const fr = Math.floor(t * 15);
  for (let i = 0; i < 60; i++) {
    const a = i / 60 * Math.PI * 2 + rnd(i + fr) * 0.08, r0 = 560 + rnd(i * 3 + fr) * 260;
    ctx.moveTo(540 + Math.cos(a) * r0, 1100 + Math.sin(a) * r0); ctx.lineTo(540 + Math.cos(a) * 1500, 1100 + Math.sin(a) * 1500);
  }
  stroke(3); ctx.restore();
}
function drawBall(x, y, r, col, lw) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); FS(lw, col);
  ctx.beginPath(); ctx.arc(x - r * 1.05, y, r * 0.75, -0.9, 0.9); ctx.moveTo(x + r * 1.05 + Math.cos(Math.PI - 0.9) * r * 0.75, y + Math.sin(Math.PI - 0.9) * r * 0.75);
  ctx.arc(x + r * 1.05, y, r * 0.75, Math.PI - 0.9, Math.PI + 0.9); stroke(lw * 0.6, col);
}
function burst(x, y, r, col, lw, n = 12) {
  ctx.beginPath();
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; ctx.moveTo(x + Math.cos(a) * r * 0.45, y + Math.sin(a) * r * 0.45); ctx.lineTo(x + Math.cos(a) * r * (i % 2 ? 0.8 : 1), y + Math.sin(a) * r * (i % 2 ? 0.8 : 1)); }
  stroke(lw, col);
}

// ---------- scenes ----------
const HIT_PT = racketHead(heroAt(T.HIT));

function sceneMain(t) {
  const P = heroAt(t), cam = camAt(t);
  const k = seg(cam, 1500, 6500);
  const MID = '#f6b3d3';
  BG = k < 0.5 ? mix(CREAM, MID, k * 2) : mix(MID, DARK, (k - 0.5) * 2);
  LN = mix(INK, CREAM, seg(k, 0.6, 0.72));
  ctx.fillStyle = BG; ctx.fillRect(-200, -200, W + 400, H + 400);
  drawStars(seg(cam, 4000, 7000), t);
  const sunY = 330 + cam * 0.35;
  if (sunY < H + 300) drawSun(900, sunY - 40, t);
  // Hitze
  if (t < 5.4) {
    ctx.save(); ctx.globalAlpha = 0.35 * (1 - seg(t, 4.9, 5.4)); ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const y = 1480 - ((t * 140 + i * 130) % 900), x0 = 60 + rnd(i) * 700;
      for (let x = 0; x <= 260; x += 10) { const yy = y + Math.sin(x * 0.05 + t * 6 + i) * 12; x ? ctx.lineTo(x0 + x, yy) : ctx.moveTo(x0 + x, yy); }
    }
    stroke(4); ctx.restore();
  }
  if (cam < 1400) drawCourt(cam, true, t);
  // Wolken
  for (const [a, x, s] of [[1700, 220, 1.2], [2500, 820, 1.4], [3300, 300, 1.6], [4100, 760, 1.3], [5000, 260, 1.7], [5900, 800, 1.2]]) {
    const y = 1560 - a + cam; if (y > -300 && y < H + 300) drawCloud(x, y, s);
  }
  // Speedlines
  const v = (altAt(t) - altAt(t - 1 / 30)) * 30, I = clamp(v / 5000);
  if (I > 0.02) {
    ctx.save(); ctx.globalAlpha = 0.6 * I; ctx.beginPath();
    for (let i = 0; i < 26; i++) { const x = rnd(i) * W, l = 160 + rnd(i + 5) * 300, y = ((rnd(i + 9) * (H + 600) + t * 3200) % (H + 600)) - 300; ctx.moveTo(x, y); ctx.lineTo(x, y + l); }
    stroke(4); ctx.restore();
  }
  // Erde
  const earthTop = H + 300 - 950 * easeOut(seg(cam, 5500, 9200));
  if (earthTop < H + 60) drawEarth(earthTop, t);
  // Mond
  if (k > 0.6) { ctx.save(); ctx.globalAlpha = seg(k, 0.6, 0.9); ctx.beginPath(); ctx.arc(170, 820 + (9200 - cam) * 0.1, 60, 0, Math.PI * 2); FS(6); ctx.beginPath(); ctx.arc(150, 805 + (9200 - cam) * 0.1, 14, 0, Math.PI * 2); ctx.arc(195, 845 + (9200 - cam) * 0.1, 9, 0, Math.PI * 2); stroke(4); ctx.restore(); }
  // Fokuslinien beim Power-up
  drawFocusLines(t > 5.1 && t < 7.0 ? (1 - seg(t, 6.3, 7.0)) * 0.7 : 0, t);
  // Startrauch + pinke Flugbahn (eine durchgehende Linie)
  if (t >= T.LAUNCH) {
    const g = 1560 + cam, age = t - T.LAUNCH;
    if (g < H + 300) {
      ctx.save(); ctx.globalAlpha = 1 - seg(age, 0.8, 1.6);
      for (let i = 0; i < 9; i++) { const sg = i % 2 ? 1 : -1, x = 540 + sg * (40 + rnd(i) * 80 + age * 320 * rnd(i + 3)), r = 40 + age * 110 * (0.5 + rnd(i + 8)); ctx.beginPath(); ctx.arc(x, g - r * 0.5 - rnd(i + 2) * 30, r, 0, Math.PI * 2); FS(6); }
      ctx.restore();
    }
    ctx.save(); ctx.beginPath(); let started = false;
    for (let tt = T.LAUNCH; tt <= t; tt += 1 / 90) {
      const y = 1560 - altAt(tt) + cam + 30 * P.s, x = heroX(tt) + 14 * Math.sin(tt * 18);
      if (y < -200 || y > H + 400) { started = false; continue; }
      started ? ctx.lineTo(x, y) : ctx.moveTo(x, y); started = true;
    }
    ctx.shadowColor = PINK; ctx.shadowBlur = 20; stroke(9, PINK); ctx.restore();
  }
  // Power-Aura
  let aura = 0;
  if (t >= 5.1 && t < T.LAUNCH) aura = 0.85 + 0.15 * Math.sin(t * 40);
  else if (t >= T.LAUNCH) aura = 0.35 + (t > T.HIT - 0.3 && t < T.HIT + 0.3 ? 0.5 : 0);
  drawAura(P, aura, t);
  // Shaker fliegt ins Bild
  if (t >= 3.15 && t < 3.62) {
    const u = seg(t, 3.15, 3.62), Pc = heroAt(3.62), [ex, ey] = xf(Pc)(Pc.pose.Lx, Pc.pose.Ly);
    const x = lerp(-140, ex, u), y = lerp(820, ey, u) - 320 * Math.sin(Math.PI * u);
    ctx.save(); ctx.translate(x, y); ctx.scale(0.75, 0.75); drawBottle(0, 0, u * Math.PI * 4, 8); ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.6; ctx.beginPath(); for (let i = 1; i <= 3; i++) { ctx.moveTo(x - 60 - i * 40, y - 40 + i * 25); ctx.lineTo(x - 120 - i * 40, y - 40 + i * 25); } stroke(5, PINK); ctx.restore();
  }
  // Schweisstropfen
  if (P.melt > 0.4 && t < 4.6) {
    const [hx, hy] = xf(P)(18 * P.melt, -585 + 30 * P.melt);
    for (let i = 0; i < 3; i++) {
      const ph = (t * 1.3 + i / 3) % 1, sg = i % 2 ? 1 : -1;
      const x = hx + sg * (90 + ph * 140), y = hy - 80 - Math.sin(ph * Math.PI) * 120 + ph * 160;
      ctx.save(); ctx.globalAlpha = 1 - ph; ctx.beginPath(); ctx.moveTo(x, y - 26); ctx.quadraticCurveTo(x + 16, y, x, y + 10); ctx.quadraticCurveTo(x - 16, y, x, y - 26); FS(5); ctx.restore();
    }
  }
  drawPlayer(P);
  // Schluck-Spritzer
  if (t > 3.9 && t < 5.0) {
    const [mx, my] = xf(P)(10, -520);
    ctx.save(); ctx.beginPath();
    for (let i = 0; i < 5; i++) { const ph = (t * 2.5 + i / 5) % 1, x = mx + 40 + ph * 120 * (rnd(i) + .4), y = my - 20 - Math.sin(ph * Math.PI) * 80; ctx.moveTo(x + 6, y); ctx.arc(x, y, 6, 0, Math.PI * 2); }
    stroke(4, PINK); ctx.restore();
  }
  // Ball im All
  if (t >= T.ORBIT && t < T.HIT) {
    const u = seg(t, T.ORBIT, T.HIT), a = [880, 1950], c = [1000, 1000], b = HIT_PT;
    const x = (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], y = (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1];
    ctx.save(); ctx.globalAlpha = 0.6; ctx.beginPath(); for (let i = 1; i < 4; i++) { ctx.moveTo(x + i * 14, y + 40 + i * 30); ctx.lineTo(x + i * 20, y + 90 + i * 40); } stroke(4); ctx.restore();
    drawBall(x, y, 26 + 8 * u, LN, 6);
  }
  if (t >= T.HIT && t < T.CUT) {
    const u = easeIn(seg(t, T.HIT, T.CUT)), x = lerp(HIT_PT[0], 420, u), y = lerp(HIT_PT[1], 2250, u), r = 32 + 40 * u;
    ctx.save(); ctx.beginPath(); ctx.moveTo(HIT_PT[0], HIT_PT[1]);
    for (let i = 0; i <= 20; i++) { const q = i / 20, xx = lerp(HIT_PT[0], x, q) + Math.sin(q * 12 + t * 30) * 12 * q, yy = lerp(HIT_PT[1], y, q); ctx.lineTo(xx, yy); }
    ctx.shadowColor = PINK; ctx.shadowBlur = 30; stroke(14, PINK); ctx.restore();
    drawBall(x, y, r, PINK, 7);
  }
  if (t >= T.HIT && t < T.HIT + 0.35) {
    const u = seg(t, T.HIT, T.HIT + 0.35);
    ctx.save(); ctx.globalAlpha = 1 - u; burst(HIT_PT[0], HIT_PT[1], 90 + 160 * u, PINK, 8, 16); ctx.restore();
  }
}

function sceneImpact(t) {
  BG = CREAM; LN = INK;
  ctx.fillStyle = BG; ctx.fillRect(-200, -200, W + 400, H + 400);
  drawSun(900, 290, t);
  drawCourt(0, false, t);
  const hit = t >= T.IMPACT, ip = [330, 1540];
  if (hit) {
    ctx.beginPath(); ctx.ellipse(ip[0], ip[1], 180, 42, 0, 0, Math.PI * 2); FS(7);
    ctx.beginPath(); ctx.ellipse(ip[0], ip[1] + 6, 120, 24, 0, 0, Math.PI * 2); stroke(4);
    for (let i = 0; i < 6; i++) { const a = Math.PI + (i + 0.5) / 6 * Math.PI; ctx.beginPath(); ctx.moveTo(ip[0] + Math.cos(a) * 190, ip[1] + Math.sin(a) * 48); ctx.lineTo(ip[0] + Math.cos(a) * 240, ip[1] + Math.sin(a) * 70); stroke(5); }
    drawBall(ip[0], ip[1] - 30, 34, PINK, 7);
    ctx.save(); ctx.beginPath();
    for (let i = 0; i < 3; i++) { const x = ip[0] - 20 + i * 20; ctx.moveTo(x, ip[1] - 80); for (let y = 0; y < 140; y += 10) ctx.lineTo(x + Math.sin(y * 0.08 + t * 8 + i) * 10, ip[1] - 80 - y); }
    ctx.globalAlpha = 0.5; stroke(4); ctx.restore();
  }
  const opp = { x: 650, y: 1560, s: 0.92, melt: 0, style: HIM, t, racket: true, ground: true,
    pose: hit ? PZ.hang : PZ.shock, face: hit ? 'dazed' : 'shock', frizz: hit, rot: hit ? 0.06 * Math.sin(t * 6) : 0 };
  drawPlayer(opp);
  if (!hit) {
    const u = seg(t, T.CUT, T.IMPACT), x = lerp(60, ip[0], u), y = lerp(-200, ip[1] - 30, u);
    ctx.save(); ctx.beginPath(); ctx.moveTo(x - 200, y - 900); ctx.lineTo(x, y); ctx.shadowColor = PINK; ctx.shadowBlur = 30; stroke(16, PINK); ctx.restore();
    drawBall(x, y, 70, PINK, 8);
  } else {
    const age = t - T.IMPACT;
    ctx.save(); ctx.globalAlpha = 1 - seg(age, 0.3, 0.75);
    for (let i = 0; i < 10; i++) { const a = Math.PI + rnd(i) * Math.PI, d = 60 + age * 520 * (0.5 + rnd(i + 4)), r = 30 + age * 120 * rnd(i + 2); ctx.beginPath(); ctx.arc(ip[0] + Math.cos(a) * d, ip[1] + Math.sin(a) * d * 0.5 - age * 120, r, 0, Math.PI * 2); stroke(5); }
    ctx.beginPath();
    for (let i = 0; i < 12; i++) { const vx = (rnd(i + 20) - .5) * 1400, vy = -600 - rnd(i + 30) * 900, x = ip[0] + vx * age, y = ip[1] + vy * age + 2400 * age * age; ctx.moveTo(x, y); ctx.lineTo(x + 12, y - 10); }
    stroke(6); ctx.restore();
    const e = env(t, T.IMPACT + 0.05, T.END);
    if (e) { txt('ACE.', 470, 480, 330, { col: PINK, scale: e.s, alpha: e.a }); txt('?!', 860, 830, 150, { scale: e.s, rot: 0.15 }); }
  }
}

function drawLemniscate(cx, cy, a, prog, lw, col) {
  ctx.beginPath();
  const N = 160, end = Math.floor(N * prog);
  for (let i = 0; i <= end; i++) {
    const th = i / N * Math.PI * 2 - Math.PI / 2, den = 1 + Math.sin(th) ** 2;
    const x = cx + a * Math.cos(th) / den, y = cy + a * Math.sin(th) * Math.cos(th) / den;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  stroke(lw, col);
}
function sceneEnd(t) {
  const u = t - T.END;
  BG = DARK; LN = CREAM;
  ctx.fillStyle = BG; ctx.fillRect(-200, -200, W + 400, H + 400);
  const g = ctx.createRadialGradient(540, 880, 50, 540, 880, 800); g.addColorStop(0, 'rgba(255,20,137,0.28)'); g.addColorStop(1, 'rgba(255,20,137,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  drawStars(0.35, t);
  // Logo
  const lg = imgs.logo, ls = backOut(seg(u, 0.05, 0.35));
  if (ls > 0) { ctx.save(); ctx.translate(540, 330); ctx.scale(ls, ls); const w = 800, h = w * lg.height / lg.width; ctx.drawImage(lg, -w / 2, -h / 2, w, h); ctx.restore(); }
  // Mini-Heldin umkreist den Beutel
  const orbit = (back) => {
    if (u < 0.4) return;
    const w = (u - 0.4) * 2.4 + Math.PI * 0.95, s = Math.sin(w);
    if ((s < 0) !== back) return;
    const x = 540 + Math.cos(w) * 380, y = 890 + s * 110 + Math.sin(w * 2) * 40;
    const vx = -Math.sin(w) * 380, vy = Math.cos(w) * 110;
    const P = { x, y, s: 0.2 + 0.05 * s, melt: 0, pose: PZ.fly, face: 'fly', pony: 1.6, style: HER, t, bottle: true, racket: true, power: true, flame: 230, rot: Math.atan2(vy, vx) + Math.PI / 2 };
    ctx.save(); ctx.globalAlpha = back ? 0.6 : 1; drawPlayer(P); ctx.restore();
  };
  orbit(true);
  const bg = imgs.bag, bs = backOut(seg(u, 0.15, 0.5));
  if (bs > 0) { ctx.save(); ctx.translate(540, 890 + Math.sin(t * 2.2) * 10); ctx.rotate(-0.04); ctx.scale(bs, bs); const h = 760, w = h * bg.width / bg.height; ctx.drawImage(bg, -w / 2, -h / 2, w, h); ctx.restore(); }
  orbit(false);
  const e1 = env(t, T.END + 0.5, 99);
  if (e1) txt('KEIN ENDE IN SICHT.', 540, 1350, 128, { col: CREAM, scale: e1.s });
  if (u > 0.75) drawLemniscate(540, 1440, 120, easeInOut(seg(u, 0.75, 1.6)), 7, PINK);
  const e2 = env(t, T.END + 1.2, 99);
  if (e2) txt('PinkBerry Match Drink · Tennis & Padel', 540, 1525, 40, { col: CREAM, scale: e2.s, rot: 0, font: '700', fam: 'MR' });
  const e3 = env(t, T.END + 1.5, 99);
  if (e3) {
    ctx.save(); ctx.translate(540, 1610); ctx.scale(e3.s, e3.s);
    ctx.beginPath(); ctx.roundRect(-170, -42, 340, 84, 42); ctx.fillStyle = PINK; ctx.fill();
    txt('ever8te.de', 0, 2, 46, { col: CREAM, rot: 0, font: '800', fam: 'MR' }); ctx.restore();
  }
}

function overlays(t) {
  // Texte in den Hauptszenen
  if (t < T.CUT) {
    let e;
    if (e = env(t, 0.05, 3.2)) txt('SATZ 3.', 440, 370, 190, { scale: e.s, alpha: e.a });
    if (e = env(t, 0.45, 3.2)) txt('38 °C IM SCHATTEN.', 470, 505, 84, { scale: e.s, alpha: e.a });
    if (e = env(t, 0.9, 3.2)) drawBattery(470, 640, 'low', t, e.s * (e.a > 0 ? 1 : 0));
    [[4.0, 'GLUCK!', 250, 1050, -0.2], [4.33, 'GLUCK!!', 820, 960, 0.15], [4.66, 'GLUCK!!!', 300, 860, -0.1]].forEach(([t0, s, x, y, r]) => {
      const q = env(t, t0, 5.05); if (q) txt(s, x, y, 96, { col: PINK, scale: q.s, alpha: q.a, rot: r });
    });
    if (e = env(t, 5.2, 6.85)) {
      const j = (rnd(Math.floor(t * 30)) - .5) * 8;
      ctx.save(); ctx.shadowColor = PINK; ctx.shadowBlur = 30;
      txt('PINKBERRY', 540 + j, 350, 200, { col: PINK, scale: e.s, alpha: e.a }); ctx.restore();
      txt('MODE', 540 - j, 510, 150, { scale: e.s, alpha: e.a });
    }
    if (e = env(t, 5.3, 6.85)) drawBattery(540, 660, 'full', t, e.s * 0.9);
    [['3', 6.88], ['2', 7.12], ['1', 7.36]].forEach(([s, t0]) => { const q = env(t, t0, t0 + 0.24); if (q) txt(s, 540, 480, 300, { scale: q.s }); });
    if (e = env(t, T.LAUNCH, 8.55)) { ctx.save(); ctx.shadowColor = PINK; ctx.shadowBlur = 30; txt('ABFLUG!', 540, 420, 230, { col: PINK, scale: e.s, alpha: e.a }); ctx.restore(); }
    if (e = env(t, 8.65, 9.95)) { txt('HOUSTON,', 540, 350, 130, { scale: e.s, alpha: e.a }); txt('WIR HABEN MATCHBALL.', 540, 480, 96, { scale: e.s, alpha: e.a }); }
    if (e = env(t, 10.05, T.CUT)) { txt('SMASH AUS', 540, 330, 120, { scale: e.s, alpha: e.a }); txt('DER UMLAUFBAHN.', 540, 450, 120, { col: PINK, scale: e.s, alpha: e.a }); }
    if (e = env(t, T.HIT, T.HIT + 0.33)) txt('POCK!', 820, 760, 120, { col: PINK, scale: e.s, rot: 0.2 });
  }
}

function draw(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  let shake = 0;
  if (t > 5.15 && t < 6.0) shake = 12 * (1 - seg(t, 5.15, 6.0));
  if (t > T.LAUNCH && t < T.LAUNCH + 0.9) shake = Math.max(shake, 22 * (1 - seg(t, T.LAUNCH, T.LAUNCH + 0.9)));
  if (t > T.IMPACT && t < T.IMPACT + 0.6) shake = Math.max(shake, 32 * (1 - seg(t, T.IMPACT, T.IMPACT + 0.6)));
  const fr = Math.floor(t * 30);
  ctx.save(); ctx.translate((rnd(fr) - .5) * shake * 2, (rnd(fr + 99) - .5) * shake * 2);
  if (t < T.CUT) sceneMain(t); else if (t < T.END) sceneImpact(t); else sceneEnd(t);
  overlays(t);
  ctx.restore();
  // Blitze
  const flash = (t0, d, a, col) => { if (t >= t0 && t < t0 + d) { ctx.save(); ctx.globalAlpha = a * (1 - seg(t, t0, t0 + d)); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); } };
  flash(5.1, 0.35, 0.55, PINK); flash(T.LAUNCH, 0.3, 0.6, CREAM); flash(T.HIT, 0.14, 0.4, PINK); flash(T.IMPACT, 0.4, 0.85, PINK);
  // Wischer zur Endcard
  if (t > T.END - 0.2 && t < T.END + 0.2) {
    const x = lerp(-1900, 2300, seg(t, T.END - 0.2, T.END + 0.2));
    ctx.save(); ctx.beginPath(); ctx.moveTo(x - 1300, 0); ctx.lineTo(x + 900, 0); ctx.lineTo(x + 300, H); ctx.lineTo(x - 1900, H); ctx.closePath(); ctx.fillStyle = PINK; ctx.fill(); ctx.restore();
  }
}
window.draw = draw;
