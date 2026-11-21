# Carousel „Warum die 8?“

## Dateien (`export/`)
- `slide-1.png` … `slide-6.png`: Standbilder 1080×1350 (4:5)
- `slide-1.mp4` … `slide-6.mp4`: animierte Version, je 6 s, 30 fps, H.264
- `vorschau-komplett.mp4`: alle 6 Slides am Stück, nur zum Anschauen (nicht posten)

Im Carousel kannst du Bilder und Videos mischen. Empfehlung:
- **Animiert:** Slide 1, 2, 3 und 6 als MP4 (die 8 kippt, der Ball läuft, der Beutel schwebt)
- **Ruhig:** Slide 4 und 5 als MP4 oder PNG, beides passt

Slide 3 ist eine nahtlose Schleife. Die anderen Videos bleiben am Ende stehen und starten dann neu.

## Caption

Warum eigentlich die 8? 👀

Leg sie auf die Seite und du hast das Zeichen für Unendlichkeit. ∞
Daher kommt unser Name. Gesprochen: „Everate“.

Auf dem Beutel steht „Match Drink“, weil er genau dafür gemacht ist: Tennis, Padel, Squash, Badminton, Tischtennis und Pickleball.

Entwickelt von einem Ex-ATP-Profi. Hergestellt in Deutschland.
Kein Ende in Sicht. 🎾

👉 Link in Bio. Neu hier? −20 % auf deine erste Bestellung mit dem Newsletter-Code.

#ever8te #matchdrink #tennis #padel #squash #badminton #tischtennis #pickleball #tennisdeutschland #padeldeutschland #racketsport #tennislife #madeingermany

## Hinweis zu Werbeaussagen
Die Texte bleiben bei den Fakten von Website und Beutel. Gesundheits- oder Leistungsversprechen wie „mehr Ausdauer“ oder „bessere Hydration“ sind bewusst nicht drin (EU-Health-Claims-Verordnung).

## Neu rendern
```
node render.js            # PNG und MP4 für alle Slides
node render.js png 1,6    # nur PNGs für Slide 1 und 6
```
Live-Vorschau im Browser: `carousel.html#2` spielt Slide 2 in Schleife.
