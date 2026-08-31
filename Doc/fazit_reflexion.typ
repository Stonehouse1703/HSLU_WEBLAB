#import "template/hslu-template.typ": project-doc, note, tip, warning, todo, badge

#show: project-doc.with(
  title: "Fazit & Reflexion",
  subtitle: "WebLab Projekt -- Projektanalyse, Lessons Learned und persönliche Reflexion",
  doc-type: "Fazit & Reflexion",
  authors: (
    (name: "Vorname Nachname", email: "vorname.nachname@stud.hslu.ch", id: "XX-XXX-XXX"),
  ),
  module: "WebLab",
  semester: "FS 2026",
  supervisor: "Dozent Name",
  version: "1.0",
  abstract: [
    Dieses Dokument fasst die Ergebnisse des WebLab-Projekts zusammen, vergleicht die Anforderungen mit dem erreichten Stand (Soll-Ist-Vergleich), reflektiert technische sowie methodische Erkenntnisse und gibt einen Ausblick auf mögliche zukünftige Erweiterungen.
  ],
  show-toc: true,
  toc-depth: 2,
)

#include "fazit-reflexion/01_zusammenfassung.typ"
#include "fazit-reflexion/02_zielerreichung.typ"
#include "fazit-reflexion/03_lessons_learned.typ"
#include "fazit-reflexion/04_persoenliche_reflexion.typ"
#include "fazit-reflexion/05_ausblick.typ"
