# equipargeo-site

Sitio principal de [equipargeo.com](https://equipargeo.com) en Astro 5.x + Tailwind.

## Stack

- **Astro 5.x** — generador estático con islands architecture
- **Tailwind CSS 3.x** — utility-first
- **MDX** — para notas y cursos con embeds
- **Cloudflare Pages** — deploy

## Setup

```bash
npm install
npm run dev      # localhost:4321
npm run build    # ./dist/
npm run preview  # preview del build
```

## Estructura

```
src/
├── content/
│   ├── cursos/      # markdown de cursos
│   ├── noticias/    # markdown de notas del blog
│   └── config.ts    # schemas de content collections
├── pages/           # rutas del sitio
├── layouts/         # layouts compartidos
├── components/      # componentes Astro
└── styles/          # CSS global
```

## Deploy

Cloudflare Pages → build command `npm run build` → publish directory `dist/`.

URL final: https://equipargeo.com (con cutover desde el WP actual).
URL staging: https://equipargeo-site.pages.dev (automático).
