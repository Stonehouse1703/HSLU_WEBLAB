#import "template/hslu-template.typ": project-doc, note, tip, warning, todo, adr, journal-entry, badge

#show: project-doc.with(
  title: "Gesamtdokumentation WebLab",
  subtitle: "Architektur, Fazit & Reflexion sowie Arbeitsjournal",
  doc-type: "Gesamtdokumentation",
  authors: (
    (name: "Vorname Nachname", email: "vorname.nachname@stud.hslu.ch", id: "XX-XXX-XXX"),
  ),
  module: "WebLab",
  semester: "FS 2026",
  supervisor: "Dozent Name",
  version: "1.0",
  abstract: [
    Dieses Gesamtdokument beinhaltet alle drei obligatorischen Teildokumente des Moduls WebLab: Die vollständige Architekturdokumentation inklusive ADRs, das abschliessende Fazit mit persönlicher und technischer Reflexion sowie das lückenlose Arbeitsjournal.
  ],
  show-toc: true,
  toc-depth: 3,
)

= TEIL I: Architekturdokumentation

#include "architektur/01_einleitung.typ"
#include "architektur/02_randbedingungen.typ"
#include "architektur/03_kontext_abgrenzung.typ"
#include "architektur/04_bausteinsicht.typ"
#include "architektur/05_laufzeitsicht.typ"
#include "architektur/06_verteilungssicht.typ"
#include "architektur/07_datenmodell.typ"
#include "architektur/08_querschnittskonzepte.typ"
#include "architektur/09_architekturentscheidungen.typ"

#pagebreak()
= TEIL II: Fazit & Reflexion

#include "fazit-reflexion/01_zusammenfassung.typ"
#include "fazit-reflexion/02_zielerreichung.typ"
#include "fazit-reflexion/03_lessons_learned.typ"
#include "fazit-reflexion/04_persoenliche_reflexion.typ"
#include "fazit-reflexion/05_ausblick.typ"

#pagebreak()
= TEIL III: Arbeitsjournal

#include "arbeitsjournal/01_uebersicht.typ"
#include "arbeitsjournal/02_eintraege.typ"
#include "arbeitsjournal/03_fazit_aufwand.typ"
