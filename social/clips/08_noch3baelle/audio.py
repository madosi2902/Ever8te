# Tonspur Clip 8 (Noch 3 Bälle) – synthetisch, lizenzfrei
import numpy as np, wave
SR = 44100; DUR = 15.9
L = np.zeros(int(SR * DUR)); rng = np.random.default_rng(8)
B, C, D, E, F, H, END = 2.5, 5.0, 5.6, 8.0, 10.8, 11.75, 12.9

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
def kick(): return sweep(150, 45, 0.18) * envl(0.18, r=0.06)
def hat(): return (noise(0.04) - lp(noise(0.04), 0.5)) * envl(0.04, r=0.01)
def beat(start, stop, bpm, g):
    b = 60 / bpm; t = start
    while t < stop - 0.05: add(t, kick(), g); add(t + b / 2, hat(), g * 0.45); t += b
def whistle(t0, d, g=0.25):
    x = tt(d); f = 2400 + 120 * np.sin(2 * np.pi * 28 * x)
    add(t0, np.sin(2 * np.pi * np.cumsum(f) / SR) * envl(d, a=0.01) * np.minimum(1, (d - x) / 0.03), g)

# A: Trainerpfiff + fröhliches Zupfen
whistle(0.15, 0.5)
for i, f in enumerate([523, 659, 784, 659, 523, 659, 784, 1046]):
    add(0.7 + i * 0.22, np.sin(2 * np.pi * f * tt(0.2)) * envl(0.2, r=0.08), 0.12)
# B: Schläge (wie clip.js: Start 2.6, Periode 0.9, Treffer bei u=0.5)
for k in range(2): pock(2.6 + k * 0.9 + 0.45, 0.8)
for k in np.arange(3.4, C, 0.06): add(k, noise(0.008) * envl(0.008, r=0.003), 0.15)   # Vorspul-Rattern
for i in range(30): pock(3.4 + 1.6 * (i / 30) ** 0.6, 0.18)                            # Bälle im Zeitraffer
x = tt(1.0); add(4.0, lp(2 * ((x * np.linspace(220, 130, len(x))) % 1) - 1, 0.07) * np.sin(np.pi * x / 1.0), 0.8)  # Ächzen
# C: Pfiff „Letzte 3!“
whistle(C + 0.02, 0.35, 0.22)
# D: Shaker + GLUCK + Power-up
add(5.7, lp(noise(0.2), 0.3) * np.sin(np.pi * tt(0.2) / 0.2), 0.5)
for g in [5.95, 6.25]: add(g, sweep(420, 140, 0.16) * envl(0.16, r=0.08), 0.6)
add(6.8, sweep(60, 30, 0.6) * envl(0.6, r=0.2), 0.8)
for i, f in enumerate([784, 988, 1175, 1568]): add(6.85 + i * 0.06, np.sin(2 * np.pi * f * tt(0.4)) * envl(0.4, r=0.15), 0.15)
beat(6.8, E, 132, 0.45)
# E: Ball-Gewitter, schneller Beat, Pocks
beat(E, 9.95, 150, 0.5)
t = 8.05
while t + 0.26 <= 9.9 + 0.001: pock(t + 0.13, 0.9); t += 0.26
for k in np.arange(8.2, 9.9, 0.11): pock(k + 0.05, 0.25)
add(8.1, sweep(300, 900, 1.85) * envl(1.85, a=0.3) * 0.5, 0.12)   # steigende Spannung
# BALL 300: Einschlag + Pling
add(9.95, sweep(120, 40, 0.4) * envl(0.4, r=0.15), 0.9)
add(9.98, sweep(900, 1800, 0.25) * envl(0.25, r=0.12), 0.2)
# F: Korb leer – trauriges Posaunen-Wah
for i, f in enumerate([392, 370, 349, 330]):
    d = 0.22 if i < 3 else 0.5; x = tt(d)
    sig = lp(2 * ((x * f * (1 + 0.01 * np.sin(2 * np.pi * 6 * x))) % 1) - 1, 0.08) * envl(d, a=0.02) * np.minimum(1, (d - x) / 0.05)
    add(F + 0.1 + i * 0.22, sig, 0.5)
# H: gemütlicher Beat + Schlürfen
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
