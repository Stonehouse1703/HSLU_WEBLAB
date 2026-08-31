#import "../template/hslu-template.typ": note, tip, warning, todo, badge

= Übersicht & Zeitbudget

== Zielsetzung des Arbeitsjournals
Das Arbeitsjournal dient der kontinuierlichen Erfassung aller im Rahmen des Moduls WebLab erbrachten Arbeitsleistungen, Meilensteine, Herausforderungen und Zwischenentscheidungen. Es stellt die Nachvollziehbarkeit des Entwicklungsprozesses sicher.

== Zeitbudget-Übersicht (Soll / Ist)
Das Modul umfasst ein Richtpensum von insgesamt ca. 90 bis 120 Arbeitsstunden (bzw. gemäss Modulvorgabe ECTS).

#table(
  columns: (auto, 1fr, auto, auto, auto),
  table.header([*Phase*], [*Arbeitspaket / Themenbereich*], [*Soll (h)*], [*Ist (h)*], [*Status*]),
  [1], [Initialisierung, Recherche & Setup], [15.0], [14.5], [#badge("Abgeschlossen", color: rgb("#16a34a"))],
  [2], [Architektur, Datenmodell & API-Design], [20.0], [19.0], [#badge("Abgeschlossen", color: rgb("#16a34a"))],
  [3], [Backend-Entwicklung & Authentifizierung], [25.0], [26.0], [#badge("Abgeschlossen", color: rgb("#16a34a"))],
  [4], [Frontend-Entwicklung (UI & State-Management)], [30.0], [32.5], [#badge("Abgeschlossen", color: rgb("#16a34a"))],
  [5], [Testing, Bugfixing & Optimierung], [15.0], [13.0], [#badge("Abgeschlossen", color: rgb("#16a34a"))],
  [6], [Dokumentation (Architektur, Journal, Reflexion)], [15.0], [14.0], [#badge("Abgeschlossen", color: rgb("#16a34a"))],
  table.hline(stroke: 1.5pt + rgb("#1a2b49")),
  [*Total*], [*Gesamtaufwand*], [*120.0*], [*119.0*], [#badge("100%", color: rgb("#005ea8"))],
)
