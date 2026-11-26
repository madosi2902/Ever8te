#!/usr/bin/env bash
# Stellt den Upload-Ordner für https://ever8te-media.netlify.app zusammen:
# alle Videos der letzten 30 Tage (laut manifest.json der Live-Seite) + das neue Video.
#   ./publish-media.sh 07_training_feierabend
# Danach build/media mit dem Netlify-MCP-Deploy hochladen (siehe AUTOPILOT.md).
# Gibt am Ende die öffentliche URL des neuen Videos aus.
set -euo pipefail
cd "$(dirname "$0")"
name="${1:?Clip-Name angeben, z. B. 07_training_feierabend}"
src="videos/$name.mp4"
[ -f "$src" ] || { echo "Video fehlt: $src (erst ./build.sh $name)"; exit 1; }
BASE="https://ever8te-media.netlify.app"
out="build/media"
rm -rf "$out"; mkdir -p "$out/v"
cp media-site/_headers media-site/robots.txt media-site/index.html media-site/netlify.toml "$out"/
curl -fsS "$BASE/manifest.json" -o "$out/old.json" || echo '{"videos":[]}' > "$out/old.json"
python3 - "$out" "$src" "$name" "$BASE" <<'PY'
import json, sys, os, secrets, subprocess, datetime
out, src, name, base = sys.argv[1:5]
today = datetime.date.today()
old = json.load(open(os.path.join(out, "old.json"))).get("videos", [])
keep = []
for v in old:
    if (today - datetime.date.fromisoformat(v["date"])).days > 30 or v["clip"] == name:
        continue
    dst = os.path.join(out, v["file"])
    if subprocess.run(["curl", "-fsS", f"{base}/{v['file']}", "-o", dst]).returncode == 0:
        keep.append(v)
    else:
        print("WARNUNG: konnte nicht laden:", v["file"])
fname = f"v/{name}-{secrets.token_hex(6)}.mp4"
subprocess.run(["cp", src, os.path.join(out, fname)], check=True)
keep.append({"clip": name, "file": fname, "date": today.isoformat()})
json.dump({"videos": keep}, open(os.path.join(out, "manifest.json"), "w"), indent=1)
os.remove(os.path.join(out, "old.json"))
print(f"{len(keep)} Videos bereit in {out}")
print("NEUE_URL", f"{base}/{fname}")
PY
