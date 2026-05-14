# Reporte técnico — Herramientas equipargeo.com

## Resumen ejecutivo

Las 4 herramientas operativas son **JavaScript puro inline embebido en el HTML de cada página WordPress** (categoría **a**). Ningún iframe, ningún plugin de WordPress renderizándolas, ninguna dependencia de librerías externas (no proj4, no PapaParse, no FileSaver, no Chart.js, no JSZip). Cada herramienta es un bloque `<section>` autocontenido + un IIFE `(function(){…})()` que la cablea por IDs específicos. El código de las 4 herramientas se inyecta **en todas las páginas de herramientas a la vez** — en cada page sólo "se activa" la que encuentra su contenedor DOM; las otras quedan inertes (sus `getElementById` devuelven `null` y los handlers nunca se atan).

El sitio usa el theme **`flixita`** (padre) + **`britely`** (child theme). No detecté ningún plugin de WordPress front-end cargando recursos desde `/wp-content/plugins/` en ninguna de las 5 páginas auditadas. El único tracking visible es Google Tag (`GT-NNQ4JFFT`) y la huella de Site Kit. WordPress 6.9.4.

**Decisión preliminar:** migración **trivial** para las 4 herramientas. Son apps estáticas drop-in: copiar el bloque `<section>` + el `<script>` correspondiente a un `index.html` por herramienta y publicar en Cloudflare Pages. No hay nada que dependa del backend WP (no AJAX al admin-ajax, no shortcodes ejecutándose en servidor, no nonces). El theme aporta sólo estilos genéricos (Bootstrap, Owl, Font Awesome, wow.js) que las herramientas no usan dentro de su scope.

---

## Herramienta 1 — Conversor CSV/TXT → DXF R12

**URL:** https://equipargeo.com/conversor-a-dxf/
**Title:** `Conversor a DXF – Equipargeo`
**Categoría:** (a) JS custom inline en la página
**Decisión preliminar de migración:** Trivial

### Metadata
- `<title>`: Conversor a DXF – Equipargeo
- `<meta name="description">`: (vacía)
- `<link rel="canonical">`: https://equipargeo.com/conversor-a-dxf/
- `<meta name="generator">`: WordPress 6.9.4
- Schema JSON-LD: ninguno
- Open Graph: ninguno
- Body classes: `wp-singular page-template-default page page-id-261 wp-theme-flixita wp-child-theme-britely`
- No hay clases de plugin (nada `wpcf7-`, `elementor-`, `vc_`, `et_pb_`).

### HTML de la herramienta
Contenedor raíz: `<section id="eg-csv2dxf" class="egc2dxf-wrap" aria-label="CSV/TXT a DXF">` (~5.4 KB).

Estructura resumida (todos los selectores `egc2dxf-*` son custom, no plugin):

```
section#eg-csv2dxf.egc2dxf-wrap
└── div.egc2dxf-card
    ├── h1.egc2dxf-title  →  "CSV/TXT → DXF (R12)"
    ├── p.egc2dxf-sub
    └── div.egc2dxf-grid
        ├── input#egc2dxf-file        (type=file, accept .csv/.txt)
        ├── span#egc2dxf-infoRows     (pill: contador de filas)
        ├── select#egc2dxf-colName    (mapeo columna nombre)
        ├── select#egc2dxf-colX       (mapeo columna X/Este)
        ├── select#egc2dxf-colY       (mapeo columna Y/Norte)
        ├── select#egc2dxf-colZ       (mapeo columna Z/Cota)
        ├── select#egc2dxf-colCode    (mapeo columna código)
        ├── select#egc2dxf-decSep     (separador decimal)
        ├── input#egc2dxf-hasHeader   (checkbox)
        ├── input#egc2dxf-addTextName (checkbox)
        ├── input#egc2dxf-addTextCode (checkbox)
        ├── input#egc2dxf-textH       (altura de texto)
        ├── button#egc2dxf-previewBtn
        ├── button#egc2dxf-exportBtn.egc2dxf-primary
        ├── button#egc2dxf-measureBtn
        ├── button#egc2dxf-resetMeasureBtn
        ├── button#egc2dxf-reframeBtn
        ├── span#egc2dxf-status
        ├── select#egc2dxf-rowsLimit
        ├── canvas#egc2dxf-plot       (300×150, preview gráfico)
        └── table#egc2dxf-tblPreview.egc2dxf-table
```

