# Architekturdokumentation (arc42 v8) – HSLU_WEBLAB

> **Webapplikation für Tourenverwaltung & 3x3 Sicherheitsmatrix**  
> Modul **WebLab** | Hochschule Luzern (Departement Informatik)  
> Student: **Colin Felber** | Dozent: **Dominik Witschard**

Kompilierung der Dokumentation:
```bash
make architektur
# oder zusammen mit allen Dokumenten:
make all
```
Das fertige PDF liegt unter: [`Doc/architektur.pdf`](file:///home/vrx/github/HSLU_WEBLAB/Doc/architektur.pdf).

---

## 1. Einführung & Ziele

Wer eine Skitour für eine Gruppe leitet, trägt viel Verantwortung. Kommt es zu einem Notfall am Berg, muss die Tourenleitung sofort die Notfallkontakte der Teilnehmenden griffbereit haben. Zudem fordert die Rechtsprechung im Ernstfall den Nachweis einer sorgfältigen Tourenplanung nach anerkannten Standards – insbesondere der **3x3-Sicherheitsmatrix** nach Werner Munter (Verhältnisse, Gelände, Mensch).

Normale Chat-Apps oder Vereins-Tools reichen dafür nicht aus: Notfallkontakte fehlen oder sind unauffindbar, und die 3x3-Planung kann nirgends strukturiert festgehalten werden. Die vorliegende Webapplikation schliesst diese Lücke.

### 1.1 Qualitätsziele
| Prio | Qualitätsziel | Bedeutung für die Applikation |
|---|---|---|
| **1** | Datenschutz & Vertraulichkeit | Notfallkontakte sind hochsensibel. Ausschliesslich autorisierte Tourenleiter der jeweiligen Tour dürfen sie einsehen (*Principle of Least Privilege*). |
| **2** | Schnelligkeit & Usability | Schnelle Bedienung am Handy und Desktop. Die 3x3-Matrix ist in wenigen Minuten ausgefüllt, Notfallkontakte sind mit einem Klick sichtbar. |
| **3** | Wartbarkeit & Testbarkeit | Klare Entkopplung: Smart/Dumb-Muster im Frontend, modularer Monolith mit NestJS im Backend, abgesichert durch Unit- und Cypress-E2E-Tests. |
| **4** | Ein-Befehl-Start | Vollständiger Start des Stacks via `docker compose up --build` ohne manuelle Vorabinstallation von Node oder Datenbanken. |

### 1.2 Stakeholder
| Rolle | Wer ist das? | Erwartungshaltung |
|---|---|---|
| **Tourenleiter/in** | Leiter/in von SAC- oder privaten Touren | Strukturierte 3x3-Dokumentation zur rechtlichen Absicherung, Teilnehmerübersicht und Notfallkontakte im Ernstfall. |
| **Teilnehmende** | Mitglieder der Tourengruppe | Einfacher Beitritt per Link, Übersicht zu Treffpunkt, Route und Ausrüstung, garantierter Schutz der Notfalldaten. |
| **Dozent / Experte** | Dominik Witschard (HSLU) | Klare Softwarearchitektur, nachvollziehbar begründete Technologiewahl, Testabdeckung und verständlicher Code. |

---

## 2. Randbedingungen

| Randbedingung | Konsequenz für die Architektur |
|---|---|
| **Angular 19 SPA** | TypeScript, Standalone Components, Signals und `httpResource` statt alter NgModules. |
| **NestJS 11 REST API** | Modularer Monolith, Dependency Injection, Controller/Service-Schichten, kein SSR. |
| **MongoDB 8.0 & Mongoose** | Dokumentenspeicher: 3x3-Matrix und Notfallkontakt direkt eingebettet; UUIDs statt ObjectIds. |
| **Standard-Token-Auth** | Zustandslose JWTs mit `@nestjs/jwt`, Passport (`passport-jwt`) und `bcrypt` für robustes Passwort-Hashing. |
| **Docker Compose & Nginx** | Nginx serviert das Frontend und proxied `/api/*` auf Port 80; eliminiert CORS-Probleme. |
| **Einzelarbeit & Frist** | Entwicklung durch eine Person im Rahmen des Moduls WebLab; Konzentration auf Kernfunktionen. |

*Konventionen*: TypeScript Strict Mode, Smart/Dumb-Komponentenmuster, REST-Semantik mit JSON, ESLint und Prettier.

---

## 3. Kontext & Abgrenzung

### 3.1 Fachlicher & Technischer Kontext
- Der Browser kommuniziert über HTTP (Port 80) mit Nginx.
- Nginx leitet API-Aufrufe (`/api/*`) intern an das NestJS-Backend (Port 4566) weiter.
- Das Backend greift über das MongoDB-Wire-Protokoll (Port 27017) auf die Datenbank zu.

![Systemkontext](diagrams/01_kontext_abgrenzung.svg)
*PlantUML-Quelle: [`Doc/architektur/diagrams/01_kontext_abgrenzung.puml`](file:///home/vrx/github/HSLU_WEBLAB/Doc/architektur/diagrams/01_kontext_abgrenzung.puml)*

### 3.2 In Scope (+)
- **+** Touren-CRUD: Erstellen, Bearbeiten, Löschen und Detailansicht von Touren.
- **+** Digitale 3x3-Sicherheitsmatrix: Strukturierte Risikobeurteilung nach Werner Munter (Verhältnisse, Gelände, Mensch).
- **+** Notfallkontakt-Erfassung: Hinterlegung bei der Registrierung und Bearbeitung im Profil.
- **+** Geschützter Notfallkontakt-Zugriff: Zugriff auf Notfalldaten ausschliesslich für autorisierte Tourenleiter der jeweiligen Tour.
- **+** Teilnehmer- und Rollenverwaltung: Beitritt per Link und Verwaltung von Leiter- und Teilnehmerrollen.
- **+** GPX-Routenupload: Hochladen und Anzeigen von GPX-Tracks direkt in der Tour.

### 3.3 Out of Scope (-)
- **-** Native Mobile Apps: Keine eigenständigen Apps für iOS oder Android (reine responsive Web-App).
- **-** Automatisches Lawinenbulletin: Kein API-Scraping von SLF- oder Wetterdiensten (manuelle Erfassung).
- **-** E-Mail-Dienste: Keine E-Mail-Verifikation und kein Passwort-Reset per Mail.
- **-** Zahlungsabwicklung: Keine Online-Abrechnung von Tourenkosten.
- **-** Live-GPS-Tracking: Keine Turn-by-Turn-Navigation oder Live-Ortung während der Tour.
- **-** Offline-Synchronisation: Keine vollumfängliche PWA mit lokaler IndexedDB-Synchronisation.


---

## 4. Lösungsstrategie

| Bereich | Gewählte Technologie | Warum gewählt? (Begründung) | ADR |
|---|---|---|---|
| **Frontend** | Angular 19 (Standalone & Signals) | Alles aus einer Hand (Routing, Forms, HTTP). Standalone Components und Signals sparen Modul-Boilerplate und bieten direkte Reaktivität. | ADR-02 |
| **Backend** | NestJS 11 (TypeScript) | Klare Schichtenarchitektur (Controller, Service, Modul). Gleiche Denkweise wie Angular und automatische Validierung via `class-validator`. | ADR-01 |
| **Datenbank** | MongoDB 8.0 & Mongoose | Hierarchische 3x3-Matrix und Notfallkontakte direkt als BSON einbettbar; keine zeitraubenden SQL-Joins für dynamische Matrixfelder. | ADR-03 |
| **Auth** | @nestjs/jwt, Passport & bcrypt | Standard-Stack im NestJS-Ökosystem: Sicheres Passwort-Hashing via bcrypt und standardisierte JWT-Verwaltung mit Passport ohne fehleranfällige Eigenbau-Krypto. | ADR-04 |
| **Deployment** | Docker Compose & Nginx | 1-Befehl-Start (`docker compose up --build`). Nginx serviert das Frontend und leitet `/api/` weiter; keine CORS-Probleme. | ADR-05 |
| **Architektur** | Smart / Dumb Components | Smart Container steuern State und API-Calls, Dumb Components zeigen nur an (`@Input`) und melden Events (`@Output`). | ADR-02 |

---

## 5. Bausteinsicht

### 5.1 Level 1: System-Whitebox
![Bausteinsicht Level 1](diagrams/02_bausteinsicht_level1.svg)
*PlantUML-Quelle: [`Doc/architektur/diagrams/02_bausteinsicht_level1.puml`](file:///home/vrx/github/HSLU_WEBLAB/Doc/architektur/diagrams/02_bausteinsicht_level1.puml)*

| Container | Technologie | Verantwortung & Schnittstellen |
|---|---|---|
| `HSLU_WEBLAB_frontend` | nginx:alpine | Haupteinstiegspunkt (Port 80). Liefert das Angular-Bundle aus und proxied `/api/*` an das Backend weiter. |
| `backend` | NestJS 11, Node.js 24 | REST-API auf internem Port 4566. Verarbeitet Business-Logik, Validierung und Berechtigungsprüfungen. |
| `hslu_weblab_mongo` | mongo:8 | MongoDB-Server auf Port 27017. Speichert Daten dauerhaft im Volume `mongo-data`. |
| `hslu_weblab_mongo_express` | mongo-express:1 | Web-Admin-Tool auf Port 8081 zur Datenbank-Inspektion während der Entwicklung. |

### 5.2 Level 2: Backend-Architektur (NestJS Modular Monolith)
![Backend Architektur](diagrams/04_backend_architektur.svg)
*PlantUML-Quelle: [`Doc/architektur/diagrams/04_backend_architektur.puml`](file:///home/vrx/github/HSLU_WEBLAB/Doc/architektur/diagrams/04_backend_architektur.puml)*

### 5.3 Level 2: Frontend-Architektur (Smart Container / Dumb Components)
![Frontend Architektur](diagrams/03_frontend_architektur.svg)
*PlantUML-Quelle: [`Doc/architektur/diagrams/03_frontend_architektur.puml`](file:///home/vrx/github/HSLU_WEBLAB/Doc/architektur/diagrams/03_frontend_architektur.puml)*

| Ordner / Bereich | Inhalt & Verantwortung |
|---|---|
| `src/app/features/tour-management/` | Tourenübersicht, Detailansicht, Teilnehmerliste, 3x3-Matrix-Anzeige. |
| `src/app/features/tour-editor/` | Formulare zur Tourenerstellung und Bearbeitung der 3x3-Matrix, GPX-Upload. |
| `src/app/features/user/` | Benutzerprofil, Bearbeitung der Notfallkontakte, geschützte Notfallansicht. |
| `src/app/features/auth/` | Login- und Registrierungsformulare, `AuthService`, `authInterceptor`, `authGuard`. |
| `src/app/components/` | Wiederverwendbares UI-Kit (Button, Card, Badge, LoadingSpinner, InputFieldError). |
| `src/app/pipes/` | Wiederverwendbare Hilfs-Pipes (`ShortenerPipe`). |

---

## 6. Laufzeitsicht

### 6.1 Szenario 1: Registrierung & Token-Generierung
![Laufzeitsicht Auth](diagrams/05_laufzeitsicht_auth.svg)
*PlantUML-Quelle: [`Doc/architektur/diagrams/05_laufzeitsicht_auth.puml`](file:///home/vrx/github/HSLU_WEBLAB/Doc/architektur/diagrams/05_laufzeitsicht_auth.puml)*

### 6.2 Szenario 2: Tour erstellen mit 3x3 Sicherheitsmatrix
![Laufzeitsicht Tourenerstellung](diagrams/06_laufzeitsicht_tour_erstellung.svg)
*PlantUML-Quelle: [`Doc/architektur/diagrams/06_laufzeitsicht_tour_erstellung.puml`](file:///home/vrx/github/HSLU_WEBLAB/Doc/architektur/diagrams/06_laufzeitsicht_tour_erstellung.puml)*

### 6.3 Szenario 3: Tour-Beitritt & Notfallkontakt-Abfrage
![Laufzeitsicht Notfallkontakt](diagrams/07_laufzeitsicht_notfallkontakt.svg)
*PlantUML-Quelle: [`Doc/architektur/diagrams/07_laufzeitsicht_notfallkontakt.puml`](file:///home/vrx/github/HSLU_WEBLAB/Doc/architektur/diagrams/07_laufzeitsicht_notfallkontakt.puml)*

---

## 7. Verteilungssicht & Deployment

![Verteilungssicht](diagrams/08_verteilungssicht_deployment.svg)
*PlantUML-Quelle: [`Doc/architektur/diagrams/08_verteilungssicht_deployment.puml`](file:///home/vrx/github/HSLU_WEBLAB/Doc/architektur/diagrams/08_verteilungssicht_deployment.puml)*

- **Frontend**: Stage 1 (`node:24-slim`) baut Angular (`npm run build`). Stage 2 (`nginx:alpine`) übernimmt nur den fertigen `dist/`-Ordner.
- **Backend**: Stage 1 kompiliert TypeScript. Stage 2 führt nur `dist/` mit Produktions-Dependencies aus.
- **Nginx-Routing**: Serviert Angular per HTML5-Fallback (`try_files $uri /index.html`) und leitet `/api/` an das Backend weiter (`proxy_pass http://backend:4566`).

---

## 8. Querschnittskonzepte

### 8.1 Ownership, Datenschutz & Sicherheit
- **Datenschutz**: Standardabfragen filtern Notfallkontakte immer serverseitig aus (`.select('-emergencyContact')`).
- **Authentifizierung**: Zustandsloses JWT, signiert via `@nestjs/jwt` (1h Lebensdauer) und validiert über eine Passport-JWT-Strategie (`JwtStrategy`). Passwörter werden sicher mit `bcrypt` gehasht (10 Salt-Rounds) und verifiziert.
- **Validierung & NoSQL-Schutz**: NestJS `ValidationPipe` (`whitelist: true, transform: true`) verwirft unbekannte Payload-Felder. Falsche Datumsformate oder NoSQL-Injection-Versuche (`$gt`, `$where`) werden sofort mit HTTP 400 geblockt.
- **Fehlerformat (Error Handling)**: NestJS liefert Fehler standardisiert als JSON: `{"statusCode": 400, "message": ["..."], "error": "Bad Request"}`. Frontend wertet `error.message` aus und zeigt sie im UI an.

### 8.2 Datenmodell & Konsistenz
![Datenmodell](diagrams/09_datenmodell_persistenz.svg)
*PlantUML-Quelle: [`Doc/architektur/diagrams/09_datenmodell_persistenz.puml`](file:///home/vrx/github/HSLU_WEBLAB/Doc/architektur/diagrams/09_datenmodell_persistenz.puml)*

- **Eingebettet**: `EmergencyContact` in `Person` (`_id: false`) und `SecurityMatrix` in `Tour`.
- **UUIDs statt MongoDB ObjectIds**: Anwendungsgenerierte UUIDs (`crypto.randomUUID()`) als primäre `id: string`. Referenzen (`tourManagerIds`, `participantIds`) werden im Service-Layer per `findByIds({ id: { $in: ids } })` aufgelöst statt über Mongoose-`populate()`.

### 8.3 Frontend-Konzepte & Reaktivität
| Thema | Umsetzung & Ansatz |
|---|---|
| **Reaktivität** | Angular Signals (`signal`, `computed`) für lokalen State; `httpResource` für deklaratives Laden. |
| **Komponenten-Kommunikation** | Smart Container verwalten State; Dumb Components nutzen ausschliesslich `@Input` und `@Output`. |
| **Change Detection** | `ChangeDetectionStrategy.OnPush` auf allen Komponenten für maximale Performance. |
| **Styling & Feedback** | CSS Design-System mit Farbcodes für Lawinenwarnstufen; Validierungsfeedback via `InputFieldError`. |
| **Offline-Strategie** | Tokens/User im `localStorage`. Für Notfallkontakte ohne Netz ist der Ausbau zur PWA konzipiert. |

### 8.4 Dependency Supply Chain
Abhängigkeiten werden über `npm ci` auf Basis einer versionierten `package-lock.json` festgeschrieben. In den Docker-Builds kommen schlanke, offizielle Node.js 24- und Nginx-Alpine-Images zum Einsatz.

### 8.5 Testing
| Test-Typ | Werkzeug | Anzahl | Was wird abgedeckt? |
|---|---|---|---|
| **Backend Unit** | Vitest | 9 Files | Services (`users`, `tours`, `auth`), JwtStrategy, JwtAuthGuard, DTO-Validierung, Hash-Utils. |
| **Backend Integration** | Vitest / Supertest | 1 File | REST-Endpunkte gegen die Test-Datenbank (`api.integration.spec.ts`). |
| **Frontend Unit** | Vitest | 23 Files | Smart Container, Dumb Components (`security-matrix`), Services, Pipes, UI-Kit. |
| **Frontend E2E** | Cypress | 5 Files | Auth-Flow, Tourenverwaltung, Toureneditor, Tourdetails, Navigation. |

Befehle: `npm test` im Frontend/Backend, `npm run test:e2e` im Backend, `npm run cypress:run` im Frontend.

---

## 9. Architekturentscheidungen (ADRs)

| ADR | Thema | Entscheidung | Begründung |
|---|---|---|---|
| **ADR-01** | Backend | NestJS 11 (TypeScript) | Klare Schichten, Dependency Injection, fühlt sich wie Angular an und spart Validierungscode via `class-validator`. |
| **ADR-02** | Frontend | Angular 19 Standalone | Alles aus einer Hand (Routing, Forms, HTTP), kein altes Modul-Boilerplate, saubere Trennung durch Smart/Dumb-Muster. |
| **ADR-03** | Datenbank | MongoDB & Mongoose | 3x3-Matrix und Notfallkontakte lassen sich direkt als Dokument einbetten, ohne zeitraubende SQL-Joins und Tabellen. |
| **ADR-04** | Auth | @nestjs/jwt & bcrypt | Standard-Ökosystem in NestJS: Etablierte JWT-Strategie mit Passport und robustes Bcrypt-Hashing statt wartungsintensiver Eigenbau-Kryptografie. |
| **ADR-05** | Deployment | Docker Compose & Nginx | 1-Befehl-Start (`docker compose up --build`); Nginx verhindert CORS-Probleme, da alles über Port 80 läuft. |
| **ADR-06** | Datenschutz | Restriktive Notfallkontakte | Principle of Least Privilege: Notfallkontakte sind nur für den verifizierten Tourenleiter der jeweiligen Tour sichtbar. |

---

## 10. Qualitätsanforderungen

| ID | Szenario | Verhalten des Systems | Messkriterium |
|---|---|---|---|
| **Q1** | Teilnehmer ruft Notfall-URL eines anderen Teilnehmers auf. | Backend prüft Leiterrechte und blockiert den Zugriff. | HTTP 403 Forbidden. |
| **Q2** | Tourenleiter speichert 3x3-Sicherheitsmatrix ab. | Formular validiert Daten; Matrix wird sofort gespeichert und gerendert. | Ladezeit < 200 ms lokal. |
| **Q3** | Beitrittsversuch zu einer vergangenen Tour. | Backend prüft `date < today` und lehnt den Beitritt ab. | HTTP 400 Bad Request. |
| **Q4** | Matrix wird später um neue Gefahrenfelder erweitert. | Da MongoDB schemalos speichert, muss nur das DTO angepasst werden. | Keine SQL-Migration nötig. |
| **Q5** | Start auf einem frischen Entwicklungsrechner mit Docker. | Startet Frontend, Backend und Datenbank ohne manuelle Vorarbeit. | `docker compose up` auf Port 80. |

---

## 11. Risiken & technische Schulden

| Bereich | Problem / Risiko | Status & Massnahme |
|---|---|---|
| **Offline-Nutzung am Berg** | Im alpinen Funkloch schlägt das Neuladen fehl; Notfallkontakte wären offline nicht erreichbar. | Konzipiert als nächster Schritt: PWA mit Service Worker und IndexedDB-Cache für Notfallnummern. |
| **GPX-Parsing im Browser** | Riesige GPX-Dateien (> 20 MB) könnten den UI-Thread kurz blockieren. | Aktuell für normale GPX-Tracks ausreichend; künftig Auslagerung in einen Web Worker. |
| **Token-Blacklist** | JWTs sind zustandslos; Logout löscht Token nur im Client. | 1h Ablaufdatum reicht für WebLab; künftig Background-Jobs (z. B. via Hangfire) für Blacklist-Bereinigung. |
| **E2E-Testisolation** | Cypress-Tests teilen sich teilweise Datenbankzustände. | Tests bereinigen ihre Daten eigenständig; für Einzelentwickler im Modul WebLab vollkommen ausreichend. |

---

## 12. Glossar

| Begriff | Bedeutung im Projektkontext |
|---|---|
| **3x3 Sicherheitsmatrix** | Standardisierte Risikobeurteilung nach Werner Munter auf drei Stufen (Regional, Lokal, Zonal) für drei Faktoren (Verhältnisse, Gelände, Mensch). |
| **Notfallkontakt** | Sensible Kontaktdaten (Name, Telefonnummer, Beziehung), die im Ernstfall am Berg von der Tourenleitung benötigt werden. |
| **Smart Container** | Angular-Komponente, die Daten über Services lädt, Signals hält und Benutzeraktionen steuert. |
| **Dumb Component** | Reine UI-Komponente, die Daten per `@Input` empfängt und Aktionen per `@Output` feuert. |
| **DTO** | Data Transfer Object; TypeScript-Klasse zur typisierten Validierung von HTTP-Request-Bodys. |
| **ValidationPipe** | NestJS-Mechanismus zur automatischen Validierung und Bereinigung (`whitelist`) eingehender Daten. |
| **Least Privilege** | Sicherheitsprinzip: Benutzer erhalten ausschliesslich die für ihre Rolle zwingend nötigen Rechte. |
| **UUID** | Universally Unique Identifier; anwendungsgenerierter 128-Bit-String zur Entkopplung von MongoDB `ObjectId`s. |
| **Hangfire** | Hintergrund-Job-Scheduler zur periodischen Ausführung von Tasks (z. B. Blacklist-Cleanup). |
| **PWA** | Progressive Web App; Webtechnologie für Offline-Fähigkeit mittels Service Worker und Caching. |
