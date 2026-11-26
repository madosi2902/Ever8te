# Tonspur Clip 2 (Anime-Power-up, Padel) – synthetisch, lizenzfrei
import numpy as np, wave
SR = 44100; DUR = 15.2
L = np.zeros(int(SR * DUR)); rng = np.random.default_rng(2)
DRINK, S1, S2, EYE, S8, OPP, LOB, CUT2, LAND, SHRUG, END = 2.4, 3.95, 4.9, 5.9, 6.6, 7.7, 8.4, 9.6, 10.2, 11.2, 12.2

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

# Hook: Keuchen (gefiltertes Rauschen im Atemrhythmus) + müder Ton
for b in np.arange(0.2, 2.4, 0.55):
    add(b, lp(noise(0.3), 0.12) * np.sin(np.pi * tt(0.3) / 0.3), 0.9)
add(0.1, sweep(300, 140, 1.5) * envl(1.5, r=1.0), 0.15)
# Shaker + GLUCK + Boing
add(DRINK, lp(noise(0.45), 0.08) * np.sin(np.pi * tt(0.45) / 0.45), 1.4)
add(2.85, sweep(900, 400, 0.06) * envl(0.06), 0.3)
for g in [3.05, 3.3, 3.55]: add(g, sweep(420, 140, 0.16) * envl(0.16, r=0.08), 0.6)
x = tt(0.6); add(3.6, np.sin(2 * np.pi * np.cumsum(180 + 220 * np.sin(2 * np.pi * 7 * x) * np.exp(-x * 4)) / SR) * envl(0.6, r=0.3), 0.4)
# Stufe 1
add(S1, sweep(70, 40, 0.5) * envl(0.5, r=0.2), 0.7)
add(S1, sweep(300, 900, 0.95, 'sq') * np.linspace(0.02, 0.06, int(0.95 * SR)))
# Stufe 2: Grollen + höherer Riser
add(S2, sweep(60, 30, 1.0) * envl(1.0, r=0.4), 0.9)
add(S2, lp(noise(1.0), 0.05) * envl(1.0, a=0.05), 1.5)
add(S2, sweep(500, 1500, 1.0, 'sq') * np.linspace(0.03, 0.08, int(1.0 * SR)))
# Augen-Close-up: metallisches "Shing"
x = tt(0.6); shing = (np.sin(2 * np.pi * 3200 * x) + 0.6 * np.sin(2 * np.pi * 4700 * x) + 0.3 * np.sin(2 * np.pi * 6100 * x)) * envl(0.6, r=0.18)
add(EYE, shing, 0.25); add(EYE, noise(0.05) * envl(0.05, r=0.01), 0.3)
# Stufe 8: Explosion + Dauer-Dröhnen + Sägezahn-"Schrei"
add(S8, sweep(90, 25, 1.1) * envl(1.1, r=0.4), 1.2)
add(S8, lp(noise(1.1), 0.2) * envl(1.1, a=0.01), 1.0)
x = tt(1.1); saw = 2 * ((x * np.linspace(220, 330, len(x))) % 1) - 1
add(S8, saw * np.sin(np.pi * x / 1.1) * 0.12)
add(7.15, sweep(600, 1400, 0.25) * envl(0.25), 0.2)   # die 8 kippt
# Gegner zittern
x = tt(0.7); add(OPP, np.sin(2 * np.pi * 520 * x) * (0.5 + 0.5 * np.sin(2 * np.pi * 18 * x)) * envl(0.7, r=0.5), 0.15)
# Lob: Stille + kleines "Plopp"
add(9.12, (np.sin(2 * np.pi * 700 * tt(0.07)) + 0.3 * noise(0.07)) * envl(0.07, r=0.02), 0.5)
add(9.2, sweep(500, 900, 0.4) * envl(0.4, r=0.2), 0.06)
add(CUT2, sweep(900, 500, 0.6) * envl(0.6, r=0.5), 0.05)
add(LAND - 0.02, (np.sin(2 * np.pi * 600 * tt(0.06))) * envl(0.06, r=0.02), 0.4)
# BOOM
add(LAND + 0.04, sweep(100, 25, 1.2) * envl(1.2, r=0.4), 1.3)
add(LAND + 0.04, lp(noise(1.0), 0.25) * envl(1.0, r=0.25), 1.3)
add(LAND + 0.1, sweep(800, 2400, 0.55) * envl(0.55) * 0.12)   # wegfliegen
for d in [LAND + 0.68, LAND + 0.72]:                              # "Ding" beim Verschwinden
    x = tt(0.6); add(d, (np.sin(2 * np.pi * 2093 * x) + 0.5 * np.sin(2 * np.pi * 3136 * x)) * envl(0.6, r=0.2), 0.18)
# Schulterzucken
add(SHRUG + 0.15, sweep(300, 500, 0.12) * envl(0.12, r=0.05), 0.25)
add(SHRUG + 0.32, sweep(500, 300, 0.14) * envl(0.14, r=0.06), 0.25)
# Endcard-Akkord
x = tt(3.0); chord = sum(np.sin(2 * np.pi * f * x) for f in [523.25, 659.25, 783.99, 1046.5]) / 4
add(END, chord * envl(3.0, a=0.02, r=1.4), 0.45)
# Beat: von Stufe 1 bis zum Lob (dann komische Stille), wieder ab Endcard
bpm = 140; beat = 60 / bpm
k = sweep(150, 45, 0.18) * envl(0.18, r=0.06); hh = (noise(0.04) - lp(noise(0.04), 0.5)) * envl(0.04, r=0.01)
for start, stop, g in [(S1, LOB, 0.5), (END, DUR, 0.32)]:
    bt = start
    while bt < stop - 0.05:
        if not (EYE - 0.05 < bt < EYE + 0.3): add(bt, k, g)
        add(bt + beat / 2, hh, 0.22)
        bt += beat / (2 if S8 <= bt < OPP else 1)
L = np.tanh(L * 1.3) * 0.85
fl = int(0.4 * SR); L[-fl:] *= np.linspace(1, 0, fl)
pcm = (L * 32767).astype(np.int16)
with wave.open('audio.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(np.column_stack([pcm, pcm]).ravel().tobytes())
print('ok')
