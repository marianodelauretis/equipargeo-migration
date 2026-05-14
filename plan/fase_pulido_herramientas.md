# Plan — Fase 8: Pulido de herramientas (futuro, no urgente)

## Cuándo

**Después** de tener las 6 herramientas migradas y funcionando en `app.equipargeo.com`. **No antes.**

## Objetivo

Optimizar y mejorar las herramientas individualmente, sin la presión de "que sigan funcionando como antes". Iteraciones independientes por herramienta.

## Mejoras candidatas (no exhaustivas)

### Comunes a todas

- **Migrar de IIFE a módulos ES6** — más mantenible, mejor tree-shaking.
- **TypeScript** — type safety en cálculos matemáticos críticos (POSGAR07, DXF gen).
- **Tests unitarios** — Vitest + casos conocidos (BA → faja 5, etc.).
- **Loading states / progress bars** — para procesamiento de CSVs grandes.
- **Drag & drop de archivos** — UX más moderna.
- **Toast notifications** — feedback visual en lugar de `alert()`.
- **Modo oscuro** — toggle con `prefers-color-scheme`.
- **i18n** — soporte para inglés / portugués (mercado regional).

### Específicas

#### Conversor CSV→DXF
- Soporte para más formatos de output (DWG, KML, GeoJSON, Shapefile).
- Detección automática de sistema de coordenadas.
- Preview 3D del terreno si hay Z.

#### POSGAR07
- Soporte para WGS84 ↔ POSGAR07 7-parámetros.
- Conversión inversa (GK → Lat/Lon).
- Soporte para POSGAR94 / Campo Inchauspe.
- Multi-coord batch (procesar CSV de coordenadas).

#### Puntos intermedios
- Curvas (no solo líneas rectas) — arcos, espirales.
- Replanteo desde un punto fijo (origen + acimut + distancia).
- Export a formato Trimble / Leica para carga directa en controladora.

#### Faja
- Mapa visual de las 7 fajas POSGAR07.
- Cálculo de distorsión esperada según distancia al meridiano central.
- Recomendación de factor de escala local.

#### Verificador ISO Ángulos
- Soporte para diferentes normas (ISO 17123-3, DIN 18723).
- Visualización gráfica de residuos por target.
- Reporte PDF imprimible.

#### TIN / Curvas de nivel
- Soporte para volúmenes (corte/relleno entre TINs).
- Análisis de pendientes / aspecto / hillshade.
- Export a formatos GIS (GeoTIFF, MBTiles).

## Refactor base

- Eliminar dependencia del theme flixita (ya está hecho en la migración).
- Eliminar cross-page bleed (ya está hecho).
- CSS shared limpio (`shared/base.css`).
- Iconos consistentes (Heroicons / Lucide vs Font Awesome 4.6.3 actual).
- Tipografía consistente (Source Sans Pro mantener, agregar Inter o JetBrains Mono para data).

## Modelo PWA full

- Cada herramienta como PWA instalable.
- Service worker para offline (las herramientas no necesitan red).
- Iconos adaptados.
- Splash screen.

## Estimación

Una herramienta pulida por mes = 6 meses para tener todas optimizadas. Pero **es trabajo de incrementos**, no de releases monolíticos. Cada mejora se commitea y deploya independiente.

## Cuándo iniciar

Cuando: (1) las 6 estén migradas y estables, (2) el sitio principal esté lanzado, (3) Mariano tenga ganas. No antes.
