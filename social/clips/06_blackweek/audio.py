# Tonspur Clip 6 (Black Week Dialog) – synthetisch, lizenzfrei
import numpy as np, wave
SR = 44100; DUR = 18.6
L = np.zeros(int(SR * DUR)); rng = np.random.default_rng(6)
A2, A3, A4, A5, A6, A7, END = 2.4, 3.6, 6.2, 7.6, 10.4, 13.4, 15.6

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
def kick(): return sweep(150, 45, 0.18) * envl(0.18, r=0.06)
def hat(): return (noise(0.04) - lp(noise(0.04), 0.5)) * envl(0.04, r=0.01)
def clap(): s = noise(0.12); return (s - lp(s, 0.3)) * envl(0.12, r=0.03)
def bass(t0, f, d, g=0.25):
    x = tt(d); s = 2 * ((x * f) % 1) - 1; add(t0, lp(s, 0.08) * envl(d, a=0.01, r=d * 0.6), g)
def pop(t0, g=0.3): add(t0, sweep(300, 900, 0.08) * envl(0.08, r=0.03), g)
def blip(t0, g=0.12): add(t0, sweep(900, 1500, 0.05) * envl(0.05, r=0.02), g)

# Neon-Summen + Flackern am Anfang
x = tt(0.7); add(0, np.sin(2 * np.pi * 120 * x) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 10 * x))) * envl(0.7), 0.12)
# Groove: 120 bpm, Kick/Clap/Hat + Bass
b = 60 / 120; t = 0.6; prog = [55, 55, 65.4, 49]
i = 0
while t < END - 0.05:
    add(t, kick(), 0.45); add(t + b / 2, hat(), 0.18)
    if i % 2: add(t, clap(), 0.25)
    bass(t, prog[(i // 4) % 4], b * 0.9, 0.22); i += 1; t += b
# Anlauf + Bremsen
add(0.1, lp(noise(0.8), 0.15) * np.sin(np.pi * tt(0.8) / 0.8), 0.9)
add(0.85, lp(noise(0.25), 0.4) * envl(0.25, r=0.08), 0.6)
# Sprechblasen-Pops + Plapper-Blips
for t0 in [0.95, 2.45, 3.65, 6.25, 7.65, 10.45, 13.45, 14.5]: pop(t0)
for a, bb in [(0.95, 2.3), (3.65, 5.0), (7.65, 9.0), (10.45, 11.8), (14.5, 15.3)]:
    for k in np.arange(a + 0.1, bb, 0.11): blip(k, 0.06)
for a, bb in [(2.45, 3.2), (6.25, 7.0), (13.45, 14.0)]:
    for k in np.arange(a + 0.1, bb, 0.1): add(k, sweep(1300, 2000, 0.05) * envl(0.05, r=0.02), 0.06)
# Ticket: Kassen-"Ka-ching"
add(3.95, noise(0.05) * envl(0.05, r=0.01), 0.4)
for f in [2093, 2637]: add(4.0, np.sin(2 * np.pi * f * tt(0.6)) * envl(0.6, r=0.2), 0.16)
# Schock-Sting
add(A4, sweep(800, 1600, 0.12) * envl(0.12), 0.2); add(A4, sweep(70, 35, 0.4) * envl(0.4, r=0.15), 0.6)
# Produkte poppen rein
for t0 in [7.95, 8.15, 8.35, 8.5, 8.65]: pop(t0, 0.25)
for t0 in [10.75, 10.9, 11.1] + [11.25 + k * 0.09 for k in range(10)]: add(t0 + 0.25, sweep(1200, 600, 0.06) * envl(0.06, r=0.02), 0.18)
# Wegrennen
add(14.0, lp(noise(0.5), 0.12) * np.sin(np.pi * tt(0.5) / 0.5), 1.1)
add(15.0, lp(noise(0.5), 0.12) * np.sin(np.pi * tt(0.5) / 0.5), 0.9)
# Endcard-Akkord
x = tt(3.0); chord = sum(np.sin(2 * np.pi * f * x) for f in [523.25, 659.25, 783.99, 1046.5]) / 4
add(END, chord * envl(3.0, a=0.02, r=1.4), 0.45)
t = END
while t < DUR - 0.05: add(t, kick(), 0.3); add(t + b / 2, hat(), 0.14); t += b
L = np.tanh(L * 1.3) * 0.85
fl = int(0.4 * SR); L[-fl:] *= np.linspace(1, 0, fl)
pcm = (L * 32767).astype(np.int16)
with wave.open('audio.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(np.column_stack([pcm, pcm]).ravel().tobytes())
print('ok')
