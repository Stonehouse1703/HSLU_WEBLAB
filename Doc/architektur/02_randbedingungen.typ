#import "../template/hslu-template.typ": note, tip, warning, todo

= Randbedingungen & Technologiestack

== Technische Rahmenbedingungen
Die Entwicklung basiert auf modernen Webtechnologien und unterliegt folgenden Rahmenbedingungen:

#table(
  columns: (auto, auto, 1fr),
  table.header([*Bereich*], [*Technologie / Standard*], [*Begründung / Kontext*]),
  [Frontend], [TypeScript, Modernes Framework (z. B. Angular / React / Vue)], [Moderne Komponentenarchitektur, Typsicherheit und State-Management.],
  [Styling], [CSS3 / SCSS / Tailwind CSS], [Responsive Design, Konsistentes Design System.],
  [Backend / API], [Node.js / Express / NestJS / REST API], [Asynchrones I/O, nahtlose TypeScript-Integration mit Shared Types.],
  [Datenbank / Storage], [PostgreSQL / MongoDB / SQLite], [Strukturierte Datenspeicherung und relationale bzw. dokumentenbasierte Integrität.],
  [Versionskontrolle], [Git & GitHub], [Feature-Branch-Workflow, Pull Requests und Code Reviews.],
  [Dokumentation], [Typst], [Präzise, versionierbare und moderne PDF-Generierung.],
)

== Organisatorische & rechtliche Rahmenbedingungen
- *Lizenzen:* Einsatz ausschliesslich von Open-Source-Bibliotheken unter permissiven Lizenzen (MIT, Apache 2.0).
- *Datenschutz:* Es werden keine sensiblen Personendaten ohne explizite Einwilligung oder im Produktivbetrieb unverschlüsselt verarbeitet (DSG / DSGVO Konformität im Konzept).
- *Abgabetermin & Meilensteine:* Einhaltung der vorgegebenen Modul-Deadlines gemäss WebLab-Zeitplan.

== Konventionen & Richtlinien
- *Code Style:* ESLint & Prettier für einheitliche Code-Formatierung.
- *Naming Conventions:* CamelCase für Variablen/Funktionen, PascalCase für Klassen/Komponenten, kebab-case für Dateinamen.
- *Git Commits:* Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
