# EVER8TE Social-Autopilot: täglicher Ablauf

Diese Anleitung gilt für die geplante Aufgabe, die **jeden Morgen** einen neuen Clip baut. Freigegebene Posts gehen um **14:00 Uhr (Europe/Berlin)** online.

## Feste Werte

| Was | Wert |
|---|---|
| Arbeits-Branch | `claude/beautiful-ramanujan-ujo97y` (holen, darauf arbeiten, dorthin pushen) |
| Buffer-Organisation | „My organization“ `6b07cd188cc59ff08127ae8f` |
| Buffer-Kanal Instagram | **ever8te.nutrition** `6b07cee68541f09ecbab3594`. Jedes Video wird **zweimal** gepostet: als **Reel** und als **Story**. |
| Buffer-Kanal TikTok | **ever8te.nutrition** `6b096c298541f09ecbc0652e` (seit 27.11.2026). Jedes Video zusätzlich als TikTok-Post (`metadata.tiktok = {title: …}`, Caption wie Reel). TikTok-Storys kann Buffer über die Schnittstelle nicht anlegen (kein Story-Typ); bei Bedarf in der TikTok-App manuell teilen. |
| Video-Hosting | Netlify-Projekt **ever8te-media**, Site-ID `f0b477ae-7400-4814-b3c3-490f3cea60fc`, https://ever8te-media.netlify.app |
| Website ever8te.de | **niemals** deployen oder ändern (Live-Stand weicht vom Repo ab, siehe `live-snapshot/`) |
| Postzeit | 14:00 Uhr Europe/Berlin |

## Schritte

1. **Repo vorbereiten:** `git fetch origin claude/beautiful-ramanujan-ujo97y && git checkout -B claude/beautiful-ramanujan-ujo97y FETCH_HEAD`.
2. **Lesen:** `social/CONTENT-GUIDE.md` (Stil, rechtliche Leitplanken, Ideen-Backlog), `social/posted.md` (was schon lief) und `social/README.md`.
3. **Idee wählen:** eine offene Idee aus dem Backlog oder eine neue im gleichen Geist, die zu Datum und Saison passt. Sie muss Tennis-Bezug haben und den Nutzen von EVER8TE zeigen, ohne Wirkversprechen. Keine Wiederholung bereits geposteter Stories. Aktionen (Rabattcodes usw.) nur, wenn sie in `posted.md` unter „Aktive Aktionen“ als bestätigt eingetragen sind.
4. **Clip bauen:** neuen Ordner `social/clips/<NN>_<kurzname>` anlegen (fortlaufende Nummer), passende Vorlage kopieren (siehe README), Szenen, Texte und `audio.py` anpassen. Mit `./build.sh <name> stills …` Testbilder rendern und **ansehen**: Lesbarkeit, Safe Zones, keine Überlappungen, Figuren korrekt. Erst dann `./build.sh <name>`. Länge 12–19 s.
5. **Hochladen:** `./publish-media.sh <name>` (merkt sich die `NEUE_URL`). Dann das Netlify-MCP-Tool `netlify-deploy-services-updater` → `deploy-site` mit der Site-ID oben aufrufen und den gelieferten `npx …`-Befehl **im Ordner `social/build/media`** mit `NODE_USE_ENV_PROXY=1` davor ausführen. Danach `curl -fsSI <NEUE_URL>` muss 200 liefern. Den Ordner `.netlify` nicht committen.
6. **Zwei Entwürfe in Buffer**, beide mit `channelId` Instagram, `schedulingType: automatic`, `saveToDraft: true` und dem Video-Asset = NEUE_URL:
   - **Reel:** `metadata.instagram = {type: "reel", shouldShareToFeed: true}`, Caption nach Content-Guide (Abschnitt 6).
   - **Story:** `metadata.instagram = {type: "story", shouldShareToFeed: false}`, kein Caption-Text nötig (Stories zeigen keine Caption).
   Beide Post-IDs notieren. Sobald ein TikTok-Kanal verbunden ist, zusätzlich einen TikTok-Entwurf mit der Caption anlegen.
7. **Sichern:** Caption in `captions.md`, Eintrag in `posted.md` (Datum, Clip, Caption, Buffer-Post-IDs von Reel und Story, Status „wartet auf Freigabe“), Backlog-Idee abhaken. Commit und Push auf den Arbeits-Branch. Videos werden nicht committet (`.gitignore`).
8. **Freigabe einholen:** Das fertige MP4 mit `SendUserFile` schicken (`status: proactive`, `display: render`), kurz die Story und die Caption nennen und fragen: **„Freigeben für heute 14:00 Uhr?“** Dann die Runde beenden. **Niemals ohne ausdrückliches „Ja“ veröffentlichen oder einplanen.**
9. **Nach der Antwort:**
   - **Ja / Freigeben:** `get_account` für die aktuelle Zeit, dann für **jeden** Entwurf (Reel, Story, ggf. TikTok) `edit_post` mit `mode: customScheduled`, `dueAt` = heute 14:00 Uhr Europe/Berlin (mit korrektem Offset). Ist 14:00 Uhr schon vorbei, nachfragen: sofort, morgen 14:00 Uhr oder ein anderer Zeitpunkt. `posted.md` auf „eingeplant“ setzen, committen und pushen.
   - **Änderungswunsch:** Clip anpassen, neu bauen, neu hochladen, alle Buffer-Entwürfe aktualisieren (`edit_post` mit neuem Asset oder neuer Caption) und erneut fragen.
   - **Nein:** alle Buffer-Entwürfe dieses Clips löschen, `posted.md` auf „verworfen“ setzen.

## Fehlerfälle

- Render, Upload oder Buffer schlagen fehl: nicht raten oder umgehen. Kurz berichten, was fehlt (zum Beispiel ein blockierter Host oder ein getrennter Kanal), und den Clip trotzdem per `SendUserFile` schicken, damit er manuell gepostet werden kann.
- Buffer-Limit (kostenloser Tarif: 10 geplante Posts; pro Tag werden 2 belegt, mit TikTok 3): ältere verworfene Entwürfe löschen, nichts Eingeplantes anfassen.
