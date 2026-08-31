// =============================================================================
// HSLU Typst Template
// Modul: WebLab / Hochschule Luzern - Informatik
// =============================================================================

#let hslu-blue = rgb("#005ea8")
#let hslu-dark = rgb("#1a2b49")
#let text-color = rgb("#2b2b2b")
#let light-gray = rgb("#f8fafc")
#let border-gray = rgb("#e2e8f0")
#let accent-green = rgb("#16a34a")
#let accent-amber = rgb("#d97706")
#let accent-red = rgb("#dc2626")

// Callout / Info Boxen
#let callout(title: none, body, fill: light-gray, stroke: hslu-blue, icon: none) = {
  block(
    width: 100%,
    fill: fill,
    inset: (x: 12pt, y: 10pt),
    radius: 4pt,
    stroke: (left: 3pt + stroke),
    [
      #if title != none [
        #set text(weight: "bold", fill: stroke)
        #if icon != none [#icon #h(4pt)]
        #title
        #v(4pt)
      ]
      #set text(fill: text-color, size: 9.5pt)
      #body
    ]
  )
}

#let note(body, title: "Hinweis") = callout(
  title: title,
  body,
  fill: rgb("#f0f7ff"),
  stroke: hslu-blue,
  icon: [ℹ]
)

#let tip(body, title: "Tipp") = callout(
  title: title,
  body,
  fill: rgb("#f0fdf4"),
  stroke: accent-green,
  icon: [✓]
)

#let warning(body, title: "Wichtig") = callout(
  title: title,
  body,
  fill: rgb("#fffbeb"),
  stroke: accent-amber,
  icon: [⚠]
)

#let todo(body, title: "TODO") = callout(
  title: title,
  body,
  fill: rgb("#fef2f2"),
  stroke: accent-red,
  icon: [📝]
)

// Status Badges
#let badge(text-val, color: hslu-blue) = {
  box(
    fill: color.lighten(85%),
    stroke: color.lighten(30%) + 0.5pt,
    radius: 3pt,
    inset: (x: 6pt, y: 3pt),
    outset: 0pt,
    baseline: 0%,
    [#set text(fill: color, size: 8pt, weight: "bold"); #text-val]
  )
}

// Architectural Decision Record (ADR) Box
#let adr(
  number: "1",
  title: "",
  status: "Akzeptiert",
  date: none,
  problem-context: [],
  decision: [],
  consequences: []
) = {
  let status-color = if status == "Akzeptiert" or status == "Accepted" {
    accent-green
  } else if status == "Vorgeschlagen" or status == "Proposed" {
    accent-amber
  } else if status == "Veraltet" or status == "Deprecated" {
    accent-red
  } else {
    hslu-blue
  }

  block(
    width: 100%,
    stroke: border-gray,
    radius: 4pt,
    inset: 12pt,
    fill: rgb("#fafcff"),
    [
      #grid(
        columns: (1fr, auto),
        align: (left + horizon, right + horizon),
        [
          #text(weight: "bold", size: 12pt, fill: hslu-dark)[ADR-#number: #title]
        ],
        [
          #badge(status, color: status-color)
          #if date != none [ #h(6pt) #text(size: 8.5pt, fill: luma(100))[#date] ]
        ]
      )
      #v(4pt)
      #line(length: 100%, stroke: 0.5pt + border-gray)
      #v(4pt)

      #text(weight: "bold", size: 9.5pt, fill: hslu-dark)[Kontext & Problemstellung:]
      #v(2pt)
      #text(size: 9.5pt)[#problem-context]

      #v(6pt)
      #text(weight: "bold", size: 9.5pt, fill: hslu-dark)[Entscheidung:]
      #v(2pt)
      #text(size: 9.5pt)[#decision]

      #v(6pt)
      #text(weight: "bold", size: 9.5pt, fill: hslu-dark)[Konsequenzen & Vor-/Nachteile:]
      #v(2pt)
      #text(size: 9.5pt)[#consequences]
    ]
  )
}

