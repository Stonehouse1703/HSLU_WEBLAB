#!/usr/bin/env bash
# ==============================================================================
# HSLU WebLab Typst Build Script
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

DOCS=("architektur" "fazit-reflexion" "arbeitsjournal" "projektbeschreibung")

print_help() {
  echo "Verwendung: ./compile.sh [Kommando]"
  echo ""
  echo "Kommandos:"
  echo "  all                  Kompiliert alle Dokumente (Standard)"
  echo "  architektur          Kompiliert nur architektur/main.typ"
  echo "  fazit                Kompiliert nur fazit-reflexion/main.typ"
  echo "  journal              Kompiliert nur arbeitsjournal/main.typ"
  echo "  projekt              Kompiliert nur projektbeschreibung/main.typ"
  echo "  watch [name]         Startet Typst im Live-Watch-Modus (z. B. ./compile.sh watch architektur)"
  echo "  clean                Entfernt alle generierten PDF-Dateien"
  echo "  help                 Zeigt diese Hilfe an"
}

compile_doc() {
  local doc_dir="$1"
  local src_file="$SCRIPT_DIR/${doc_dir}/main.typ"
  local out_file="$SCRIPT_DIR/${doc_dir}.pdf"

  if [ ! -f "$src_file" ]; then
    echo "❌ Datei nicht gefunden: $src_file"
    exit 1
  fi

  echo "🔨 Kompiliere $doc_dir/main.typ -> $doc_dir.pdf ..."
  typst compile --root "$WORKSPACE_ROOT" "$src_file" "$out_file"
  echo "✅ $out_file erfolgreich erstellt."
}

watch_doc() {
  local target="${1:-architektur}"
  # Map alias names
  if [ "$target" = "fazit" ]; then target="fazit-reflexion"; fi
  if [ "$target" = "journal" ]; then target="arbeitsjournal"; fi
  if [ "$target" = "projekt" ]; then target="projektbeschreibung"; fi

  local src_file="$SCRIPT_DIR/${target}/main.typ"
  local out_file="$SCRIPT_DIR/${target}.pdf"

  if [ ! -f "$src_file" ]; then
    echo "❌ Datei nicht gefunden: $src_file"
    exit 1
  fi

  echo "👀 Starte Typst Watch für $src_file ..."
  echo "💡 Änderungen werden automatisch in $out_file übernommen. Beenden mit Ctrl+C."
  typst watch --root "$WORKSPACE_ROOT" "$src_file" "$out_file"
}

cmd="${1:-all}"

case "$cmd" in
  all)
    echo "🚀 Kompiliere alle WebLab Dokumente..."
    for d in "${DOCS[@]}"; do
      compile_doc "$d"
    done
    echo "🎉 Fertig!"
    ;;
  architektur)
    compile_doc "architektur"
    ;;
  fazit|fazit-reflexion|reflexion)
    compile_doc "fazit-reflexion"
    ;;
  journal|arbeitsjournal)
    compile_doc "arbeitsjournal"
    ;;
  projekt|projektbeschreibung)
    compile_doc "projektbeschreibung"
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
