# Plan migración — Verificador ISO de Ángulos (fantasma → activar)

## Identificación

- **URL actual:** NO PUBLICADA. Código cargando en `wp-content` pero sin contenedor HTML en ninguna página.
- **URL destino:** https://app.equipargeo.com/verificador-angulos/
- **Categoría:** (a) JS vanilla custom inline.
- **Tamaño JS:** ~21 KB.
- **Decisión:** Activar y publicar. Decisión confirmada por Mariano.

## Funcionalidad detectada (del reporte de Chrome)

Verificador ISO de ángulos topográficos. Control angular con análisis estadístico (stddev), threshold configurable, grilla de observaciones, render global + per-target, import/export JSON, demo data.

Selectores: `#ang-verif-tool`.

Funciones detectadas: `parseDMS, parseAngleInput, buildObsModel, buildObsGrid, onCalculate, renderGlobal, renderPerTarget, exportJSON, importJSON, loadDemo, getThreshold, stddev`.

## Pasos

### 1. Extraer el código fuente

El código está cargando pero sin contenedor. **Antes de migrar hay que conseguir el HTML del contenedor**.

Opciones:
- **(a)** Mariano tiene el HTML guardado en algún lado (Notion, drive, archivo local). Buscar.
- **(b)** El HTML existe en alguna page de WP pero está oculta / draft. Buscar en WP-admin.
- **(c)** El HTML hay que diseñarlo desde cero (el JS sí está, solo falta el container).

Si es (c), inferir la estructura del HTML a partir de los IDs/selectores que el JS busca con `getElementById`. El reporte de Chrome lista las funciones — leerlas para detectar los IDs requeridos.

### 2. Una vez con HTML completo

Pasos idénticos a herramientas 01-04.

## Pregunta abierta para Mariano

**¿Tenés el HTML container guardado en algún lado, o hay que reconstruirlo?**

Si la respuesta es "hay que reconstruirlo", esta herramienta sube de complejidad. Resolver antes de empezar la migración.

## Criterios de aceptación

- [ ] Container HTML completo, funcional, alineado con el JS existente.
- [ ] Import/export JSON funciona.
- [ ] Demo data carga correctamente.
- [ ] Validación estadística con caso conocido.
