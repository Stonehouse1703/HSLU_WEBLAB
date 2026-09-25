#import "../template/basic-wipro.typ": basic-wipro

#show: basic-wipro.with(
  logo: image("../assets/hslu-logo.svg", width: 30%),
  title: "Architekturdokumentation",
  subtitle: "Skitourenverwaltung & 3x3 Sicherheitsmatrix (arc42 v8)",
  project-type: "WEBLAB",
  students: ("Colin Felber",),
  year: "2026",
  supervisor: "Dominik Witschard",
  show-declaration: false,
)

= Introduction & Goals

Wer eine Skitour für eine Gruppe leitet, trägt viel Verantwortung. Kommt es zu einem Notfall am Berg, muss die Tourenleitung sofort die Notfallkontakte der Teilnehmenden griffbereit haben. Zudem fordert die Rechtsprechung im Ernstfall den Nachweis einer sorgfältigen Tourenplanung nach anerkannten Standards, insbesondere der 3x3-Sicherheitsmatrix (Verhältnisse, Gelände, Mensch).

Normale Chat-Apps oder Vereins-Tools reichen dafür nicht aus: 

Notfallkontakte fehlen oder sind unauffindbar, und die 3x3-Planung kann nirgends strukturiert festgehalten werden. Die vorliegende Webapplikation schliesst diese Lücke.

== Qualitätsziele
#table(
  columns: (auto, 1.2fr, 2.5fr),
  [*Prio*], [*Qualitätsziel*], [*Bedeutung für die Applikation*],
  [1], [Datenschutz & Vertraulichkeit], [Notfallkontakte sind hochsensibel. Ausschliesslich autorisierte Tourenleiter der jeweiligen Tour dürfen sie einsehen (Principle of Least Privilege).],
  [2], [Schnelligkeit & Usability], [Schnelle Bedienung am Handy und Desktop. Die 3x3-Matrix ist in wenigen Minuten ausgefüllt, Notfallkontakte sind mit einem Klick sichtbar.],
  [3], [Wartbarkeit & Testbarkeit], [Klare Entkopplung: Smart/Dumb-Muster im Frontend, modularer Monolith mit NestJS im Backend, abgesichert durch Unit- und Cypress-E2E-Tests.],
  [4], [Ein-Befehl-Start], [Vollständiger Start des Stacks via `docker compose up --build` ohne manuelle Vorabinstallation von Node oder Datenbanken.],
)

== Stakeholder
#table(
  columns: (1fr, 1.4fr, 2.2fr),
  [*Rolle*], [*Wer ist das?*], [*Erwartungshaltung*],
  [Tourenleiter/in], [Leiter/in von SAC- oder privaten Touren], [Strukturierte 3x3-Dokumentation zur rechtlichen Absicherung, Teilnehmerübersicht und Notfallkontakte im Ernstfall.],
  [Teilnehmende], [Mitglieder der Tourengruppe], [Einfacher Beitritt per Link, Übersicht zu Treffpunkt, Route und Ausrüstung, garantierter Schutz der Notfalldaten.],
  [Dozent / Experte], [Dominik Witschard (HSLU)], [Klare Softwarearchitektur, nachvollziehbar begründete Technologiewahl, Testabdeckung und verständlicher Code.],
)

= Context & Scope

== Fachlicher Kontext
Das System fokussiert sich auf die Planung, Durchführung und rechtliche Absicherung von Touren. Externe Daten (SLF-Lawinenbulletin, Wetterdaten) werden vom Tourenleiter manuell in die 3x3-Matrix übertragen. GPX-Routentracks können als Datei hochgeladen werden.

#figure(
  image("diagrams/01_kontext_abgrenzung.svg", width: 90%),
  caption: [Systemkontext: Benutzer, Schnittstellen und Umsysteme (PlantUML: 01_kontext_abgrenzung.puml)],
)

== Technischer Kontext
- Der Browser kommuniziert über HTTP (Port 80) mit Nginx.
- Nginx leitet API-Aufrufe (`/api/*`) intern an das NestJS-Backend (Port 4566) weiter.
- Das Backend greift über das MongoDB-Wire-Protokoll (Port 27017) auf die Datenbank zu.

