# Auditoría pre-cutover — equipargeo.com

> **Cómo usar este prompt:** abrir Claude Code en `C:\Users\agrim\GitHub\equipargeo-migration\`, modelo Sonnet, y pegar todo lo que sigue (desde el separador hasta el final). El prompt es autocontenido.

---

# CONTEXTO

Soy Mariano De Lauretis. Estás auditando el repo `equipargeo-migration` antes de un cutover de DNS programado para el 16/05/2026 (mañana). El sitio actual está en WordPress sobre DonWeb y se migra a Astro + Cloudflare Pages. Tu rol es hacer una auditoría sistemática, aplicar los fixes triviales que no requieran decisión humana, y dejarme un reporte para revisión manual de lo que sí.

**Repo local:** `C:\Users\agrim\GitHub\equipargeo-migration\`
**Stack asumido:** Astro + Tailwind + Cloudflare Pages, deploy auto on push a `main`.
**Staging activo:** `https://equipargeo-site.pages.dev` (sitio) y `https://equipargeo-tools.pages.dev` (tools standalone).
**Producción post-cutover:** `equipargeo.com` + `www.equipargeo.com` → site, `app.equipargeo.com` → tools.
**Sitio canónico WordPress (fuente de datos comerciales):** `https://equipargeo.com`

**Entorno:** Windows, user `agrim`. Tenés `git`, `npm`, `node`, `curl.exe` (Git for Windows), PowerShell. NO tenés `gh` CLI.

**Reglas de copy no negociables:**
- Evitar lenguaje marketinero o de marketing AI. Frases prohibidas (auto-detect y reportar/reemplazar): "profesionales del territorio", "soluciones a medida", "capacitación integral", "transformar tu perfil", "100% práctico", "experiencias transformadoras", "potenciar tu carrera", "llevar tu trabajo al siguiente nivel".
- Usar lenguaje técnico argentino concreto: agrimensores, topógrafos, ingenieros, obra, gabinete, expediente, mensura, libreta, replanteo, geodesia, GNSS, post-procesamiento, RTK, NTRIP.
- Adjetivos solo con sustantivos concretos.

**Datos canónicos del sitio:**
- Email de contacto: `equipargeo@gmail.com` (formato `mailto:equipargeo@gmail.com`). El WordPress viejo usa `info@equipargeo.com` — **eso NO es canónico, normalizá a gmail**.
- WhatsApp: `+54 9 11 5572-2266`, formato canónico de link: `https://wa.me/5491155722266` (sin `+`, sin espacios, sin guiones). Texto pre-llenado opcional con `?text=...`.
- Marca: **EQUIPAR** (todo mayúsculas). El WordPress viejo usa "Equipargeo" (capitalización mixta) — en el repo nuevo es "EQUIPAR".

---

# OBJETIVO

Producir un sitio listo para cutover de DNS mañana. Criterios de aceptación:

1. Cero ocurrencias de las frases marketineras prohibidas en archivos servidos a usuarios.
2. Cero `<!-- COMPLETAR -->` u otros placeholders visibles en producción.
3. Cero links rotos internos. Externos rotos: reporte, no auto-fix.
4. Todas las páginas con `<title>`, `<meta description>`, OG completo, canonical apuntando a `equipargeo.com`.
5. `public/_redirects` cubriendo todas las URLs viejas indexadas en Google.
6. `public/_headers` con headers de seguridad mínimos.
7. `public/sitemap.xml` y `public/robots.txt` presentes y consistentes con `equipargeo.com`.
8. Página 404 personalizada (`src/pages/404.astro`).
9. `npm run build` corre sin errores; warnings revisados y reportados.
10. `docs/DEPLOY.md` corregido (build output es `dist`, no `repos-target/equipargeo-site/dist`).
11. Email canónico (`equipargeo@gmail.com`) y WhatsApp canónico (`wa.me/5491155722266`) consistentes en todo el repo.
12. Precios de cursos extraídos del WordPress e insertados en cada módulo (ver Fase 3).

