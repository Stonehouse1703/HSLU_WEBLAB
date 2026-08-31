#let document-property(title: "", info: "") = {
  if info != "" and info != none [
    [/ #title\:: #info]
    v(.25em)
  ]
}

#let checkbox(info: "", checked: false) = box[
  #box(
    width: 1em,
    height: 1em,
    stroke: 0.5pt + black,
    inset: 0.1em,
    baseline: 0.15em,
  )[
    #if checked [#text(size: 0.8em)[✓]] else []
  ]
  #h(0.3em)
  #info
]

#let signature() = {
  grid(
    columns: (auto, 1fr),
    gutter: 0.75em,
    align: bottom,
    [Ort / Datum, Unterschrift], line(length: 100%, stroke: 1pt + gray),
  )
}

#let title-page(
  logo: none,
  title: "",
  subtitle: "",
  project-type: "WEBLAB",
  students: (),
  year: "2026",
  institution: "Hochschule Luzern - Informatik",
  study-program: "BSc Informatik",
  supervisor: "Dominik Witschard",
  expert: "",
  client: "",
  public: true,
  secret: false,
  show-declaration: true,
  scanned-signature-page: none,
) = {
  if logo != none {
    logo
  }

  align(center)[
    #v(1fr)

    #text(size: 14pt)[
      Informatik
      #linebreak()
      #institution
    ]

    #v(1.5fr)

    #text(size: 24pt, weight: "bold")[#title]

    #if subtitle != "" and subtitle != none [
      #v(0.5fr)
      #text(size: 14pt)[#subtitle]
    ]

    #v(2fr)

    #text(size: 16pt)[#upper(project-type)]

    #text(size: 11pt)[vorgelegt am Departement Informatik der Hochschule Luzern (Schweiz)]

    #v(2fr)

    #text(size: 11pt)[von]

    #text(size: 15pt)[
      #students.map(student => text(weight: "bold")[#if type(student) == str { student } else { student.name }]).join(" und ")
    ]

    #v(1fr)

    #text(size: 11pt)[von]

    #text(size: 15pt)[Luzern (Schweiz)]

    #v(2fr)
  ]

  pagebreak()

  if show-declaration {
    if scanned-signature-page != none {
      scanned-signature-page
    } else {
      text()[= #project-type an der Hochschule Luzern - Informatik]
      v(1em)

      document-property(title: "Titel", info: title)

      for student in students [
        #let s-name = if type(student) == str { student } else { student.name }
        #let s-extra = if type(student) == dictionary and "email" in student { " (" + student.email + ")" } else { "" }
        #document-property(title: "Student", info: s-name + s-extra)
      ]

      if study-program != "" [
        #document-property(title: "Studiengang", info: study-program)
      ]
      if year != "" [
        #document-property(title: "Jahr", info: year)
      ]
      if supervisor != "" [
        #document-property(title: "Betreuungsperson", info: supervisor)
      ]
      if expert != "" [
        #document-property(title: "Expertenperson", info: expert)
      ]
      if client != "" [
        #document-property(title: "Auftraggeberin / Auftraggeber", info: client)
      ]

      v(.5em)

      text()[
        *Codierung / Klassifizierung der Arbeit:*
      ]
      linebreak()
      checkbox(info: "Öffentlich (Normalfall) ", checked: public)
      linebreak()
      checkbox(info: "Vertraulich ", checked: secret)

      v(2em)

      text()[
        *Eidesstattliche Erklärung*

        Ich erkläre hiermit, dass ich/wir die vorliegende Arbeit selbständig und ohne unerlaubte fremde Hilfe angefertigt
        habe/n. Alle verwendeten Quellen, Literatur und Hilfsmittel (insbesondere künstliche Intelligenz oder sonstige
        verwendete Instrumente) wurden urheberrechts- und datenschutzkonform verwendet und wörtlich oder inhaltlich
        entnommene Stellen als solche kenntlich gemacht. Das Vertraulichkeitsinteresse des Auftraggebers wurde gewahrt
        und die Urheberrechtsbestimmungen der Hochschule Luzern respektiert.
      ]

      v(1.5em)
      signature()
      v(1.5em)
      signature()

      v(1fr)

      text(style: "italic")[
        Geistiges Eigentum gemäss der
        #link("https://srl.lu.ch/app/de/texts_of_law/521/versions/3884")[
          #underline()[Studienordnung]
        ]
        für die Ausbildung an der Hochschule Luzern, FH Zentralschweiz
      ]
    }
    pagebreak()
  }
}
