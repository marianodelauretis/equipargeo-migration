# Plan migración — Generador de puntos intermedios

## Identificación

- **URL actual:** https://equipargeo.com/herramientas-de-topografia/
- **URL destino:** https://app.equipargeo.com/puntos-intermedios/
- **Categoría:** (a) JS vanilla custom inline.
- **Tamaño JS:** ~7.8 KB.
- **HTML:** ~4.3 KB (21 controles).
- **Decisión:** Migración trivial. Suma canvas + export DXF/CSV.

## Funcionalidad

Genera puntos equidistantes entre dos coordenadas (E1/N1 → E2/N2) con preset de intervalos o manual. Renderiza la línea + puntos en canvas con pan/zoom/reset. Exporta DXF R12 (polilínea + puntos + rótulos) y CSV.

## Pasos

Idénticos a herramienta 01-02, plus:
- **Importante:** descartar la carga de `chart.js@4.4.3` y `chartjs-plugin-zoom@2.0.1` (cargan ~200KB sin usar). La herramienta dibuja con `canvas.getContext('2d')` a mano, no necesita Chart.js.
- Validar export DXF abriendo en AutoCAD LT / DWG TrueView para asegurar que abre sin errores.
- Validar export CSV abriendo en Excel/Google Sheets (separador decimal correcto según locale).

## Criterios de aceptación

- [ ] Mismo comportamiento visual (canvas, pan/zoom) que el original.
- [ ] Export DXF abre en AutoCAD LT sin errores y muestra la polilínea + puntos + rótulos.
- [ ] Export CSV con separador correcto para España/Argentina (coma).
- [ ] **NO carga chart.js** (verificar Network tab).