### JavaScript

**Inline** (1 bloque, ~18.4 KB, IIFE auto-contenida):
Funciones extraídas vía introspección AST/regex (no copio el código por la regla de copyright + por estar > 500 líneas):

```
els, readFileSmart, detectDelimiter, toNumber, parseCSV,
fillSelect, autoMap, getMap, computeBounds, fitView,
setupCanvas, nearestPoint, toPoints, fillTable, draw,
stripAccents, sanitizeText, sanitizeCode, hashStr,
makeLayerName, colorFromCode, headerWithLayers, dxfFooter,
entPOINT, entTEXT, exportDXF, renderAll, init
```

Eventos atados: `mousedown, mouseup, mousemove, wheel, dblclick, click×6, resize, change×4, DOMContentLoaded`.
No usa jQuery dentro del scope del tool (el `$` detectado es ruido del global de WP).
No usa `fetch`, no usa `XMLHttpRequest`, no llama a `$.ajax`. Todo el trabajo es client-side.

**Externos:** ninguno específico de esta herramienta. Lo que carga la página viene del theme:
- `wp-includes/js/jquery/jquery.min.js?ver=3.7.1`
- `wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1`
- `wp-content/themes/flixita/assets/js/wow.min.js`
- `wp-content/themes/flixita/assets/js/bootstrap.min.js`
- `wp-content/themes/flixita/assets/js/owl.carousel.min.js`
- `wp-content/themes/flixita/assets/js/custom.js`
- `wp-includes/js/wp-emoji-release.min.js`
- `googletagmanager.com/gtag/js?id=GT-NNQ4JFFT`

Bibliotecas detectadas en el código del tool: **ninguna**. El DXF lo genera la propia función `headerWithLayers`/`entPOINT`/`entTEXT`/`exportDXF` armando el texto AC1009 a mano. La descarga se hace con `Blob` + `URL.createObjectURL` (no usa FileSaver).

### CSS
- `<style>` inline scoped al tool (clases `egc2dxf-*`, ~1.7 KB embebido en la página).
- No carga stylesheets externos específicos. Los CSS de la página son del theme (`flixita/assets/css/main.css`, `bootstrap.min.css`, `owl.carousel.min.css`, `font-awesome.min.css`, `animate.min.css`, `responsive.css`, `britely/style.css`).

### Origen
**(a) JS custom inline en la página.** El selector namespace `egc2dxf-*` es propio (no es ningún plugin conocido). No hay clases `wpcf7-`, `elementor-`, `vc_`, `et_pb_`, `wpbf-`. El script está pegado directamente en el HTML del post de WP — muy probablemente vía el editor de WordPress en modo "HTML personalizado" o un snippet manager. No es un plugin que renderice nada.

### Interacciones de red
**Ninguna durante la operación del tool.** No hay `fetch`, no hay form submit a un endpoint, no carga JSON externo. El archivo CSV/TXT lo lee via `FileReader` desde el `<input type="file">` del usuario. La salida DXF se genera in-memory y se descarga con `Blob`.

### Anomalías
En la misma página se inyectan también los scripts de las otras 3 herramientas (POSGAR07, faja-local) + dos tools "fantasma" (ang-verif-tool y un TIN/contornos con namespace `egs-*` que tiene `delaunay`, `marchingSquares`, `convexHull`, `gridIDW`, `smoothChaikin`, `breaklinesByCode`). Ninguno de esos contenedores existe en el DOM de esta página, así que no se activan, pero el bytecode viaja inútilmente al cliente. (Sumando, ~88 KB de JS de herramientas se carga en cada página de tools — algo a limpiar en la migración).

