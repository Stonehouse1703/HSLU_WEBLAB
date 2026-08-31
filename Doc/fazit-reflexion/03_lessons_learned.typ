#import "../template/hslu-template.typ": note, tip, warning, todo

= Erkenntnisse & Lessons Learned

== Technische Erkenntnisse
Im Verlauf des Projekts wurden wertvolle technische Erfahrungen gesammelt:

- *TypeScript im Fullstack-Umfeld:* Die gemeinsame Nutzung von Interfaces/DTOs zwischen Frontend und Backend reduzierte Schnittstellenfehler massiv und beschleunigte die Entwicklung.
- *Zustandsverwaltung (State Management):* Ein klares unidirektionales Datenfluss-Muster verhinderte Race Conditions und Inkonsistenzen bei asynchronen API-Aufrufen.
- *Effiziente Toolchains:* Moderne Build-Tools (z. B. Vite / Angular CLI / Typst) verkürzten Feedback-Schleifen im Vergleich zu älteren Setups erheblich.

== Aufgetretene Herausforderungen & Lösungen

#table(
  columns: (auto, 1fr, 1fr),
  table.header([*Herausforderung*], [*Problemursache*], [*Ergriffene Lösung*]),
  [CORS & Auth-Cookies], [Unterschiedliche Ports bei lokaler Entwicklung für Frontend (4200/5173) und Backend (3000).], [Einrichtung eines Reverse Proxys in der Dev-Konfiguration sowie korrekte `Access-Control-Allow-Credentials` Header.],
  [Asynchrones State-Handling], [UI flackerte bei schnellen aufeinanderfolgenden Filter-Eingaben.], [Einsatz von Debouncing ($300"ms"$) und Abbrechen noch laufender HTTP-Requests (AbortController).],
  [Komplexe Datenbankabfragen], [N+1 Abfrageproblem bei verschachtelten Entitäten.], [Optimierung der ORM-Abfragen via Eager-Loading bzw. gezielte `JOIN`-Statements.],
)
