# Bäckerei alpascha: Redesign-Konzept

## 1. Design rationale (for the agency)

**The visitor we design for** is the owner of a shop, restaurant, kebab or falafel place or catering business.
They open the site on a phone, often between jobs, and want answers to three questions: *Do they deliver to me?
What do they have? How do I start?* Every layout decision serves those three questions.

### Why this layout works for B2B customers

| Decision | Why |
|---|---|
| **Request CTA in four places**: header button, hero, B2B section, and a sticky bar on mobile (Anrufen · WhatsApp · Anfrage) | The next step is always one tap away, wherever the visitor stops scrolling. Calling and WhatsApp get the same weight as the form, because many small gastro owners would rather call than type. |
| **Hero states the offer and the proof** (H1 + three chips: Seit 2014 · erste industrielle Fladenbrot-Bäckerei der Schweiz · Lieferung an Handel & Gastronomie) | The visitor learns what the business does, why to trust it and that it serves businesses within about 3 seconds. The phone number sits right under the buttons. |
| **Fact strip with the delivery area as the 4th item** | Delivery area is the first thing a B2B buyer checks. It is kept as a placeholder until the owner confirms it. |
| **Products as large picture cards, flatbread first and twice the size of the others** | Flatbread is the main product and the reason customers come back, so it gets the largest card. Each card has an "Anfragen" button that **pre-ticks that product in the form** and scrolls there, which saves a step. |
| **"So werden Sie Kunde" in 3 steps + conditions box** (area, days, minimum order, prices) | The steps explain how to become a customer, which the current site never does. The conditions box shows the possible deal-breakers up front, so fewer requests go nowhere. |
| **Short form**: 6 required fields, products as tap-friendly checkboxes, quantity is a free estimate | Enough information to prepare an offer without scaring off a busy owner. Errors are shown per field, with an error summary and focus on the first invalid field. |
| **Trust section uses only real facts + slots for real photos** (bakery, oven, delivery van, team) | Real photos of the bakery build more trust than any stock image. The illustrated placeholders show where each photo goes and what it should show. |
| **Jobs are data, not layout** | The owner (or agency) edits one list in `site-config.js`. When the list is empty, the site honestly says that there are currently no open positions. |

### Visual language
- **Colours:** wheat/sand backgrounds (`#FBF6EE`, `#F3E8D6`), deep warm brown text (`#2B1D14`, 15:1 contrast), and **one** fresh herb green for all actions (`#2D6A4F`, 6.4:1 with white text). Crust gold is used only for decoration and icons.
- **Type:** *Readex Pro* has Latin and Arabic designed as one family, so DE and AR look like the same brand. It is self-hosted (no Google request) and one variable file per script covers all weights. Body text is 17 px (Arabic 18 px with more line height), so it is readable on phones.
- **Motion:** only a soft fade/rise when sections scroll into view. It is fully disabled with `prefers-reduced-motion`.
- **RTL:** the Arabic version is the same markup with `dir="rtl"`. All spacing uses logical CSS properties, so the layout mirrors automatically. Arrows flip, and phone numbers, emails and addresses stay LTR.

### SEO
- Unique `<title>`/description per page and language, `hreflang` de/ar/x-default, canonical URLs, `sitemap.xml` with alternates, `robots.txt`.
- JSON-LD `Bakery` (a LocalBusiness subtype) with address, phone, email, founding year and product catalogue. **`geo` is left out on purpose** until the coordinates are confirmed.
- Real text content on target terms, worked in naturally: *arabisches Fladenbrot*, *Aesch bei Basel*, *Handel & Gastronomie*, *Grosshandel* (form option), plus Arabic *خبز عربي … سويسرا*.
- **Held back:** *"Pita"* (for "Pita Lieferant Schweiz") is not used yet, because calling their product pita is a product claim. See question C4.
- Recommended outside the website: set up and maintain a **Google Business Profile** (opening hours, photos, category "Bäckerei"/"Grosshändler"). For local search it matters more than anything on the site.

### Privacy & quality
- No cookies, no tracking, fonts self-hosted, **Google Map loads only after a click** (revDSG-friendly), honeypot spam protection instead of reCAPTCHA.
- Tested in Chromium at 390 px and 1366 px, DE + AR: **0 axe-core WCAG 2 A/AA violations**, no horizontal scroll, no console errors, and the form flow (errors → preselect → success) checked.
- About 60 KB transferred per page (gzip, including the font). No libraries.

### Where the wording differs from the brief
- The brief's example subline says "erste Fladenbrot-Bäckerei der Schweiz". The site says **"erste *industrielle* Fladenbrot-Bäckerei der Schweiz"**, because that is the claim on the current website.
- "Eigene Lieferung / mit eigenen Chauffeuren" is inferred from the fact that they hire drivers. The owner should confirm it (C3).
- The target groups (shops, restaurants, kebab/falafel, catering) are worded as an **invitation** ("Sie führen …?"), not as a claim about existing customers.

