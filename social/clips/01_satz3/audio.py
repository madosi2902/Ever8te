# Synthetische Soundeffekte + leichter Beat, passend zur Timeline in clip.js
import numpy as np, wave
SR = 44100; DUR = 14.8
L = np.zeros(int(SR * DUR)); rng = np.random.default_rng(8)
LAUNCH, ORBIT, HIT, CUT, IMPACT, END = 7.6, 10.0, 10.62, 10.95, 11.08, 11.85

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
def lp(x, k):  # einfacher Tiefpass
    y = np.zeros_like(x); a = 0.0
    for i in range(len(x)): a += k * (x[i] - a); y[i] = a
    return y

# 0-3s: Hitze – fauler Drohnenton + Zikaden
x = tt(5.2); drone = 0.18 * np.sin(2 * np.pi * 55 * x) * (1 + 0.3 * np.sin(2 * np.pi * 0.7 * x))
drone *= np.minimum(1, x / 0.3) * np.clip((5.2 - x) / 0.4, 0, 1); add(0, drone)
cic = noise(5.0) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 28 * tt(5.0)))); cic = cic - lp(cic, 0.3)
add(0, cic * 0.035 * np.clip((5.0 - tt(5.0)) / 0.5, 0, 1))
# "Schmelz"-Slide
add(0.1, sweep(500, 120, 1.3) * envl(1.3, r=0.9), 0.22)
# Akku-Piepen
for b in [0.9, 1.4, 1.9, 2.4]: add(b, np.sin(2 * np.pi * 1800 * tt(0.08)) * envl(0.08), 0.12)
# Shaker fliegt rein (Whoosh)
w = lp(noise(0.45), 0.08) * np.sin(np.pi * tt(0.45) / 0.45); add(3.15, w, 1.4)
add(3.6, sweep(900, 400, 0.06) * envl(0.06), 0.3)   # Fang
# GLUCK x3
for g in [4.0, 4.33, 4.66]: add(g, sweep(420, 140, 0.16) * envl(0.16, r=0.08), 0.6)
# Wiederaufblasen (Boing)
x = tt(0.6); add(4.8, np.sin(2 * np.pi * np.cumsum(180 + 220 * np.sin(2 * np.pi * 7 * x) * np.exp(-x * 4)) / SR) * envl(0.6, r=0.3), 0.4)
# Power-up: Riser + Boom
add(5.1, sweep(60, 30, 0.8) * envl(0.8, r=0.3), 0.9)
add(5.1, lp(noise(0.5), 0.2) * envl(0.5, r=0.12), 0.6)
add(5.15, sweep(200, 1600, 1.6, 'sq') * np.linspace(0.02, 0.09, int(1.6 * SR)))
# Countdown
for i, b in enumerate([6.88, 7.12, 7.36]): add(b, np.sin(2 * np.pi * 880 * tt(0.12)) * envl(0.12, r=0.06), 0.35)
# Abflug: Rumpeln + Rakete
add(LAUNCH, sweep(80, 35, 1.2) * envl(1.2, r=0.4), 1.0)
r = lp(noise(2.4), 0.06) * np.concatenate([np.linspace(1, 1, int(0.4 * SR)), np.linspace(1, 0, int(2.0 * SR))]); add(LAUNCH, r, 2.2)
# Ball kommt hoch
add(ORBIT, sweep(300, 1200, 0.6) * envl(0.6) * np.linspace(0.05, 0.2, int(0.6 * SR)))
# Smash: POCK
add(HIT, (np.sin(2 * np.pi * 1100 * tt(0.08)) + 0.6 * noise(0.08)) * envl(0.08, r=0.02), 0.9)
add(HIT + 0.02, lp(noise(0.33), 0.15) * np.linspace(0.3, 1, int(0.33 * SR)), 0.6)  # Meteor-Pfeifen
add(HIT, sweep(2400, 500, 0.45) * envl(0.45), 0.12)
# Einschlag
add(IMPACT, sweep(90, 28, 1.0) * envl(1.0, r=0.35), 1.2)
add(IMPACT, lp(noise(0.9), 0.25) * envl(0.9, r=0.22), 1.2)
# Endcard: Akkord-Sting
x = tt(2.9); chord = sum(np.sin(2 * np.pi * f * x) for f in [523.25, 659.25, 783.99, 1046.5]) / 4
add(END, chord * envl(2.9, a=0.02, r=1.4), 0.45)
# Beat ab dem Power-up
bpm = 128; beat = 60 / bpm; t0 = 5.1
k = sweep(150, 45, 0.18) * envl(0.18, r=0.06); hh = (noise(0.04) - lp(noise(0.04), 0.5)) * envl(0.04, r=0.01)
n = 0; bt = t0
while bt < END + 2.9:
    g = 0.55 if bt < END else 0.35
    if not (IMPACT - 0.3 < bt < IMPACT + 0.4): add(bt, k, g)
    add(bt + beat / 2, hh, 0.25)
    bt += beat; n += 1
# Mastern
L = np.tanh(L * 1.3) * 0.85
fade = np.ones_like(L); fl = int(0.4 * SR); fade[-fl:] = np.linspace(1, 0, fl); L *= fade
pcm = (L * 32767).astype(np.int16)
st = np.column_stack([pcm, pcm]).ravel()
with wave.open('audio.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(st.tobytes())
print('ok')
