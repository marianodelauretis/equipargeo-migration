# Plan migración — Conversor CSV/TXT → DXF R12

## Identificación

- **URL actual:** https://equipargeo.com/conversor-a-dxf/
- **URL destino:** https://app.equipargeo.com/conversor-dxf/
- **Categoría:** (a) JS vanilla custom inline.
- **Tamaño JS:** ~18.4 KB.
- **HTML:** ~5.4 KB.
- **Decisión:** Migración trivial. La más grande de las 4 publicadas, pero misma categoría.

## Funcionalidad

Convierte CSV/TXT con autodetección de delimitador y separador decimal a DXF R12 con todas las capas separadas (puntos, texto nombre, texto código). Permite mapear/ordenar columnas. Preview gráfico con canvas (zoom/pan/mediciones). Tabla preview con filtrado de filas inválidas.

## Componentes detectados

- Contenedor: `<section id="eg-csv2dxf" class="egc2dxf-wrap">`.
- 20+ controles con prefijo `egc2dxf-*`.
- JS: IIFE grande con `els, readFileSmart, detectDelimiter, toNumber, parseCSV, fillSelect, autoMap, getMap, computeBounds, fitView, setupCanvas, nearestPoint, toPoints, fillTable, draw, stripAccents, sanitizeText, sanitizeCode, hashStr, makeLayerName, colorFromCode, headerWithLayers, dxfFooter, entPOINT, entTEXT, exportDXF, renderAll, init`.
- DXF generado a mano (AC1009, no usa librería).
- Descarga via `Blob` + `URL.createObjectURL` (no usa FileSaver).
- Eventos: mouse interactions sobre canvas, file input, change handlers en selects.

## Pasos

Idénticos a herramientas anteriores. Plus:
- **Caso de prueba crítico:** preparar un CSV de prueba con 10 puntos, formato "Nombre, X, Y, Z, Código" (P1, 6500000.123, 5500000.456, 25.789, EST). Procesarlo y comparar el DXF resultante con el original (deben ser idénticos byte-a-byte, o casi).
- **Edge cases:** archivos con BOM UTF-8, separadores mixtos (tab + coma), filas con valores faltantes, separador decimal coma vs punto.

## Criterios de aceptación

- [ ] CSV de prueba de 10 puntos genera DXF idéntico al original.
- [ ] CSV con 1000+ puntos no congela el navegador.
- [ ] Canvas preview rinde con zoom/pan suaves.
- [ ] Layers separadas correctamente en el DXF (verificar en AutoCAD LT).
