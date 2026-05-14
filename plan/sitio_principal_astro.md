# Plan migración — Sitio principal (Astro)

## Objetivo

Reemplazar el WordPress de `equipargeo.com` (theme flixita + child britely) por sitio estático en Astro 5.x corriendo en Cloudflare Pages.

## Stack

- **Astro 5.x** — generador estático con islands architecture.
- **Tailwind CSS 3.x** — utility-first, sin CSS custom heavy.
- **Markdown + MDX** — contenido editable en Git.
- **Astro Content Collections** — type-safe content, especialmente útil para sección noticias.
- **Astro Image** — optimización automática de imágenes.
- **Astro SEO** — meta tags, OG, sitemap, RSS.

## Estructura

```
equipargeo-site/
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
├── package.json
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── logo.svg
└── src/
    ├── content/
    │   ├── config.ts                  # Schemas de Content Collections
    │   ├── cursos/                    # 12 archivos .md
    │   │   ├── gnss-overview.md
    │   │   ├── gnss-modulo-1.md
    │   │   ├── gnss-modulo-2.md
    │   │   ├── gnss-modulo-3.md
    │   │   ├── topografia-overview.md
    │   │   ├── topografia-modulo-1.md
    │   │   ├── ...
    │   └── noticias/                  # .md cada nota
    │       ├── ejemplo-nota-1.md
    │       └── ...
    ├── layouts/
    │   ├── BaseLayout.astro
    │   ├── CursoLayout.astro
    │   └── NoticiaLayout.astro
    ├── components/
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── Hero.astro
    │   ├── CursoCard.astro
    │   ├── NoticiaCard.astro
    │   ├── CtaWhatsapp.astro
    │   └── Newsletter.astro
    ├── pages/
    │   ├── index.astro                # Home
    │   ├── cursos/
    │   │   ├── index.astro            # Listado de cursos
    │   │   └── [slug].astro           # Página dinámica por curso
    │   ├── noticias/
    │   │   ├── index.astro            # Listado paginado
    │   │   ├── [slug].astro           # Página dinámica por nota
    │   │   └── categoria/
    │   │       └── [cat].astro        # Filtro por categoría
    │   ├── herramientas.astro         # Listing → redirige/linkea a app.equipargeo.com
    │   ├── asesoria.astro
    │   ├── agenda.astro
    │   ├── contacto.astro
    │   ├── sobre-nosotros.astro
    │   └── rss.xml.ts                 # Feed RSS de noticias
    └── styles/
        └── global.css                 # Tailwind base
```

## Home rediseñada

**Objetivos:**
1. Propuesta de valor clara en hero (no Lorem Ipsum, no "Sitio en construcción").
2. Cards de los 3 programas con info real.
3. Sección destacada "Herramientas gratuitas" linkeando a `app.equipargeo.com`.
4. Sección "Últimas novedades" con 3 noticias recientes.
5. Social proof (testimonios + nº de profesionales formados).
6. CTA único: WhatsApp / Agendá tu curso.

## Estructura de menú propuesta

```
EQUIPAR
├── Cursos
│   ├── GNSS
│   ├── Topografía
│   └── Fotogrametría
├── Herramientas  →  app.equipargeo.com
├── Novedades     →  /noticias/
├── Asesoría      →  /asesoria/
└── Contacto      (CTA destacado)
```

## Forms

- **Contacto:** form básico (nombre, email, mensaje) → Cloudflare Workers POST → Telegram bot o email.
- **Agenda curso:** form más rico (curso de interés, modalidad, fecha tentativa) → mismo backend.

## SEO

- Title + meta description únicos por página.
- Open Graph + Twitter Cards.
- Schema markup `Course` para cada curso (precio, modalidad, duración, instructor).
- Schema markup `Article` para cada noticia.
- Schema markup `Organization` para EQUIPAR (Site-wide).
- Sitemap automático (astro-sitemap).
- robots.txt.
- 301 redirects exhaustivos de WP URLs viejas → nuevas (ver Fase 6).

## Analytics

- Google Tag `GT-NNQ4JFFT` (mantener actual).
- Cloudflare Web Analytics en paralelo (cookies-less, gratis).
- Eventos custom: click en CTAs, completar form, descargar PDF.

## Performance objetivo

- Lighthouse Performance > 95
- Lighthouse SEO 100
- Lighthouse Accessibility > 95
- First Contentful Paint < 1s
- Largest Contentful Paint < 2.5s