== In Scope
#list(marker: "+",
  [*Touren-CRUD*: Erstellen, Bearbeiten, Löschen und Detailansicht von Touren.],
  [*Digitale 3x3-Sicherheitsmatrix*: Strukturierte Risikobeurteilung nach Werner Munter (Verhältnisse, Gelände, Mensch).],
  [*Notfallkontakt-Erfassung*: Hinterlegung bei der Registrierung und Bearbeitung im Profil.],
  [*Geschützter Notfallkontakt-Zugriff*: Zugriff auf Notfalldaten ausschliesslich für autorisierte Tourenleiter der jeweiligen Tour.],
  [*Teilnehmer- und Rollenverwaltung*: Beitritt per Link und Verwaltung von Leiter- und Teilnehmerrollen.],
  [*GPX-Routenupload*: Hochladen und Anzeigen von GPX-Tracks direkt in der Tour.],
)

== Out of Scope
#list(marker: "-",
  [*Native Mobile Apps*: Keine eigenständigen Apps für iOS oder Android (reine responsive Web-App).],
  [*Automatisches Lawinenbulletin*: Kein API-Scraping von SLF- oder Wetterdiensten (manuelle Erfassung).],
  [*E-Mail-Dienste*: Keine E-Mail-Verifikation und kein Passwort-Reset per Mail.],
  [*Live-GPS-Tracking*: Keine Turn-by-Turn-Navigation oder Live-Ortung während der Tour.],
)

= Solution Strategy

Da wir im Modul WebLab freie Technologiewahl hatten, fasst die folgende Tabelle die gewählten Kerntechnologien und die Gründe dafür kurz und bündig zusammen:

#table(
  columns: (1.1fr, 1.4fr, 2.5fr, auto),
  [*Bereich*], [*Gewählte Technologie*], [*Warum gewählt? (Begründung)*], [*ADR*],
  [Backend], [NestJS 11 (TypeScript)], [Klare Schichtenarchitektur (Controller, Service, Modul). Gleiche Denkweise wie Angular und automatische Validierung via `class-validator`.], [ADR-01],[Frontend], [Angular 19 (Standalone & Signals)], [Alles aus einer Hand (Routing, Forms, HTTP). Standalone Components und Signals sparen Modul-Boilerplate und bieten direkte Reaktivität.], [ADR-02],
  [Datenbank], [MongoDB 8.0 & Mongoose], [Hierarchische 3x3-Matrix und Notfallkontakte direkt als BSON einbettbar; keine zeitraubenden SQL-Joins für dynamische Matrixfelder.], [ADR-03],
  [Auth], [`@nestjs/jwt`, Passport & bcrypt], [Standard-Stack im NestJS-Ökosystem: Sicheres Passwort-Hashing via bcrypt und standardisierte JWT-Verwaltung mit Passport ohne fehleranfällige Eigenbau-Krypto.], [ADR-04],
  [Deployment], [Docker Compose & Nginx], [1-Befehl-Start (`docker compose up --build`). Nginx serviert das Frontend und leitet `/api/` weiter; keine CORS-Probleme.], [ADR-05],
  [Architektur], [Smart / Dumb Components], [Smart Container steuern State und API-Calls, Dumb Components zeigen nur an (`@Input`) und melden Events (`@Output`).], [ADR-02],
)

= Building Block View

== Bausteinsicht Level 1: Gesamtsystem Whitebox
Das System läuft vollständig isoliert in Docker Compose:

#figure(
  image("diagrams/02_bausteinsicht_level1.svg", width: 92%),
  caption: [Bausteinsicht Level 1: System-Whitebox mit Containern und Ports (PlantUML: 02_bausteinsicht_level1.puml)],
)

#table(
  columns: (1.2fr, 1.2fr, 2.3fr),
  [*Container*], [*Technologie*], [*Verantwortung & Schnittstellen*],
  [`HSLU_WEBLAB_frontend`], [nginx:alpine], [Haupteinstiegspunkt (Port 80). Liefert das Angular-Bundle aus und proxied `/api/*` an das Backend weiter.],
  [`backend`], [NestJS 11, Node.js 24], [REST-API auf internem Port 4566. Verarbeitet Business-Logik, Validierung und Berechtigungsprüfungen.],
  [`hslu_weblab_mongo`], [mongo:8], [MongoDB-Server auf Port 27017. Speichert Daten dauerhaft im Volume `mongo-data`.],
  [`hslu_weblab_
  mongo_express`], [mongo-express:1], [Web-Admin-Tool auf Port 8081 zur Datenbank-Inspektion während der Entwicklung.],
)

== Bausteinsicht Level 2: Frontend-Architektur
Das Frontend ist nach Features und dem Smart/Dumb-Muster strukturiert:

#figure(
  image("diagrams/03_frontend_architektur.svg", width: 96%),
  caption: [Bausteinsicht Level 2: Frontend-Aufbau mit Smart Containern und Dumb Components (PlantUML: 03_frontend_architektur.puml)],
)

