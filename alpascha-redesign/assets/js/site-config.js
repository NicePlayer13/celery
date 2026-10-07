/* ==========================================================================
   Bäckerei alpascha – zentrale Einstellungen
   Diese Datei ist die EINZIGE Stelle, die für Alltags-Änderungen
   angepasst werden muss (Jobs, WhatsApp, Formular-Empfänger).
   ========================================================================== */
window.ALPASCHA_CONFIG = {
  /* WhatsApp-Nummer im internationalen Format OHNE "+" und ohne Leerzeichen,
     z. B. "41791234567". Leer lassen = Platzhalter (Buttons zeigen Hinweis). */
  whatsapp: "",

  /* Ziel-URL für das Anfrageformular (z. B. Formspree, Netlify Forms oder
     eigenes PHP-Skript). Leer lassen = Konzept-Modus: Es wird NICHTS gesendet,
     die Erfolgsmeldung wird nur simuliert. */
  formEndpoint: "",

  /* Offene Stellen. Leere Liste = "Zurzeit keine offenen Stellen".
     Beispiel für einen Eintrag (Kommentarzeichen entfernen):

     {
       id: "chauffeur-2027",
       de: { title: "Chauffeur/in Kat. C1 (80–100 %)", text: "Auslieferung an unsere Kundschaft …", type: "Festanstellung" },
       ar: { title: "سائق/سائقة (فئة C1) بنسبة 80–100٪", text: "توصيل الطلبيات إلى زبائننا …", type: "وظيفة دائمة" }
     },
  */
  jobs: []
};