---

## Herramienta 2 — Generador de puntos intermedios

**URL:** https://equipargeo.com/herramientas-de-topografia/
**Title:** `Generador de puntos intermedios – Equipargeo`
**Categoría:** (a) JS custom inline en la página
**Decisión preliminar de migración:** Trivial

### Metadata
- `<title>`: Generador de puntos intermedios – Equipargeo
- `<meta name="description">`: (vacía)
- `<link rel="canonical">`: https://equipargeo.com/herramientas-de-topografia/
- WordPress 6.9.4 | page-id-127
- Sin schema, sin OG, sin clases de plugin.

### HTML de la herramienta
Contenedor: `<section id="herramienta-puntos">` (~4.3 KB).

Inputs / controles detectados (21 total):

```
#e1, #n1               (coords P1: Este, Norte)   type=number
#e2, #n2               (coords P2: Este, Norte)   type=number
#intervalo             (preset: 0.2, 0.25, 0.5, 1, 2, 5, 10)
#intervaloManual       (override manual)
#decimales             (default 3)
#incluirExtremos       (sí/no)
button#btnGenerar      "Generar puntos"
button#btnLimpiar      "Limpiar"
button#btnFit          "Ajustar a línea"
button#btnZoomIn       "Zoom +"
button#btnZoomOut      "Zoom −"
button#btnReset        "Reset"
button#panUp/panLeft/panRight/panDown
button#btnDXF          "Descargar DXF (R12)"
button#btnCSV          "Descargar CSV"
button#btnCopiar       "Copiar tabla"
canvas#canvasXY        (300×380, preview de la línea + puntos)
div#panelResumen.eg-summary
div#tablaWrap.eg-table-wrap  (contiene tabla de salida)
section#eg-supuestos   (texto auxiliar)
```

### JavaScript
**Inline** (~7.8 KB), un solo IIFE. Maneja: generación de puntos equidistantes, renderizado en canvas con pan/zoom, export DXF R12 y CSV, copy-to-clipboard. Flags detectadas: `canvas: true, dxf_writer: true (R12/AcDb), savefile: true, poligonal: true, puntosInter: true`.

**Externos cargados en la página (no específicos del tool):** además de los del theme, esta página agrega:
- `https://cdn.jsdelivr.net/npm/chart.js@4.4.3`
- `https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.0.1/dist/chartjs-plugin-zoom.umd.min.js`

Aclaración: chart.js NO se usa en el código del Generador de puntos (que dibuja con `canvas.getContext('2d')` a mano). Está cargado a nivel página probablemente para otro bloque o lo dejaron de cuando había una versión con gráficos — en la migración se puede quitar.

### CSS
- `<style>` inline con scope `#herramienta-puntos` y `#canvasXY` (~29 KB de CSS scoped en la página, junto con otros bloques).
- Sin stylesheets externos propios.

### Origen
**(a) JS custom inline.** Namespace de clases `eg-*` y `eg-card-*`. Sin huella de plugin.

### Interacciones de red
**Ninguna.** Todo es client-side: cálculo geométrico in-place, dibujado al canvas, generación DXF/CSV en memoria, descarga via Blob.

### Anomalías
- Carga **chart.js + chartjs-plugin-zoom** que la herramienta no consume → ~200 KB de JS desperdiciados.
- Misma situación que tool 1: se inyectan los scripts de las otras herramientas; en esta página se activa el de puntos-intermedios + dead-code de las demás.

---

## Herramienta 3 — Conversor de coordenadas POSGAR07 (Lat/Long ↔ Gauss-Krüger)

