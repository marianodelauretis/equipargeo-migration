"""
parse_equipargeo.py — Extracción estructurada de equipargeo.com

Lee HTMLs crudos de raw-html/source/ y genera salidas estructuradas en
raw-html/extracted/<slug>/ con:

  - Para herramientas: section.html, style.css, script.js, meta.json
  - Para cursos: content.md, meta.json, ctas.json, imagenes.json
  - Para auxiliares: content.md, meta.json, ctas.json, forms.json
"""

import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

# Configuración: qué tipo es cada slug
HERRAMIENTAS = {
    "herramientas-gnss":                     {"section_id": "faja-local-tool",   "slug_out": "faja"},
    "conversor-de-coordenadas-lat-long-gk":  {"section_id": "gk-posgar07-tool",  "slug_out": "posgar07"},
    "herramientas-de-topografia":            {"section_id": "herramienta-puntos","slug_out": "puntos-intermedios"},
    "conversor-a-dxf":                       {"section_id": "eg-csv2dxf",        "slug_out": "conversor-dxf"},
}

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
    "agenda-tu-curso",
    "experiencias",
    "home",
]

SOURCE_DIR = Path(__file__).parent / "source"
OUTPUT_DIR = Path(__file__).parent / "extracted"


def extract_meta(soup):
    """Extrae title, meta description, canonical, og."""
    meta = {
        "title": (soup.title.string.strip() if soup.title and soup.title.string else None),
        "description": None,
        "canonical": None,
        "og": {},
    }
    for tag in soup.find_all("meta"):
        name = tag.get("name", "").lower()
        prop = tag.get("property", "").lower()
        content = tag.get("content", "")
        if name == "description":
            meta["description"] = content
        elif prop.startswith("og:"):
            meta["og"][prop[3:]] = content
    canonical = soup.find("link", rel="canonical")
    if canonical:
        meta["canonical"] = canonical.get("href")
    return meta


def find_main_content(soup):
    """
    Encuentra el contenedor principal del contenido (no header/nav/footer/sidebar).
    Intenta varias estrategias en orden.
    """
    # Strategy 1: <main>
    main = soup.find("main")
    if main:
        return main
    # Strategy 2: <article>
    article = soup.find("article")
    if article:
        return article
    # Strategy 3: div con clase entry-content / post-content / page-content
    for cls in ["entry-content", "post-content", "page-content", "content-area"]:
        div = soup.find("div", class_=cls)
        if div:
            return div
    # Strategy 4: div id="content"
    content = soup.find(id="content")
    if content:
        return content
    # Fallback: body completo
    return soup.body


def remove_chrome(elem):
    """Quita header/nav/footer/sidebar/scripts del elemento."""
    for tag_name in ["header", "nav", "footer", "aside", "script"]:
        for tag in elem.find_all(tag_name):
            tag.decompose()
    # Sidebar por clase común
    for cls in ["sidebar", "widget-area", "site-footer", "site-header"]:
        for el in elem.find_all(class_=cls):
            el.decompose()
    return elem


def html_to_markdown(elem):
    """
    Conversión muy simple de HTML a markdown.
    Preserva: h1-h6, p, ul/ol/li, strong/em, a, img, hr.
    No usa librería para evitar dependencias extra.
    """
    lines = []

    def walk(node):
        if node.name is None:
            text = (node.string or "").strip()
            if text:
                return text
            return ""
        tag = node.name.lower()
        if tag in ("script", "style", "noscript"):
            return ""
        # Recursión para hijos
        children_md = "".join(walk(c) for c in node.children if c is not None)
        children_md = children_md.strip()

        if tag.startswith("h") and tag[1:].isdigit():
            level = int(tag[1])
            lines.append("")
            lines.append("#" * level + " " + children_md)
            lines.append("")
            return ""
        if tag == "p":
            lines.append("")
            lines.append(children_md)
            lines.append("")
            return ""
        if tag == "li":
            lines.append("- " + children_md)
            return ""
        if tag == "ul" or tag == "ol":
            lines.append("")
            for c in node.children:
                if c.name == "li":
                    walk(c)
            lines.append("")
            return ""
        if tag == "br":
            return "\n"
        if tag == "strong" or tag == "b":
            return f"**{children_md}**"
        if tag == "em" or tag == "i":
            return f"*{children_md}*"
        if tag == "a":
            href = node.get("href", "")
            return f"[{children_md}]({href})"
        if tag == "img":
            alt = node.get("alt", "")
            src = node.get("src", "")
            lines.append("")
            lines.append(f"![{alt}]({src})")
            lines.append("")
            return ""
        if tag == "hr":
            lines.append("")
            lines.append("---")
            lines.append("")
            return ""
        # Por default, devolver hijos
        return children_md

    walk(elem)
    md = "\n".join(lines)
    # Limpieza: colapsar líneas vacías múltiples
    md = re.sub(r"\n{3,}", "\n\n", md)
    return md.strip()


