// EVER8TE TikTok – "Satz 3, 38 Grad" – One-Line-Art mit pinken Akzenten
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const W = 1080, H = 1920;
let T = { LAUNCH: 7.6, ORBIT: 10.0, HIT: 10.62, CUT: 10.95, IMPACT: 11.08, END: 11.85, DUR: 14.8 };
window.DUR = T.DUR;
const PINK = '#ff1489', PINK2 = '#ff6db4', INK = '#1a1014', CREAM = '#f4efe8', DARK = '#15101a';
let BG = CREAM, LN = INK, BLVL = 0.46;

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
let KF = [[0, 'hang'], [3.38, 'hang'], [3.62, 'reach'], [3.85, 'drink'], [4.15, 'drink2'], [4.3, 'drink'], [4.5, 'drink2'],
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
  if (BLVL > 0.01) { ctx.beginPath(); ctx.roundRect(-30, 84 - 160 * BLVL, 60, 160 * BLVL, 12); ctx.fillStyle = 'rgba(255,20,137,0.22)'; ctx.fill(); }
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
  } else if (f === 'tired') {
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sg * 62, 0); ctx.quadraticCurveTo(sg * 40, 4, sg * 18, 8); stroke(lw * 0.9); ctx.beginPath(); ctx.arc(sg * 38, 12, 6, 0, Math.PI); ctx.fillStyle = LN; ctx.fill(); }
    ctx.beginPath(); ctx.ellipse(0, 58, 22, 14 + 8 * Math.sin(t * 9), 0, 0, Math.PI * 2); FS(lw * 0.8);
  } else if (f === 'scream') {
    pinkEyes();
    ctx.beginPath(); ctx.ellipse(0, 62, 38, 48 + 6 * Math.sin(t * 50), 0, 0, Math.PI * 2); FS(lw * 0.8);
    ctx.beginPath(); ctx.moveTo(-28, 36); ctx.lineTo(28, 36); stroke(lw * 0.4);
  } else if (f === 'calm') {
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sg * 58, 0); ctx.lineTo(sg * 20, 0); stroke(lw * 0.9); ctx.beginPath(); ctx.arc(sg * 38, 4, 7, 0, Math.PI); ctx.fillStyle = LN; ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(-16, 56); ctx.lineTo(16, 56); stroke(lw * 0.8);
  } else if (f === 'smug') {
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sg * 58, 4); ctx.quadraticCurveTo(sg * 38, -14, sg * 18, 4); stroke(lw * 0.9); }
    ctx.beginPath(); ctx.moveTo(22, -44); ctx.quadraticCurveTo(40, -60, 60, -46); stroke(lw * 0.7);
    ctx.beginPath(); ctx.moveTo(-24, 50); ctx.quadraticCurveTo(10, 66, 34, 42); stroke(lw * 0.9);
  } else if (f === 'nervous') {
    for (const sg of [-1, 1]) {
      ctx.beginPath(); ctx.arc(sg * 40, eyeY, 24, 0, Math.PI * 2); FS(lw * 0.7);
      ctx.beginPath(); ctx.arc(sg * 40 + (rnd(Math.floor(t * 30) + sg) - .5) * 8, eyeY - 6, 5, 0, Math.PI * 2); ctx.fillStyle = LN; ctx.fill();
      ctx.beginPath(); ctx.moveTo(sg * 62, -40); ctx.lineTo(sg * 20, -56); stroke(lw * 0.7);
    }
    ctx.beginPath(); ctx.moveTo(-28, 60); for (let x = -21; x <= 28; x += 7) ctx.lineTo(x, 60 + (((x + 28) / 7) % 2 ? 6 : -6)); stroke(lw * 0.7);
  } else if (f === 'happy') {
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sg * 58, 6); ctx.quadraticCurveTo(sg * 38, -16, sg * 18, 6); stroke(lw * 0.9); }
    ctx.beginPath(); ctx.moveTo(-36, 42); ctx.quadraticCurveTo(0, 92, 36, 42); ctx.closePath(); FS(lw * 0.8);
  } else if (f === 'side' || f === 'sneaky') {
    const dx = f === 'side' ? 13 : -13;
    for (const sg of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(sg * 40 - 24, f === 'sneaky' ? -2 - sg * 4 : -2); ctx.lineTo(sg * 40 + 24, f === 'sneaky' ? -2 + sg * 4 : -2); stroke(lw * 0.9);
      ctx.beginPath(); ctx.arc(sg * 40 + dx, 0, 8, 0, Math.PI); ctx.fillStyle = LN; ctx.fill();
    }
    ctx.beginPath(); if (f === 'side') { ctx.moveTo(-18, 58); ctx.lineTo(20, 54); } else { ctx.moveTo(-26, 52); ctx.quadraticCurveTo(0, 62, 28, 44); } stroke(lw * 0.8);
  } else if (f === 'whistle' || f === 'straw') {
    for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sg * 58, 0); ctx.quadraticCurveTo(sg * 38, 14, sg * 18, 0); stroke(lw * 0.9); }
    if (f === 'whistle') { ctx.beginPath(); ctx.moveTo(-50, 26); ctx.quadraticCurveTo(0, 46, 50, 26); stroke(lw * 1.5, PINK); }
    ctx.beginPath(); ctx.arc(8, 58, 11, 0, Math.PI * 2); FS(lw * 0.8);
  } else if (f === 'puppy') {
    for (const sg of [-1, 1]) {
      ctx.beginPath(); ctx.arc(sg * 40, 4, 30, 0, Math.PI * 2); FS(lw * 0.7);
      ctx.beginPath(); ctx.arc(sg * 40, 8, 20, 0, Math.PI * 2); ctx.fillStyle = LN; ctx.fill();
      ctx.beginPath(); ctx.arc(sg * 40 - 7, 0, 7, 0, Math.PI * 2); ctx.arc(sg * 40 + 8, 15, 3.5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(sg * 62, -36); ctx.lineTo(sg * 20, -48); stroke(lw * 0.7);
    }
    ctx.beginPath(); ctx.moveTo(-16, 60); ctx.quadraticCurveTo(0, 50, 16, 60); stroke(lw * 0.8);
  } else if (f === 'angry') {
    for (const sg of [-1, 1]) {
      ctx.beginPath(); ctx.arc(sg * 40, 6, 8, 0, Math.PI * 2); ctx.fillStyle = LN; ctx.fill();
      ctx.beginPath(); ctx.moveTo(sg * 66, -34); ctx.lineTo(sg * 16, -14); stroke(lw * 1.2);
    }
    ctx.beginPath(); ctx.roundRect(-34, 42, 68, 26, 8); FS(lw * 0.8);
    ctx.beginPath(); for (let i = -22; i <= 22; i += 11) { ctx.moveTo(i, 42); ctx.lineTo(i, 68); } stroke(lw * 0.4);
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
  } else if (st.hair === 'spiky') { drawSpiky(P, lw); } else if (!P.frizz) {
    ctx.beginPath(); ctx.arc(0, -4, 110, Math.PI + 0.15, Math.PI * 2 - 0.15);
    for (let i = 0; i <= 6; i++) { const x = 95 - i * 32; ctx.lineTo(x, -40 - (i % 2) * 22); } ctx.closePath(); FS(lw);
  }
  drawFace(P, lw);
  ctx.restore();
  // arms
  if (P.racket) (st.padel ? drawPadel : drawRacket)(po.Rx, po.Ry, po.rAng, lw, P.racketPink ? PINK : LN);
  limb(82, shY, po.Rx, po.Ry, 108, 1, 28, lw);
  if (P.bottle) drawBottle(po.Lx, po.Ly, po.bAng, lw);
  limb(-82, shY, po.Lx, po.Ly, 108, -1, 28, lw);
  for (const [x, y] of [[po.Rx, po.Ry], [po.Lx, po.Ly]]) { ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); FS(lw); }
  if (st.sleeves) for (const sg of [-1, 1]) { ctx.beginPath(); ctx.arc(sg * 84, shY + 10, 32, 0, Math.PI * 2); FS(lw); }
  ctx.restore();
}
function drawAura(P, I, t, sz = 1) {
  if (I <= 0) return;
  const [cx, cy] = xf(P)(0, -330);
  const s = P.s * sz;
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


// ================= Clip 2: Anime-Power-up auf dem Padel-Court =================
T = { DRINK: 2.4, S1: 3.95, S2: 4.9, EYE: 5.9, S8: 6.6, OPP: 7.7, LOB: 8.4, CUT2: 9.6, LAND: 10.2, SHRUG: 11.2, END: 12.2, DUR: 15.2 };
window.DUR = T.DUR;
const HERO = { hair: 'spiky', chest: true, bottom: 'shorts', sleeves: false, padel: true };
const OPPA = { hair: 'pony', chest: false, bottom: 'skirt', padel: true };
const OPPB = { hair: 'short', chest: false, bottom: 'shorts', sleeves: false, padel: true };
Object.assign(PZ, {
  power2: { Lx: -170, Ly: -290, Rx: 175, Ry: -290, rAng: 2.5, bAng: 0.2, drop: 30, fs: 100 },
  scream: { Lx: -228, Ly: -560, Rx: 228, Ry: -560, rAng: 0.6, bAng: -0.3, drop: 30, fs: 112 },
  ready2: { Lx: -110, Ly: -300, Rx: 110, Ry: -300, rAng: 0.4, bAng: 0.2, drop: 15, fs: 80 },
  low:    { Lx: -120, Ly: -280, Rx: 170, Ry: -210, rAng: 2.4, bAng: 0.2, drop: 25, fs: 85 },
  lob:    { Lx: -130, Ly: -300, Rx: 110, Ry: -560, rAng: 0.25, bAng: 0.2, drop: 0, fs: 70 },
  shrug:  { Lx: -215, Ly: -400, Rx: 215, Ry: -400, rAng: 0.6, bAng: 0.3, drop: 0, fs: 62 },
});
KF = [[0, 'hang'], [2.62, 'hang'], [2.85, 'reach'], [3.05, 'drink'], [3.2, 'drink2'], [3.32, 'drink'], [3.45, 'drink2'], [3.57, 'drink'],
  [3.7, 'drink2'], [3.82, 'drink2'], [4.05, 'flex'], [4.9, 'flex'], [5.15, 'power2'], [6.6, 'power2'], [6.8, 'scream'], [7.7, 'scream'],
  [T.LOB, 'ready2'], [8.8, 'ready2'], [9.0, 'low'], [9.2, 'lob'], [T.SHRUG, 'lob'], [T.SHRUG + 0.25, 'shrug'], [99, 'shrug']];
function meltAt(t) { if (t < 3.6) return 0.4 + 0.04 * Math.sin(t * 5); return 0.4 * (1 - elastic(seg(t, 3.6, 4.3))); }
function heroAt(t) {
  let face = 'tired', spike = 0.05, hairPink = false, power = false;
  if (t >= 3.0) face = 'drink';
  if (t >= 3.9) { face = 'power'; power = true; spike = lerp(0.05, 0.2, seg(t, 3.95, 4.1)); }
  if (t >= T.S2) { spike = lerp(0.2, 0.65, easeOut(seg(t, T.S2, T.S2 + 0.4))); hairPink = true; }
  if (t >= T.S8) { face = 'scream'; spike = lerp(0.65, 1.0, easeOut(seg(t, T.S8, T.S8 + 0.3))); }
  if (t >= T.LOB) { face = 'calm'; spike = 0.05; hairPink = false; power = false; }
  if (t >= T.SHRUG) face = 'smug';
  let x = 540;
  if (t >= T.S8 && t < T.OPP) x += (rnd(Math.floor(t * 30)) - .5) * 10;
  return { x, y: 1560, s: 1, melt: meltAt(t), pose: poseAt(t), face, spike, hairPink, power, style: HERO, t,
    bottle: t >= 2.85, racket: true, ground: true };
}
function drawSpiky(P, lw) {
  const sp = P.spike || 0, col = P.hairPink ? PINK : LN, N = 7, R = 106, a0 = Math.PI + 0.12, a1 = 2 * Math.PI - 0.12;
  ctx.save();
  if (P.hairPink) { ctx.shadowColor = PINK; ctx.shadowBlur = 28; }
  ctx.beginPath(); ctx.moveTo(Math.cos(a0) * R, Math.sin(a0) * R + 6);
  for (let i = 0; i < N; i++) {
    const aa = lerp(a0, a1, i / N), ab = lerp(a0, a1, (i + 1) / N), am = (aa + ab) / 2;
    const td = lerp(am, Math.PI * 1.5, 0.55 * sp) + (P.hairPink ? 0.06 * Math.sin(P.t * 25 + i) : 0);
    const tr = R + 40 + sp * (110 + 70 * rnd(i + 1));
    ctx.lineTo(Math.cos(td) * tr, Math.sin(td) * tr);
    ctx.lineTo(Math.cos(ab) * R, Math.sin(ab) * R + (i === N - 1 ? 6 : 0));
  }
  ctx.quadraticCurveTo(60, -30, 0, -52); ctx.quadraticCurveTo(-60, -30, Math.cos(a0) * R, Math.sin(a0) * R + 6);
  ctx.closePath(); FS(lw, col);
  ctx.restore();
}
function drawPadel(hx, hy, ang, lw, col) {
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang);
  tube(0, 24, 0, -70, 16, lw, col);
  ctx.beginPath(); ctx.moveTo(0, -62);
  ctx.bezierCurveTo(-30, -70, -72, -100, -72, -160); ctx.bezierCurveTo(-72, -232, -40, -262, 0, -262);
  ctx.bezierCurveTo(40, -262, 72, -232, 72, -160); ctx.bezierCurveTo(72, -100, 30, -70, 0, -62); ctx.closePath(); FS(lw * 1.1, col);
  ctx.beginPath();
  for (let y = -236; y <= -100; y += 26) for (let x = -52; x <= 52; x += 26) {
    const xx = x + ((y / 26) % 2 ? 13 : 0);
    if ((xx / 58) ** 2 + ((y + 165) / 82) ** 2 < 1) { ctx.moveTo(xx + 6, y); ctx.arc(xx, y, 6, 0, Math.PI * 2); }
  }
  stroke(lw * 0.4, col);
  ctx.restore();
}

