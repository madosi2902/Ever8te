# Newsletter mit Brevo einrichten (ca. 20 Minuten)

Ablauf, sobald alles eingerichtet ist:

1. Jemand trägt sich auf ever8te.de ein.
2. Die Website (Netlify-Function `/api/newsletter`) gibt die Adresse an Brevo weiter.
3. Brevo schickt automatisch eine **Bestätigungsmail** (Double-Opt-In).
4. Nach dem Klick auf den Link landet die Person auf **ever8te.de/danke** und kommt in die Liste.
5. Eine **Brevo-Automation** schickt sofort die Willkommensmail mit dem Code **EVER8TE20**.

Solange Brevo noch nicht verbunden ist, landen Anmeldungen wie bisher in Netlify Forms. Es geht also nichts verloren.

---

## Schritt 1: Brevo-Konto und Absender

1. Konto auf brevo.com anlegen (der Free-Plan reicht: 300 Mails am Tag).
2. **Senders, Domains & Dedicated IPs → Domains**: `ever8te.de` hinzufügen und die angezeigten DNS-Einträge (DKIM, DMARC) bei eurem Domain-Anbieter eintragen. Sonst landen die Mails im Spam.
3. **Senders**: einen Absender anlegen, z. B. `EVER8TE <hallo@ever8te.de>`.

## Schritt 2: Liste anlegen

**Contacts → Lists → Create a list**, Name z. B. `EVER8TE Newsletter`.
Die **Listen-ID** (Zahl in der Übersicht) notieren → `BREVO_LIST_ID`.

## Schritt 3: Vorlage für die Bestätigungsmail (Double-Opt-In)

1. **Campaigns → Templates → New template**.
2. Bei **Template name** z. B. `DOI Bestätigung`; als **Tag** genau `optin` eintragen (Pflicht, sonst lehnt Brevo die Vorlage ab).
3. Betreff: `Bitte bestätige deine Anmeldung`.
4. Inhalt, z. B.:
   > Fast geschafft! Klick auf den Button, um deine Anmeldung zum EVER8TE-Newsletter zu bestätigen. Danach bekommst du deinen Code für −20 % auf die erste Bestellung.
5. Der Button braucht als Link genau `{{ doubleoptin }}`.
6. Speichern und **aktivieren**. Die **Vorlagen-ID** (#-Zahl) notieren → `BREVO_DOI_TEMPLATE_ID`.

## Schritt 4: Willkommensmail mit Code (Automation)

1. **Automations → Create an automation → Welcome message**.
2. Einstiegspunkt: **Contact added to list** → Liste `EVER8TE Newsletter`.
3. E-Mail senden, Inhalt z. B.:
   > Willkommen bei EVER8TE! Dein Code für −20 % auf die erste Bestellung: **EVER8TE20**
   > Einfach im Shop beim Bezahlen eingeben: [Zum Shop](https://the-tennisbase.com/products/ever8te-carbs-elektrolyte-pinkberry-500-g?utm_source=brevo&utm_medium=email&utm_campaign=welcome)
   > Gilt einmal pro Person, nicht mit dem Mengenrabatt kombinierbar.
4. Automation **aktivieren**.

## Schritt 5: API-Schlüssel

**Profil (oben rechts) → SMTP & API → API Keys → Generate a new API key**.
Den Schlüssel **nicht** in Chats oder Mails kopieren, sondern direkt in Netlify eintragen (Schritt 6).

## Schritt 6: Netlify verbinden

Netlify → Projekt **ever8te** → **Project configuration → Environment variables → Add a variable**:

| Key | Wert | Hinweis |
|---|---|---|
| `BREVO_API_KEY` | API-Schlüssel aus Schritt 5 | als **Secret** markieren, Scope „Functions“ |
| `BREVO_LIST_ID` | Listen-ID aus Schritt 2 | |
| `BREVO_DOI_TEMPLATE_ID` | Vorlagen-ID aus Schritt 3 | |

Danach unter **Deploys → Trigger deploy → Deploy project** neu deployen. Die Variablen gelten erst nach einem neuen Deploy.

## Schritt 7: Testen

Auf ever8te.de mit einer eigenen Adresse eintragen → Bestätigungsmail → Link klicken → Danke-Seite → Willkommensmail mit Code.

## Die bisherigen 85 Anmeldungen

Die stehen in Netlify unter **Forms → ever8te-launch** und können als CSV exportiert werden. Sie haben sich ohne Double-Opt-In angemeldet. Für einen sauberen Nachweis der Einwilligung sollten sie in Brevo nicht direkt angeschrieben werden. Sicherer ist, sie einmalig um Bestätigung zu bitten oder sie nur für den bereits versprochenen Code zu nutzen. Im Zweifel kurz mit einem Anwalt abklären.

## Rechtliches

- In Brevo unter **Settings → Data Processing Agreement (DPA)** den Auftragsverarbeitungsvertrag abschließen.
- Die Datenschutzerklärung auf der Website erwähnt Brevo bereits.
