#!/usr/bin/env bash
# Baut einen Clip komplett: Frames rendern, Ton erzeugen, MP4 kodieren.
#   ./build.sh 01_satz3                 → videos/01_satz3.mp4
#   ./build.sh 01_satz3 stills 1.5,4.2  → nur Testbilder in build/01_satz3/stills/
# Voraussetzungen: node + playwright (Chromium), python3 + numpy, ffmpeg.
set -euo pipefail
cd "$(dirname "$0")"
name="${1:?Clip-Ordner aus clips/ angeben, z. B. 01_satz3}"
src="clips/$name"; work="build/$name"
[ -d "$src" ] || { echo "Gibt es nicht: $src"; exit 1; }
mkdir -p "$work"
cp "$src"/clip.html "$src"/clip.js "$src"/audio.py "$work"/
# Schriften und Bilder kommen direkt aus der Website, damit alles markengleich bleibt.
cp -r ../public/assets/fonts ../public/assets/bag.webp ../public/assets/logo.png "$work"/

if [ "${2:-}" = "stills" ]; then
  node render.js "$work" stills "${3:?Zeitpunkte angeben, z. B. 1.5,4.2}"
  echo "Testbilder: $work/stills/"; exit 0
fi

rm -rf "$work/frames"
node render.js "$work" all
(cd "$work" && python3 audio.py)
mkdir -p videos
ffmpeg -y -loglevel error -framerate 30 -i "$work/frames/f%04d.png" -i "$work/audio.wav" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart \
  "videos/$name.mp4"
echo "Fertig: social/videos/$name.mp4"