// ---------- Padel-Court ----------
const PC = { fy: 1000, ny: 1780, fl: 230, fr: 850, nl: -300, nr: 1380, top: 760 };
const psx = (y, side) => { const k = (y - PC.fy) / (PC.ny - PC.fy); return side < 0 ? lerp(PC.fl, PC.nl, k) : lerp(PC.fr, PC.nr, k); };
function drawPadelCourt(o = {}) {
  const t = o.t || 0;
  drawCloud(160, 650, 0.6); drawCloud(930, 610, 0.5);
  // Rückwand aus Glas + Gitter
  ctx.beginPath(); ctx.rect(PC.fl, PC.top, PC.fr - PC.fl, PC.fy - PC.top); FS(6);
  ctx.beginPath(); for (let i = 1; i < 4; i++) { const x = lerp(PC.fl, PC.fr, i / 4); ctx.moveTo(x, PC.top); ctx.lineTo(x, PC.fy); } stroke(4);
  ctx.save(); ctx.globalAlpha = 0.3; ctx.beginPath();
  for (let x = PC.fl; x <= PC.fr; x += 24) { ctx.moveTo(x, 600); ctx.lineTo(x, PC.top); }
  for (let y = 600; y < PC.top; y += 24) { ctx.moveTo(PC.fl, y); ctx.lineTo(PC.fr, y); }
  stroke(2); ctx.restore();
  ctx.beginPath(); ctx.moveTo(PC.fl, 600); ctx.lineTo(PC.fr, 600); ctx.moveTo(PC.fl, 600); ctx.lineTo(PC.fl, PC.top); ctx.moveTo(PC.fr, 600); ctx.lineTo(PC.fr, PC.top); stroke(5);
  ctx.save(); ctx.globalAlpha = 0.35; ctx.beginPath();
  for (const [x, y] of [[270, 790], [490, 800], [700, 785]]) { ctx.moveTo(x, y + 60); ctx.lineTo(x + 50, y); ctx.moveTo(x + 22, y + 80); ctx.lineTo(x + 72, y + 20); }
  stroke(3); ctx.restore();
  ctx.beginPath(); ctx.roundRect(370, 845, 340, 80, 10); FS(5); txt('EVER8TE', 540, 887, 64, { rot: 0, outline: 3 });
  // Seitenwände
  for (const sd of [-1, 1]) {
    const fx = sd < 0 ? PC.fl : PC.fr, nx = sd < 0 ? PC.nl : PC.nr;
    ctx.beginPath(); ctx.moveTo(fx, PC.fy); ctx.lineTo(fx, PC.top); ctx.lineTo(nx, 1130); stroke(6);
    ctx.beginPath();
    for (let i = 1; i < 4; i++) { const k = i / 4, yb = lerp(PC.fy, PC.ny, k), xb = psx(yb, sd); ctx.moveTo(xb, yb); ctx.lineTo(lerp(fx, nx, k), lerp(PC.top, 1130, k)); }
    stroke(4);
    ctx.save(); ctx.globalAlpha = 0.3; ctx.beginPath();
    for (const k of [0.15, 0.55]) { const x = lerp(fx, nx, k + 0.08), y = lerp(PC.top, 1130, k + 0.08) + 40; ctx.moveTo(x, y + 70); ctx.lineTo(x + sd * -40, y); }
    stroke(3); ctx.restore();
  }
  // Bodenlinien
  ctx.beginPath();
  ctx.moveTo(PC.fl, PC.fy); ctx.lineTo(PC.nl, PC.ny); ctx.moveTo(PC.fr, PC.fy); ctx.lineTo(PC.nr, PC.ny);
  for (const y of [1090, 1400]) { ctx.moveTo(psx(y, -1), y); ctx.lineTo(psx(y, 1), y); }
  ctx.moveTo(540, 1090); ctx.lineTo(540, 1400);
  stroke(5);
  ctx.save(); ctx.globalAlpha = 0.25; ctx.beginPath();
  for (let i = 0; i < 40; i++) { const x = rnd(i) * W, y = 1010 + rnd(i + 40) * 880; ctx.moveTo(x, y); ctx.lineTo(x + 3, y - 12); ctx.moveTo(x + 9, y); ctx.lineTo(x + 10, y - 10); }
  stroke(3); ctx.restore();
  if (o.opps) for (const [st, x] of [[OPPA, 450], [OPPB, 640]])
    drawPlayer({ x, y: 1078, s: 0.17, melt: 0, pose: PZ.ready, face: o.oppFace || 'normal', pony: 1.3, style: st, t, racket: true, ground: true });
  const ny = 1170, nl = psx(ny, -1), nr = psx(ny, 1);
  ctx.beginPath(); ctx.rect(nl, ny - 70, nr - nl, 70); ctx.fillStyle = BG; ctx.save(); ctx.globalAlpha = 0.55; ctx.fill(); ctx.restore();
  ctx.save(); ctx.globalAlpha = 0.35; ctx.beginPath();
  for (let x = nl; x < nr; x += 26) { ctx.moveTo(x, ny - 70); ctx.lineTo(x, ny); }
  for (let y = ny - 56; y < ny; y += 16) { ctx.moveTo(nl, y); ctx.lineTo(nr, y); }
  stroke(2); ctx.restore();
  ctx.beginPath(); ctx.moveTo(nl, ny - 72); ctx.lineTo(nr, ny - 72); stroke(9);
  ctx.beginPath(); ctx.moveTo(nl, ny); ctx.lineTo(nl, ny - 90); ctx.moveTo(nr, ny); ctx.lineTo(nr, ny - 90); ctx.moveTo(nl, ny); ctx.lineTo(nr, ny); stroke(6);
}

