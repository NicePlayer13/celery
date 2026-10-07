# Bäckerei alpascha – Website-Redesign (Konzept)

Redesign-Konzept für <https://www.baeckerei-alpascha.ch/>, Deutsch und Arabisch (RTL).
Das Konzept und die Fragen an die Inhaberschaft stehen in **[KONZEPT.md](KONZEPT.md)**.

## Stack

- **Statisches HTML, CSS und Vanilla JS.** Kein Framework, kein Build-Schritt, keine kostenpflichtigen Plugins.
  Läuft auf jedem Webhosting (auch Netlify, Cloudflare Pages, GitHub Pages).
- **Schriften:** Readex Pro (Fliesstext, Latein + Arabisch), Fraunces (deutsche Titel), Reem Kufi (arabische Titel).
  Alle variabel, lokal eingebunden, SIL Open Font License. Es werden keine Google Fonts geladen, also auch keine Daten an Google übertragen.
- **Gewicht beim ersten Laden:** ca. 100 KB inkl. Schriften (HTML ~9 KB, CSS ~11 KB, JS ~5.5 KB gzip, zwei Schriftdateien ~70 KB, Brot-Grafiken ~7 KB).
  Die Produktbilder (~10 KB pro Stück) werden erst beim Scrollen geladen.
- **Bewegung:** reines CSS + ein kleiner rAF-Loop, keine Animations-Library. Ist auf dem Gerät «Bewegung reduzieren» aktiv,
  bleibt die Seite ruhig (alle Inhalte sofort sichtbar).

## Struktur

```
index.html              Sprachweiche → /de/ oder /ar/ (je nach Browsersprache)
de/index.html           One-Pager Deutsch
de/impressum.html
de/datenschutz.html     Mustertext nach revDSG (vor Livegang prüfen lassen)
ar/…                    Dieselben Seiten auf Arabisch, dir="rtl"
assets/css/style.css    Gesamtes Design (mobile first, logische CSS-Properties für RTL)
assets/js/site-config.js  ← Jobs, WhatsApp-Nummer und Formular-Empfänger hier eintragen
assets/js/main.js       Menü, Formular, Karte nach Klick, Scroll-Effekte (Reveal, Parallax, Schritte, Zitat), Magnet-Buttons
assets/img/art/*.svg    Texturierte Illustrationen (Brot, Produkte, Ofen) – Platzhalter, bis echte Fotos da sind
sitemap.xml, robots.txt
```

## Lokal ansehen

```bash
cd alpascha-redesign
python3 -m http.server 8000
# → http://localhost:8000/de/  und  http://localhost:8000/ar/
```

## Alltags-Pflege (ohne Programmierkenntnisse)

Alles in `assets/js/site-config.js`:

- **Jobs:** Einen Eintrag in `jobs: [ … ]` ergänzen (Beispiel steht in der Datei). Ist die Liste leer,
  steht auf der Website „Zurzeit sind keine Stellen offen“.
- **WhatsApp:** Nummer bei `whatsapp` eintragen (z. B. `"41791234567"`). Alle WhatsApp-Buttons funktionieren dann.
- **Formular:** Ziel-URL bei `formEndpoint` eintragen (z. B. Formspree, Netlify Forms oder ein PHP-Skript auf dem
  eigenen Hosting). Solange das Feld leer ist, läuft das Formular im **Konzept-Modus**: Die Eingaben werden geprüft und
  die Erfolgsmeldung erscheint, aber es werden **keine Daten gesendet**.

## Fotos einsetzen

Jedes Bild steht in einem `<figure class="media wipe">` (die Klasse `wipe` sorgt für den Aufzieh-Effekt).
Die Foto-Slots «Foto folgt» (`media--slot`) werden einfach durch ein Bild ersetzt. Für echte Fotos das `<img>` durch ein `<picture>` mit AVIF/WebP
ersetzen und die `figcaption` mit dem Platzhalter-Label entfernen:

```html
<picture>
  <source type="image/avif" srcset="../assets/img/fladenbrot-800.avif 800w, ../assets/img/fladenbrot-1600.avif 1600w" sizes="(min-width: 900px) 50vw, 100vw">
  <source type="image/webp" srcset="../assets/img/fladenbrot-800.webp 800w, ../assets/img/fladenbrot-1600.webp 1600w" sizes="(min-width: 900px) 50vw, 100vw">
  <img src="../assets/img/fladenbrot-800.jpg" alt="…" width="800" height="800" loading="lazy" decoding="async">
</picture>
```

Das Hero-Bild behält `fetchpriority="high"` und **kein** `loading="lazy"`.

## Vor dem Livegang

- [ ] Alle Platzhalter `[…]` ersetzen (Liste in KONZEPT.md)
- [ ] `geo` (Koordinaten) im JSON-LD beider Startseiten ergänzen
- [ ] `og:image` (1200×630) ergänzen
- [ ] `formEndpoint` und `whatsapp` in `site-config.js` setzen
- [ ] Datenschutzerklärung an die eingesetzten Dienste anpassen und rechtlich prüfen lassen
- [ ] Konzept-Hinweise entfernen (`.concept-footnote` im Footer, `.concept-note` im Formular)
- [ ] Sprachweiche auf dem Server als 302-Weiterleitung lösen (optional)
- [ ] Google Search Console: Sitemap einreichen

## Werkzeuge (optional)

`tools/generate-art.py` erzeugt die texturierten Produkt-Illustrationen neu (`python3 tools/generate-art.py assets/img/art`).
Für den Betrieb der Website wird es nicht gebraucht.
