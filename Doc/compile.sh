#!/usr/bin/env bash
# ==============================================================================
# HSLU WebLab Typst Build Script
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

DOCS=("architektur" "fazit_reflexion" "arbeitsjournal" "komplettdokumentation")

print_help() {
  echo "Verwendung: ./compile.sh [Kommando]"
  echo ""
  echo "Kommandos:"
  echo "  all                  Kompiliert alle Dokumente (Standard)"
  echo "  architektur          Kompiliert nur die Architekturdokumentation"
  echo "  fazit                Kompiliert nur Fazit & Reflexion"
  echo "  journal              Kompiliert nur das Arbeitsjournal"
  echo "  komplett             Kompiliert die Gesamtdokumentation"
  echo "  watch [name]         Startet Typst im Live-Watch-Modus (z. B. ./compile.sh watch architektur)"
  echo "  clean                Entfernt alle generierten PDF-Dateien"
  echo "  help                 Zeigt diese Hilfe an"
}

compile_doc() {
  local doc_name="$1"
  local src_file="$SCRIPT_DIR/${doc_name}.typ"
  local out_file="$SCRIPT_DIR/${doc_name}.pdf"

  if [ ! -f "$src_file" ]; then
    echo "❌ Datei nicht gefunden: $src_file"
    exit 1
  fi

  echo "🔨 Kompiliere $doc_name.typ -> $doc_name.pdf ..."
  typst compile "$src_file" "$out_file"
  echo "✅ $out_file erfolgreich erstellt."
}

watch_doc() {
  local target="${1:-architektur}"
  local src_file="$SCRIPT_DIR/${target}.typ"
  local out_file="$SCRIPT_DIR/${target}.pdf"

  if [ ! -f "$src_file" ]; then
    echo "❌ Datei nicht gefunden: $src_file"
    exit 1
  fi

  echo "👀 Starte Typst Watch für $src_file ..."
  echo "💡 Änderungen werden automatisch in $out_file übernommen. Beenden mit Ctrl+C."
  typst watch "$src_file" "$out_file"
}

cmd="${1:-all}"

case "$cmd" in
  all)
    echo "🚀 Kompiliere alle WebLab Typst-Dokumente..."
    for d in "${DOCS[@]}"; do
      compile_doc "$d"
    done
    echo "🎉 Alle Dokumente erfolgreich erstellt!"
    ;;
  architektur)
    compile_doc "architektur"
    ;;
  fazit|fazit_reflexion|reflexion)
    compile_doc "fazit_reflexion"
    ;;
  journal|arbeitsjournal)
    compile_doc "arbeitsjournal"
    ;;
  komplett|komplettdokumentation)
    compile_doc "komplettdokumentation"
    ;;
  watch)
    watch_doc "${2:-architektur}"
    ;;
  clean)
    echo "🧹 Lösche erstellte PDFs..."
    rm -f "$SCRIPT_DIR"/*.pdf
    echo "✅ Bereinigung abgeschlossen."
    ;;
  help|--help|-h)
    print_help
    ;;
  *)
    echo "Unbekanntes Kommando: $cmd"
    print_help
    exit 1
    ;;
esac