// ---------- Effekte ----------
function cracks(cx, cy, len) {
  if (len <= 0) return;
  ctx.beginPath();
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2 + 0.3; ctx.moveTo(cx, cy);
    for (let j = 1; j <= 6; j++) { const r = len * j / 6, aa = a + (rnd(i * 10 + j) - .5) * 0.6; ctx.lineTo(cx + Math.cos(aa) * r * 1.4, cy + Math.sin(aa) * r * 0.3); }
  }
  stroke(5);
}
function rocks(t, t0) {
  const age = t - t0;
  for (let i = 0; i < 12; i++) {
    const x = 540 + (rnd(i) - .5) * 820 + Math.sin(t * 2 + i) * 10, y = 1540 - rnd(i + 3) * 60 - age * (60 + rnd(i + 5) * 150);
    const r = 10 + rnd(i + 7) * 22, rot = age * (rnd(i + 9) - .5) * 4;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
    for (let j = 0; j < 6; j++) { const a = j / 6 * Math.PI * 2, rr = r * (0.7 + 0.5 * rnd(i * 6 + j)); j ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    ctx.closePath(); FS(5); ctx.restore();
  }
}
function pillar(t) {
  ctx.save(); const w = 230 + 10 * Math.sin(t * 40);
  ctx.fillStyle = 'rgba(255,20,137,0.13)'; ctx.fillRect(540 - w, -200, w * 2, 1760);
  ctx.shadowColor = PINK; ctx.shadowBlur = 30;
  ctx.beginPath(); ctx.moveTo(540 - w, -200); ctx.lineTo(540 - w, 1560); ctx.moveTo(540 + w, -200); ctx.lineTo(540 + w, 1560); stroke(7, PINK);
  ctx.beginPath();
  for (let i = 0; i < 14; i++) { const x = 540 + (rnd(i) - .5) * w * 1.8, y = ((rnd(i + 4) * 1900 - t * 2600) % 1900 + 1900) % 1900 - 200, l = 120 + rnd(i + 8) * 200; ctx.moveTo(x, y); ctx.lineTo(x, y + l); }
  stroke(4, PINK2); ctx.restore();
}
function bolts(t) {
  const fr = Math.floor(t * 12);
  ctx.save(); ctx.shadowColor = PINK; ctx.shadowBlur = 20; ctx.beginPath();
  for (let b = 0; b < 3; b++) {
    const sd = b % 2 ? 1 : -1; let x = 540 + sd * (280 + rnd(fr * 3 + b) * 180), y = -40; ctx.moveTo(x, y);
    for (let j = 0; j < 7; j++) { x += (rnd(fr * 30 + b * 8 + j) - .5) * 120; y += 110 + rnd(j + b) * 50; ctx.lineTo(x, y); }
  }
  stroke(6, PINK); ctx.restore();
}
function star4(x, y, r, col) {
  ctx.beginPath(); ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 25; stroke(6, col); ctx.restore();
}
function glassCrack(x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + 0.2; ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5 + 6); ctx.lineTo(x + Math.cos(a + 0.1) * r, y + Math.sin(a + 0.1) * r); }
  ctx.moveTo(x + r * 0.35, y); ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
  stroke(4);
}