**URL:** https://equipargeo.com/conversor-de-coordenadas-lat-long-gk/
**Title:** `Conversor de coordenadas – Equipargeo`
**Categoría:** (a) JS custom inline en la página
**Decisión preliminar de migración:** Trivial

### Metadata
- `<title>`: Conversor de coordenadas – Equipargeo
- `<meta name="description">`: (vacía)
- `<link rel="canonical">`: https://equipargeo.com/conversor-de-coordenadas-lat-long-gk/
- WordPress 6.9.4 | page-id-165
- Sin schema, sin OG, sin clases de plugin.

### HTML de la herramienta
Contenedor: `<section id="gk-posgar07-tool">` (~7 KB, 22 inputs).
Contiene además `div#out_info.info` para output formateado.
Hay botones `.copy-btn[data-target=...]` (copy-to-clipboard por resultado).

### JavaScript
**Inline** (~7.3 KB), un solo IIFE con comentario header explícito:
`// ===== Geográficas (DMS) → Gauss-Krüger (POSGAR07 / GRS80, k0=1) =====`

Funciones extraídas:
```
normNum, dmsToDec, fajaFromLon, lon0FromFaja, lam0FromParams,
meridionalArc, LLtoGK, leerDMS, aplicarFormatos,
copyToClipboard, feedback
```

Implementación matemática propia (elipsoide GRS80, arco meridional, Gauss-Krüger directo) — **NO** usa proj4js ni ninguna librería de proyección. Selectores tipo `#gk-posgar07-tool .result-primary`, `.copy-btn[data-target=...]`.

**Externos cargados en la página:** sólo los del theme + GT. Ninguna librería de geodesia externa.

### CSS
Inline scoped a `#gk-posgar07-tool`. Sin stylesheets externos propios.

### Origen
**(a) JS custom inline.** Namespace ID `gk-posgar07-tool` y `.result-primary` / `.copy-btn`. Sin huella de plugin.

### Interacciones de red
**Ninguna.** Conversión 100% matemática client-side. El copy-to-clipboard usa `navigator.clipboard.writeText`.

### Anomalías
Igual que las otras: tools fantasma viajando junto al código útil.

---

## Herramienta 4 — Consulta de faja (GNSS)

**URL:** https://equipargeo.com/herramientas-gnss/
**Title:** `Consulta de faja – Equipargeo`
**Categoría:** (a) JS custom inline en la página
**Decisión preliminar de migración:** Trivial

### Metadata
- `<title>`: Consulta de faja – Equipargeo
- `<meta name="description">`: (vacía)
- `<link rel="canonical">`: https://equipargeo.com/herramientas-gnss/
- WordPress 6.9.4 | page-id-127
- Sin schema, sin OG, sin clases de plugin.

### HTML de la herramienta
Contenedor: `<section id="faja-local-tool">` (~1.5 KB, 4 botones/inputs):

```
section#faja-local-tool
└── div.wrap
    ├── h2  →  "¿Conviene usar una faja local?"
    ├── p.sub  (explica ±1° del meridiano central, fajas 1–7)
    ├── div.actions
    │   ├── button#btnUbicacion.primary  "Obtener mi ubicación"
    │   ├── button#btnAnalizar           "Analizar"
    │   └── button#btnUsarManual         (cargar lat/lon manualmente)
    ├── div#faja_coordenadas.out
    ├── div#faja_detalle.hint
    ├── div#faja_error.error
    ├── div#faja_resultado.out
    └── div#faja_sugerencia.hint
```

### JavaScript
**Inline** (~3.3 KB), un solo IIFE. Funciones:
```
toDMS, toDMSabs, reset, obtenerUbicacion, usarManual, analizar
```
Eventos: `DOMContentLoaded` + 3× `click`.
**Usa `navigator.geolocation.getCurrentPosition`** (browser API, requiere HTTPS + permiso del usuario — esto Cloudflare Pages lo soporta sin fricción).

**Externos cargados en la página:** sólo theme + GT. Ninguna lib externa.

