#import "../template/hslu-template.typ": project-doc, note, tip, warning, todo, adr, badge

#show: project-doc.with(
  title: "Architekturdokumentation",
  subtitle: "WebLab Projekt -- Konzeption, Struktur und technische Architektur",
  doc-type: "Architekturdokumentation",
  authors: (
    (name: "Vorname Nachname", email: "vorname.nachname@stud.hslu.ch", id: "XX-XXX-XXX"),
  ),
  module: "WebLab",
  semester: "FS 2026",
  supervisor: "Dozent Name",
  version: "1.0",
  abstract: [
    Dieses Dokument beschreibt die Softwarearchitektur der im Rahmen des Moduls WebLab entwickelten Webanwendung.
    Es orientiert sich an gängigen Architekturmustern (u. a. arc42) und dokumentiert die Systemziele,
    Randbedingungen, Bausteine, Datenstrukturen sowie zentrale Architekturentscheidungen (ADRs).
  ],
  show-toc: true,
  toc-depth: 3,
)

// Einzelne Kapitel einbinden
#include "01_einleitung.typ"
#include "02_randbedingungen.typ"
#include "03_kontext_abgrenzung.typ"
#include "04_bausteinsicht.typ"
#include "05_laufzeitsicht.typ"
#include "06_verteilungssicht.typ"
#include "07_datenmodell.typ"
#include "08_querschnittskonzepte.typ"
#include "09_architekturentscheidungen.typ"
