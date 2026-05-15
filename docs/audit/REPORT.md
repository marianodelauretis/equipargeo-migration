# Auditoria pre-cutover — 2026-05-15

## Resumen ejecutivo
- Archivos modificados: 23
- Fixes triviales aplicados: 41 (detalle abajo)
- Blockers para cutover: 2
- Mayores para revision: 3
- Menores para post-cutover: 2

## Fixes aplicados automaticamente

### [OG image] og-default.jpg
- Generado desde `banner wsp.png` (OneDrive): redimensionado de 1200x600 a 1200x630, JPEG quality 85, 140 KB.
- Guardado en `repos-target/equipargeo-site/public/images/og-default.jpg`.
- Eliminado `.gitkeep` del directorio images.

### [Fase 2.1] Email canonico
- 0 reemplazos necesarios. El repo ya usa `equipargeo@gmail.com` en todos los archivos.

### [Fase 2.2] WhatsApp canonico
- 0 reemplazos necesarios. Todos los links ya usan `https://wa.me/5491155722266` con formato correcto.

### [Fase 2.3] "Profesionales del territorio" — 18 reemplazos en 10 archivos

| Archivo | Contexto | Reemplazo |
|---|---|---|
| `src/pages/index.astro` | title | "EQUIPAR — Cursos practicos en GNSS, topografia y fotogrametria" |
| `src/pages/index.astro` | Hero titulo | "Cursos practicos en GNSS, topografia y fotogrametria" |
| `src/pages/index.astro` | Seccion "Sobre EQUIPAR" | "agrimensores, topografos e ingenieros" |
| `src/pages/cursos/index.astro` | Hero titulo | "Cursos practicos en GNSS, topografia y fotogrametria" |
| `src/pages/noticias/index.astro` | meta description | "agrimensores, topografos e ingenieros" |
| `src/pages/noticias/index.astro` | Hero titulo | "agrimensores, topografos e ingenieros" |
| `src/pages/sobre.astro` | meta description | "agrimensores, topografos e ingenieros" |
| `src/pages/sobre.astro` | Hero subtitulo | "agrimensores, topografos e ingenieros" |
| `src/pages/sobre.astro` | parrafo nuestra historia | "agrimensores, topografos e ingenieros" |
| `src/components/Footer.astro` | descripcion | "Cursos practicos y herramientas en GNSS, topografia," |
| `src/components/Footer.astro` | copyright | "Capacitacion en GNSS, topografia y fotogrametria" |
| `src/components/Newsletter.astro` | texto activo | "agrimensores, topografos e ingenieros" |
| `src/content/cursos/gnss.md` | frontmatter descripcion | "agrimensores, topografos e ingenieros" |
| `src/content/noticias/trimble-*.md` | parrafo intro | "agrimensores y topografos" |
| `equipargeo-tools/index.html` | title | "agrimensores, topografos e ingenieros" |
| `equipargeo-tools/index.html` | meta description | "agrimensores y topografos" |
| `equipargeo-tools/index.html` | og:title | "agrimensores, topografos e ingenieros" |
| `equipargeo-tools/index.html` | H1 | "agrimensores, topografos e ingenieros" |
| `equipargeo-tools/shared/manifest.json` | description | "agrimensores y topografos" |

### [Fase 2.3] "Equipargeo" como marca
- 0 reemplazos necesarios. El repo ya usa "EQUIPAR" en todos los archivos servidos.

### [Fase 2.5] .gitignore raiz
- Agregado: `node_modules/`, `dist/`, `.astro/`, `.env`, `.env.local`, `.env.*.local`, `.DS_Store`, `Thumbs.db`.

### [Fase 3] Datos de cursos — 9 de 12 cursos completados

Los **9 modulos** tienen precios extraidos del WordPress e insertados en frontmatter:
- GNSS Mod 1-3: ARS $375.000 / USD 250 (comunidad: ARS $93.750 / USD 62)
- Topografia Mod 1-3: ARS $375.000 / USD 250 (comunidad: ARS $93.750 / USD 62)
- Fotogrametria Mod 1-3: ARS $750.000 / USD 500 (comunidad: ARS $187.500 / USD 125)

Los **3 programas completos** tienen precios calculados como suma de los 3 modulos:
- GNSS y Topografia: ARS $1.125.000 / USD 750 (comunidad: ARS $281.250 / USD 186)
- Fotogrametria: ARS $2.250.000 / USD 1.500 (comunidad: ARS $562.500 / USD 375)

CursoLayout incluye nota explicativa "Total cursando los 3 modulos" para programas completos.

Cambios realizados:
- Schema `config.ts` extendido con campos `formato`, `fechas`, `precios` (objeto estructurado con ars/usd).
- Frontmatter de 9 modulos actualizado con `duracion`, `formato`, `fechas`, `precios`.
- Secciones placeholder "## Inversion / Consultá precios..." eliminadas del body de 9 modulos.
- `CursoLayout.astro` actualizado: sidebar muestra precios estructurados (ARS + USD), formato, fechas.