### CSS
Inline scoped a `#faja-local-tool`. Sin stylesheets propios.

### Origen
**(a) JS custom inline.** ID namespace `faja-local-tool` + botones `btnUbicacion/btnAnalizar/btnUsarManual`. Sin huella de plugin.

### Interacciones de red
**Ninguna red externa.** La única "interacción" es la Geolocation API del browser (permission prompt nativo). No hay reverse-geocoding, no llama a Google Maps, no llama a ningún tile server.

---

## Configuración global del sitio

### Theme
- **Theme parent:** `flixita` (`wp-content/themes/flixita/`)
- **Child theme:** `britely` (`wp-content/themes/britely/style.css`)
- Body classes confirman: `wp-theme-flixita wp-child-theme-britely`
- Recursos del theme cargados en todas las páginas:
  - CSS: `bootstrap.min.css`, `owl.carousel.min.css`, `font-awesome.min.css` (v4.6.3), `animate.min.css`, `main.css`, `responsive.css`, `britely/style.css`
  - JS: `wow.min.js`, `bootstrap.min.js`, `owl.carousel.min.js`, `custom.js`
  - Fuentes: Source Sans Pro (auto-hosted en `wp-content/fonts/source-sans-pro/`)

### Plugins detectados
**Ninguno carga assets front-end.** No detecté un solo recurso (JS o CSS) servido desde `/wp-content/plugins/*` en la home ni en las 4 páginas de herramientas. Esto significa que cualquier plugin instalado (incluido Site Kit) es exclusivamente backend / no inyecta scripts visibles, o está desactivado en front.

Indicadores positivos en HTML:
- **Site Kit by Google**: marcador `googlesitekit` presente en el HTML (confirma sospecha del usuario).
- No detecté: Yoast, Rank Math, Elementor, WP Rocket, WPBakery, CookieYes, Cookiebot, WPCF7.

### Tracking IDs
- **Google Tag (gtag.js):** `GT-NNQ4JFFT` (formato `GT-` — el más nuevo, contenedor unificado de Google Tag)
- **GA4 (G-XXXX):** no detecté un G-id explícito en el HTML; el GT- es el contenedor server-side que abstrae GA4.
- **GTM-XXXX:** no presente.
- **Facebook Pixel:** no presente.
- **Google Ads (AW-):** no presente.

### WordPress version
- `<meta name="generator" content="WordPress 6.9.4">` (versión visible en todas las páginas).

### Performance subjetivo (home /home/)
Medido con `performance.getEntriesByType('resource')` y navigation timing:

- **TTFB:** 204 ms
- **DOMContentLoaded:** 287 ms
- **Load event:** 514 ms
- **Total de requests:** 37
- **Transferido (suma de transferSize en recursos):** ~94 KB
- **Requests > 2 s:** ninguna

Subjetivamente el sitio carga rápido y liviano. No vi señales de lentitud en ningún tab.

### Recursos de CDN externos detectados
- `googletagmanager.com` (gtag)
- `googleads.g.doubleclick.net` (downstream del GT)
- `google.com.ar` (downstream del GT)
- Sólo en la página de Topografía: `cdn.jsdelivr.net` (chart.js + chartjs-plugin-zoom — cargados pero no usados por la herramienta visible).

### Fuentes web
- Source Sans Pro **auto-hosted** desde `equipargeo.com/wp-content/fonts/source-sans-pro/` (no llama a Google Fonts).
- Font Awesome 4.6.3 auto-hosted vía theme.
- Hoja consolidada extra: `wp-content/fonts/3e8b9d9d962080d5710cfee765ac3df0.css`.

### Service Workers
- Ninguno activo (`navigator.serviceWorker.controller === null`).

---

## Anomalías detectadas

