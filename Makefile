.PHONY: all architektur fazit journal projekt watch-architektur watch-fazit watch-journal watch-projekt clean help

all: architektur fazit journal projekt

architektur:
	typst compile --root . Doc/architektur/main.typ Doc/architektur.pdf

fazit:
	typst compile --root . Doc/fazit-reflexion/main.typ Doc/fazit_reflexion.pdf

journal:
	typst compile --root . Doc/arbeitsjournal/main.typ Doc/arbeitsjournal.pdf

projekt:
	typst compile --root . Doc/projektbeschreibung/main.typ Doc/projektbeschreibung.pdf

watch-architektur:
	typst watch --root . Doc/architektur/main.typ Doc/architektur.pdf

watch-fazit:
	typst watch --root . Doc/fazit-reflexion/main.typ Doc/fazit_reflexion.pdf

watch-journal:
	typst watch --root . Doc/arbeitsjournal/main.typ Doc/arbeitsjournal.pdf

watch-projekt:
	typst watch --root . Doc/projektbeschreibung/main.typ Doc/projektbeschreibung.pdf

clean:
	rm -f Doc/*.pdf

help:
	@echo "Verfügbare Befehle:"
	@echo "  make all                Kompiliert alle Dokumente"
	@echo "  make architektur        Kompiliert Doc/architektur/main.typ"
	@echo "  make fazit              Kompiliert Doc/fazit-reflexion/main.typ"
	@echo "  make journal            Kompiliert Doc/arbeitsjournal/main.typ"
	@echo "  make projekt            Kompiliert Doc/projektbeschreibung/main.typ"
	@echo "  make watch-architektur  Startet Live-Watch für Architektur"
	@echo "  make clean              Löscht alle erstellten PDFs"