// ================= Clip 5: Der Doppelpartner =================
T = { B: 2.0, C: 3.6, D: 4.8, E: 6.6, F: 8.2, G: 10.0, END: 11.8, DUR: 14.8 };
window.DUR = T.DUR;
const HERP = { hair: 'pony', chest: true, bottom: 'skirt', padel: true };
const BX = 540, BTOP = 1450, BOTTLE_Y = 1378, BSC = 0.8;
const XH = 340, XP = 740, YB = 1640, SB = 0.85;
const P5 = {
  stand:  { Lx: -118, Ly: -255, Rx: 122, Ry: -255, rAng: 2.75, bAng: 0.2, drop: 0, fs: 62 },
  hPlace: { Lx: -118, Ly: -255, Rx: 235, Ry: -308, rAng: 2.75, bAng: 0.2, drop: 0, fs: 62 },
  hHold:  { Lx: -118, Ly: -255, Rx: 110, Ry: -470, rAng: 2.75, bAng: 0.2, drop: 0, fs: 62 },
  towel:  { Lx: -80, Ly: -610, Rx: 80, Ry: -610, rAng: 2.75, bAng: 0.2, drop: 0, fs: 62 },
  cross:  { Lx: 70, Ly: -370, Rx: -70, Ry: -385, rAng: 2.75, bAng: 0.2, drop: 0, fs: 70 },
  wind:   { Lx: -118, Ly: -280, Rx: -150, Ry: -470, rAng: 2.75, bAng: 0.2, drop: 10, fs: 70 },
  throw:  { Lx: -118, Ly: -280, Rx: 170, Ry: -600, rAng: 2.75, bAng: 0.2, drop: 0, fs: 70 },
  pReach: { Lx: -235, Ly: -308, Rx: 122, Ry: -255, rAng: 2.75, bAng: 0.2, drop: 0, fs: 62 },
  pDrink: { Lx: -128, Ly: -585, Rx: 122, Ry: -262, rAng: 2.65, bAng: 2.1, drop: 0, fs: 62 },
  pDrink2:{ Lx: -118, Ly: -600, Rx: 122, Ry: -262, rAng: 2.65, bAng: 2.6, drop: 0, fs: 62 },
  puppy:  { Lx: -34, Ly: -500, Rx: 34, Ry: -500, rAng: 2.75, bAng: 0.2, drop: 0, fs: 62 },
  straw:  { Lx: -70, Ly: -520, Rx: 122, Ry: -255, rAng: 2.75, bAng: 0.2, drop: 0, fs: 62 },
  hug:    { Lx: -70, Ly: -400, Rx: 70, Ry: -400, rAng: 2.75, bAng: 0.2, drop: 0, fs: 62 },
  ready:  { Lx: -110, Ly: -300, Rx: 120, Ry: -300, rAng: 0.5, bAng: 0.2, drop: 15, fs: 82 },
  wind2:  { Lx: -112, Ly: -300, Rx: 150, Ry: -600, rAng: -2.3, bAng: 0.15, drop: 0, fs: 40 },
  hit2:   { Lx: -112, Ly: -300, Rx: 110, Ry: -650, rAng: 0.15, bAng: 0.15, drop: 0, fs: 40 },
  follow2:{ Lx: -112, Ly: -300, Rx: 40, Ry: -330, rAng: 2.6, bAng: 0.15, drop: 0, fs: 40 },
};
function poseFrom(list, t) {
  for (let i = 0; i < list.length - 1; i++) {
    const [t0, a] = list[i], [t1, b] = list[i + 1];
    if (t >= t0 && t <= t1) { const k = easeInOut(seg(t, t0, t1)); const A = P5[a], B = P5[b], o = {}; for (const f in A) o[f] = lerp(A[f], B[f], k); return o; }
  }
  return { ...P5[list[list.length - 1][1]] };
}
const KH = [[0, 'hHold'], [0.3, 'hHold'], [0.7, 'hPlace'], [1.05, 'stand'], [1.4, 'stand'], [1.8, 'towel'], [T.C, 'towel'], [3.78, 'stand'], [3.95, 'hPlace'], [4.2, 'hHold'], [T.D, 'hHold'],
  [T.E, 'cross'], [T.G, 'cross'], [10.15, 'wind'], [10.3, 'throw'], [10.6, 'stand'], [99, 'stand']];
