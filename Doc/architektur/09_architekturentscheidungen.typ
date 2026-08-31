#import "../template/hslu-template.typ": note, tip, warning, todo, adr

= Architekturentscheidungen (ADRs)

In diesem Kapitel werden fundamentale Entwurfs- und Architekturentscheidungen dokumentiert und begründet.

== Übersicht der Architekturentscheidungen

#adr(
  number: "001",
  title: "Wahl des Frontend-Frameworks und TypeScript",
  status: "Akzeptiert",
  date: "15.02.2026",
  problem-context: [
    Für die Entwicklung der WebLab-Anwendung wird ein modernes Frontend-Framework benötigt, welches strikte Typsicherheit, komponentenbasierte Wiederverwendbarkeit und ein starkes Ökosystem bietet.
  ],
  decision: [
    Wir setzen auf ein modernes Single-Page-Application-Framework mit durchgängigem Einsatz von TypeScript.
  ],
  consequences: [
    - *Vorteile:* Hohe Wartbarkeit, statische Fehlerprüfung zur Compile-Zeit, hervorragende IDE-Unterstützung und Autovervollständigung.
    - *Nachteile / Trade-offs:* Geringfügiger Boilerplate-Overhead beim Erstellen von Interfaces und DTOs.
  ]
)

#v(10pt)

#adr(
  number: "002",
  title: "Authentifizierung via JWT (JSON Web Tokens)",
  status: "Akzeptiert",
  date: "20.02.2026",
  problem-context: [
    Das System erfordert eine sichere, zustandslose Authentifizierung zwischen Frontend-SPA und Backend-API.
  ],
  decision: [
    Einsatz von JSON Web Tokens (JWT) mit HMAC-SHA256 Signatur und kurzer Gültigkeitsdauer.
  ],
  consequences: [
    - *Vorteile:* Stateless Backend (keine Server-Sessions in der DB erforderlich), gut skalierbar, einfache Handhabung im REST-Kontext.
    - *Nachteile / Trade-offs:* Token-Revocation (Blacklisting) erfordert zusätzliche Mechanismen wie Refresh Tokens oder Redis-Cache.
  ]
)

#v(10pt)

#adr(
  number: "003",
  title: "Dokumentationserstellung mit Typst",
  status: "Akzeptiert",
  date: "25.02.2026",
  problem-context: [
    Die geforderten Projektdokumente (Architektur, Reflexion, Journal) müssen im Team sauber versioniert, ansprechend formatiert und schnell als PDF exportiert werden können.
  ],
  decision: [
    Nutzung von Typst anstelle von Word oder schwergewichtigem LaTeX.
  ],
  consequences: [
    - *Vorteile:* Sehr schnelle Kompilierung (< 100ms), saubere Code-basierte Struktur in Git, moderne Syntax, hervorragendes Typography-Layout.
    - *Nachteile / Trade-offs:* Einarbeitung in Typst-Syntax für Teammitglieder nötig (wird durch Vorlagen stark vereinfacht).
  ]
)
