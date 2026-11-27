# Tennisbase – tägliches „Angebot des Tages“ auf Instagram

Ziel: Jeden Tag genau **einen** Feed-Post auf Instagram **the_tennisbaseshop** (über Buffer) um **20:00 Uhr (Europe/Berlin)** einplanen.

## Feste Werte
- Buffer-Organisation: „My organization“ – `6b07cd188cc59ff08127ae8f`
- Buffer-Kanal Instagram the_tennisbaseshop: `6b096ecc8541f09ecbc07755` (nur diesen Kanal verwenden, **nie** ever8te.nutrition)
- Domain auf allen Grafiken und Texten: **the-tennisbase.de** (nie .com)
- Look: ausschließlich die Vorlage `social-preview/template/template.html` (Signature-Look im Shop-Design). Layout, Farben und Schriften nicht ändern.

## Ablauf
1. **Doppelte Posts vermeiden:** Mit Buffer `list_posts` (Kanal oben, Status scheduled/sent, dueAt heute) prüfen, ob für heute 20:00 schon ein Post existiert. Wenn ja: nichts tun und beenden.
2. **Bereits beworbene Produkte:** Buffer-Posts der letzten 30 Tage für den Kanal lesen und die beworbenen Produktnamen notieren; diese nicht erneut nehmen.
3. **Produkt wählen** (Shopify Admin GraphQL, `products(query:"status:active")`, bis zu 250 Produkte):
   - `totalInventory > 0`, hat Bild (`featuredMedia`), hat `compareAtPrice` > Preis
   - nicht in den letzten 30 Tagen beworben
   - zwischen Kategorien abwechseln (Schläger, Griffbänder, Saiten, Kinderschläger, Schuhe …), nicht zwei Tage hintereinander dieselbe Kategorie
   - innerhalb der Kandidaten bevorzugt hoher Rabatt; bei Gleichstand zufällig
4. **Aktion/Code prüfen:** Aktive Rabattcodes in Shopify abfragen (`codeDiscountNodes(query:"status:active")`). Nur einen Code nennen, wenn er **heute aktiv** ist und für das Produkt gilt (z. B. auf alles). Endpreis mit Code korrekt berechnen. Ohne gültigen Code: Felder `code`/`codePrice` weglassen.
5. **Daten füllen** (`social-preview/template/data.json` als Muster):
   - `label`: „Angebot des Tages“
   - `title`: Kampagnenname, falls im Shop gerade eine läuft (z. B. „Black Friday“ bis 30.11.2026), sonst kurz und passend, z. B. „Deal des Tages“ (max. ~12 Zeichen, damit er in eine Zeile passt)
   - `eyebrow`: z. B. „Nur heute“ oder Aktionszeitraum laut Shop, nur wenn wahr
   - `badge`: Rabatt in % gerundet (`-46%`)
   - `brand`: „Marke · Zusatz“, `name`: Modell, max. 2 Zeilen mit `<br>`
   - `oldLabel`: „UVP xxx,xx €“ (durchgestrichener Vergleichspreis aus Shopify)
   - `stock`: nur wenn Bestand ≤ 5: „Nur noch X Stück verfügbar“
   - `legal`: „UVP = unverbindliche Preisempfehlung des Herstellers.“ + ggf. Code-Gültigkeit
   - `image`: Produktbild nach `social-preview/template/img/product.png` laden; `cardBg`: Farbe des Bildpixels (5,5) als Hex
6. **Rendern:** `node social-preview/template/render.js $PWD/social-preview/template/template.html $PWD/social-preview/template/data.json $PWD/social-preview/out` → `feed.png` (1080×1350). Bild ansehen und prüfen: nichts abgeschnitten, nichts überlappt, Preise stimmen.
7. **Veröffentlichen:** `social-preview/posts/JJJJ-MM-TT.png` speichern, committen, pushen. Öffentliche URL: `https://raw.githubusercontent.com/madosi2902/Ever8te/<commit-SHA>/social-preview/posts/JJJJ-MM-TT.png` (mit curl prüfen: HTTP 200).
8. **Buffer:** `create_post` mit Kanal oben, `schedulingType: automatic`, `mode: customScheduled`, `dueAt: <heute>T20:00:00+01:00` (Winterzeit, Sommerzeit +02:00), `metadata.instagram: {type: "post", shouldShareToFeed: true}`, Bild mit Alt-Text.
9. **Caption** (Deutsch, Du-Ansprache, 3–6 Zeilen + Hashtags): Produkt, Preis vorher/nachher, ggf. Code, ggf. Bestand, „👉 Link in Bio · the-tennisbase.de“, Pflichthinweis zur UVP, 6–10 passende Hashtags inkl. #tennis #tennisbase.

## Regeln
- Keine erfundenen Aussagen: Zeiträume, Bestände, Codes und Preise nur so, wie sie in Shopify stehen.
- Kein „Nur heute“, wenn der Preis nicht wirklich nur heute gilt.
- Pro Tag nur ein Post. Bei Fehlern lieber keinen Post als einen falschen.