**No hacer:**
- NO hacer `git push`. Solo commit local en branch nueva.
- NO modificar archivos en `dist/` ni `node_modules/`.
- NO refactorizar componentes ni cambiar diseño.
- NO tocar las URLs hardcodeadas de tools (`equipargeo-tools.pages.dev` → `app.equipargeo.com`). Eso queda para post-cutover y va con env var `PUBLIC_TOOLS_URL`. Sí reportá en qué archivos están.
- NO inventar datos. Si el WordPress no tiene un campo (ej. fecha es "A confirmar"), copiar literal y reportar.

---

# FASE 0 — Setup

```powershell
cd C:\Users\agrim\GitHub\equipargeo-migration
git status                                    # confirmar working tree limpio
git checkout -b audit/pre-cutover-2026-05-15  # branch dedicada
mkdir docs\audit -ErrorAction SilentlyContinue
```

Si `git status` muestra cambios pendientes, **detenete y reportame antes de seguir**. No quiero perder trabajo previo.

---

# FASE 1 — Reconocimiento

Producir un inventario completo del repo. Generar `docs/audit/INVENTORY.md` con:

1. **Tree del repo** hasta 3 niveles (excluir `node_modules`, `dist`, `.astro`, `.git`).
2. **Stack detectado:** versión de Astro, versión de Tailwind si está, integrations en `astro.config.mjs`, scripts de `package.json`.
3. **Páginas Astro:** listar todos los archivos en `src/pages/**/*.astro` (y `.md`/`.mdx` si hay).
4. **Componentes:** listar `src/components/**/*.astro`.
5. **Layouts:** listar `src/layouts/**/*.astro`.
6. **Contenido en markdown:** si hay `src/content/` o `src/pages/**/*.md`, listar.
7. **Assets estáticos relevantes:** `public/images/`, `public/_redirects`, `public/_headers`, `public/sitemap.xml`, `public/robots.txt`, `public/404.html` o `src/pages/404.astro`. Reportar cuáles existen y cuáles faltan.
8. **Archivos `docs/`:** listar y resumir cada uno en una línea.

---

# FASE 2 — Fixes triviales (aplicar directo, sin pedir confirmación)

## 2.1 Email canónico

Buscar en TODO el repo (`src/`, `public/`, `docs/`, archivos de configuración) ocurrencias de:

- `info@equipargeo.com`
- `contacto@equipargeo.com`
- cualquier variante con dominio `@equipargeo.com`

Reemplazar por `equipargeo@gmail.com`. Si está en formato `<email>` o texto plano, dejar `mailto:equipargeo@gmail.com` cuando sea un link, o texto plano `equipargeo@gmail.com` cuando sea solo texto. Reportar cantidad de reemplazos por archivo.

## 2.2 WhatsApp canónico

Buscar variantes y normalizar:

- `+54 9 11 5572-2266`, `+54 9 11 55722266`, `+(54) 911 5572-2266`, `5491155722266`, `54 9 11 5572-2266` → mostrar como texto: `+54 9 11 5572-2266`
- Links: cualquier URL que apunte a `api.whatsapp.com/send?phone=5491155722266` o variantes → normalizar a `https://wa.me/5491155722266` preservando el `?text=...` si existe.

NO romper los `?text=` existentes — son intencionales (cada CTA tiene su mensaje pre-llenado).

## 2.3 Filtro argentino-técnico — auto-reemplazos seguros

Reemplazo directo en archivos del repo (NO en `docs/`, NO en archivos del directorio raíz tipo READMEs, NO en `node_modules`, NO en commits previos):

| Buscar | Reemplazar por |
|---|---|
| `profesionales del territorio` | depende contexto, ver abajo |
| `Profesionales del territorio` | idem (preservar capitalización) |
| `Equipargeo` (como marca) | `EQUIPAR` |
| `equipargeo` (como marca, NO en URLs ni emails) | `EQUIPAR` |

Para **"profesionales del territorio"**, aplicar estos reemplazos contextuales en este orden de prioridad:

