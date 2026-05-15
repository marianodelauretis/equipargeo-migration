# Inventario del repo — Fase 1 Reconocimiento

> Generado: 2026-05-15 — Branch: `audit/pre-cutover-2026-05-15`

---

## 1. Tree del repo (3 niveles, excluidos node_modules/dist/.astro/.git)

```
.
├── .gitignore                          # Root: solo "BUNDLE_PARA_CLAUDE.md" y "archive/"
├── BUNDLE_PARA_CLAUDE.md
├── HANDOFF.md
├── README.md
├── auditoria/
│   └── 2026-05-14_chrome_audit_equipargeo.md
├── decisiones/
│   ├── 2026-05-14_herramientas_fantasma_activar.md
│   ├── 2026-05-14_seccion_noticias.md
│   └── 2026-05-14_stack_y_arquitectura.md
├── docs/
│   ├── CUTOVER_DNS.md
│   ├── DEPLOY.md
│   └── audit/
│       └── PROMPT-pre-cutover-2026-05-15.md
├── plan/
│   ├── fase_pulido_herramientas.md
│   ├── herramienta_01_faja.md
│   ├── herramienta_02_posgar07.md
│   ├── herramienta_03_puntos_intermedios.md
│   ├── herramienta_04_conversor_dxf.md
│   ├── herramienta_05_verificador_angulos.md
│   ├── herramienta_06_tin_curvas_nivel.md
│   ├── plan_general.md
│   ├── seccion_noticias.md
│   └── sitio_principal_astro.md
├── raw-html/
│   ├── build_bundle.py
│   ├── parse_equipargeo.py
│   ├── extracted/
│   │   ├── _resumen.json
│   │   ├── auxiliares/
│   │   ├── cursos/
│   │   └── herramientas/
│   └── source/                         # 21 archivos .html (WP scrape)
├── repos-target/
│   ├── equipargeo-site/                # ← SITIO ASTRO
│   │   ├── .gitignore
│   │   ├── README.md
│   │   ├── astro.config.mjs
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── tailwind.config.cjs
│   │   ├── tsconfig.json
│   │   ├── public/
│   │   └── src/
│   └── equipargeo-tools/               # ← HERRAMIENTAS STANDALONE (HTML)
│       ├── README.md
│       ├── _headers
│       ├── _redirects
│       ├── index.html
│       ├── robots.txt
│       ├── shared/
│       ├── conversor-dxf/
│       ├── faja/
│       ├── posgar07/
│       ├── puntos-intermedios/
│       ├── tin-curvas-nivel/
│       └── verificador-angulos/
```

**Nota clave:** El prompt asumía `src/pages/`, `public/`, `package.json` en la raíz. En realidad el sitio Astro vive en `repos-target/equipargeo-site/`. Todas las rutas de las fases siguientes se adaptan con prefijo `repos-target/equipargeo-site/`.

---

## 2. Stack detectado

| Componente | Versión / Detalle |
|---|---|
| Astro | `^5.0.0` |
| Tailwind CSS | `^3.4.17` (via `@astrojs/tailwind ^5.1.4`) |
| MDX | `@astrojs/mdx ^4.0.0` |
| Sitemap | `@astrojs/sitemap ^3.2.1` |
| `site` en config | `https://equipargeo.com` |
| Build format | `directory` (trailing slash) |
| Prefetch | hover strategy |

**Scripts de `package.json`:** `dev`, `start`, `build`, `preview`, `astro` (todos estándar Astro).

**Integrations en `astro.config.mjs`:**
- `tailwind` (applyBaseStyles: false)
- `mdx`
- `sitemap` (filtra /404, agrega customPages de app.equipargeo.com)

---

## 3. Paginas Astro (`src/pages/`)

| Archivo | Ruta servida |
|---|---|
| `src/pages/index.astro` | `/` |
| `src/pages/cursos/index.astro` | `/cursos/` |
| `src/pages/cursos/[...slug].astro` | `/cursos/{slug}/` (dinámico, content collection) |
| `src/pages/noticias/index.astro` | `/noticias/` |
| `src/pages/noticias/[...slug].astro` | `/noticias/{slug}/` (dinámico) |
| `src/pages/asesoria.astro` | `/asesoria/` |
| `src/pages/agenda.astro` | `/agenda/` |
| `src/pages/contacto.astro` | `/contacto/` |
| `src/pages/sobre.astro` | `/sobre/` |
| `src/pages/404.astro` | `/404` |

**Total:** 10 archivos (2 dinámicos que generan ~15 rutas en build).

---

## 4. Componentes (`src/components/`)

| Componente | Función probable |
|---|---|
| `Header.astro` | Navegación principal |
| `Footer.astro` | Pie de página |
| `Hero.astro` | Banner principal / hero section |
| `ProgramaCard.astro` | Tarjeta de programa en /cursos/ |
| `NoticiaCard.astro` | Tarjeta de noticia en /noticias/ |
| `Newsletter.astro` | Sección de suscripción |
| `CtaWhatsapp.astro` | Botón flotante WhatsApp |
| `Breadcrumb.astro` | Migas de pan |
| `HerramientasFeatured.astro` | Sección de herramientas destacadas |

**Total:** 9 componentes.

---

## 5. Layouts (`src/layouts/`)

| Layout | Uso probable |
|---|---|
| `BaseLayout.astro` | Layout general (meta tags, head, body) |
| `CursoLayout.astro` | Layout para páginas de cursos individuales |
| `NoticiaLayout.astro` | Layout para notas de noticias |

