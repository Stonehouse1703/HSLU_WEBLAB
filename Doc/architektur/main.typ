#import "../template/basic-wipro.typ": basic-wipro

#show: basic-wipro.with(
  logo: image("../assets/hslu-logo.svg", width: 30%),
  title: "Architekturdokumentation",
  subtitle: "",
  project-type: "WEBLAB",
  students: ("Colin Felber",),
  year: "2026",
  supervisor: "Dominik Witschard",
  show-declaration: false,
)

= Einführung & Ziele

== Aufgabenstellung

== Qualitätsziele

= Randbedingungen & Kontext

== Technologiestack

== Kontextabgrenzung

= Lösungsstrategie & Bausteinsicht

== Frontend-Architektur

== Backend-Architektur

= Laufzeitsicht

= Datenmodell & Persistenz

= Verteilungssicht & Deployment

= Querschnittskonzepte

== Sicherheit & Authentifizierung

= Architekturentscheidungen (ADRs)
