"""
build_bundle.py — Consolida la extracción en un único markdown para subir al chat.
"""

from pathlib import Path

ROOT = Path(__file__).parent.parent
EXTRACTED = Path(__file__).parent / "extracted"
OUT = ROOT / "BUNDLE_PARA_CLAUDE.md"

HERRAMIENTAS = [
    ("faja", "FAJA (Consulta de faja GNSS)", ["section.html", "style.css", "script.js", "meta.json"]),
    ("posgar07", "POSGAR07 (Conversor coordenadas)", ["section.html", "style.css", "script.js", "meta.json"]),
    ("puntos-intermedios", "PUNTOS-INTERMEDIOS (Generador de puntos intermedios)", ["section.html", "style.css", "script.js", "meta.json"]),
    ("conversor-dxf", "CONVERSOR-DXF (Conversor CSV/TXT a DXF R12)", ["section.html", "style.css", "script.js", "meta.json"]),
]

CURSOS = [
    "programa-completo-curso-gnss",
    "curso-gnss-modulo-1",
    "curso-gnss-modulo-2",
    "curso-gnss-modulo-3",
    "programa-completo-topografia",
    "modulo-1-topografia-basica",
    "modulo-2-nivelacion",
    "modulo-3-estacion-total",
    "programa-completo-fotogrametria",
    "modulo-1-manejo-basico-de-drones",
    "modulo-2-captura-de-datos-y-fotogrametria-aplicada",
    "modulo-3-procesamiento-y-productos-avanzados",
]

AUXILIARES = [
    "asesoria-tecnica",
    "consultoria-y-equipamiento",
]

FENCE = {
    ".html": "html",
    ".css": "css",
    ".js": "javascript",
    ".json": "json",
    ".md": "markdown",
}


def fence_for(filename):
    for ext, lang in FENCE.items():
        if filename.endswith(ext):
            return lang
    return ""


def read(path):
    return path.read_text(encoding="utf-8")


def main():
    parts = []
    parts.append("# BUNDLE PARA CLAUDE — equipargeo migración\n")
    parts.append("Generado: 2026-05-14\n")
    parts.append("---\n")

    # PARTE 1
    parts.append("# PARTE 1 — HERRAMIENTAS\n")
    for i, (slug, title, files) in enumerate(HERRAMIENTAS, 1):
        parts.append(f"## Herramienta {i}: {title}\n")
        base = EXTRACTED / "herramientas" / slug
        for f in files:
            fp = base / f
            if not fp.exists():
                continue
            lang = fence_for(f)
            parts.append(f"### {f}\n")
            parts.append(f"```{lang}")
            parts.append(read(fp))
            parts.append("```\n")
        parts.append("---\n")

    # PARTE 2
    parts.append("# PARTE 2 — CURSOS\n")
    for i, slug in enumerate(CURSOS, 1):
        parts.append(f"## Curso {i:02d}: {slug}\n")
        base = EXTRACTED / "cursos" / slug
        for f in ["meta.json", "content.md", "ctas.json", "imagenes.json"]:
            fp = base / f
            if not fp.exists():
                continue
            lang = fence_for(f)
            parts.append(f"### {f}\n")
            parts.append(f"```{lang}")
            parts.append(read(fp))
            parts.append("```\n")
        parts.append("---\n")

    # PARTE 3
    parts.append("# PARTE 3 — AUXILIARES (con contenido real)\n")
    for slug in AUXILIARES:
        parts.append(f"## {slug}\n")
        base = EXTRACTED / "auxiliares" / slug
        for f in ["meta.json", "content.md", "ctas.json", "forms.json", "imagenes.json"]:
            fp = base / f
            if not fp.exists():
                continue
            lang = fence_for(f)
            parts.append(f"### {f}\n")
            parts.append(f"```{lang}")
            parts.append(read(fp))
            parts.append("```\n")
        parts.append("---\n")

    # PARTE 4
    parts.append("# PARTE 4 — RESUMEN DE EXTRACCIÓN\n")
    parts.append("```json")
    parts.append(read(EXTRACTED / "_resumen.json"))
    parts.append("```\n")

    OUT.write_text("\n".join(parts), encoding="utf-8")
    lines = OUT.read_text(encoding="utf-8").count("\n")
    size = OUT.stat().st_size
    print(f"Bundle generado: {OUT}")
    print(f"Tamaño: {size:,} bytes ({size/1024:.1f} KB)")
    print(f"Lineas: {lines:,}")


if __name__ == "__main__":
    main()
