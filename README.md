# equipargeo-migration

Sitio web de EQUIPAR — capacitación, consultoría y herramientas para agrimensura, topografía y fotogrametría en Argentina.

**Producción:** https://equipargeo.com (sitio) + https://app.equipargeo.com (tools)  
**Staging:** https://equipargeo-site.pages.dev + https://equipargeo-tools.pages.dev

## Stack

- **Framework:** Astro 5 (content collections)
- **Estilos:** Tailwind CSS
- **Hosting:** Cloudflare Pages (auto-deploy on push a `main`)
- **DNS:** Cloudflare
- **Server-side:** Cloudflare Pages Functions (proxy efemérides BRDC)

## Estructura

```
.
├── repos-target/
│   ├── equipargeo-site/      Sitio principal (equipargeo.com)
│   └── equipargeo-tools/     Herramientas standalone (app.equipargeo.com)
│       └── functions/api/    Cloudflare Pages Functions
├── docs/
│   └── audit/                Auditorías y reportes operativos
├── decisiones/               ADRs — decisiones técnicas
├── auditoria/                Auditoría del WordPress original (referencia)
└── archive/                  Material del proceso de migración (gitignored)
```

## Desarrollo local

```bash
cd repos-target/equipargeo-site
npm install
npm run dev          # http://localhost:4321
npm run build        # genera dist/
npm run preview      # sirve el build
```

Para las herramientas (HTML/JS estáticos): abrir `repos-target/equipargeo-tools/index.html` o servir con cualquier servidor estático.

Para testear las Pages Functions (proxy de efemérides BRDC):

```bash
cd repos-target/equipargeo-tools
npx wrangler pages dev .    # http://localhost:8788
```

## Deploy

Push a `main` dispara auto-deploy en Cloudflare Pages para ambos sitios. Build output: `dist/` en cada subproyecto.

## Convenciones

- **Copy:** lenguaje técnico argentino concreto. Ver `docs/audit/COPY-REVIEW.md`.
- **Imágenes:** `astro:assets` con archivos en `src/assets/`. `public/images/` solo para assets globales (og-default).
- **Redirects WP → Astro:** `repos-target/equipargeo-site/public/_redirects`.
- **Security headers:** `repos-target/equipargeo-site/public/_headers`.

## Estado actual

Sitio en producción desde el 02/06/2026 en https://equipargeo.com.

- **Cutover DNS completado.** Cloudflare Pages, SSL emitido por Google Trust Services. Always Use HTTPS habilitado.
- **21 páginas** en el sitio Astro (home, 12 cursos, notas técnicas, asesoría, agenda, STEC, sobre, contacto, 404).
- **5 herramientas** en app.equipargeo.com (POSGAR07, Faja, Puntos intermedios, Conversor DXF, Caja de herramientas RINEX).
- **1 Cloudflare Pages Function** — proxy server-side para descarga de efemérides BRDC de BKG (`/api/brdc`).
- **Web Analytics:** Cloudflare (modo automatic, sin cookies).
- **Indexación:** Google Search Console con propiedad Dominio, `sitemap-index.xml` submitted.
- **100+ redirects 301** del WordPress viejo en `_redirects`.
- Auditoría pre-cutover en `docs/audit/REPORT.md`.
