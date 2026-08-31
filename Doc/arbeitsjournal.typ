#import "template/hslu-template.typ": project-doc, note, tip, warning, todo, journal-entry, badge

#show: project-doc.with(
  title: "Arbeitsjournal",
  subtitle: "WebLab Projekt -- Laufende Dokumentation, Aufwände und Meilensteine",
  doc-type: "Arbeitsjournal",
  authors: (
    (name: "Vorname Nachname", email: "vorname.nachname@stud.hslu.ch", id: "XX-XXX-XXX"),
  ),
  module: "WebLab",
  semester: "FS 2026",
  supervisor: "Dozent Name",
  version: "1.0",
  abstract: [
    Dieses Arbeitsjournal dokumentiert den kontinuierlichen Fortschritt, den zeitlichen Aufwand (Soll/Ist) sowie wichtige Zwischenentscheidungen und Erkenntnisse während der Durchführung des WebLab-Projekts.
  ],
  show-toc: true,
  toc-depth: 2,
)

#include "arbeitsjournal/01_uebersicht.typ"
#include "arbeitsjournal/02_eintraege.typ"
#include "arbeitsjournal/03_fazit_aufwand.typ"