1. En `<title>` y meta tags (`og:title`, `twitter:title`, `meta description`): reemplazar la frase completa que la contenga por una versión limpia. Ejemplos:
   - `"EQUIPAR — Cursos prácticos y herramientas para profesionales del territorio"` → `"EQUIPAR — Cursos prácticos en GNSS, topografía y fotogrametría"`
   - `"Cursos — EQUIPAR"` (ya OK, no tocar)
   - Aplicar análogamente a cualquier title largo que mencione "profesionales del territorio".
2. En H1 de páginas: reemplazar similar.
   - `"Cursos prácticos y herramientas para profesionales del territorio"` (H1 home) → `"Cursos prácticos en GNSS, topografía y fotogrametría"`
   - `"Cursos prácticos para profesionales del territorio"` (H1 /cursos/) → `"Cursos prácticos en GNSS, topografía y fotogrametría"`
3. En párrafos de cuerpo (ej. sección "Sobre EQUIPAR", footer):
   - `"profesionales del territorio"` aislado en oración → `"agrimensores, topógrafos e ingenieros"`
   - Ejemplo footer: `"Cursos prácticos y herramientas para profesionales del territorio."` → `"Cursos prácticos en GNSS, topografía y fotogrametría."`
4. En copyright del footer:
   - `"© 2026 EQUIPAR · Capacitación para profesionales del territorio"` → `"© 2026 EQUIPAR · Capacitación en GNSS, topografía y fotogrametría"`

Para **OTRAS frases prohibidas** (`soluciones a medida`, `capacitación integral`, `transformar tu perfil`, `100% práctico`, `experiencias transformadoras`, `potenciar tu carrera`, `llevar tu trabajo al siguiente nivel`): **NO auto-reemplazar**, solo reportar en `docs/audit/COPY-REVIEW.md` con archivo, línea, contexto y sugerencia. Yo decido.

Si encontrás otra frase que te suena marketinera pero no está en la lista, NO tocar — reportar.

## 2.4 docs/DEPLOY.md

Si el archivo menciona el path de build output como `repos-target/equipargeo-site/dist` o cualquier variante con `repos-target/`, reemplazar por `dist`. Reportar el diff.

## 2.5 .gitignore review

Verificar que estén en `.gitignore`:

- `node_modules/`
- `dist/`
- `.astro/`
- `.env`, `.env.local`, `.env.*.local`
- `archive/` (ya está según commit `505eb1d`)
- `.DS_Store`, `Thumbs.db`

Si falta alguno, agregarlo. NO agregar `.env.example`.

---

# FASE 3 — Datos comerciales de cursos (fetchear WP + insertar)

Esta es la parte más sustantiva. El sitio nuevo tiene **9 módulos** + **3 programas completos** = **12 páginas de curso** con sección "Inversión" stub (texto: *"Consultá precios actualizados y opciones de pago por WhatsApp..."* o similar) o marcadores `<!-- COMPLETAR -->`. Hay que reemplazar con los datos reales del WordPress actual.

## 3.1 Mapeo de URLs WP → archivos del repo

Las URLs del WP siguen estos slugs (ya verificados):

| Curso | URL WordPress | Archivo Astro esperado |
|---|---|---|
| GNSS Programa completo | `https://equipargeo.com/programa-completo-curso-gnss/` | `src/pages/cursos/gnss.astro` (o `.md`) |
| GNSS Módulo 1 | `https://equipargeo.com/curso-gnss-modulo-1/` | `src/pages/cursos/gnss-modulo-1.astro` |
| GNSS Módulo 2 | `https://equipargeo.com/curso-gnss-modulo-2/` | `src/pages/cursos/gnss-modulo-2.astro` |
| GNSS Módulo 3 | `https://equipargeo.com/curso-gnss-modulo-3/` | `src/pages/cursos/gnss-modulo-3.astro` |
| Topografía Programa completo | `https://equipargeo.com/programa-completo-topografia/` | `src/pages/cursos/topografia.astro` |
| Topografía Módulo 1 | `https://equipargeo.com/modulo-1-topografia-basica/` | `src/pages/cursos/topografia-modulo-1.astro` |
| Topografía Módulo 2 | `https://equipargeo.com/modulo-2-nivelacion/` | `src/pages/cursos/topografia-modulo-2.astro` |
| Topografía Módulo 3 | `https://equipargeo.com/modulo-3-estacion-total/` | `src/pages/cursos/topografia-modulo-3.astro` |
| Fotogrametría Programa completo | `https://equipargeo.com/programa-completo-fotogrametria/` | `src/pages/cursos/fotogrametria.astro` |
| Fotogrametría Módulo 1 | `https://equipargeo.com/modulo-1-manejo-basico-de-drones/` | `src/pages/cursos/fotogrametria-modulo-1.astro` |
| Fotogrametría Módulo 2 | `https://equipargeo.com/modulo-2-captura-de-datos-y-fotogrametria-aplicada/` | `src/pages/cursos/fotogrametria-modulo-2.astro` |
| Fotogrametría Módulo 3 | `https://equipargeo.com/modulo-3-procesamiento-y-productos-avanzados/` | `src/pages/cursos/fotogrametria-modulo-3.astro` |

