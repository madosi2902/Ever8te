# EVER8TE Social-Clips

Cartoon-Clips für TikTok und Instagram Reels im One-Line-Art-Stil. Alles wird per Code gezeichnet, animiert und vertont. Dieser Ordner wird **nicht** mit der Website veröffentlicht, denn Netlify veröffentlicht nur `public/`.

- **Inhalt und Regeln:** [`CONTENT-GUIDE.md`](CONTENT-GUIDE.md). Vor jedem neuen Clip lesen.
- **Captions:** [`captions.md`](captions.md)
- **Fertige Videos:** `videos/*.mp4`

## Aufbau

```
clips/<nr>_<name>/
  clip.html   lädt clip.js in einen 1080×1920-Canvas
  clip.js     komplette Animation: Figuren, Szenen, Texte; draw(t) zeichnet Zeitpunkt t, window.DUR = Länge
  audio.py    erzeugt audio.wav (synthetische Soundeffekte und Beat, lizenzfrei)
render.js     rendert Frames über Playwright/Chromium
build.sh      kopiert Schriften und Bilder aus public/assets, rendert, vertont und kodiert nach videos/
```

## Clip bauen

```bash
cd social
./build.sh 03_turniertag                      # → videos/03_turniertag.mp4 (dauert ein paar Minuten)
./build.sh 03_turniertag stills 1.5,4.4,9.8   # nur Testbilder in build/03_turniertag/stills/
```

Benötigt werden `node` mit `playwright` (Chromium), `python3` mit `numpy` und `ffmpeg`.

## Neuen Clip anlegen

1. Den passenden Vorgänger als Vorlage kopieren:
   - Sandplatz und Spielerin: `03_turniertag` oder `04_ballmaschine`
   - Padel und zwei Figuren: `05_doppelpartner`
   - Dialog mit Sprechblasen: `06_blackweek`

   Jede `clip.js` enthält oben den gemeinsamen Baukasten (Figuren, Posen, Gesichter, Shaker, Schläger, Plätze, Effekte, Endcard). Unten stehen die clip-spezifischen Szenen ab der Zeile `// ================= Clip …`.
2. Unten Timeline (`T`), Posen-Keyframes, Szenenfunktionen, `overlays(t)` und `draw(t)` anpassen.
3. Mit `stills` Testbilder rendern und prüfen: Lesbarkeit, Safe Zones, keine Überlappungen.
4. `audio.py` an die neue Timeline anpassen.
5. `./build.sh <name>`, dann die Caption in `captions.md` ergänzen und die Idee im Backlog des Content-Guides abhaken.
