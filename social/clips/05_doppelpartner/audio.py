# Tonspur Clip 5 (Der Doppelpartner) – synthetisch, lizenzfrei
import numpy as np, wave
SR = 44100; DUR = 14.8
L = np.zeros(int(SR * DUR)); rng = np.random.default_rng(5)
B, C, D, E, F, G, END = 2.0, 3.6, 4.8, 6.6, 8.2, 10.0, 11.8

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
def pluck(t0, f, g=0.35, d=0.25):
    x = tt(d); add(t0, (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(4 * np.pi * f * x)) * envl(d, r=0.06), g)
def kick(): return sweep(150, 45, 0.18) * envl(0.18, r=0.06)
def hat(): return (noise(0.04) - lp(noise(0.04), 0.5)) * envl(0.04, r=0.01)
def beat(start, stop, bpm, g):
    b = 60 / bpm; t = start
    while t < stop - 0.05: add(t, kick(), g); add(t + b / 2, hat(), g * 0.45); t += b
def note(t0, f, d, g=0.25, vib=0):
    x = tt(d); add(t0, np.sin(2 * np.pi * np.cumsum(f * (1 + vib * np.sin(2 * np.pi * 6 * x))) / SR) * envl(d, a=0.02, r=d * 0.8), g)

# Intro: lockerer Beat, Shaker abstellen
beat(0, B, 110, 0.3)
add(0.7, sweep(500, 300, 0.05) * envl(0.05, r=0.02), 0.4)
# Schleich-Pizzicato beim Klauen
for i, (k, f) in enumerate(zip(np.arange(B, C, 0.2), [196, 233, 262, 233, 196, 233, 262, 294])): pluck(k, f)
add(2.25, sweep(900, 400, 0.06) * envl(0.06), 0.3)
for g in [2.5, 2.75]: add(g, sweep(420, 140, 0.16) * envl(0.16, r=0.08), 0.6)
add(3.3, sweep(500, 300, 0.05) * envl(0.05, r=0.02), 0.4)
# Hm? + Unschuldspfeifen
for k, f in [(3.95, 1046), (4.1, 1318), (4.25, 1174), (4.45, 1046), (4.6, 880)]: note(k, f, 0.15, 0.13, 0.01)
note(4.2, 160, 0.4, 0.35)
add(4.0, lp(noise(0.25), 0.4) * envl(0.25, r=0.1), 0.25)  # leeres Schütteln
# Weltmeister: Power-Sting, schneller Beat, Smashes
add(D, sweep(60, 30, 0.6) * envl(0.6, r=0.2), 0.8)
for i, f in enumerate([784, 988, 1175, 1568]): add(D + 0.03 + i * 0.05, np.sin(2 * np.pi * f * tt(0.35)) * envl(0.35, r=0.12), 0.14)
beat(D, E, 150, 0.5)
for n in range(3):
    h = D + n * 0.6 + 0.24
    add(h, (np.sin(2 * np.pi * 800 * tt(0.08)) + 0.6 * noise(0.08)) * envl(0.08, r=0.02), 0.9)
    add(h, lp(noise(0.25), 0.2) * np.linspace(1, 0, int(0.25 * SR)), 0.6)
# Kette + Schloss
for k in np.arange(E + 0.05, E + 0.5, 0.07): add(k, np.sin(2 * np.pi * (2400 + rng.random() * 800) * tt(0.05)) * envl(0.05, r=0.015), 0.15)
add(E + 0.55, (noise(0.03) + np.sin(2 * np.pi * 1800 * tt(0.03))) * envl(0.03, r=0.008), 0.5)
note(E + 0.8, 392, 0.5, 0.12); note(E + 1.2, 349, 0.6, 0.1)   # Hundeblick-Winseln
# Strohhalm + Schlürfen
add(F, sweep(300, 900, 0.4) * envl(0.4) * 0.12)
x = tt(1.2); slurp = lp(noise(1.2), 0.15) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 9 * x))); add(8.6, slurp * np.sin(np.pi * x / 1.2), 1.0)
add(9.75, lp(noise(0.35), 0.3) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 25 * tt(0.35)))) * envl(0.35), 0.6)
add(8.95, sweep(600, 1500, 0.15) * envl(0.15), 0.25)
x = tt(0.8); add(9.2, np.sin(2 * np.pi * 2200 * x) * (0.5 + 0.5 * np.sin(2 * np.pi * 14 * x)) * envl(0.8, r=0.6), 0.1)   # Dampfpfeife
# Wurf + Fang + Herzen
add(10.3, lp(noise(0.4), 0.1) * np.sin(np.pi * tt(0.4) / 0.4), 1.2)
add(10.72, sweep(180, 90, 0.12) * envl(0.12, r=0.05), 0.6)
for i, f in enumerate([659, 784, 988, 1318]): add(10.75 + i * 0.09, np.sin(2 * np.pi * f * tt(0.4)) * envl(0.4, r=0.15), 0.16)
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
