#import "../template/basic-wipro.typ": basic-wipro

#show: basic-wipro.with(
  logo: image("../assets/hslu-logo.svg", width: 30%),
  title: "Arbeitsjournal",
  subtitle: "Skitourenverwaltung & 3x3-Sicherheitsmatrix",
  project-type: "WEBLAB",
  students: ("Colin Felber",),
  year: "2026",
  supervisor: "Dominik Witschard",
  show-declaration: false,
)

= Arbeitsjournal & Zeitaufwand
#table(
  columns: (auto, 1fr, auto),
  align: (center + horizon, left + horizon, center + horizon),
  table.header([*Datum*], [*Tätigkeit(en) & Meilensteine*], [*Aufwand*]),
  [31.08.2026], block(breakable: false)[
    *Themenfindung & Projekt-Setup*
    - Erarbeitung der Projektidee (Skitourenverwaltung mit 3x3-Sicherheitsmatrix)
    - Initialisierung des Git-Repositories und Erstellung der README
    - Einrichtung des HSLU-Dokumentationstemplates (Typst) und Konfiguration der Dokumente
  ], [2.5 h],
  [01-02.09.2026], block(breakable: false)[
    - Architektur- und Scope-Entscheid (Angular Standalone, NestJS, MongoDB)
    - Initialisierung der Angular-Applikation, Routing und Root-Layout
    - Entwurf der responsiven Navigationskomponente
  ], [4.0 h],
  [09.09.2026], block(breakable: false)[
    *Frontend UI-Prototyping & Komponenten*
    - Entwicklung der Tourenübersicht
    - Implementierung der Tourendetailansicht und Teilnehmer-Karten
    - Erstellung der Landingpage (Home-Page) mit Unterstützung generativer KI
  ], [6.0 h],
  [11.09.2026], block(breakable: false)[
    *Fullstack-Setup: NestJS & MongoDB*
    - Trennung von Personenprofil und Notfalldaten im Frontend
    - Containerisierung: Erstellung des Frontend-Dockerfiles (Nginx)
    - Setup von MongoDB und Mongo-Express via Docker Compose
    - Initialisierung des NestJS-Backends und erste REST-Controller
  ], [6.5 h],
  [12.09.2026], block(breakable: false)[
    *Backend-Tourenverwaltung & API-Integration*
    - Definition der Mongoose-Schemas für Touren und Benutzer
    - Implementierung des `TourApiService` im Frontend zur REST-Kommunikation
    - Rollenmodell (Tourenleiter vs. Teilnehmer) und Abmeldefunktion für Touren
  ], [5.0 h],
  [14.09.2026], block(breakable: false)[
    *Tourenerstellung & Einstieg in Authentifizierung*
    - Formular zur Tourenerstellung
    - Modulares Refactoring des NestJS-Backends (`tours`, `users`)
    - Erste Implementierung des Authentifizierungsmoduls (Login-Schnittstelle)
    - Datenisolation: Benutzer sehen im Dashboard nur noch eigene Touren
  ], [5.5 h],
  [19.09.2026], block(breakable: false)[
    *Autorisierung, GPX-Karten & Notfallkontakte*
    - Rollenbasierte Zugriffskontrolle (nur Leiter darf Touren bearbeiten/löschen)
    - Schutz sensibler Notfallkontakte (nur für bestätigte Tourenteilnehmer einsehbar)
    - Einbindung von Leaflet und Leaflet-GPX zur Streckenvisualisierung (inkl. Lifecycle-Fix)
    - Benutzerregistrierung, Profilverwaltung und Validierung des Tourenbeitritts
    - Filterlogik zur automatischen Archivierung vergangener Touren
  ], [7.5 h],
  [21.09.2026], block(breakable: false)[
    *3x3 Sicherheitsmatrix, Datumsformat & Security-Audit*
    - Implementierung der 3x3-Sicherheitsmatrix (Formular und interaktive Anzeige)
    - Lawinenwarnstufen, Beurteilung von Verhältnissen, Gelände und Gruppe
    - Refactoring der Datumsformatierung auf Schweizer Standard (`dd/MM/yyyy`)
    - KI-gestütztes Security-Audit
    - Token-Ablauf auf 1 Stunde begrenzt & automatischer Logout bei 401 über Interceptor
  ], [6.0 h],
  [22.09.2026], block(breakable: false)[
    *Testumgebung & Frontend Unit-Tests*
    - Evaluierung und Einrichtung der Vitest-Testumgebung im Angular-Frontend
    - Konfiguration von Mocks und erste Unit-Tests für Angular-Services
  ], [3.0 h],
  [23.09.2026], block(breakable: false)[
    *Tests: Unit, Integration & Cypress E2E*
    - Erstellung umfassender Unit-Tests für Dumb Components (Buttons, Cards, Badges, Errors)
    - Backend-API-Integrationstests (`api.integration.spec.ts`) gegen laufende Controller
    - Aufbau der vollständigen Cypress E2E-Testsuite für End-to-End-Benutzerflüsse
  ], [4.5 h],
  [24.09.2026], block(breakable: false)[
    *Backend DTO-Validierung*
    - Implementierung einheitlicher DTOs für alle Request-Payloads
    - Validierungslogik mit `class-validator` und `class-transformer` für 400 Bad Request API-Fehler
    - Implementierung des colors.css
  ], [4.5 h],
  [25.09.2026], block(breakable: false)[
    *Clean Code, Arc42 Doku & Finalisierung*
    - Zweite implementierung des colors.css (wurde vergessen zu pushen und der Computer war nicht mehr in Reichweite) 
    - Refactoring der Authentifizierung auf NestJS Passport, JWT und Bcrypt
    - Erstellung der vollständigen Arc42-Architekturdokumentation und PlantUML-Diagramme
    - Docker Build Cache Bereinigung und Behebung von Leaflet-Initialisierungsfehlern
    - Verfassen von Fazit & Reflexion sowie Finalisierung des Arbeitsjournals
  ], [7.5 h],
  table.cell(colspan: 2, [*Total geleisteter Arbeitsaufwand*]),
  [*62.5 h*],
)

Dabei wurden die Zeiten leider nicht immer genau getrackt (vergessen zu Starten oder zu Stoppen), deshalb mussten einige geschätzt werden. Zudem wurden die Zeiten für die genauere Analyse des Demoprojekts sowie für das Online-Tutorial von Angular nicht aufgeführt.
