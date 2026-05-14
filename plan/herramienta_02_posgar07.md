# Plan migración — Conversor coordenadas POSGAR07

## Identificación

- **URL actual:** https://equipargeo.com/conversor-de-coordenadas-lat-long-gk/
- **URL destino:** https://app.equipargeo.com/posgar07/
- **Categoría:** (a) JS vanilla custom inline.
- **Tamaño JS:** ~7.3 KB.
- **Tamaño HTML:** ~7 KB (22 inputs).
- **Decisión:** Migración trivial. Segunda en el orden por complejidad ascendente.

## Funcionalidad

Convierte coordenadas Geográficas DMS (Lat/Lon) a Gauss-Krüger (POSGAR07 / GRS80, k₀=1) con detección automática de faja. Implementación matemática propia (arco meridional, transformación directa) — NO usa proj4js.

## Componentes detectados

- Contenedor: `<section id="gk-posgar07-tool">` con 22 inputs.
- Output: `<div id="out_info" class="info">` formateado.
- Botones copy-to-clipboard: `.copy-btn[data-target=...]`.
- JS: IIFE con `normNum, dmsToDec, fajaFromLon, lon0FromFaja, lam0FromParams, meridionalArc, LLtoGK, leerDMS, aplicarFormatos, copyToClipboard, feedback`.

## Pasos

Idénticos a herramienta 01, ajustando paths y selectores:
1. Bajar HTML de `equipargeo.com/conversor-de-coordenadas-lat-long-gk/`.
2. Extraer `<section id="gk-posgar07-tool">`, su CSS scoped, su `<script>`.
3. Armar `repos-target/equipargeo-tools/posgar07/index.html` usando el mismo shell que faja, ajustando title/meta/canonical.
4. Verificar local (validar con una coordenada conocida: BA = -34.6037, -58.3816 → debería dar faja 5 con números específicos).
5. Commit.

## Criterios de aceptación

Mismos que herramienta 01, más:
- [ ] Validación matemática con caso conocido: lat -34.6037, lon -58.3816 → faja 5, X≈6173000, Y≈5527000 (validar con valor exacto del original).
- [ ] Copy-to-clipboard funciona en navegador (`navigator.clipboard.writeText`).