// Arbeitsjournal-Eintrag Helper
#let journal-entry(
  date: "",
  duration: "",
  phase: none,
  title: "",
  tasks: (),
  insights: none,
  next: none
) = {
  block(
    width: 100%,
    stroke: border-gray,
    radius: 4pt,
    inset: 12pt,
    fill: rgb("#ffffff"),
    [
      #grid(
        columns: (auto, 1fr, auto),
        gutter: 8pt,
        align: (left + horizon, left + horizon, right + horizon),
        [
          #text(weight: "bold", fill: hslu-dark)[#date]
        ],
        [
          #text(weight: "semibold")[#title]
          #if phase != none [ #h(6pt) #badge(phase, color: hslu-blue) ]
        ],
        [
          #if duration != "" [ #badge(duration, color: rgb("#475569")) ]
        ]
      )
      #v(4pt)
      #line(length: 100%, stroke: 0.5pt + border-gray)
      #v(4pt)

      #if tasks.len() > 0 [
        #text(weight: "semibold", size: 9pt, fill: hslu-dark)[Durchgeführte Tätigkeiten:]
        #list(..tasks.map(t => text(size: 9.5pt)[#t]))
      ]

      #if insights != none [
        #v(4pt)
        #text(weight: "semibold", size: 9pt, fill: hslu-dark)[Erkenntnisse & Herausforderungen:]
        #v(2pt)
        #text(size: 9.5pt)[#insights]
      ]

      #if next != none [
        #v(4pt)
        #text(weight: "semibold", size: 9pt, fill: hslu-dark)[Nächste Schritte:]
        #v(2pt)
        #text(size: 9.5pt)[#next]
      ]
    ]
  )
}