const KP = [[0, 'stand'], [T.B, 'stand'], [2.25, 'pReach'], [2.45, 'pDrink'], [2.6, 'pDrink2'], [2.72, 'pDrink'], [2.85, 'pDrink2'], [3.05, 'pDrink'], [3.3, 'pReach'], [3.55, 'stand'], [T.D, 'stand'],
  [T.E, 'puppy'], [T.F, 'puppy'], [8.35, 'straw'], [T.G, 'straw'], [10.5, 'straw'], [10.7, 'hug'], [99, 'hug']];
function herAt(t) {
  let face = 'normal';
  if (t >= T.C + 0.6) face = 'side';
  if (t >= T.E) face = 'smug';
  if (t >= 8.95 && t < T.G) face = t < 9.25 ? 'shock' : 'angry';
  let pose = poseFrom(KH, t);
  if (t >= 1.8 && t < T.C) { const w = Math.sin(t * 9) * 25; pose.Lx += w; pose.Rx += w; }
  return { x: XH, y: YB, s: SB, melt: 0, pose, face, pony: 1.25 + 0.1 * Math.sin(t * 4), style: HERP, t, racket: false, ground: true };
}
function himAt(t) {
  let face = 'normal';
  if (t >= 1.0) face = 'sneaky';
  if (t >= 2.45 && t < 3.1) face = 'drink';
  if (t >= T.C) face = 'whistle';
  if (t >= T.E) face = 'puppy';
  if (t >= 8.35) face = 'straw';
  if (t >= 10.65) face = 'happy';
  const x = XP - 30 * Math.sin(Math.PI * seg(t, 2.0, 3.55));
  return { x, y: YB, s: SB, melt: 0, pose: poseFrom(KP, t), face, style: HERO, spike: 0.15, t, racket: false, ground: true, bottle: t >= 2.25 && t < 3.3, stache: t >= T.C && t < T.D };
}
function levelAt(t) {
  if (t < 2.5) return 0.7;
  if (t < T.E) return lerp(0.7, 0.12, seg(t, 2.5, 3.05));
  if (t < 8.6) return 0.7;
  return lerp(0.7, 0.04, seg(t, 8.6, 9.7));
}

