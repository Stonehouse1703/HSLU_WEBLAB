#import "../template/hslu-template.typ": note, tip, warning, todo, badge

= Zielerreichung & Soll-Ist-Vergleich

== Funktionaler Soll-Ist-Vergleich
Die nachfolgende Tabelle vergleicht die zu Beginn definierten Anforderungen mit dem tatsächlich erreichten Umsetzungsstand:

#table(
  columns: (auto, 1fr, auto, 1fr),
  table.header([*Anforderung*], [*Soll-Beschreibung*], [*Status*], [*Ist-Zustand / Bemerkung*]),
  [F01 - Auth], [Registrierung, Login, JWT-Generierung], [#badge("Erfüllt", color: rgb("#16a34a"))], [Vollständig implementiert inkl. Validierung und Secure Token Handling.],
  [F02 - CRUD], [Erstellen, Bearbeiten, Löschen und Anzeigen der Kernobjekte], [#badge("Erfüllt", color: rgb("#16a34a"))], [Vollständig mit Bestätigungsdialogen und Optimistic UI Updates.],
  [F03 - Filter/Suche], [Dynamische Filterung & Volltextsuche im Frontend], [#badge("Erfüllt", color: rgb("#16a34a"))], [Debounced Search mit client-seitigem Caching.],
  [F04 - Responsive UI], [Nutzbarkeit auf Desktop, Tablet und Smartphone], [#badge("Erfüllt", color: rgb("#16a34a"))], [Responsive Breakpoints getestet auf gängigen Bildschirmgrössen.],
  [F05 - Zusatzfeature], [Erweitertes Feature (z. B. Export, Dark Mode, Statistiken)], [#badge("Teilweise", color: rgb("#d97706"))], [Grundversion vorhanden, weitere Visualisierungen als Ausblick.],
)

== Nicht-funktionale Anforderungen
- *Performance:* Ladezeiten liegen deutlich unter den anvisierten Grenzwerten. Initial Load $< 1.2"s"$.
- *Code-Qualität:* TypeScript Strict Mode ohne Typfehler, saubere Formatierung über Linter.
- *Testabdeckung:* Wichtigste Business-Services und Controller sind mit Unit-Tests abgedeckt.