// Hauptvorlage
#let project-doc(
  title: "",
  subtitle: "",
  doc-type: "Dokumentation",
  authors: (),
  module: "WebLab",
  semester: "FS 2026",
  supervisor: none,
  version: "1.0",
  date: datetime.today().display("[day].[month].[year]"),
  abstract: none,
  show-toc: true,
  toc-depth: 3,
  body
) = {
  // Metadaten für PDF
  set document(
    title: title + " - " + module,
    author: authors.map(a => if type(a) == str { a } else { a.name }),
    date: auto,
  )

  // Schrift & Grundlayout
  set text(
    font: ("Liberation Sans", "DejaVu Sans", "Ubuntu Sans", "Ubuntu"),
    size: 10.5pt,
    lang: "de",
    fill: text-color,
    spacing: 120%,
  )

  set par(
    justify: true,
    leading: 0.75em,
  )

  // Formatierung von Überschriften
  show heading: it => [
    #set text(fill: hslu-dark, font: ("Liberation Sans", "DejaVu Sans", "Ubuntu Sans", "Ubuntu"))
    #if it.level == 1 {
      v(18pt, weak: true)
      text(size: 16pt, weight: "bold")[#it]
      v(8pt, weak: true)
    } else if it.level == 2 {
      v(14pt, weak: true)
      text(size: 13pt, weight: "bold")[#it]
      v(6pt, weak: true)
    } else if it.level == 3 {
      v(10pt, weak: true)
      text(size: 11pt, weight: "bold")[#it]
      v(4pt, weak: true)
    } else {
      v(8pt, weak: true)
      text(size: 10.5pt, weight: "bold")[#it]
      v(3pt, weak: true)
    }
  ]

  // Code-Blöcke
  show raw.where(block: true): it => block(
    width: 100%,
    fill: rgb("#f8fafc"),
    stroke: border-gray,
    inset: 10pt,
    radius: 4pt,
    [
      #set text(font: ("Liberation Mono", "DejaVu Sans Mono", "Ubuntu Mono"), size: 8.5pt)
      #it
    ]
  )

  show raw.where(block: false): it => box(
    fill: rgb("#f1f5f9"),
    inset: (x: 3pt, y: 1.5pt),
    radius: 2pt,
    [
      #set text(font: ("Liberation Mono", "DejaVu Sans Mono", "Ubuntu Mono"), size: 8.5pt, fill: rgb("#0f172a"))
      #it
    ]
  )

  // Links
  show link: it => text(fill: hslu-blue, underline(it))

  // Tabellen-Styling
  set table(
    stroke: (x, y) => if y == 0 { (bottom: 1.5pt + hslu-dark) } else { 0.5pt + border-gray },
    fill: (x, y) => if y == 0 { rgb("#f1f5f9") } else if calc.even(y) { rgb("#fafcff") } else { none },
    inset: (x: 8pt, y: 7pt),
  )

  // Seitenränder & Kopf-/Fusszeilen
  set page(
    paper: "a4",
    margin: (top: 3cm, bottom: 2.5cm, left: 2.5cm, right: 2.5cm),
    header: context {
      let page-num = counter(page).get().first()
      if page-num > 1 [
        #grid(
          columns: (1fr, 1fr),
          align: (left, right),
          [
            #set text(size: 8.5pt, fill: rgb("#64748b"))
            #module | #doc-type
          ],
          [
            #set text(size: 8.5pt, fill: rgb("#64748b"))
            #title
          ]
        )
        #v(2pt)
        #line(length: 100%, stroke: 0.5pt + rgb("#cbd5e1"))
      ]
    },
    footer: context {
      let page-num = counter(page).get().first()
      let total-pages = counter(page).final().first()
      if page-num > 1 [
        #line(length: 100%, stroke: 0.5pt + rgb("#cbd5e1"))
        #v(4pt)
        #grid(
          columns: (1fr, 1fr),
          align: (left, right),
          [
            #set text(size: 8.5pt, fill: rgb("#64748b"))
            HSLU Informatik -- #authors.map(a => if type(a) == str { a } else { a.name }).join(", ")
          ],
          [
            #set text(size: 8.5pt, fill: rgb("#64748b"))
            Seite #page-num von #total-pages
          ]
        )
      ]
    }
  )

  // --- TITELSEITE ---
  {
    v(1cm)
    
    // Header Institution
    grid(
      columns: (1fr, auto),
      align: (left + horizon, right + horizon),
      [
        #text(size: 14pt, weight: "bold", fill: hslu-dark)[Hochschule Luzern]\
        #text(size: 10pt, fill: rgb("#64748b"))[Departement Informatik -- #module]
      ],
      [
        #badge(doc-type, color: hslu-blue)
      ]
    )

    v(15pt)
    line(length: 100%, stroke: 2pt + hslu-blue)
    v(30pt)

    // Titel & Untertitel
    text(size: 26pt, weight: "bold", fill: hslu-dark)[#title]
    
    if subtitle != "" [
      #v(10pt)
      #text(size: 14pt, fill: rgb("#475569"))[#subtitle]
    ]

    v(35pt)

    // Metadaten-Box
    rect(
      width: 100%,
      fill: rgb("#f8fafc"),
      stroke: border-gray,
      radius: 6pt,
      inset: 16pt,
      [
        #grid(
          columns: (auto, 1fr),
          column-gutter: 20pt,
          row-gutter: 10pt,
          [#text(weight: "bold", fill: hslu-dark)[Autor(en):]],
          [
            #for a in authors [
              #if type(a) == str [
                #a \
              ] else [
                #a.name #if "email" in a [ (#link("mailto:" + a.email)[#a.email]) ] #if "id" in a [ -- Matrikelnr.: #a.id ] \
              ]
            ]
          ],
          [#text(weight: "bold", fill: hslu-dark)[Modul:]], [#module (#semester)],
          ..if supervisor != none {
            ([#text(weight: "bold", fill: hslu-dark)[Dozierende/Betreuung:]], [#supervisor])
          } else { () },
          [#text(weight: "bold", fill: hslu-dark)[Version:]], [#version],
          [#text(weight: "bold", fill: hslu-dark)[Datum:]], [#date],
        )
      ]
    )

    if abstract != none [
      #v(20pt)
      #block(
        fill: rgb("#f1f5f9"),
        inset: 12pt,
        radius: 4pt,
        stroke: (left: 3pt + hslu-blue),
        [
          #text(weight: "bold", size: 10pt, fill: hslu-dark)[Management Summary / Abstract]\
          #v(4pt)
          #text(size: 9.5pt, style: "italic")[#abstract]
        ]
      )
    ]

    pagebreak()
  }

  // --- INHALTSVERZEICHNIS ---
  if show-toc {
    set page(numbering: "1")
    counter(page).update(1)
    
    outline(
      title: [Inhaltsverzeichnis],
      depth: toc-depth,
      indent: 1.5em,
    )
    v(20pt)
    pagebreak()
  }

  // Nummerierung für Hauptinhalt
  set heading(numbering: "1.1")
  
  body
}