#table(
  columns: (1.2fr, 2.8fr),
  [*Ordner / Bereich*], [*Inhalt & Verantwortung*],
  [`features/tour-management/`], [Tourenübersicht, Detailansicht, Teilnehmerliste, 3x3-Matrix-Anzeige (`TourInformation`, `SecurityMatrixDisplay`).],
  [`features/tour-editor/`], [Formulare zur Tourenerstellung und Bearbeitung der 3x3-Matrix, GPX-Upload (`TourForm`, `SecurityMatrixForm`).],
  [`features/user/`], [Benutzerprofil, Bearbeitung der Notfallkontakte, geschützte Notfallansicht (`UserCard`, `EmergInformation`).],
  [`features/auth/`], [Login- und Registrierungsformulare, `AuthService`, `authInterceptor`, `authGuard`.],
  [`components/`], [Wiederverwendbares UI-Kit (Button, Card, Badge, LoadingSpinner, InputFieldError).],
  [`pipes/`], [Wiederverwendbare Hilfs-Pipes (`ShortenerPipe`).],
)

== Bausteinsicht Level 2: Backend-Architektur
Das Backend ist als modularer Monolith organisiert:

#figure(
  image("diagrams/04_backend_architektur.svg", width: 92%),
  caption: [Bausteinsicht Level 2: NestJS Modular Monolith Struktur (PlantUML: 04_backend_architektur.puml)],
)

- *AppModule*: Wurzelmodul, initialisiert MongoDB/Mongoose, globalen `ValidationPipe` und Telemetrie.
- *AuthModule*: Login, Registrierung, Passwort-Hashing (`bcrypt`) sowie Token-Erstellung via `@nestjs/jwt` und Absicherung via `JwtAuthGuard` (`@nestjs/passport`).
- *UsersModule*: Profilverwaltung; blendet sensible Notfallkontakte bei Standardabfragen immer aus (`.select('-emergencyContact')`).
- *ToursModule*: Touren, 3x3-Sicherheitsmatrix, Rollen (`admin`/`participant`) und autorisierte Notfallkontakt-Abfrage.

= Runtime View

== Szenario 1: Registrierung & Login
Ablauf bei der Registrierung eines neuen Benutzers mit Notfallkontakt:

#figure(
  image("diagrams/05_laufzeitsicht_auth.svg", width: 92%),
  caption: [Laufzeitsicht: Registrierung und Token-Erstellung (PlantUML: 05_laufzeitsicht_auth.puml)],
)

1. Benutzer füllt Formular aus (Name, E-Mail, Passwort, Notfallkontakt) und klickt "Konto erstellen".
2. `ValidationPipe` prüft das `RegisterDto` (E-Mail-Format, Passwort $>= 6$ Zeichen).
3. Backend hasht das Passwort mit Salt via `bcrypt` (10 Salt-Rounds) und speichert die Person in MongoDB.
4. Backend signiert ein JWT via `JwtService` (`@nestjs/jwt`, 1 Stunde gültig) und schickt es zurück.
5. Frontend speichert das Token im `localStorage` und leitet zur Tourenübersicht weiter.

== Szenario 2: Tour erstellen mit 3x3 Sicherheitsmatrix
Ablauf beim Planen und Abspeichern einer Tour:

#figure(
  image("diagrams/06_laufzeitsicht_tour_erstellung.svg", width: 92%),
  caption: [Laufzeitsicht: Tourenerstellung inkl. 3x3-Matrix (PlantUML: 06_laufzeitsicht_tour_erstellung.puml)],
)

1. Tourenleiter erfasst Tourdaten, GPX-Track und füllt die 3x3-Matrix (Lawinenstufe, Wind, Gefahren) aus.
2. `authInterceptor` hängt das JWT als Bearer-Token an den POST-Request an `/api/tours`.
3. `JwtAuthGuard` verifiziert das Token und stellt den User bereit.
4. Controller prüft, dass das Datum nicht in der Vergangenheit liegt (`date >= today`).
5. Service trägt den User in `tourManagerIds` ein und speichert die Tour mit der Matrix in MongoDB.
6. Frontend leitet direkt auf die neue Detailansicht weiter.

== Szenario 3: Tour-Beitritt & Notfallkontakt-Abfrage
Ablauf für Beitritt und Berechtigungsprüfung im Notfall:

#figure(
  image("diagrams/07_laufzeitsicht_notfallkontakt.svg", width: 95%),
  caption: [Laufzeitsicht: Tour-Beitritt und Berechtigungsprüfung (PlantUML: 07_laufzeitsicht_notfallkontakt.puml)],
)