def extract_ctas(elem):
    """Lista botones y enlaces de acción del contenido principal."""
    ctas = []
    for a in elem.find_all("a", href=True):
        text = a.get_text(strip=True)
        href = a["href"]
        # Filtrar links de navegación cortos / footers (heurística)
        if text and len(text) > 1:
            ctas.append({"text": text, "href": href})
    return ctas


def extract_forms(elem):
    """Inspecciona forms del contenido principal."""
    forms = []
    for form in elem.find_all("form"):
        f = {
            "action": form.get("action", ""),
            "method": form.get("method", "GET").upper(),
            "fields": [],
        }
        for inp in form.find_all(["input", "textarea", "select"]):
            f["fields"].append({
                "tag": inp.name,
                "name": inp.get("name", ""),
                "type": inp.get("type", ""),
                "placeholder": inp.get("placeholder", ""),
                "required": inp.has_attr("required"),
            })
        forms.append(f)
    return forms


def extract_images(elem):
    """Lista imágenes del contenido principal."""
    imgs = []
    for img in elem.find_all("img"):
        imgs.append({
            "src": img.get("src", ""),
            "alt": img.get("alt", ""),
        })
    return imgs


def process_herramienta(slug, html, section_id, slug_out):
    """Extrae section + style scoped + script IIFE."""
    soup = BeautifulSoup(html, "lxml")
    out = OUTPUT_DIR / "herramientas" / slug_out
    out.mkdir(parents=True, exist_ok=True)

    meta = extract_meta(soup)
    meta["slug_origen"] = slug
    meta["slug_destino"] = slug_out
    meta["section_id"] = section_id

    # Sección de la herramienta
    section = soup.find("section", id=section_id)
    if section is None:
        # Fallback: cualquier elemento con ese id
        section = soup.find(id=section_id)

    if section:
        (out / "section.html").write_text(str(section), encoding="utf-8")
        meta["section_extraida"] = True
        meta["section_size_chars"] = len(str(section))
    else:
        meta["section_extraida"] = False
        meta["error"] = f"No se encontró elemento con id={section_id}"

    # Buscar <style> que tenga el section_id en sus selectores
    styles_relevantes = []
    for style in soup.find_all("style"):
        css = style.string or ""
        if f"#{section_id}" in css:
            styles_relevantes.append(css)
    if styles_relevantes:
        (out / "style.css").write_text("\n\n".join(styles_relevantes), encoding="utf-8")
        meta["style_extraido"] = True
        meta["style_size_chars"] = sum(len(s) for s in styles_relevantes)
    else:
        meta["style_extraido"] = False

    # Buscar <script> que mencione el section_id o sus IDs internos
    scripts_relevantes = []
    if section:
        # Obtener todos los IDs internos del section
        internal_ids = set()
        for el in section.find_all(id=True):
            internal_ids.add(el.get("id"))
        internal_ids.add(section_id)

        for script in soup.find_all("script"):
            if script.get("src"):
                continue  # Externos los ignoramos
            code = script.string or ""
            if not code or len(code) < 100:
                continue
            # Match por: getElementById, querySelector('#id'), o '#id' como CSS selector
            # Para IDs cortos (<=3 chars), requiere getElementById o querySelector para evitar false positives
            matched = False
            for i in internal_ids:
                if len(i) <= 3:
                    if f"getElementById('{i}')" in code or f'getElementById("{i}")' in code:
                        matched = True
                        break
                    if f"(\"#{i}\")" in code or f"('#{i}')" in code:
                        matched = True
                        break
                else:
                    if f"'{i}'" in code or f'"{i}"' in code or f"#{i}" in code:
                        matched = True
                        break
            if matched:
                scripts_relevantes.append(code)

    if scripts_relevantes:
        (out / "script.js").write_text("\n\n".join(scripts_relevantes), encoding="utf-8")
        meta["script_extraido"] = True
        meta["script_size_chars"] = sum(len(s) for s in scripts_relevantes)
    else:
        meta["script_extraido"] = False

    (out / "meta.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")

    return meta


