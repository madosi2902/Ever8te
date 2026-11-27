# EVER8TE Social: Content-Guide

Dieser Leitfaden gilt für alle Clips, die für die EVER8TE-Accounts auf **TikTok** und **Instagram (Reels)** entstehen. Das gilt auch für die täglich automatisch erstellten Clips. Bitte vor jedem neuen Clip lesen.

## 1. Ziel und Rhythmus

- **Täglich ein Clip** für TikTok und Instagram Reels, jeweils auf dem EVER8TE-Account.
- **Jeder Clip hat mit Tennis zu tun** (Padel und andere Racket-Sportarten sind als Abwechslung okay) und zeigt **den Nutzen von EVER8TE** im Alltag auf dem Platz: lange Matches, Hitze, Turniertage, Training nach der Arbeit.
- Humor steht im Vordergrund. Das Produkt ist der Wendepunkt der Geschichte, aber keine Werbetafel.
- Kein Clip wird ohne Freigabe durch einen Menschen veröffentlicht. Er wird als Entwurf oder geplanter Post angelegt, und jemand gibt ihn frei.

## 2. Look und Format

- **9:16, 1080×1920, 30 fps, 12–19 Sekunden.**
- **One-Line-Art:** dünne, gleichmäßige Linien, Figuren als Kontur. Hintergrund cremefarbenes Papier `#f4efe8`, Linien `#1a1014`.
- **Pink `#ff1489` nur in Schlüsselmomenten:** Shaker, Power-up, Pointe, „ACE“, Endcard. Pink ist das Signal „hier wirkt EVER8TE“.
- Bei Aktionen wie der Black Week ist auch der **Dark-Look** erlaubt: Hintergrund `#15101a`, helle Linien, Pink als Neon.
- Schrift: **Barlow Condensed Italic 900** für Headlines, **Manrope 800** für Kleintext. Beide liegen unter `public/assets/fonts`.
- **Hook in der ersten Sekunde:** große Headline oben, zum Beispiel „SATZ 3.“, „POV: TURNIERTAG.“ oder „ICH VS. BALLMASCHINE.“.
- **Safe Zones:** Texte zwischen y ≈ 260 und 1500. Rechts ab x ≈ 950 und unten ab y ≈ 1500 liegen die Buttons und die Caption der App.
- **Wiederkehrende Figuren:** die Spielerin mit Pferdeschwanz (`HER`/`HERP`), der Spieler mit Stachelfrisur (`HERO`) und der pinke Shaker mit der „8“. Dazu kommt die Endcard mit Logo, Beutel-Foto, „KEIN ENDE IN SICHT.“, liegender 8 und „ever8te.de“.
- **Ton:** selbst erzeugte Soundeffekte und Beats (`audio.py`). Keine fremde Musik und keine Samples, damit es keine Lizenzprobleme gibt. Einen Trend-Sound kann man in der App bei Bedarf zusätzlich unterlegen.

## 3. Rechtliche Leitplanken (wichtig)

EVER8TE ist ein Lebensmittel. Es gelten die **EU-Health-Claims-Verordnung (VO 1924/2006)**, die Lebensmittelinformationsverordnung und das Wettbewerbsrecht (UWG). Die folgenden Regeln sind eine praktische Orientierung, **keine Rechtsberatung**. Bei Unsicherheit: weglassen.

**Nicht sagen oder einblenden:**
- Wirkversprechen wie „mehr Energie“, „mehr Leistung“, „schneller“, „stärker“, „bessere Regeneration“, „verhindert Krämpfe“, „hält dich hydriert“, „macht wach“, „gegen Müdigkeit“.
- Gesundheits- oder Krankheitsbezug wie „gesund“, „heilt“, „schützt“, „beugt vor“, „ärztlich empfohlen“, „klinisch getestet“.
- Absolute oder vergleichende Aussagen wie „der beste“, „Nr. 1“, „besser als [Marke]“, „garantiert“, oder Vergleiche mit Konkurrenzprodukten.
- Erfundene Kundenstimmen, Bewertungen oder Testimonials, und echte Profis oder Prominente ohne Freigabe.
- Fremde Marken, Logos oder Turniernamen wie Wimbledon, ATP-Turniere oder Ausrüster-Logos. Generische Bezeichnungen wie „Turnier“, „Ballmaschine“ oder „Overgrips“ sind in Ordnung.

**Erlaubt und erwünscht:**
- **Erkennbar übertriebener Cartoon-Humor:** abheben, Anime-Power-up, Ballmaschine geht K.O. Niemand versteht das wörtlich. Die Texte dazu bleiben neutral: „PINKBERRY MODE“, „WIEDER DA.“, „Kein Problem.“, „KEIN ENDE IN SICHT.“.
- **Situationen beschreiben, nicht Wirkungen:** „Satz 3, 38 °C“, „Match 2 um 13:30“, „Trinkpause“.
- **Fakten vom Beutel, wörtlich und korrekt:** 30 g Kohlenhydrate pro Portion (35 g), mit Natrium, Magnesium und Chlorid, Geschmack PinkBerry/Waldfrucht, 500 g ≈ 14 Portionen, „Entwickelt von einem Ex-ATP-Profi“, „für Tennis, Padel und Racket-Sport“, „ideal vor, während und nach intensiven Trainingseinheiten und Matches“.
- **Zugelassene Health Claims nur im exakten Wortlaut** und nur nach Freigabe durch das EVER8TE-Team, zum Beispiel „Magnesium trägt zu einer normalen Muskelfunktion bei.“ (Magnesium: 19 % NRV pro Portion). Im Zweifel ganz darauf verzichten.
- **Aktionen:** Konditionen vollständig und richtig nennen (Code, Rabatt, Zugaben, Mindestmenge, gegebenenfalls Zeitraum). Nur Aktionen zeigen, die das Team bestätigt hat.

