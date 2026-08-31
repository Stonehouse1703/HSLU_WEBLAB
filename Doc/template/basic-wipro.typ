#import "title-page.typ": title-page
#import "utils.typ": in-outline

#let template(
  title: "",
  subtitle: "",
  project-type: "WEBLAB",
  students: ("Colin Felber",),
  year: "2026",
  institution: "Hochschule Luzern (Schweiz)",
  study-program: "BSc Informatik",
  supervisor: "Dominik Witschard",
  expert: "",
  client: "",
  public: true,
  secret: false,
  scanned-signature-page: none,
  show-title-page: true,
  show-declaration: true,
  show-toc: true,
  toc-depth: 3,
  abstract: none,
  bibliography: none,
  abbreviations: none,
  figure-outline: none,
  table-outline: none,
  code-outline: none,
  appendix: none,
  ai: none,
  logo: none,
  doc,
) = {
  set page(numbering: none)
  set heading(outlined: false)

  if show-title-page {
    title-page(
      logo: logo,
      title: title,
      subtitle: subtitle,
      project-type: project-type,
      students: students,
      year: year,
      institution: institution,
      study-program: study-program,
      supervisor: supervisor,
      expert: expert,
      client: client,
      public: public,
      secret: secret,
      show-declaration: show-declaration,
      scanned-signature-page: scanned-signature-page,
    )
  }

  counter(page).update(1)

  show outline: it => {
    in-outline.update(true)
    it
    in-outline.update(false)
  }

  set page(
    footer: context [
      #align(
        right + horizon,
        counter(page).display(
          "1 von 1",
          both: true,
        ),
      )
    ],
  )

  if abstract != none and abstract != "" {
    abstract
    pagebreak()
  }

  if show-toc {
    outline(title: "Inhaltsverzeichnis", depth: toc-depth)
  }

  if (abbreviations != none and abbreviations != "") or (figure-outline != none and figure-outline != "") or (table-outline != none and table-outline != "") {
    set heading(numbering: none, outlined: false)
    show heading: it => {
      block(it.body)
    }

    if figure-outline != none and figure-outline != "" {
      pagebreak()
      figure-outline
    }
    if table-outline != none and table-outline != "" {
      pagebreak()
      table-outline
    }
    if code-outline != none and code-outline != "" {
      pagebreak()
      code-outline
    }
    if abbreviations != none and abbreviations != "" {
      pagebreak()
      abbreviations
    }
  }

  set heading(numbering: "1.1.1", outlined: true)
  show heading: it => {
    if (it.level >= 4) {
      block(it.body)
    } else {
      block(counter(heading).display() + " " + it.body)
    }
  }
  show heading.where(level: 1): it => {
    pagebreak()
    it
  }
  show link: underline

  show figure.caption: set text(fill: luma(100))
  show figure.where(kind: raw): set figure(supplement: "Code")
  show figure.where(kind: raw): set align(left)
  show raw.where(block: true): set text(size: 0.8em)

  set par(spacing: 1.5em)
  set quote(block: true)
  set text(font: ("Liberation Serif", "DejaVu Serif"), hyphenate: true)

  doc

  if bibliography != none and bibliography != "" {
    bibliography
  }

  if ai != none and ai != "" {
    pagebreak()
    ai
  }

  if appendix != none and appendix != "" {
    appendix
  }
}

// Alias for backwards compatibility with user template
#let basic-wipro = template