Datos raw guardados en `docs/audit/DATOS-CURSOS.json`.

### [Fase 4.1] _redirects — 23 reglas agregadas

Se verifico el archivo existente (91 lineas) y se agregaron redirects faltantes:
- 6 paginas auxiliares: `/capacitaciones`, `/asesoria-tecnica`, `/consultoria-y-equipamiento`, `/agenda-tu-curso`, `/experiencias`, `/home`
- 6 herramientas con slugs WP exactos: `/conversor-de-coordenadas-lat-long-gk`, `/herramientas-gnss`, `/herramientas-de-topografia`, `/topografia/`, `/gnss/`, `/drones/`
- Con variantes con/sin trailing slash.

### [Fase 5.4] Breadcrumbs — query string eliminado

- `CursoLayout.astro`: breadcrumb `/cursos/?programa=gnss` → `/cursos/gnss/`
- `index.astro`: 3 ProgramaCard links `/cursos/?programa=X` → `/cursos/X/`

### [Fase 5.1] Build
- Exitoso: 20 paginas (post cierre de blockers), 0 errores.
- Sitemap generado por @astrojs/sitemap (`sitemap-index.xml`).
- Sitemap verificado: 0 URLs de noticias individuales (despublicadas). `/noticias/` presente como index.

---

## BLOCKERS (impiden cutover) — RESUELTOS

### 1. ~~Precios de programas completos~~ RESUELTO
Precios calculados como suma de 3 modulos e insertados en frontmatter de gnss.md, topografia.md, fotogrametria.md.
CursoLayout muestra nota "Total cursando los 3 modulos" para programas completos.

### 2. ~~Marcadores COMPLETAR en noticias~~ RESUELTO
Las 3 noticias despublicadas (`publicada: false`). No se generan en el build ni aparecen en el sitemap.
Seccion `/noticias/` muestra placeholder "Notas tecnicas — seccion en preparacion" con CTA a WhatsApp.
Las notas quedan en el repo para completar editorialmente post-cutover.
- `contacto.astro`: 1 COMPLETAR residual es un comentario HTML interno (no visible al usuario), no es blocker.

---

## MAYORES (cutover puede proceder pero deberian resolverse pronto)

### 1. Frases prohibidas residuales en frontmatter (2 archivos)
Ver `docs/audit/COPY-REVIEW.md`:
- `gnss.md`: "Capacitacion integral" en descripcion
- `topografia.md`: "Capacitacion integral" + "100% practico" en descripcion

### 2. `equipargeo-tools.pages.dev` hardcodeado (7 archivos, 14 ocurrencias)
Per instrucciones: NO se tocaron. Post-cutover deben migrar a `app.equipargeo.com` via env var `PUBLIC_TOOLS_URL`. Archivos afectados:
- `src/components/Footer.astro` (2)
- `src/components/HerramientasFeatured.astro` (5)
- `src/components/Header.astro` (1)
- `src/pages/sobre.astro` (2)
- `src/pages/contacto.astro` (1)
- `src/pages/404.astro` (2)
- `src/layouts/BaseLayout.astro` (1 preconnect)

### 3. `public/images/og-default.jpg` — verificar que el BaseLayout lo referencia
El og-default.jpg fue generado pero no se verifico que el layout lo referencie correctamente. Si BaseLayout usa otro path o nombre, ajustar.

---

## MENORES (post-cutover)

### 1. Refactor URLs hardcodeadas de tools con env var PUBLIC_TOOLS_URL
Los 14 links a `equipargeo-tools.pages.dev` deben migrar a `app.equipargeo.com`. Recomendacion: crear env var `PUBLIC_TOOLS_URL` e importarla en los componentes.

### 2. `Strict-Transport-Security` en `_headers`
El archivo `_headers` incluye HSTS (`max-age=31536000; includeSubDomains`). El prompt original decia no agregarlo porque Cloudflare lo maneja. Ya estaba — evaluar si quitar para evitar duplicacion.

---

## Conflictos de idempotencia (no se sobrescribio)
- Ninguno. Ningun modulo tenia precios previos en frontmatter.

## Reemplazos contextuales de copy que requieren revision manual
Ver `docs/audit/COPY-REVIEW.md` para las 3 frases prohibidas detectadas con sugerencias de reemplazo.

---

## Plan editorial post-cutover

Calendario de publicaciones a definir la semana del 18-22/05/2026. Las 3 notas tecnicas estan redactadas parcialmente en `src/content/noticias/` con `publicada: false`. Completar el contenido editorial, cambiar a `publicada: true` y pushear para que se publiquen automaticamente.
