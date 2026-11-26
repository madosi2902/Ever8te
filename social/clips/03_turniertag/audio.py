# Tonspur Clip 3 (POV Turniertag) – synthetisch, lizenzfrei
import numpy as np, wave
SR = 44100; DUR = 15.8
L = np.zeros(int(SR * DUR)); rng = np.random.default_rng(3)
CLK1, B, C1, C2, D, CLK2, E, END = 3.0, 3.5, 6.9, 7.8, 8.5, 10.9, 11.4, 12.8

def add(t0, sig, g=1.0):
    i = int(t0 * SR); n = min(len(sig), len(L) - i)
    if n > 0: L[i:i + n] += sig[:n] * g
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
def pock(t0, g=0.8): add(t0, (np.sin(2 * np.pi * 1100 * tt(0.08)) + 0.6 * noise(0.08)) * envl(0.08, r=0.02), g)
def kick(): return sweep(150, 45, 0.18) * envl(0.18, r=0.06)
def hat(): return (noise(0.04) - lp(noise(0.04), 0.5)) * envl(0.04, r=0.01)
def beat(start, stop, bpm, g):
    b = 60 / bpm; t = start
    while t < stop - 0.05: add(t, kick(), g); add(t + b / 2, hat(), g * 0.45); t += b

# Match 1: Vogelzwitschern + fröhlicher Beat + zwei Vorhände
for c in [0.1, 0.35, 1.2, 1.45, 2.4]: add(c, sweep(3200, 4200, 0.09) * envl(0.09, r=0.04), 0.12); add(c + 0.11, sweep(3600, 2900, 0.07) * envl(0.07, r=0.03), 0.1)
beat(0.0, CLK1, 118, 0.4)
pock(0.85); pock(2.05)
for i, f in enumerate([523, 659, 784]): add(2.3 + i * 0.08, np.sin(2 * np.pi * f * tt(0.3)) * envl(0.3, r=0.12), 0.2)   # Sieg-Pling
# Uhr: Ticken + Whoosh
for cs, ce in [(CLK1, B), (CLK2, E)]:
    add(cs, lp(noise(ce - cs), 0.1) * np.sin(np.pi * tt(ce - cs) / (ce - cs)), 1.2)
    for k in np.arange(cs, ce, 0.06): add(k, noise(0.01) * envl(0.01, r=0.003), 0.35)
# Match 2: Hitze-Drone, Fliegensummen, Zombie-Stöhnen, Whiff
x = tt(C1 - B); add(B, 0.16 * np.sin(2 * np.pi * 55 * x) * (1 + 0.3 * np.sin(2 * np.pi * 0.7 * x)))
buzz = 2 * ((x * (210 + 15 * np.sin(2 * np.pi * 3 * x))) % 1) - 1; add(B, buzz * (0.5 + 0.5 * np.sin(2 * np.pi * 1.4 * x)) * 0.035)
x = tt(1.0); moan = 2 * ((x * np.linspace(130, 90, len(x))) % 1) - 1
moan = lp(moan, 0.08) * (1 + 0.4 * np.sin(2 * np.pi * 5 * x)) * np.sin(np.pi * x / 1.0); add(4.2, moan, 1.2)
add(5.35, lp(noise(0.3), 0.3) * np.sin(np.pi * tt(0.3) / 0.3), 0.7)
add(5.6, sweep(400, 200, 0.4) * envl(0.4, r=0.2), 0.15)   # trauriges "dwoo"
# Shaker-Rasseln
for k in np.arange(C1 + 0.05, C2 - 0.05, 1 / 7.2):
    s = noise(0.07); s = s - lp(s, 0.25); add(k, s * envl(0.07, r=0.025), 0.9)
    add(k, sweep(2600, 1800, 0.03) * envl(0.03), 0.08)
# GLUCK x2
for g in [8.0, 8.2]: add(g, sweep(420, 140, 0.16) * envl(0.16, r=0.08), 0.6)
# Comeback: Boing + Power-Chime + Beat
x = tt(0.6); add(8.45, np.sin(2 * np.pi * np.cumsum(180 + 220 * np.sin(2 * np.pi * 7 * x) * np.exp(-x * 4)) / SR) * envl(0.6, r=0.3), 0.4)
add(D, sweep(60, 30, 0.6) * envl(0.6, r=0.2), 0.8)
for i, f in enumerate([784, 988, 1175, 1568]): add(D + 0.05 + i * 0.06, np.sin(2 * np.pi * f * tt(0.4)) * envl(0.4, r=0.15), 0.15)
beat(D, CLK2, 132, 0.5)
pock(9.7, 1.0); add(9.72, lp(noise(0.35), 0.15) * np.linspace(1, 0, int(0.35 * SR)), 0.8)
for k in np.arange(9.95, 10.65, 0.12): add(k, np.sin(2 * np.pi * 1500 * tt(0.04)) * envl(0.04), 0.15)   # Punktzähler
for i, f in enumerate([523, 659, 784, 1047]): add(10.62 + i * 0.07, np.sin(2 * np.pi * f * tt(0.35)) * envl(0.35, r=0.15), 0.18)
# Match 3?: "dun dun DUN"
for k, f, d in [(E + 0.15, 110, 0.25), (E + 0.45, 104, 0.25), (E + 0.8, 82, 0.9)]:
    x = tt(d); s = 2 * ((x * f) % 1) - 1; add(k, lp(s, 0.1) * envl(d, r=d * 0.6), 1.2); add(k, sweep(70, 40, d) * envl(d, r=d * 0.5), 0.6)
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
