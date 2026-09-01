#import "../template/basic-wipro.typ": basic-wipro

#show: basic-wipro.with(
  logo: image("../assets/hslu-logo.svg", width: 30%),
  title: "Projektbeschreibung",
  subtitle: "",
  project-type: "WEBLAB",
  students: ("Colin Felber",),
  year: "2026",
  supervisor: "Dominik Witschard",
  show-declaration: false,
)

= Kontext
Wer eine Skitour für eine Gruppe leitet, trägt viel Verantwortung. Bei Notfällen am Berg muss es schnell gehen, und die Tourenleitung braucht sofort die richtigen Kontaktdaten der Teilnehmenden. Zudem muss eine Tour sauber geplant sein, damit alle sicher unterwegs sind.

== Problem 
Normale Vereins- oder Chat-Apps reichen für den Bergsport nicht aus. Notfallkontakte fehlen oft oder sind schwer zu finden. Noch wichtiger: Kommt es zu einem Unfall, steht die tourenführende Person schnell vor Gericht. Wer dann nicht belegen kann, dass die Tour vorher gründlich geplant wurde, hat juristisch schlechte Karten.

== Lösung 
Eine einfache Webapplikation für die Organisation und Absicherung von Bergtouren:

- *Digitale 3x3-Sicherheitsmatrix*: Die Tourenplanung (Verhältnisse, Gelände, Gruppe) wird direkt in der App festgehalten. So ist die Planung dokumentiert und die Tourenleitung im Ernstfall abgesichert.

- *Notfallkontakte sofort griffbereit*: Sobald jemand einer Tour beitritt, sieht die Tourenleitung automatisch die im Profil hinterlegten Notfallkontakte.

- *Alles an einem Ort*: Treffpunkt, Zeitplan und eine gemeinsame Packliste sind für die ganze Gruppe klar ersichtlich.

= User-Stories

#link("https://github.com/users/Stonehouse1703/projects/2/views/3?visibleFields=%5B%22Title%22%2C%22Status%22%2C%22Labels%22%2C406463020%2C406463021%2C406463019%2C406463022%2C406463023%5D")[Link zu den User-Stories]

== Abgrenzungen (auch in den User-Stories ersichtlich)
- Es wird kein Login via Drittanbieter (z.B. Google, Facebook) implementiert.
- Ein automatischer E-Mail-Versand (z. B. für Passwort-Reset oder Benachrichtigungen) ist ausgeschlossen.
- Es gibt keinen integrierten Live-Chat zwischen den Teilnehmenden; die Kommunikation erfolgt extern.
- Automatische Abfragen oder Push-Warnungen bei Änderungen des Lawinenbulletins werden nicht umgesetzt.

= Angedachter Technologie-Stack
- Frontend: Angular
- Backend: Node.js
