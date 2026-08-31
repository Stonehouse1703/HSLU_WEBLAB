#import "../template/basic-wipro.typ": basic-wipro

#show: basic-wipro.with(
  logo: image("../assets/hslu-logo.svg", width: 30%),
  title: "Arbeitsjournal",
  subtitle: "",
  project-type: "WEBLAB",
  students: ("Colin Felber",),
  year: "2026",
  supervisor: "Dominik Witschard",
  show-declaration: false,
)

= Stunden

#table(
  columns: (auto, 1fr, auto, auto),
  table.header([*Datum*], [*Tätigkeit*], [*Stunden  *]),
  [2023-10-01], [Initialisierung & Setup], [15], [0],
  [2023-10-08], [Architektur & Konzept], [20], [0],
  [2023-10-15], [Entwicklung], [55], [0],
  [2023-10-22], [Testing & Dokumentation], [30], [0],
)