---

## 6. Contenido en content collections (`src/content/`)

### Cursos (12 archivos .md)

| Archivo | Tipo |
|---|---|
| `cursos/gnss.md` | Programa completo GNSS |
| `cursos/gnss-modulo-1.md` | Modulo 1 GNSS |
| `cursos/gnss-modulo-2.md` | Modulo 2 GNSS |
| `cursos/gnss-modulo-3.md` | Modulo 3 GNSS |
| `cursos/topografia.md` | Programa completo Topografia |
| `cursos/topografia-modulo-1.md` | Modulo 1 Topografia |
| `cursos/topografia-modulo-2.md` | Modulo 2 Topografia |
| `cursos/topografia-modulo-3.md` | Modulo 3 Topografia |
| `cursos/fotogrametria.md` | Programa completo Fotogrametria |
| `cursos/fotogrametria-modulo-1.md` | Modulo 1 Fotogrametria |
| `cursos/fotogrametria-modulo-2.md` | Modulo 2 Fotogrametria |
| `cursos/fotogrametria-modulo-3.md` | Modulo 3 Fotogrametria |

### Noticias (3 archivos .md)

| Archivo | Tema |
|---|---|
| `noticias/receptores-gnss-2026-mercado-argentino.md` | Receptores GNSS 2026 |
| `noticias/errores-post-proceso-gnss.md` | Errores en post-proceso |
| `noticias/trimble-business-center-2026-review.md` | Review TBC 2026 |

### Schema (`config.ts`)

- **cursos:** programa, titulo, descripcion, modulo, esPrograma, modalidad, duracion, precio, instructor, fechaInicio, requisitos, temario, orden, destacado, publicado
- **noticias:** titulo, descripcion, fecha, categoria (8 opciones), autor, tags, imagen, imagenAlt, cursoRelacionado, destacada, publicada

---

## 7. Assets estaticos (`public/`)

| Recurso | Estado |
|---|---|
| `public/favicon.svg` | EXISTE |
| `public/images/` | EXISTE (solo `.gitkeep` — vacio) |
| `public/images/og-default.jpg` | **NO EXISTE** — BLOCKER (referenciado en OG meta tags) |
| `public/_redirects` | EXISTE — 91 lineas, cubre cursos, herramientas, WP paths, variantes |
| `public/_headers` | EXISTE — security headers + cache policy |
| `public/robots.txt` | EXISTE — apunta a `equipargeo.com/sitemap-index.xml` |
| `public/sitemap.xml` (estatico) | NO EXISTE (correcto: generado por `@astrojs/sitemap` en build) |
| `public/404.html` | NO EXISTE (correcto: hay `src/pages/404.astro`) |

---

## 8. Archivos `docs/`

| Archivo | Resumen |
|---|---|
| `docs/DEPLOY.md` | Guia de deploy CF Pages (2 proyectos: site + tools). Build output `repos-target/equipargeo-site/dist`. |
| `docs/CUTOVER_DNS.md` | Plan paso a paso de cutover DNS con checklist pre/post, rollback, cleanup. |
| `docs/audit/PROMPT-pre-cutover-2026-05-15.md` | Este prompt de auditoria. |

### Otros docs en raiz

| Archivo/Carpeta | Resumen |
|---|---|
| `HANDOFF.md` | Documento de handoff del proyecto |
| `README.md` | Readme general del repo |
| `auditoria/2026-05-14_chrome_audit_equipargeo.md` | Auditoria Chrome del dia anterior |
| `decisiones/` | 3 documentos de decisiones de arquitectura (herramientas, noticias, stack) |
| `plan/` | 10 documentos de planificacion (general, sitio, herramientas 1-6, noticias, pulido) |
| `raw-html/` | Scrape del WordPress: 21 HTMLs fuente + scripts de parseo + JSONs extraidos |

---

## 9. Hallazgos clave para fases siguientes

### Adaptaciones necesarias al prompt original

1. **Rutas:** Todas las rutas `src/`, `public/`, `package.json` llevan prefijo `repos-target/equipargeo-site/`.
2. **Cursos:** Usan content collections (`src/content/cursos/*.md`) con frontmatter + markdown body, NO son archivos `.astro` individuales. Se renderizan via `src/pages/cursos/[...slug].astro` + `CursoLayout.astro`.
3. **DEPLOY.md:** El path de build output ya dice `repos-target/equipargeo-site/dist` (correcto para CF Pages config). No necesita fix (el prompt asumia que diria mal).

### Observaciones tempranas

- `og-default.jpg` no existe — **BLOCKER** para OG meta.
- `_redirects` ya existe y es mas completo que lo propuesto en el prompt (incluye variantes con/sin trailing slash, bloqueo WP paths). Hay que mergear, no reemplazar.
- `_headers` ya existe y es mas completo que lo propuesto (incluye cache policy). Incluye `Strict-Transport-Security` que el prompt decia no agregar — ya esta, evaluar si quitar.
- `robots.txt` apunta a `sitemap-index.xml` (no `sitemap.xml`) — correcto para `@astrojs/sitemap`.
- `.gitignore` raiz es minimalista (`BUNDLE_PARA_CLAUDE.md`, `archive/`). El `.gitignore` del site Astro cubre `node_modules/`, `dist/`, `.astro/`, `.env*`, etc. Falta `.DS_Store` y `Thumbs.db` en el de raiz.
- El Fase 2.4 del prompt (fix DEPLOY.md path) probablemente no aplica — el path ya es correcto.
