#import "../template/hslu-template.typ": note, tip, warning, todo

= Bausteinsicht

== Gesamtsystem (Ebene 1)
Das Gesamtsystem gliedert sich in eine klassische 3-Schichten-Architektur:

#block(
  fill: rgb("#f8fafc"),
  inset: 12pt,
  radius: 4pt,
  stroke: rgb("#e2e8f0"),
  [
    #grid(
      columns: (1fr, auto, 1fr, auto, 1fr),
      align: (center + horizon, center + horizon, center + horizon, center + horizon, center + horizon),
      [
        #rect(width: 100%, fill: rgb("#e0f2fe"), stroke: rgb("#0284c7"), radius: 4pt, inset: 10pt)[
          *Frontend (SPA)*\
          #text(size: 8.5pt)[UI, Routing, State]
        ]
      ],
      [ $arrow.r.l$ \ #text(size: 8pt)[JSON/HTTP] ],
      [
        #rect(width: 100%, fill: rgb("#ecfdf5"), stroke: rgb("#059669"), radius: 4pt, inset: 10pt)[
          *Backend API*\
          #text(size: 8.5pt)[Controller, Services]
        ]
      ],
      [ $arrow.r.l$ \ #text(size: 8pt)[SQL/Driver] ],
      [
        #rect(width: 100%, fill: rgb("#fef3c7"), stroke: rgb("#d97706"), radius: 4pt, inset: 10pt)[
          *Datenbank*\
          #text(size: 8.5pt)[Persistenz & Schema]
        ]
      ]
    )
  ]
)

== Frontend-Bausteine (Ebene 2)
Das Frontend ist nach Feature-Modulen und Shared-Komponenten modularisiert:

- *Core / App-Shell:* Grundlegendes Layout, Header, Navigation, globale Interceptoren und State-Services.
- *Feature-Module:* Kapselung von fachlichen Domänen (z. B. Authentifizierung, Dashboard, Datenansicht, Einstellungen).
- *Shared / UI-Components:* Wiederverwendbare atomare UI-Elemente (Buttons, Modals, Form Controls, Tables).
- *Services & API-Clients:* Datenabruf, Caching und Synchronisation mit dem Backend.

== Backend-Bausteine (Ebene 2)
Das Backend folgt dem Schichtenmodell zur Trennung von Belangen (Separation of Concerns):

1. *Controller / Routing-Layer:* Entgegennahme von HTTP-Requests, Validierung der Payloads (DTOs) und HTTP-Response-Handling.
2. *Service- / Business-Logic-Layer:* Zentrale Geschäftslogik, Domain-Validierung und Orchestrierung.
3. *Data Access / Repository-Layer:* Abstraktion des Datenbankzugriffs, CRUD-Operationen und Transaktionsverwaltung.
4. *Middleware:* Authentifizierung (JWT Verification), Logging, CORS und globales Error-Handling.
