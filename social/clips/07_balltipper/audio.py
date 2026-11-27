# Tonspur Clip 7 (Der Balltipper) – synthetisch, lizenzfrei
import numpy as np, wave
SR = 44100; DUR = 15.9
L = np.zeros(int(SR * DUR)); rng = np.random.default_rng(7)
B, C, D, E, F, HIT, G, H, END = 2.6, 5.0, 5.6, 8.2, 9.1, 9.6, 10.4, 11.7, 12.9

def add(t0, sig, g=1.0):
    i = int(t0 * SR); n = min(len(sig), len(L) - i)
    if n > 0: L[i:i + n] += sig[:n] * g
def tt(d): return np.arange(int(d * SR)) / SR
def envl(d, a=0.005, r=None):
    x = tt(d); e = np.minimum(1, x / a)
    return e * (np.exp(-x / r) if r else np.ones_like(x))
def sweep(f0, f1, d):
    x = tt(d); f = f0 * (f1 / f0) ** (x / d); return np.sin(2 * np.pi * np.cumsum(f) / SR)
def noise(d): return rng.standard_normal(int(d * SR))
def lp(x, k):
    y = np.zeros_like(x); a = 0.0
    for i in range(len(x)): a += k * (x[i] - a); y[i] = a
    return y
def pock(t0, g=0.8): add(t0, (np.sin(2 * np.pi * 1100 * tt(0.08)) + 0.6 * noise(0.08)) * envl(0.08, r=0.02), g)
def tip(t0, g): add(t0, (sweep(260, 120, 0.09) + 0.3 * lp(noise(0.09), 0.3)) * envl(0.09, r=0.025), g)
def kick(): return sweep(150, 45, 0.18) * envl(0.18, r=0.06)
def hat(): return (noise(0.04) - lp(noise(0.04), 0.5)) * envl(0.04, r=0.01)
def beat(start, stop, bpm, g):
    b = 60 / bpm; t = start
    while t < stop - 0.05: add(t, kick(), g); add(t + b / 2, hat(), g * 0.45); t += b

# Tipp-Zeitpunkte exakt wie in clip.js (phiAt)
SEGS = [(0.3, B, 0.3), (B, C, 0.08), (C, 8.4, (8.4 - C) / (47 - 7.6667 - 30))]
def t_of_phi(p):
    for a, b, per in SEGS:
        n = (b - a) / per
        if p <= n: return a + p * per
        p -= n
    return None
closeup = lambda t: t < B or (C <= t < D) or (E <= t < F)
for k in range(47):
    t = t_of_phi(k + 0.5)
    if t is not None: tip(t, 0.9 if closeup(t) else 0.3)
tip(11.15 + 0.15, 0.9)          # er fängt wieder an: Tipp #1
# Wartemusik: gelangweilte Fahrstuhl-Melodie während B (vorgespult = höher)
for i, f in enumerate([392, 330, 349, 294, 392, 330, 262, 294]):
    add(0.2 + i * 0.3, np.sin(2 * np.pi * f * tt(0.25)) * envl(0.25, r=0.1), 0.12)
for i, f in enumerate([784, 659, 698, 587] * 6):
    add(B + i * 0.1, np.sin(2 * np.pi * f * tt(0.09)) * envl(0.09, r=0.04), 0.1)
for k in np.arange(B, C, 0.05): add(k, noise(0.008) * envl(0.008, r=0.003), 0.15)   # Vorspul-Rattern
x = tt(1.1); add(3.3, lp(2 * ((x * np.linspace(220, 140, len(x))) % 1) - 1, 0.07) * np.sin(np.pi * x / 1.1), 0.9)  # Gähnen
add(C, sweep(500, 380, 0.5) * envl(0.5, r=0.25), 0.15)   # "immer noch"
# Shaker greifen + GLUCK
add(5.75, lp(noise(0.2), 0.3) * np.sin(np.pi * tt(0.2) / 0.2), 0.5)
for g in [5.95, 6.25]: add(g, sweep(420, 140, 0.16) * envl(0.16, r=0.08), 0.6)
# Power-up
add(6.8, sweep(60, 30, 0.6) * envl(0.6, r=0.2), 0.8)
for i, f in enumerate([784, 988, 1175, 1568]): add(6.85 + i * 0.06, np.sin(2 * np.pi * f * tt(0.4)) * envl(0.4, r=0.15), 0.15)
beat(6.8, E, 132, 0.45)
# Tipp #47: Pling, Ballwurf, Aufschlag
add(8.45, sweep(900, 1800, 0.25) * envl(0.25, r=0.12), 0.15)
pock(9.0, 0.9); add(9.0, lp(noise(0.25), 0.2) * np.linspace(1, 0, int(0.25 * SR)), 0.5)
# Return: Pock + Whoosh + Einschlag
pock(HIT, 1.0); add(HIT + 0.02, lp(noise(0.4), 0.15) * np.linspace(1, 0, int(0.4 * SR)), 0.8)
add(G, lp(noise(0.25), 0.25) * np.linspace(0.2, 1, int(0.25 * SR)), 0.9)
add(10.62, sweep(120, 40, 0.4) * envl(0.4, r=0.15), 0.9)
add(10.75, sweep(600, 300, 0.25) * envl(0.25, r=0.1), 0.25)   # *schluck*
# Ich hab Zeit: entspannter Beat + Schlürfen
beat(H, END, 96, 0.35)
add(12.0, lp(noise(0.6), 0.12) * np.sin(np.pi * tt(0.6) / 0.6), 0.5)
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
