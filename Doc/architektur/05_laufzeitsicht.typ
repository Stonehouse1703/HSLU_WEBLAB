#import "../template/hslu-template.typ": note, tip, warning, todo

= Laufzeitsicht

== Typischer Anwendungsfall: Benutzer-Authentifizierung
Der Ablauf für Login und Autorisierung gestaltet sich wie folgt:

1. Der Benutzer gibt Zugangsdaten im Anmeldeformular ein.
2. Das Frontend validiert das Formular lokal und sendet einen `POST /api/auth/login` Request an das Backend.
3. Der Backend-Auth-Controller validiert die Eingaben, hasht das Passwort und vergleicht den Hash mit dem Datenbankeintrag.
4. Bei erfolgreicher Verifikation generiert das Backend ein signiertes JSON Web Token (JWT) und gibt dieses zurück.
5. Das Frontend speichert den Token sicher (z. B. Secure HTTP-Only Cookie oder im Auth-State) und fügt ihn bei Folgeanfragen im `Authorization: Bearer <token>` Header ein.

== Datenabruf und State-Update
#table(
  columns: (auto, auto, 1fr),
  table.header([*Schritt*], [*Beteiligte Komponente*], [*Aktion / Beschreibung*]),
  [1], [UI-Komponente], [Löst beim Rendern oder durch Benutzeraktion ein Event / Dispatch aus.],
  [2], [Data Service], [Sendet einen HTTP GET Request an den zuständigen API-Endpunkt.],
  [3], [Backend API], [Verifiziert den JWT-Token, prüft Berechtigungen und holt Daten via ORM/SQL.],
  [4], [Frontend Store], [Aktualisiert den lokalen State mit der erhaltenen Response.],
  [5], [UI-Komponente], [Reagiert reaktiv auf die Zustandsänderung und aktualisiert die Ansicht.],
)

#tip[
  Sequenzdiagramme können direkt in Typst oder als Vektorgrafiken (`.svg`) in `Doc/assets/` abgelegt und eingebunden werden.
]