---

## 2. Fragen an die Inhaberschaft (alle Platzhalter)

*Diese Liste kann so an Bäckerei alpascha geschickt werden.*

### A. Fotos (am besten an einem Shooting-Tag in der Backstube)
1. **Hero:** frisches Fladenbrot, gestapelt oder direkt aus dem Ofen (Querformat und Hochformat)
2. Fladenbrot, Detailaufnahme (Struktur, Kruste)
3. Hummus & Tahina
4. Eingelegte Gurken & Oliven
5. Olivenöl
6. Reis & Bulgur
7. Sortiment / Lager (Regale mit den Produkten)
8. Backstube & Ofen in Betrieb
9. Lieferwagen (mit Beschriftung, falls vorhanden)
10. Team (oder einzelne Mitarbeitende bei der Arbeit, nur mit deren Einverständnis)
11. Haben Sie Ihr **Logo als Vektordatei** (SVG/AI/PDF)? *Im Konzept steht ein neutraler Entwurf.*
12. Ein Bild für Social Media / Link-Vorschau (wird aus den Fotos oben erstellt)

### B. Lieferung & Konditionen
1. **Liefergebiet:** Welche Regionen/Kantone beliefern Sie?
2. **Liefertage und Zeitfenster:** An welchen Tagen, zu welchen Zeiten?
3. **Mindestbestellmenge** oder Mindestbestellwert?
4. **Preise:** „auf Anfrage“ oder eine Preisliste (nur für registrierte Kundschaft)?
5. **Reaktionszeit:** Bis wann erhält ein Neukunde ein Angebot (z. B. „innert 2 Arbeitstagen“)?
6. **Öffnungszeiten:** Büro/Telefon? Ist eine **Abholung vor Ort** möglich, und wann?

### C. Angebot & Kundschaft
1. **Fladenbrot:** Welche Sorten und Grössen gibt es? Wie viele Stück pro Beutel bzw. Karton?
2. **Gebinde/Packungsgrössen** für Hummus, Tahina, Gurken, Oliven, Olivenöl, Reis und Bulgur
3. Dürfen wir schreiben, dass Sie **mit eigenen Chauffeuren** ausliefern?
4. Wie nennen Sie Ihr Brot? Dürfen wir auch Begriffe wie **„Pita“** oder **„Chubz“** verwenden (wichtig für Google)?
5. **Kundengruppen:** Beliefern Sie Läden, Restaurants, Kebab-/Falafel-Lokale, Caterer und Grosshändler? Gibt es weitere?
6. Gibt es eine **aktuelle Sortimentsliste** (PDF), die wir verlinken dürfen?
7. Möchten Sie **Referenzkunden** nennen (nur mit deren Einverständnis)?
8. Gibt es eine kurze **Firmengeschichte** (Gründung, Familie, Herkunft der Rezepte), die wir erzählen dürfen?
9. Ist Ihr Brot zertifiziert (z. B. Halal), oder gibt es Angaben wie vegan oder ohne Zusatzstoffe, die wir **belegt** nennen dürfen?

### D. Kontakt & Technik
1. **WhatsApp-Nummer** für Geschäftskunden (Handy oder WhatsApp Business?)
2. An welche **E-Mail-Adresse** sollen Formular-Anfragen gehen? Wer beantwortet arabische Anfragen?
3. Bleibt die Domain **baeckerei-alpascha.ch**? Wer ist der aktuelle **Hosting-Anbieter**?
4. Ist die Einbindung von **Google Maps** (nach Klick) in Ordnung, oder lieber OpenStreetMap?
5. Haben Sie ein **Google-Unternehmensprofil**? Wer hat Zugriff?

### E. Jobs
1. Stimmt es, dass **zurzeit keine Stellen offen** sind?
2. An welche Adresse gehen **Bewerbungen**, und wer ist Ansprechperson?
3. Sollen Stelleninserate **auch auf Arabisch** erscheinen?

### F. Rechtliches (Impressum & Datenschutz)
1. **Vertretungsberechtigte Person(en)** (Name, Funktion)
2. **Handelsregisteramt**, **UID** (CHE-…) und **MWST-Nummer**
3. **Ansprechperson für Datenschutz**
4. **Aufbewahrungsfristen** für Anfragen und Bewerbungen
5. Gilt bei Impressum und Datenschutz die **deutsche Fassung als verbindlich**? (So ist es in der arabischen Version vermerkt.)

### G. Arabische Version
1. Gibt es eine **arabische Schreibweise des Firmennamens** (z. B. auf Verpackungen)? *Im Konzept bleibt „alpascha“ in lateinischer Schrift.*
2. Gibt es eine bevorzugte arabische Schreibweise für **Aesch**? *Im Konzept bleibt „Aesch“ in lateinischer Schrift, passend zur Postadresse.*
3. Kann eine arabischsprachige Person aus Ihrem Team die Texte vor dem Livegang **gegenlesen**?