Las rutas de archivos son tu hipótesis a partir del slug servido. Si en tu Fase 1 encontrás que el repo usa otra convención (ej. `src/content/cursos/gnss-modulo-1.md` con frontmatter), adaptar.

## 3.2 Patrón de datos a extraer del WP

Cada página de módulo del WordPress tiene este patrón (verificado en `/curso-gnss-modulo-1/`):

```
**Fechas** [valor]
**Duración** [valor]
**Formato** [valor]
**Requisito** [valor]

#### Argentina
ARS
Precio general $ [valor]
Comunidad Equipar
75% OFF $ [valor]
+ Asesoría (opcional) **$ [valor]**

#### Internacional
USD
Precio general USD [valor]
Comunidad Equipar
75% OFF USD [valor]
+ Asesoría (opcional) **USD [valor]**
```

Procedimiento para cada uno de los 12 cursos:

1. **Fetchear** la URL del WP con `curl.exe -sL "URL" > tmp.html` (o curl directo, según prefiera Claude Code).
2. **Extraer** los 4 campos de "Detalles" (Fechas, Duración, Formato, Requisito) y los 6 valores de precio (3 ARS + 3 USD).
3. **Guardar** los datos extraídos en `docs/audit/DATOS-CURSOS.json` con esta estructura:
   ```json
   {
     "gnss-modulo-1": {
       "url_wp": "https://equipargeo.com/curso-gnss-modulo-1/",
       "fechas": "A confirmar",
       "duracion": "2 jornadas (4h c/u)",
       "formato": "Online en vivo",
       "requisito": "Sin experiencia previa",
       "precio_ars": { "general": "$375.000", "comunidad": "$93.750", "asesoria": "$37.500" },
       "precio_usd": { "general": "USD 250", "comunidad": "USD 62", "asesoria": "USD 25" }
     },
     "gnss-modulo-2": { ... },
     ...
   }
   ```
4. **Insertar** los datos en el archivo Astro/MD correspondiente. La estructura a usar en la página del repo:

   ```
   ## Modalidad y duración
   [Formato extraído] · [Duración extraída]
   [Si hay requisito: "Requisito: [Requisito extraído]"]
   [Si Fechas != "A confirmar": "Próxima cohorte: [Fechas]"]

   ## Inversión

   ### Argentina (ARS)
   - **Precio general:** [precio_ars.general]
   - **Comunidad EQUIPAR (75% OFF):** [precio_ars.comunidad]
   - **+ Asesoría individual (opcional):** [precio_ars.asesoria]

   ### Internacional (USD)
   - **Precio general:** [precio_usd.general]
   - **Comunidad EQUIPAR (75% OFF):** [precio_usd.comunidad]
   - **+ Asesoría individual (opcional):** [precio_usd.asesoria]

   > La preinscripción no implica compromiso de pago. Te asegura prioridad de cupo.

   [Preinscribirme ahora →](https://forms.gle/wiRnmaW5759EuP2f6)

   ¿Tenés dudas antes de inscribirte? [Escribinos por WhatsApp](https://wa.me/5491155722266?text=Hola%20EQUIPAR,%20consulto%20por%20el%20[NOMBRE_CURSO]) y te respondemos en horario laboral.
   ```

   Adaptá la sintaxis a Astro/MDX según corresponda al archivo (`<h2>` o `##`, etc.).