1. *Beitritt*: Teilnehmer klickt "Tour beitreten". Backend fügt seine ID atomar via `$addToSet` in `participantIds` ein.
2. *Notfallkontakt-Abruf*: Klickt der Tourenleiter auf einen Notfallkontakt, prüft das Backend mit `getUserRoleByTour()`:
   - *Ist Tourenleiter*: Gibt Notfallkontakt mit HTTP 200 zurück.
   - *Kein Tourenleiter*: Bricht sofort ab mit HTTP 403 Forbidden.

= Deployment View

#figure(
  image("diagrams/08_verteilungssicht_deployment.svg", width: 92%),
  caption: [Verteilungssicht: Docker Compose Umgebung (PlantUML: 08_verteilungssicht_deployment.puml)],
)

== Container & Multi-Stage Builds
- *Frontend*: Stage 1 (`node:24-slim`) baut Angular (`npm run build`). Stage 2 (`nginx:alpine`) übernimmt nur den fertigen `dist/`-Ordner.
- *Backend*: Stage 1 kompiliert TypeScript. Stage 2 führt nur `dist/` mit Produktions-Dependencies aus.
- *Nginx-Routing*: Serviert Angular per HTML5-Fallback (`try_files $uri /index.html`) und leitet `/api/` an das Backend weiter (`proxy_pass http://backend:4566`). Kein CORS nötig.

= Crosscutting Concepts

== Ownership, Datenschutz & Sicherheit
- *Datenschutz*: Standardabfragen filtern Notfallkontakte immer serverseitig aus (`.select('-emergencyContact')`).
- *Authentifizierung*: Zustandsloses JWT, signiert via `@nestjs/jwt` (1h Lebensdauer) und validiert über eine Passport-JWT-Strategie (`JwtStrategy`). Passwörter werden sicher mit `bcrypt` gehasht (10 Salt-Rounds) und verifiziert.
- *Validierung & NoSQL-Schutz*: Der globale `ValidationPipe` (`whitelist: true, transform: true`) verwirft unbekannte Payload-Felder. Falsche Datumsformate oder NoSQL-Injection-Versuche (z. B. `$gt`, `$where`) werden sofort mit HTTP 400 geblockt, bevor sie die Datenbank erreichen.
- *Fehlerformat (Error Handling)*: NestJS liefert Fehler standardisiert als JSON:
  `{"statusCode": 400, "message": ["..."], "error": "Bad Request"}`.
  Das Frontend wertet `error.message` aus und zeigt sie im UI an. Bei HTTP 401 loggt der `authInterceptor` automatisch aus.

== Datenmodell & Konsistenz
#figure(
  image("diagrams/09_datenmodell_persistenz.svg", width: 60%),
  caption: [Datenmodell: Mongoose Schemas und Beziehungen (PlantUML: 09_datenmodell_persistenz.puml)],
)

- *Eingebettet*: `EmergencyContact` in `Person` (`_id: false`) und `SecurityMatrix` in `Tour`.
- *UUIDs statt MongoDB ObjectIds*: Aus Gewohnheit aus früheren Projekten habe ich IDs manuell als UUIDs (`crypto.randomUUID()`) generiert und Referenzen im Service-Layer per `findByIds({ id: { $in: ids } })` statt via Mongoose-`populate()` aufgelöst. Da dies stabil lief und die Domäne sauber von Datenbank-Interna entkoppelt, habe ich es so beibehalten.

== Frontend-Konzepte & Reaktivität
#table(
  columns: (1fr, 3fr),
  [*Thema*], [*Umsetzung & Ansatz*],
  [Reaktivität], [Angular Signals (`signal`, `computed`) für lokalen State; `httpResource` für deklaratives Laden.],
  [Komponenten-Kommunikation], [Smart Container verwalten State; Dumb Components nutzen ausschliesslich `@Input` und `@Output`.],
  [Change Detection], [`ChangeDetectionStrategy.OnPush` auf allen Komponenten für gute Performance.],
  [Styling & Feedback], [CSS Design-System mit Farbcodes für Lawinenwarnstufen; Validierungsfeedback via `InputFieldError`.],
  [Offline-Strategie], [Tokens/User im `localStorage`. Für Notfallkontakte ohne Netz ist der Ausbau zur PWA konzipiert.],
)