// ---------- Requisiten ----------
function bottleWorld(x, y, ang, sc) { ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); drawBottle(0, 0, ang, Math.max(7, 2.4 / sc)); ctx.restore(); }
function drawBench() {
  ctx.beginPath(); ctx.roundRect(BX - 190, BTOP, 380, 34, 8); FS(7);
  ctx.beginPath(); ctx.moveTo(BX - 170, BTOP + 34); ctx.lineTo(BX - 160, YB); ctx.moveTo(BX + 170, BTOP + 34); ctx.lineTo(BX + 160, YB);
  ctx.moveTo(BX - 150, BTOP + 34); ctx.lineTo(BX - 140, YB); ctx.moveTo(BX + 150, BTOP + 34); ctx.lineTo(BX + 140, YB); stroke(7);
  ctx.save(); ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(BX - 180, BTOP + 17); ctx.lineTo(BX + 180, BTOP + 17); stroke(3); ctx.restore();
}
function drawChain(t) {
  const cy = BOTTLE_Y + 10;
  ctx.save();
  for (let i = 0; i <= 22; i++) {
    const u = i / 22, x = lerp(BX - 175, BX + 175, u), y = cy + Math.sin(u * Math.PI * 2) * 40 + (u - 0.5) * 60;
    ctx.beginPath(); ctx.ellipse(x, y, 12, 8, i % 2 ? 0.3 : -0.3, 0, Math.PI * 2); stroke(5);
  }
  ctx.beginPath(); ctx.arc(BX, BTOP - 40, 22, Math.PI, 0); stroke(7);
  ctx.beginPath(); ctx.roundRect(BX - 32, BTOP - 42, 64, 52, 8); FS(7);
  ctx.beginPath(); ctx.arc(BX, BTOP - 20, 6, 0, Math.PI * 2); ctx.moveTo(BX, BTOP - 14); ctx.lineTo(BX, BTOP - 2); stroke(4);
  ctx.save(); ctx.translate(BX + 4, BOTTLE_Y - 30); ctx.rotate(-0.08);
  ctx.beginPath(); ctx.rect(-50, -24, 100, 48); FS(5); txt('MEINS.', 0, 2, 40, { rot: 0 }); ctx.restore();
  ctx.restore();
}
function drawHeart(x, y, r, col) {
  ctx.beginPath(); ctx.moveTo(x, y + r * 0.9);
  ctx.bezierCurveTo(x - r * 1.4, y - r * 0.1, x - r * 0.7, y - r * 1.1, x, y - r * 0.35);
  ctx.bezierCurveTo(x + r * 0.7, y - r * 1.1, x + r * 1.4, y - r * 0.1, x, y + r * 0.9);
  ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 15; stroke(6, col); ctx.restore();
}
function drawNote(x, y, sc) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.beginPath(); ctx.ellipse(0, 0, 15, 10, -0.4, 0, Math.PI * 2); ctx.fillStyle = LN; ctx.fill();
  ctx.beginPath(); ctx.moveTo(13, -4); ctx.lineTo(13, -64); ctx.quadraticCurveTo(40, -50, 34, -24); stroke(5);
  ctx.restore();
}
function mouthWorld(P) { return xf(P)(0, -535); }
function drawStraw(t) {
  const P = himAt(t), [mx, my] = mouthWorld(P), cap = [BX, BOTTLE_Y - 118 * BSC], grow = easeOut(seg(t, T.F, 8.6));
  const pts = []; const N = 80;
  for (let i = 0; i <= N; i++) {
    const u = i / N, a = 1 - u;
    const c1 = [960, 760], c2 = [180, 760];
    pts.push([a * a * a * mx + 3 * a * a * u * c1[0] + 3 * a * u * u * c2[0] + u * u * u * cap[0], a * a * a * my + 3 * a * a * u * c1[1] + 3 * a * u * u * c2[1] + u * u * u * cap[1]]);
  }
  const n = Math.max(2, Math.floor(N * grow));
  ctx.beginPath(); pts.slice(0, n + 1).forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = LN; ctx.lineWidth = 22; ctx.stroke(); ctx.strokeStyle = BG; ctx.lineWidth = 9; ctx.stroke();
  if (t > 8.6 && t < 9.8) {
    ctx.beginPath();
    for (let k = 0; k < 7; k++) { const ph = 1 - ((t * 1.4 + k / 7) % 1), p = pts[Math.floor(ph * N)]; ctx.moveTo(p[0] + 5, p[1]); ctx.arc(p[0], p[1], 5, 0, Math.PI * 2); }
    ctx.fillStyle = PINK; ctx.fill();
  }
}

