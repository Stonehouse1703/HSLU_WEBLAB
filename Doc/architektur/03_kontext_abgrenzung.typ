#import "../template/hslu-template.typ": note, tip, warning, todo

= Kontextabgrenzung

== Fachlicher Kontext
Der fachliche Kontext definiert die Systemgrenze aus Benutzersicht und beschreibt die externen Akteure sowie den Informationsaustausch.

#note[
  Fügen Sie bei Bedarf ein Kontextdiagramm (z. B. via Mermaid oder exportiertes Bild aus `Doc/assets/`) ein.
]

#table(
  columns: (auto, auto, 1fr),
  table.header([*Nachbarsystem / Akteur*], [*Eingabe in das System*], [*Ausgabe aus dem System*]),
  [Benutzer (Webbrowser)], [Benutzerinteraktionen, Formulareingaben, Authentifizierungsdaten], [Dynamische UI-Views, Bestätigungen, Fehlermeldungen],
  [Dritte APIs (z. B. OAuth, Wetter, etc.)], [API-Tokens, externe Daten-Payloads], [Anfragen, Webhook-Trigger],
)

== Technischer Kontext
Der technische Kontext beschreibt die Kommunikationskanäle und Protokolle zwischen den Komponenten:

- *Frontend $arrow.r.double$ Backend:* HTTP/HTTPS via RESTful JSON API (bzw. WebSockets für Echtzeitkommunikation).
- *Backend $arrow.r.double$ Datenbank:* TCP/IP über standardisierte Datenbanktreiber / ORM mit Connection-Pooling.
- *Client-Plattformen:* Moderne Desktop- und Mobil-Browser (Chromium, Firefox, Safari) mit responsivem Viewport.