== Testing
#table(
  columns: (1.2fr, 1.2fr, auto, 2.2fr),
  [*Test-Typ*], [*Werkzeug*], [*Anzahl*], [*Was wird abgedeckt?*],
  [Backend Unit], [Vitest], [9 Files], [Services (`users`, `tours`, `auth`), JwtStrategy, JwtAuthGuard, DTO-Validierung, Hash-Utils.],
  [Backend Integration], [Vitest / Supertest], [1 File], [REST-Endpunkte gegen die Test-Datenbank (`api.integration.spec.ts`).],
  [Frontend Unit], [Vitest], [23 Files], [Smart Container, Dumb Components (`security-matrix`), Services, Pipes, UI-Kit.],
  [Frontend E2E], [Cypress], [5 Files], [Auth-Flow, Tourenverwaltung, Toureneditor, Tourdetails, Navigation.],
)

= Architekturentscheidungen (ADRs)

#table(
  columns: (auto, 1.1fr, 1.3fr, 2.6fr),
  [*ADR*], [*Thema*], [*Entscheidung*], [*Begründung*],
  [ADR-01], [Backend], [NestJS 11 (TypeScript)], [Klare Schichten, Dependency Injection, fühlt sich wie Angular an und spart Validierungscode via `class-validator`.],
  [ADR-02], [Frontend], [Angular 19 Standalone], [Alles aus einer Hand (Routing, Forms, HTTP), kein altes Modul-Boilerplate, saubere Trennung durch Smart/Dumb-Muster.],
  [ADR-03], [Datenbank], [MongoDB & Mongoose], [3x3-Matrix und Notfallkontakte lassen sich direkt als Dokument einbetten, ohne zeitraubende SQL-Joins und Tabellen.],
  [ADR-04], [Auth], [`@nestjs/jwt` & bcrypt], [Standard-Ökosystem in NestJS: Etablierte JWT-Strategie mit Passport und robustes Bcrypt-Hashing statt wartungsintensiver Eigenbau-Kryptografie.],
  [ADR-05], [Deployment], [Docker Compose & Nginx], [1-Befehl-Start (`docker compose up --build`); Nginx verhindert CORS-Probleme, da alles über Port 80 läuft.],
  [ADR-06], [Datenschutz], [Restriktive Notfallkontakte], [Principle of Least Privilege: Notfallkontakte sind nur für den verifizierten Tourenleiter der jeweiligen Tour sichtbar.],
)

= Qualitätsanforderungen

#figure(
  image("diagrams/10_qualitaetsbaum.svg", width: 100%),
  caption: [Qualitätsbaum: Gliederung der Qualitätsziele nach ISO 25010 (PlantUML: 10_qualitaetsbaum.puml)],
)

#table(
  columns: (auto, 1.2fr, 2.5fr, 1.5fr),
  [*ID*], [*Szenario*], [*Verhalten des Systems*], [*Messkriterium*],
  [Q1], [Teilnehmer ruft Notfall-URL eines anderen Teilnehmers auf.], [Backend prüft Leiterrechte und blockiert den Zugriff.], [HTTP 403 Forbidden.],
  [Q2], [Tourenleiter speichert 3x3-Sicherheitsmatrix ab.], [Formular validiert Daten; Matrix wird sofort gespeichert und gerendert.], [Ladezeit $< 200$ ms lokal.],
  [Q3], [Beitrittsversuch zu einer vergangenen Tour.], [Backend prüft `date < today` und lehnt den Beitritt ab.], [HTTP 400 Bad Request.],
  [Q4], [Matrix wird später um neue Gefahrenfelder erweitert.], [Da MongoDB schemalos speichert, muss nur das DTO angepasst werden.], [Keine SQL-Migration nötig.],
  [Q5], [Start auf einem frischen Entwicklungsrechner mit Docker.], [Startet Frontend, Backend und Datenbank ohne manuelle Vorarbeit.], [`docker compose up` auf Port 80.],
)

= Risiken & technische Schulden

#table(
  columns: (1.2fr, 2fr, 2fr),
  [*Bereich*], [*Problem / Risiko*], [*Status & Massnahme*],
  [Offline-Nutzung am Berg], [Im alpinen Funkloch schlägt das Neuladen fehl; Notfallkontakte wären offline nicht erreichbar.], [Konzipiert als nächster Schritt: PWA mit Service Worker und IndexedDB-Cache für Notfallnummern.],
  [GPX-Parsing im Browser], [Riesige GPX-Dateien ($> 20$ MB) könnten den UI-Thread kurz blockieren.], [Aktuell für normale GPX-Tracks ausreichend; künftig Auslagerung in einen Web Worker.],
  [E2E-Testisolation], [Cypress-Tests teilen sich teilweise Datenbankzustände.], [Tests bereinigen ihre Daten eigenständig; für Einzelentwickler im Modul WebLab vollkommen ausreichend.],
)