#import "../template/hslu-template.typ": note, tip, warning, todo

= Verteilungssicht & Deployment

== Infrastruktur-Übersicht
Die Webanwendung ist für containerisierte Umgebungen konzipiert und kann sowohl lokal als auch in Cloud-Infrastrukturen betrieben werden.

#table(
  columns: (auto, auto, 1fr),
  table.header([*Knoten / Container*], [*Umgebung*], [*Beschreibung / Konfiguration*]),
  [Frontend Static Host], [Nginx / Cloudflare Pages / Vercel], [Auslieferung kompilierter Produktions-Assets (HTML, JS, CSS, Media).],
  [Backend Service], [Node.js Container (Docker)], [Containerisierter Backend-Prozess, REST API, Environment-Konfiguration via `.env`.],
  [Database Instance], [PostgreSQL / MongoDB], [Persistentes Volume, automatische Migrationen bei Start.],
)

== CI/CD-Pipeline
Zur kontinuierlichen Qualitätssicherung ist eine automatisierte Pipeline (z. B. via GitHub Actions) vorgesehen:

1. *Linting & Type-Check:* Automatische Überprüfung via `npm run lint` und `tsc --noEmit`.
2. *Automatisierte Tests:* Ausführung von Unit- und Integrationstests (`npm test`).
3. *Build-Prozess:* Kompilierung des Frontends (`npm run build`) und Backends.
4. *Container Build & Registry:* Erstellung der Docker-Images und Tagging mit Git-Commit-Hash.
