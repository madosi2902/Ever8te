# Tonspur Clip 4 (Ich vs. Ballmaschine) – synthetisch, lizenzfrei
import numpy as np, wave
SR = 44100; DUR = 15.8
L = np.zeros(int(SR * DUR)); rng = np.random.default_rng(4)
H1, M2, H2, H3, M3, H4, M4, F, END = 1.6, 3.2, 4.0, 5.55, 6.6, 7.4, 9.6, 11.4, 12.8

def add(t0, sig, g=1.0):
    i = int(t0 * SR); n = min(len(sig), len(L) - i)
    if n > 0 and i >= 0: L[i:i + n] += sig[:n] * g
def tt(d): return np.arange(int(d * SR)) / SR
def envl(d, a=0.005, r=None):
    x = tt(d); e = np.minimum(1, x / a)
    return e * (np.exp(-x / r) if r else np.ones_like(x))
def sweep(f0, f1, d, kind='sin'):
    x = tt(d); f = f0 * (f1 / f0) ** (x / d); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) if kind == 'sin' else np.sign(np.sin(ph))
def noise(d): return rng.standard_normal(int(d * SR))
def lp(x, k):
    y = np.zeros_like(x); a = 0.0
    for i in range(len(x)): a += k * (x[i] - a); y[i] = a
    return y
def pock(t0, g=0.8, f=1100): add(t0, (np.sin(2 * np.pi * f * tt(0.08)) + 0.6 * noise(0.08)) * envl(0.08, r=0.02), g)
def plopp(t0, g=0.7): add(t0, sweep(180, 90, 0.12) * envl(0.12, r=0.05), g); add(t0, lp(noise(0.08), 0.3) * envl(0.08, r=0.02), g * 0.6)
def kick(): return sweep(150, 45, 0.18) * envl(0.18, r=0.06)
def hat(): return (noise(0.04) - lp(noise(0.04), 0.5)) * envl(0.04, r=0.01)
def beat(start, stop, bpm, g):
    b = 60 / bpm; t = start
    while t < stop - 0.05: add(t, kick(), g); add(t + b / 2, hat(), g * 0.45); t += b
def ratchet(t0, t1, rate=18):
    for k in np.arange(t0, t1, 1 / rate): add(k, noise(0.012) * envl(0.012, r=0.004), 0.5)

# Tempo 1: Maschine plopp, entspannter Beat
plopp(0.9)
beat(H1, M2, 100, 0.35)
for h in [2.05, 2.75]: add(h - 0.5, sweep(160, 90, 0.1) * envl(0.1, r=0.04), 0.4); pock(h)
# Maschine dreht auf
ratchet(M2 + 0.15, M2 + 0.6); add(M2 + 0.6, sweep(200, 600, 0.2, 'sq') * envl(0.2) * 0.06)
# Tempo 6: drei Bälle, Ausweichen, BONK
beat(H2, H3, 128, 0.4)
for p in [4.0, 4.5, 4.8]: plopp(p, 0.4)
pock(4.3); add(4.55, lp(noise(0.4), 0.25) * np.sin(np.pi * tt(0.4) / 0.4), 0.8)
add(5.08, (sweep(900, 250, 0.18) + 0.5 * noise(0.18) * envl(0.18, r=0.02)) * envl(0.18, r=0.08), 1.0)   # BONK
for c in np.arange(5.15, 5.6, 0.12): add(c, sweep(3000, 3800, 0.06) * envl(0.06, r=0.03), 0.12)     # Vögelchen
# Shaker + GLUCK
add(H3, lp(noise(0.3), 0.08) * np.sin(np.pi * tt(0.3) / 0.3), 1.4)
add(5.85, sweep(900, 400, 0.06) * envl(0.06), 0.3)
for g in [6.0, 6.25]: add(g, sweep(420, 140, 0.16) * envl(0.16, r=0.08), 0.6)
# Maschine dreht voll auf
ratchet(M3 + 0.1, M3 + 0.4, 26); add(M3 + 0.4, sweep(300, 1200, 0.4, 'sq') * envl(0.4) * 0.07)
for p in [6.95, 7.1, 7.25]: plopp(p, 0.5)
# Tempo 8: Power-Sting, schneller Beat, Dauer-TOCK
add(H4, sweep(60, 30, 0.6) * envl(0.6, r=0.2), 0.8)
for i, f in enumerate([784, 988, 1175, 1568]): add(H4 + 0.03 + i * 0.05, np.sin(2 * np.pi * f * tt(0.35)) * envl(0.35, r=0.12), 0.14)
beat(H4, M4, 160, 0.5)
h = H4 + 0.4 / 6
while h < M4 - 0.15: pock(h, 0.55, 1100 + 200 * ((round((h - H4) / 0.2)) % 2)); plopp(h - 0.28, 0.25); h += 0.2
# Überhitzung: Alarm, Zischen, Popcorn, Kollaps, Feder, trauriges Wah-wah
for k in np.arange(M4, 10.7, 0.25): add(k, np.sin(2 * np.pi * 1400 * tt(0.1)) * envl(0.1), 0.15)
x = tt(1.2); hiss = noise(1.2); hiss = hiss - lp(hiss, 0.5); add(9.7, hiss * np.minimum(1, x / 0.4) * 0.25)
for i in range(10): add(10.0 + i * 0.07, sweep(700, 300, 0.05) * envl(0.05, r=0.015), 0.35)
add(10.6, sweep(90, 30, 0.6) * envl(0.6, r=0.25), 1.0); add(10.6, lp(noise(0.5), 0.2) * envl(0.5, r=0.15), 0.9)
x = tt(0.6); add(10.85, np.sin(2 * np.pi * np.cumsum(260 + 200 * np.sin(2 * np.pi * 9 * x) * np.exp(-x * 4)) / SR) * envl(0.6, r=0.3), 0.4)
for i, f in enumerate([233, 220, 208, 196]):
    d = 0.22 if i < 3 else 0.6; x = tt(d); s = lp(2 * ((x * f * (1 + 0.01 * np.sin(2 * np.pi * 6 * x))) % 1) - 1, 0.15)
    add(10.95 + i * 0.22, s * envl(d, a=0.02, r=d * 0.7), 0.7)
# Finale: entspanntes Schlürfen
for s0 in [11.6, 12.2]: add(s0, lp(noise(0.25), 0.2) * np.sin(np.pi * tt(0.25) / 0.25), 0.5)
# Endcard
x = tt(3.0); chord = sum(np.sin(2 * np.pi * f * x) for f in [523.25, 659.25, 783.99, 1046.5]) / 4
add(END, chord * envl(3.0, a=0.02, r=1.4), 0.45)
beat(END, DUR, 128, 0.3)
L = np.tanh(L * 1.3) * 0.85
fl = int(0.4 * SR); L[-fl:] *= np.linspace(1, 0, fl)
pcm = (L * 32767).astype(np.int16)
with wave.open('audio.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(np.column_stack([pcm, pcm]).ravel().tobytes())
print('ok')
