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
Gängige Vereins-Apps decken die spezifischen Sicherheitsanforderungen des Bergsports nicht ab. Daher entwickle ich eine spezialisierte Webapplikation, mit der Bergtouren erstellt und organisiert werden können. Mitglieder können geplanten Touren beitreten, woraufhin ihre hinterlegten Notfallkontakte automatisch für die Tourenleitung sichtbar werden, um im Ernstfall schnell handlungsfähig zu sein. Zudem kann die führende Person den Treffpunkt sowie eine verbindliche Packliste festlegen. Ein zentraler Bestandteil ist die digitale Erfassung der 3x3-Sicherheitsmatrix, um die sorgfältige Tourenplanung zu dokumentieren und die tourenführende Person im Falle eines Unfalls rechtlich abzusichern. 

= User-Stories
#link("https://github.com/users/Stonehouse1703/projects/2/views/1?system_template=kanban")[Link zu den User-Stories]

= Angedachter Technologie-Stack
- Frontend: Angular
- Backend: 