5. **Reemplazar** el bloque actual de "Inversión" (que dice *"Consultá precios actualizados..."* o tiene `<!-- COMPLETAR -->`) por este nuevo bloque.

6. **Idempotencia:** si una página ya tiene un precio numérico concreto, NO sobrescribir. Reportar como conflicto en `docs/audit/REPORT.md` y dejar la página intacta.

7. **Si falta algún dato en el WP** (precio no aparece, sección "Inversión" ausente, página WP no responde, etc.): NO inventar. Dejar `<!-- COMPLETAR: [campo] para [curso] (no extraído del WP, verificar manualmente) -->` y reportar como blocker.

## 3.3 CTA de WhatsApp por curso

El texto pre-llenado del WhatsApp debe mencionar el módulo. Sustituir `[NOMBRE_CURSO]` por el nombre breve del módulo:

- gnss-modulo-1 → "Módulo 1 GNSS"
- gnss-modulo-2 → "Módulo 2 GNSS (RTK)"
- gnss-modulo-3 → "Módulo 3 GNSS (Post-proceso)"
- topografia-modulo-1 → "Módulo 1 Topografía"
- ... etc.
- gnss (programa completo) → "Programa GNSS completo"
- topografia (programa completo) → "Programa Topografía completo"
- fotogrametria (programa completo) → "Programa Fotogrametría completo"

URL-encode los espacios como `%20` y mantener acentos URL-encoded.

---

# FASE 4 — Infraestructura web

## 4.1 public/_redirects (BLOCKER)

Crear `public/_redirects` con redirects 301 desde URLs viejas del WordPress a URLs nuevas. Cloudflare Pages lee este archivo nativamente.

Contenido a crear (verificar antes que NO exista; si existe, mergear sin duplicar):

```
# Cursos: programas completos
/programa-completo-curso-gnss        /cursos/gnss/                 301
/programa-completo-topografia        /cursos/topografia/           301
/programa-completo-fotogrametria     /cursos/fotogrametria/        301

# Cursos: módulos GNSS
/curso-gnss-modulo-1                 /cursos/gnss-modulo-1/        301
/curso-gnss-modulo-2                 /cursos/gnss-modulo-2/        301
/curso-gnss-modulo-3                 /cursos/gnss-modulo-3/        301

# Cursos: módulos Topografía
/modulo-1-topografia-basica          /cursos/topografia-modulo-1/  301
/modulo-2-nivelacion                 /cursos/topografia-modulo-2/  301
/modulo-3-estacion-total             /cursos/topografia-modulo-3/  301

# Cursos: módulos Fotogrametría
/modulo-1-manejo-basico-de-drones                       /cursos/fotogrametria-modulo-1/  301
/modulo-2-captura-de-datos-y-fotogrametria-aplicada     /cursos/fotogrametria-modulo-2/  301
/modulo-3-procesamiento-y-productos-avanzados           /cursos/fotogrametria-modulo-3/  301

# Índices viejos
/capacitaciones                      /cursos/                      301
/home                                /                             301
/experiencias                        /sobre/                       301

# Asesoría / consultoría
/asesoria-tecnica                    /asesoria/                    301
/consultoria-y-equipamiento          /asesoria/                    301

# Agenda
/agenda-tu-curso                     /agenda/                      301

# Herramientas (cross-subdomain a app.equipargeo.com)
/conversor-a-dxf                              https://app.equipargeo.com/conversor-dxf/      301
/conversor-de-coordenadas-lat-long-gk         https://app.equipargeo.com/posgar07/           301
/herramientas-gnss                            https://app.equipargeo.com/faja/               301
/herramientas-de-topografia                   https://app.equipargeo.com/puntos-intermedios/ 301
/topografia                                   https://app.equipargeo.com/                    301
/gnss                                         https://app.equipargeo.com/                    301
/drones                                       https://app.equipargeo.com/                    301
```

**Verificar después de crear:** ejecutar `Get-Content public/_redirects` y reportar.