// ---------- Szenen ----------
function sceneBench(t) {
  BG = CREAM; LN = INK; ctx.fillStyle = BG; ctx.fillRect(-200, -200, W + 400, H + 400);
  drawPadelCourt({ t });
  const H5 = herAt(t), M5 = himAt(t);
  BLVL = levelAt(t);
  drawPlayer(H5); drawPlayer(M5);
  // Handtuch
  if (t >= 1.5 && t < 3.85) {
    const a = t < 1.8 ? seg(t, 1.5, 1.8) : 1 - seg(t, 3.6, 3.85), po = H5.pose;
    const [lx, ly] = xf(H5)(po.Lx, po.Ly), [rx, ry] = xf(H5)(po.Rx, po.Ry);
    ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.moveTo(lx - 20, ly - 20); ctx.lineTo(rx + 20, ry - 20);
    ctx.quadraticCurveTo(rx + 40, ry + 120, rx + 10, ry + 210); ctx.quadraticCurveTo((lx + rx) / 2, ry + 240, lx - 10, ly + 210); ctx.quadraticCurveTo(lx - 40, ly + 120, lx - 20, ly - 20); ctx.closePath(); FS(7);
    ctx.beginPath(); for (const k of [0.3, 0.55, 0.8]) { const x = lerp(lx, rx, k); ctx.moveTo(x, ly + 10); ctx.quadraticCurveTo(x + 12, ly + 120, x - 4, ly + 210); } stroke(3);
    ctx.restore();
    for (const [x, y] of [[lx, ly], [rx, ry]]) { ctx.beginPath(); ctx.arc(x, y, 24 * SB, 0, Math.PI * 2); FS(6); }
  }
  // Shaker in ihrer Hand / auf der Bank
  const hb = t < 0.7 || (t >= 3.95 && t < T.D);
  if (hb) { const [x, y] = xf(H5)(H5.pose.Rx, H5.pose.Ry); bottleWorld(x, y, t >= 3.95 && t < 4.35 ? 0.3 * Math.sin(t * 40) : 0, BSC); ctx.beginPath(); ctx.arc(x, y, 24 * SB, 0, Math.PI * 2); FS(6); }
  drawBench();
  const onBench = (t >= 0.7 && t < 2.25) || (t >= 3.3 && t < 3.95) || t >= T.E;
  if (onBench) bottleWorld(BX, BOTTLE_Y, 0, BSC);
  if (t >= T.E && t < T.G + 0.1) drawChain(t);
  if (t >= T.F && t < T.G) drawStraw(t);
  // Whistle-Noten + pinker Bart
  if (t >= T.C && t < T.D) {
    const [mx, my] = mouthWorld(M5);
    for (let i = 0; i < 3; i++) { const ph = (t * 0.9 + i / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - ph; drawNote(mx + 60 + ph * 120 + Math.sin(ph * 9) * 15, my - 40 - ph * 220, 1.1); ctx.restore(); }
  }
  // Fragezeichen + Dampf
  if (t >= 4.2 && t < T.D) { const [hx, hy] = xf(H5)(0, -760); txt('?', hx, hy, 130, { scale: backOut(seg(t, 4.2, 4.4)), rot: 0.1 }); }
  if (t >= 9.2 && t < T.G) {
    const [hx, hy] = xf(H5)(0, -700);
    for (let i = 0; i < 4; i++) { const ph = (t * 2 + i / 4) % 1, sd = i % 2 ? 1 : -1; ctx.save(); ctx.globalAlpha = 1 - ph; ctx.beginPath(); ctx.arc(hx + sd * (80 + ph * 60), hy - ph * 130, 16 + ph * 26, 0, Math.PI * 2); stroke(5); ctx.restore(); }
  }
  // Beutel-Wurf + Herzen
  if (t >= 10.3) {
    const u = seg(t, 10.3, 10.72), [sx, sy] = xf(herAt(10.3))(P5.throw.Rx, P5.throw.Ry), [ex, ey] = xf(himAt(10.75))(0, -330);
    const x = lerp(sx, ex, easeOut(u)), y = lerp(sy, ey, u) - 260 * Math.sin(Math.PI * u), rot = u < 1 ? u * Math.PI * 2 : 0;
    const bg = imgs.bag, h = 230, w = h * bg.width / bg.height;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot - (u >= 1 ? 0.1 : 0)); ctx.drawImage(bg, -w / 2, -h / 2, w, h); ctx.restore();
    if (u >= 1) for (let i = 0; i < 5; i++) { const ph = ((t - 10.72) * 0.9 + i / 5) % 1; ctx.save(); ctx.globalAlpha = 1 - ph; drawHeart(ex + (rnd(i) - .5) * 300, ey - 260 - ph * 260, 26 + 10 * rnd(i + 2), PINK); ctx.restore(); }
  }
}
function sceneCourt5(t) {
  BG = CREAM; LN = INK; ctx.fillStyle = BG; ctx.fillRect(-200, -200, W + 400, H + 400);
  drawPadelCourt({ opps: true, t, oppFace: 'shock' });
  const ph = ((t - T.D) / 0.6) % 1, n = Math.floor((t - T.D) / 0.6);
  const seq = [[0, 'wind2'], [0.35, 'hit2'], [0.45, 'follow2'], [1, 'wind2']];
  const M5 = { x: 770, y: 1600 - 150 * Math.sin(Math.PI * ph), s: 0.8, melt: 0, pose: poseFrom(seq, ph), face: ph < 0.45 && ph > 0.3 ? 'smash' : 'power',
    style: HERO, spike: 0.75, hairPink: true, power: true, t, racket: true, ground: false };
  ctx.beginPath(); ctx.ellipse(770, 1604, 90 * (1 - 0.4 * Math.sin(Math.PI * ph)), 12, 0, 0, Math.PI * 2); ctx.save(); ctx.globalAlpha = 0.5; stroke(5); ctx.restore();
  drawAura(M5, 0.75, t, 0.9);
  const H5 = { x: 300, y: 1600, s: 0.8, melt: 0, pose: P5.ready, face: 'side', pony: 1.25, style: HERP, t, racket: true, ground: true };
  drawPlayer(H5); drawPlayer(M5);
  const hitT = T.D + n * 0.6 + 0.6 * 0.4, cp = racketHead({ ...M5, y: 1600 - 150 * Math.sin(Math.PI * 0.4), pose: poseFrom(seq, 0.4) });
  if (t < hitT && t > hitT - 0.3) { const u = seg(t, hitT - 0.3, hitT); drawBall(lerp(540, cp[0], u), lerp(1040, cp[1], u) - 120 * Math.sin(Math.PI * u), lerp(8, 22, u), LN, 5); }
  for (const h of [hitT, hitT - 0.6]) if (t >= h && t < h + 0.25) {
    const u = seg(t, h, h + 0.25), to = [400 + rnd(n) * 280, 1050], x = lerp(cp[0], to[0], u), y = lerp(cp[1], to[1], u);
    ctx.save(); ctx.beginPath(); ctx.moveTo(cp[0], cp[1]); ctx.lineTo(x, y); ctx.shadowColor = PINK; ctx.shadowBlur = 20; stroke(9, PINK); ctx.restore();
    drawBall(x, y, lerp(22, 8, u), PINK, 5);
    if (u < 0.5) { ctx.save(); ctx.globalAlpha = 1 - u * 2; burst(cp[0], cp[1], 70, PINK, 5, 12); ctx.restore(); }
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
  if (e2) txt('PinkBerry Match Drink · Padel & Tennis', 540, 1525, 40, { col: CREAM, scale: e2.s, rot: 0, font: '700', fam: 'MR' });
  const e3 = env(t, T.END + 1.5, 99);
  if (e3) {
    ctx.save(); ctx.translate(540, 1610); ctx.scale(e3.s, e3.s);
    ctx.beginPath(); ctx.roundRect(-170, -42, 340, 84, 42); ctx.fillStyle = PINK; ctx.fill();
    txt('ever8te.de', 0, 2, 46, { col: CREAM, rot: 0, font: '800', fam: 'MR' }); ctx.restore();
  }
}


function overlays(t) {
  let e;
  const pinkTxt = (s, x, y, sz, q, o = {}) => { ctx.save(); ctx.shadowColor = PINK; ctx.shadowBlur = 25; txt(s, x, y, sz, { col: PINK, scale: q.s, alpha: q.a, ...o }); ctx.restore(); };
  if (e = env(t, 0.05, T.B)) txt('MEIN DOPPELPARTNER', 540, 330, 118, { scale: e.s, alpha: e.a });
  if (e = env(t, 0.35, T.B)) txt('beim Seitenwechsel:', 540, 450, 84, { scale: e.s, alpha: e.a });
  if (e = env(t, T.B + 0.05, T.C)) txt('*wischt sich kurz den Schweiß ab*', 540, 400, 64, { scale: e.s, alpha: e.a, font: 'italic 800' });
  [[2.5, 'GLUCK!', 900, 900, 0.15], [2.75, 'GLUCK!!', 880, 790, -0.1]].forEach(([t0, s, x, y, r]) => { const q = env(t, t0, 3.2); if (q) txt(s, x, y, 80, { col: PINK, scale: q.s, alpha: q.a, rot: r }); });
  if (e = env(t, T.C + 0.6, T.D)) txt('Hmm.', 540, 380, 190, { scale: e.s, alpha: e.a });
  if (e = env(t, T.D + 0.05, T.E)) txt('Danach spielt er plötzlich', 540, 330, 80, { scale: e.s, alpha: e.a });
  if (e = env(t, T.D + 0.3, T.E)) pinkTxt('WIE EIN WELTMEISTER.', 540, 450, 118, e);
  if (e = env(t, T.E + 0.05, T.F)) txt('Seitenwechsel 2:', 540, 330, 84, { scale: e.s, alpha: e.a });
  if (e = env(t, T.E + 0.3, T.F)) txt('SICHER IST SICHER.', 540, 450, 130, { scale: e.s, alpha: e.a });
  if (e = env(t, 8.6, T.G)) pinkTxt('*schlüüürf*', 540, 400, 140, e, { font: 'italic 900' });
  if (e = env(t, 9.0, T.G)) txt('?!', 220, 860, 140, { scale: e.s, alpha: e.a, rot: -0.15 });
  if (e = env(t, T.G + 0.05, T.END)) txt('KAUF DIR', 540, 330, 150, { scale: e.s, alpha: e.a });
  if (e = env(t, T.G + 0.3, T.END)) pinkTxt('DEINEN EIGENEN.', 540, 470, 130, e);
}
function draw(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  let shake = 0;
  if (t >= T.D && t < T.E) shake = 4;
  if (t >= 8.95 && t < 9.3) shake = 10;
  const fr = Math.floor(t * 30);
  ctx.save(); ctx.translate((rnd(fr) - .5) * shake * 2, (rnd(fr + 99) - .5) * shake * 2);
  if (t < T.D) sceneBench(t);
  else if (t < T.E) sceneCourt5(t);
  else if (t < T.END) sceneBench(t);
  else sceneEnd(t);
  overlays(t);
  ctx.restore();
  const flash = (t0, d, a, col) => { if (t >= t0 && t < t0 + d) { ctx.save(); ctx.globalAlpha = a * (1 - seg(t, t0, t0 + d)); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); } };
  flash(T.D, 0.3, 0.55, PINK);
  if (t > T.END - 0.2 && t < T.END + 0.2) {
    const x = lerp(-1900, 2300, seg(t, T.END - 0.2, T.END + 0.2));
    ctx.save(); ctx.beginPath(); ctx.moveTo(x - 1300, 0); ctx.lineTo(x + 900, 0); ctx.lineTo(x + 300, H); ctx.lineTo(x - 1900, H); ctx.closePath(); ctx.fillStyle = PINK; ctx.fill(); ctx.restore();
  }
}
window.draw = draw;