## 4. Story-Formel

1. **Hook (0–2 s):** ein Tennis-Moment, den jeder kennt (Hitze, langer Satz, Tiebreak, Turniertag, Training nach der Arbeit, Doppelpartner, Ballmaschine …).
2. **Problem (2–5 s):** müde, geschmolzen, Zombie, Akku 1 %. Immer als Cartoon-Übertreibung.
3. **Wendepunkt:** der pinke Shaker kommt ins Bild, „GLUCK!“. Ab hier gibt es Pink.
4. **Eskalation:** absurd übertriebene Folge (Rakete, Anime, Ballmaschine K.O.).
5. **Pointe:** ein trockener Satz, oft als Antiklimax („WAR NUR EIN LOB.“, „WER BRAUCHT JETZT 'NE PAUSE?“).
6. **Endcard (3 s).**

## 5. Ideen-Backlog

Bereits umgesetzt (in `clips/`): Satz 3 und abheben · Anime-Stufe 8 (Padel) · POV Turniertag · Ich vs. Ballmaschine · Doppelpartner klaut den Shaker · Black Week (Dialog) · Der Balltipper (07).

Offene Ideen (abhaken, wenn verwendet):
- [ ] **Training nach der Arbeit:** Laptop zu, Schläger raus, Shaker als „Feierabend-Schalter“.
- [ ] **Schiedsrichter:** Der Umpire im Hochstuhl trinkt heimlich mit. „Challenge!“ wird mit dem Shaker gemacht.
- [ ] **Ballkinder-Staffel:** Die Ballkinder reichen den Shaker im Formel-1-Boxenstopp-Tempo.
- [ ] **Matchball abwehren:** 9 abgewehrte Matchbälle, die Anzeige zählt hoch, „KEIN ENDE IN SICHT.“
- [ ] **Regenunterbrechung:** Alle warten, sie macht in der Pause Seilspringen mit dem Shaker im Takt.
- [ ] **Saitenriss:** Die Saite reißt, sie wechselt Schläger und Shaker im gleichen Move.
- [x] **Der Gegner, der ewig den Ball tippt:** 47-mal Ball tippen vor dem Aufschlag. Sie trinkt in Ruhe aus.
- [ ] **Medenspiel-Sonntag:** 8 Uhr Treffpunkt, Vereinsheim, 3 Einzel und 1 Doppel.
- [ ] **Trainer sagt „noch 3 Bälle“:** Es werden 300.
- [ ] **Hallensaison vs. Sommer:** Split-Screen Winterhalle und Sandplatz-Hitze.
- [ ] **Netzroller-Glück:** Netzroller, Ball tänzelt auf der Netzkante, die 8 wird zur Waage.
- [ ] **Shaker-ASMR:** Pulver rein, schütteln, „pling“. Ruhiger Clip, nur Sound und Linien.
- [ ] **Packliste Turniertasche:** Schläger, Griffbänder, Bälle … der Shaker kommt zuerst rein.
- [ ] **Tiebreak-Nerven:** 6:6 im Tiebreak, Herzschlag-Sound, Kamera zoomt auf die Augen.
- [ ] **Aufschlag-Zeitlupe:** Ballwurf in Superzeitlupe, ein pinker Schweif zieht hinterher.
- [ ] **Vereinsmeisterschaft:** der Pokal ist größer als die Spielerin.
- [ ] **Doppel-Kommunikation:** „Meiner!“ „Deiner!“ – beide laufen ins Leere.
- [ ] **Sandplatz abziehen:** Schleppnetz-Rennen nach dem Training.
- [ ] **Lieblingsplatz-Rituale:** Linien nicht betreten, immer der gleiche Ball …
- [ ] **Padel-Wand-Trick:** Der Ball läuft über drei Glaswände, eine pinke Linie zeigt die Bahn.
- [ ] **Wenn der Gegner „nur zum Spaß“ sagt:** Danach Turniermodus.
- [ ] **Saisonstart im Frühling:** erster Tag draußen, die Vögel zwitschern im Takt.
- [ ] **Hitzewelle-Serie:** Teil 1, 2, 3 mit derselben Figur an verschiedenen Tagen.
- [ ] **Matchtiebreak um 22 Uhr:** Flutlicht geht aus, nur der pinke Shaker leuchtet. Erlaubter Gag, kein echtes Leuchten behaupten.

## 6. Captions

- Deutsch, locker, 1–2 Sätze, 1–3 Emojis (🎾 💗 👀), Aufforderung zum Kommentieren oder Markieren („Markier deinen Doppelpartner“).
- 4–6 Hashtags: `#tennis` `#tennistiktok` bzw. `#padel` je nach Clip, dazu `#ever8te` und 1–2 themenbezogene.
- Keine Wirkversprechen, auch nicht in der Caption (siehe Abschnitt 3).
- Gesammelte Captions der bisherigen Clips: siehe `captions.md`.
