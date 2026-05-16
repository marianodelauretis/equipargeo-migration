# equipargeo-migration

Sitio web de EQUIPAR — capacitación, consultoría y herramientas para agrimensura, topografía y fotogrametría en Argentina.

**Producción:** https://equipargeo.com (sitio) + https://app.equipargeo.com (tools)  
**Staging:** https://equipargeo-site.pages.dev + https://equipargeo-tools.pages.dev

## Stack

- **Framework:** Astro 5 (content collections)
- **Estilos:** Tailwind CSS
- **Hosting:** Cloudflare Pages (auto-deploy on push a `main`)
- **DNS:** Cloudflare

## Estructura

```
.
├── repos-target/
│   ├── equipargeo-site/      Sitio principal (equipargeo.com)
│   └── equipargeo-tools/     Herramientas standalone (app.equipargeo.com)
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

## Deploy

Push a `main` dispara auto-deploy en Cloudflare Pages para ambos sitios. Build output: `dist/` en cada subproyecto.

## Convenciones

- **Copy:** lenguaje técnico argentino concreto. Ver `docs/audit/COPY-REVIEW.md`.
- **Imágenes:** `astro:assets` con archivos en `src/assets/`. `public/images/` solo para assets globales (og-default).
- **Redirects WP → Astro:** `repos-target/equipargeo-site/public/_redirects`.
- **Security headers:** `repos-target/equipargeo-site/public/_headers`.

## Estado actual

- Migración WordPress → Astro completada.
- Auditoría pre-cutover completada (ver `docs/audit/REPORT.md`).
- Cutover DNS programado: 16/05/2026.