## 4.2 public/_headers

Si no existe, crear `public/_headers` con:

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  X-Frame-Options: SAMEORIGIN
```

NO agregar `Content-Security-Policy` — eso rompe Astro/Tailwind fácil y lo dejamos para post-cutover con análisis de inline scripts.

NO agregar `Strict-Transport-Security` — Cloudflare lo maneja en el dashboard, mejor no duplicar.

## 4.3 sitemap.xml

Verificar:
- ¿Existe `@astrojs/sitemap` integration en `astro.config.mjs`? Si sí, el sitemap se genera en build.
- ¿Existe `public/sitemap.xml` (estático)? Si sí, verificar que las URLs apunten a `https://equipargeo.com/...` y no a `pages.dev`.
- Si NO existe ninguno de los dos, reportar como blocker y NO crear uno a mano — proponer instalar el integration.

## 4.4 robots.txt

Verificar `public/robots.txt`. Debe tener al menos:

```
User-agent: *
Allow: /

Sitemap: https://equipargeo.com/sitemap.xml
```

Si no existe, crear. Si existe pero apunta a `pages.dev`, corregir.

## 4.5 404

Verificar que existe `src/pages/404.astro`. Si no existe, reportar como blocker y NO crear template a ciegas (sin saber el layout, queda fuera de marca). Si existe, leerlo y verificar:
- Tiene H1 claro tipo "Página no encontrada".
- Tiene link de vuelta a home.
- Usa el layout del sitio.

---

# FASE 5 — Validación

## 5.1 Build limpio

```powershell
npm install
npm run build
```

Capturar el output completo. Reportar:
- ¿Build exitoso?
- Lista de warnings (cantidad y categorías: imágenes sin alt, headings, etc.).
- Tamaño del `dist/` final.

Si el build falla, **detenete y reportame**. No avances a 5.2.

## 5.2 Auditoría de canonicals

Para cada página en `src/pages/**/*.astro` (y `.md`):
- ¿Tiene `<link rel="canonical">`?
- ¿Apunta a `https://equipargeo.com/...` (NO a `pages.dev`)?
- ¿La URL del canonical coincide con la ruta del archivo?

Si Astro genera canonicals automáticamente vía `Astro.url` o config, verificar el `site` en `astro.config.mjs` — debe ser `https://equipargeo.com`. Si está en `pages.dev`, blocker.

## 5.3 og:image existencia

El staging usa `https://equipargeo.com/images/og-default.jpg` como og:image global. Verificar:
- ¿Existe `public/images/og-default.jpg` en el repo?
- Si existe: tamaño en KB, dimensiones (si tenés cómo medirlas; si no, reportar tamaño solo).
- Si no existe: blocker, reportar.

Reportar también qué páginas (si alguna) tienen `og:image` específica vs heredan la default.

## 5.4 Breadcrumb consistency

En staging detecté inconsistencia: en `/cursos/gnss-modulo-1/` el crumb "GNSS" apunta a `/cursos/?programa=gnss` (query string), pero en `/cursos/` los botones apuntan a `/cursos/gnss/` (path). La URL canónica de programa es **`/cursos/gnss/` (sin query string)**. Normalizar todos los breadcrumbs y links internos para usar la versión sin query string.

## 5.5 Marcadores `<!-- COMPLETAR -->` residuales

Después de todas las fases anteriores, hacer:
```powershell
git grep -n "COMPLETAR" -- "*.astro" "*.md" "*.mdx" "*.json" "*.ts" "*.js"
```

Reportar cada match en `docs/audit/REPORT.md` como blocker. NO auto-cerrar (a esta altura los que queden son los que requieren decisión humana).

## 5.6 Links rotos

Generar lista de todos los `href` que apuntan a:
- Rutas internas: verificar que el archivo destino existe en el repo.
- `https://forms.gle/...`: NO verificar (no se puede sin abrirlo, asumir OK).
- `https://wa.me/...`: NO verificar (asumir OK si formato es correcto).
- Otros externos: NO verificar (queda para QA manual).

Internos rotos: reportar como blocker. NO auto-fix (el destino correcto requiere criterio).