def process_curso(slug, html):
    """Extrae title, meta, contenido principal en markdown, CTAs, imágenes."""
    soup = BeautifulSoup(html, "lxml")
    out = OUTPUT_DIR / "cursos" / slug
    out.mkdir(parents=True, exist_ok=True)

    meta = extract_meta(soup)
    meta["slug"] = slug

    main = find_main_content(soup)
    main = remove_chrome(main)

    # H1 principal
    h1 = main.find("h1")
    meta["h1"] = h1.get_text(strip=True) if h1 else None

    # Markdown del cuerpo
    md = html_to_markdown(main)
    (out / "content.md").write_text(md, encoding="utf-8")
    meta["content_size_chars"] = len(md)

    # CTAs
    ctas = extract_ctas(main)
    (out / "ctas.json").write_text(json.dumps(ctas, indent=2, ensure_ascii=False), encoding="utf-8")
    meta["ctas_count"] = len(ctas)

    # Imágenes
    imgs = extract_images(main)
    (out / "imagenes.json").write_text(json.dumps(imgs, indent=2, ensure_ascii=False), encoding="utf-8")
    meta["imagenes_count"] = len(imgs)

    (out / "meta.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")

    return meta


def process_auxiliar(slug, html):
    """Similar a curso pero suma forms."""
    soup = BeautifulSoup(html, "lxml")
    out = OUTPUT_DIR / "auxiliares" / slug
    out.mkdir(parents=True, exist_ok=True)

    meta = extract_meta(soup)
    meta["slug"] = slug

    main = find_main_content(soup)
    main = remove_chrome(main)

    h1 = main.find("h1")
    meta["h1"] = h1.get_text(strip=True) if h1 else None

    md = html_to_markdown(main)
    (out / "content.md").write_text(md, encoding="utf-8")
    meta["content_size_chars"] = len(md)

    ctas = extract_ctas(main)
    (out / "ctas.json").write_text(json.dumps(ctas, indent=2, ensure_ascii=False), encoding="utf-8")
    meta["ctas_count"] = len(ctas)

    imgs = extract_images(main)
    (out / "imagenes.json").write_text(json.dumps(imgs, indent=2, ensure_ascii=False), encoding="utf-8")
    meta["imagenes_count"] = len(imgs)

    forms = extract_forms(main)
    (out / "forms.json").write_text(json.dumps(forms, indent=2, ensure_ascii=False), encoding="utf-8")
    meta["forms_count"] = len(forms)

    (out / "meta.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")

    return meta


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    resumen = {"herramientas": [], "cursos": [], "auxiliares": []}

    # Herramientas
    for slug_origen, info in HERRAMIENTAS.items():
        path = SOURCE_DIR / f"{slug_origen}.html"
        if not path.exists():
            print(f"⚠ No existe {path}")
            continue
        html = path.read_text(encoding="utf-8")
        m = process_herramienta(slug_origen, html, info["section_id"], info["slug_out"])
        resumen["herramientas"].append(m)
        print(f"✓ Herramienta: {info['slug_out']}")

    # Cursos
    for slug in CURSOS:
        path = SOURCE_DIR / f"{slug}.html"
        if not path.exists():
            print(f"⚠ No existe {path}")
            continue
        html = path.read_text(encoding="utf-8")
        m = process_curso(slug, html)
        resumen["cursos"].append(m)
        print(f"✓ Curso: {slug}")

    # Auxiliares
    for slug in AUXILIARES:
        path = SOURCE_DIR / f"{slug}.html"
        if not path.exists():
            print(f"⚠ No existe {path}")
            continue
        html = path.read_text(encoding="utf-8")
        m = process_auxiliar(slug, html)
        resumen["auxiliares"].append(m)
        print(f"✓ Auxiliar: {slug}")

    # Guardar resumen general
    (OUTPUT_DIR / "_resumen.json").write_text(
        json.dumps(resumen, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )
    print("\n✓ Resumen guardado en extracted/_resumen.json")


if __name__ == "__main__":
    main()
