.PHONY: all architektur fazit journal komplett watch-architektur watch-fazit watch-journal clean help

all: architektur fazit journal komplett

architektur:
	typst compile Doc/architektur.typ Doc/architektur.pdf

fazit:
	typst compile Doc/fazit_reflexion.typ Doc/fazit_reflexion.pdf

journal:
	typst compile Doc/arbeitsjournal.typ Doc/arbeitsjournal.pdf

komplett:
	typst compile Doc/komplettdokumentation.typ Doc/komplettdokumentation.pdf

watch-architektur:
	typst watch Doc/architektur.typ Doc/architektur.pdf

watch-fazit:
	typst watch Doc/fazit_reflexion.typ Doc/fazit_reflexion.pdf

watch-journal:
	typst watch Doc/arbeitsjournal.typ Doc/arbeitsjournal.pdf

clean:
	rm -f Doc/*.pdf

help:
	@echo "Verfügbare Befehle:"
	@echo "  make all                Kompiliert alle Dokumente"
	@echo "  make architektur        Kompiliert nur Architekturdokumentation"
	@echo "  make fazit              Kompiliert nur Fazit & Reflexion"
	@echo "  make journal            Kompiliert nur Arbeitsjournal"
	@echo "  make komplett           Kompiliert das zusammengefasste Gesamtdokument"
	@echo "  make watch-architektur  Startet Live-Watch für Architektur"
	@echo "  make watch-fazit        Startet Live-Watch für Fazit"
	@echo "  make watch-journal      Startet Live-Watch für Arbeitsjournal"
	@echo "  make clean              Löscht alle PDFs"