---

# FASE 6 — Reporte final y commit

## 6.1 Generar `docs/audit/REPORT.md`

Estructura:

```markdown
# Auditoría pre-cutover — 2026-05-15

## Resumen ejecutivo
- Archivos modificados: N
- Fixes triviales aplicados: N (detalle abajo)
- Blockers para cutover: N (lista abajo)
- Mayores para revisión: N
- Menores para post-cutover: N

## Fixes aplicados automáticamente
- [Fase 2.1] Email canónico: N reemplazos en M archivos. Lista...
- [Fase 2.2] WhatsApp canónico: N reemplazos en M archivos. Lista...
- [Fase 2.3] "Profesionales del territorio": N reemplazos en M archivos. Lista por contexto (title/H1/cuerpo/footer)...
- [Fase 2.4] DEPLOY.md: corregido.
- [Fase 2.5] .gitignore: agregadas N entradas.
- [Fase 3] Datos de cursos: N de 12 cursos completados. Detalle por curso...
- [Fase 4.1] _redirects: creado con N reglas.
- [Fase 4.2] _headers: creado.

## 🔴 BLOCKERS (impiden cutover)
1. ...
2. ...

## 🟡 MAYORES (cutover puede proceder pero deberían resolverse pronto)
1. ...

## 🟢 MENORES (post-cutover)
1. Refactor URLs hardcodeadas de tools con env var PUBLIC_TOOLS_URL. Archivos afectados: ...
2. ...

## Conflictos de idempotencia (no se sobrescribió)
- ...

## Reemplazos contextuales de copy que requieren revisión manual
(de docs/audit/COPY-REVIEW.md)
```

## 6.2 Commit local

```powershell
git add -A
git status                                    # mostrar antes de committear
git commit -m "audit: pre-cutover fixes 2026-05-15

- Copy: profesionales del territorio → técnico (title/H1/footer)
- Email canónico: info@ → equipargeo@gmail.com (mailto)
- WhatsApp canónico: wa.me/5491155722266
- Marca: Equipargeo → EQUIPAR
- Datos de cursos extraídos del WP (12/12)
- public/_redirects: 23 redirects 301 desde WordPress
- public/_headers: security headers
- docs/DEPLOY.md: build output path
- .gitignore: entries añadidas

Branch: audit/pre-cutover-2026-05-15
Ver docs/audit/REPORT.md para detalle.
"
```

NO hacer `git push`. Yo lo reviso, mergeo a `main` y pusheo.

## 6.3 Mensaje final en el chat

Cuando termines, dame:
1. Resumen ejecutivo en 5-8 líneas (qué hiciste, qué quedó como blocker).
2. Path absoluto a `docs/audit/REPORT.md` para que lo abra.
3. Lista de blockers en orden de prioridad para que decida en qué orden los resuelvo antes del cutover.
4. Comando exacto que tengo que correr para mergear a main cuando apruebe.

---

# Notas de operación

- **Velocidad vs precisión:** precisión siempre. No tomes atajos con datos comerciales (precios) ni con redirects (rompen SEO). Mejor reportar incompleto que reportar mal.
- **Si encontrás algo raro que no encaja con estas instrucciones:** detenete, no improvises, reportá. Yo prefiero un blocker explícito que un fix mal aplicado.
- **Si el repo tiene una estructura distinta a la que asumo** (ej. monorepo con `site/` y `tools/`, o usa `src/content/` en vez de `src/pages/` para cursos): adaptá las rutas pero mantené el espíritu del plan. Reportá la adaptación en `REPORT.md`.
- **`equipargeo-tools.pages.dev`:** si el repo incluye también el código de tools, podés correr Fase 2 (fixes triviales) sobre tools también, pero las Fases 3-5 son específicas del site. No te metas con el código de las herramientas en sí (calculadoras, conversores) más allá del copy.
- **Ante duda sobre auto-reemplazo de copy:** NO reemplazar. Reportar.

Empezá por Fase 0 y reportame cuando termines la Fase 1 antes de avanzar a fixes, así confirmo que la estructura del repo coincide con lo que asumo.
