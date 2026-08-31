#import "../template/hslu-template.typ": note, tip, warning, todo

= Einführung & Ziele

== Aufgabenstellung & Motivation
#todo[Beschreiben Sie hier kurz die Problemstellung und die Vision des WebLab-Projekts. Was ist das Hauptziel der Webapplikation?]

Die vorliegende Webanwendung wurde im Rahmen des Moduls *WebLab* an der Hochschule Luzern (Departement Informatik) entwickelt. Ziel ist es, eine modulare, performante und benutzerfreundliche Webanwendung zu realisieren, welche moderne Best Practices im Fullstack-Bereich demonstriert.

== Qualitätsziele
Die zentralen Qualitätsziele orientieren sich an ISO/IEC 25010 und sind in folgender Priorität definiert:

#table(
  columns: (auto, auto, 1fr),
  table.header([*Priorität*], [*Qualitätsmerkmal*], [*Konkretisierung / Messbarkeit*]),
  [1], [Benutzerfreundlichkeit (Usability)], [Intuitive Bedienung, konsistentes UI/UX, Reaktionszeit bei Interaktionen < 100ms.],
  [2], [Wartbarkeit (Maintainability)], [Saubere modulare Trennung (Clean Architecture / Komponenten), TypeScript Typisierung, Testabdeckung.],
  [3], [Zuverlässigkeit (Reliability)], [Robuste Fehlerbehandlung im Frontend & Backend, Valide Datenvalidierung auf API-Ebene.],
  [4], [Performance], [Optimierte Asset-Bundles, schnelles Initial Rendering (< 1.5s First Contentful Paint).],
  [5], [Sicherheit (Security)], [Sichere Authentifizierung, Schutz vor XSS/CSRF, Input-Sanitizing.],
)

== Stakeholder & Zielgruppen

#table(
  columns: (auto, auto, 1fr),
  table.header([*Rolle / Stakeholder*], [*Erwartungshaltung*], [*Bedeutung für das System*]),
  [Endbenutzer], [Schnelle, selbsterklärende und fehlerfreie Nutzung der Kernfunktionen.], [Direkte Interaktion mit dem Frontend.],
  [Dozierende / Experten], [Technisch saubere Umsetzung, Einhaltung der WebLab-Vorgaben, Dokumentation.], [Bewertung & Abnahme.],
  [Entwickler / Betreiber], [Gute Erweiterbarkeit, klare Code-Struktur, einfaches lokales Setup und Deployment.], [Wartung und Weiterentwicklung.],
)
