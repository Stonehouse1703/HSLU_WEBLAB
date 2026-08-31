#import "../template/hslu-template.typ": note, tip, warning, todo, journal-entry

= Chronologische Journaleinträge

#note[
  Fügen Sie für jede Arbeitssitzung oder Woche einen neuen `#journal-entry(...)` Block hinzu.
]

#journal-entry(
  date: "17.02.2026",
  duration: "3.5 h",
  phase: "Phase 1: Setup",
  title: "Projekt-Kickoff & Toolchain-Einrichtung",
  tasks: (
    "Erstellung des Git-Repositories und Definition der Branching-Strategie.",
    "Aufsetzen des Basis-Projekts mit modernem Framework & TypeScript.",
    "Initialisierung der Typst-Dokumentationsvorlagen.",
  ),
  insights: "Typst erwies sich als deutlich schneller und wartungsfreundlicher im Vergleich zu bisherigen LaTeX-Setups.",
  next: "Ausarbeitung des Architektur-Grobkonzepts und Definition des Datenmodells."
)

#v(8pt)

#journal-entry(
  date: "22.02.2026",
  duration: "4.0 h",
  phase: "Phase 2: Architektur",
  title: "Konzeption des Datenmodells und REST-API-Schnittstellen",
  tasks: (
    "Entwurf des ER-Diagramms und Spezifikation der Entitäten (User, Items).",
    "Definition der REST-Endpunkte (OpenAPI / Swagger Entwurf).",
    "Erstellung von ADR-001 (Framework) und ADR-002 (JWT-Auth).",
  ),
  insights: "Frühzeitige Einigung auf genaue DTO-Typen spart später bei der Integration viel Zeit.",
  next: "Aufsetzen des Node.js/Express Backend-Skeletts mit ORM."
)

#v(8pt)

#journal-entry(
  date: "01.03.2026",
  duration: "5.5 h",
  phase: "Phase 3: Backend",
  title: "Implementierung der Backend-Kernservices & Auth",
  tasks: (
    "Aufbau der Datenbankmigrationen und Seed-Daten.",
    "Implementierung des Auth-Controllers (Registrierung, Login, JWT-Signierung).",
    "Erstellung von Middleware für Request-Validierung und geschützte Routen.",
  ),
  insights: "Passwort-Hashing mit Argon2id ist Bcrypt vorzuziehen; Integration klappte reibungslos.",
  next: "Frontend-Authentifizierungs-Views und State-Store implementieren."
)

#v(8pt)

#journal-entry(
  date: "08.03.2026",
  duration: "6.0 h",
  phase: "Phase 4: Frontend",
  title: "Frontend-Grundgerüst, Routing und Login-Flow",
  tasks: (
    "Erstellung des App-Layouts mit responsivem Navigation-Header.",
    "Reaktive Formulare für Login und Registrierung inkl. Client-Validierung.",
    "Integration des Auth-States mit Token-Storage und Auth-Guards im Router.",
  ),
  insights: "Klare Trennung zwischen Presentational Components und Smart Container Components vereinfacht das Refactoring.",
  next: "CRUD-Funktionalitäten für fachliche Hauptentitäten im Frontend."
)

#v(8pt)

#journal-entry(
  date: "15.03.2026",
  duration: "4.5 h",
  phase: "Phase 5: Testing & Docs",
  title: "Testing, Bugfixing und Dokumentationsfinalisierung",
  tasks: (
    "Erstellung von Unit-Tests für Auth-Service und Backend-Controller.",
    "Behebung von UI-Glitches auf mobilen Bildschirmauflösungen.",
    "Vervollständigung der Architekturdokumentation und Fazit.",
  ),
  insights: "Automatisierte Tests deckten zwei Randfall-Validierungsfehler auf.",
  next: "Finale Abgabe und Präsentationsvorbereitung."
)