1. **Cross-page bleed de scripts.** En todas las páginas de herramientas se inyectan los IIFE de las 4 tools + 2 tools adicionales (ver punto 2), aunque sólo una se active. Resultado: ~88 KB de JS de herramientas viaja en cada page load aunque sólo una corra. Probablemente Mariano pegó los snippets en un widget global o en `header.php`/`footer.php` del child theme. No es bloqueante para migrar, pero conviene aislar uno-por-página en el destino estático.

2. **Dos herramientas "fantasma" en el código.** Aparecen embedded pero no tienen contenedor en ninguna de las 4 páginas auditadas:
   - **`#ang-verif-tool`** (Verificador ISO de Ángulos, scope `#ang-verif-tool`, ~21 KB). Funciones: `parseDMS, parseAngleInput, buildObsModel, buildObsGrid, onCalculate, renderGlobal, renderPerTarget, exportJSON, importJSON, loadDemo, getThreshold, stddev`. Es una herramienta de control angular topográfico completa.
   - **TIN/contornos `egs-*`** (~18 KB). Funciones: `delaunay, circum, addEdge, convexHull, pointInPoly, gridIDW, marchingSquares, stitchSegments, smoothChaikin, headerR12, footerR12, ent3DFACE, entPLINE3D, exportDXF, parseCodes, breaklinesByCode`. Es un **generador de TIN + curvas de nivel** con triangulación de Delaunay y marching squares.

   **Esto es relevante para la migración**: hay dos tools más, ya implementadas en código, que NO están publicadas en ninguna página (¿WIP? ¿están en otra URL que no me pasaste?). Vale la pena confirmar si querés migrarlas también.

3. **chart.js + chartjs-plugin-zoom** se cargan en la página de Topografía pero la herramienta del Generador no los usa. Probablemente quedaron de una versión anterior — descartar en la migración.

4. **Filtro de contenido bloqueó parte del raw HTML/JS** durante mi inspección (algunos `textContent` me los devolvía como `[BLOCKED: Cookie/query string data]`). Esto no afectó el resultado del audit porque pude extraer la estructura completa vía introspección de funciones, IDs y selectores; pero por eso no copio el código JS literal de ninguna tool (también la regla de no copiar > 500 líneas y la de copyright). Cuando arranquemos la migración, conviene bajarse los archivos HTML crudos vía `curl` o desde el editor de WP.

5. **Ningún tool usa el backend de WP.** Cero llamadas a `admin-ajax.php`, cero nonces, cero shortcodes server-rendered. Todo se compila a HTML estático trivialmente.

6. **Ninguna autenticación, ninguna ofuscación, ningún DRM/anti-bot.** Todo el código está en claro y legible.

---

## Conclusión y siguiente paso

**Las 4 herramientas son migración trivial.** Son 4 bloques HTML + 4 IIFE inline, sin dependencias externas, sin backend, sin librerías. Cada una se convierte en un `index.html` autocontenido bajo `app.equipargeo.com/<slug>/` en Cloudflare Pages copiando: (i) el `<section>` correspondiente, (ii) su `<script>` IIFE, (iii) los `<style>` inline scoped, y (iv) opcionalmente el GT- tag si querés mantener analytics.

**Orden sugerido para arrancar** (de más simple a más rica):

1. Consulta de faja (tool 4) — 3.3 KB JS, 4 botones, 5 minutos de migración.
2. Conversor POSGAR07 (tool 3) — 7.3 KB JS, sin canvas.
3. Generador de puntos intermedios (tool 2) — 7.8 KB JS, canvas + DXF/CSV export.
4. Conversor CSV/TXT → DXF (tool 1) — 18.4 KB JS, FileReader + canvas + DXF generation.

**Pregunta abierta antes de migrar:** las dos herramientas fantasma (`#ang-verif-tool` y la TIN/contornos `egs-*`) — ¿están publicadas en alguna URL que no me pasaste, o son WIP? Si están vivas en algún lado o querés activarlas, súmalas al plan; el código ya está escrito.