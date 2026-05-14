---
fecha: 2026-05-14
tipo: decision
estado: vigente
---

# Decisión arquitectónica — Stack y división de responsabilidades

## Contexto

equipargeo.com vive hoy en WordPress (flixita + britely, WP 6.9.4). Tiene contenido educativo (cursos), herramientas técnicas (4 publicadas + 2 fantasma) y necesita una sección de noticias. La home actual tiene problemas serios (Lorem Ipsum, CTAs rotos, "Sitio en construcción").

## Decisión

**Split en 2 dominios/repos/stacks:**

| Subdominio | Stack | Repo | Hosting |
|---|---|---|---|
| `app.equipargeo.com` | HTML + JS vanilla puro | `equipargeo-tools` | Cloudflare Pages |
| `equipargeo.com` (root) | Astro 5.x + Tailwind | `equipargeo-site` | Cloudflare Pages |

## Razón

### Por qué HTML+JS vanilla para herramientas

- Las herramientas YA son JS vanilla — no hay nada que ganar migrando a framework.
- Cada herramienta debería poder evolucionar independiente (refactor de una no debería implicar reconstruir build pipeline).
- Las herramientas son apps, no contenido — separar concerns.
- PWA-ready trivial desde día 1.

### Por qué Astro para sitio principal

- Markdown nativo para contenido de cursos y noticias.
- Content collections type-safe — schemas validados.
- MDX si se necesita interactividad puntual en posts.
- Performance brutal (cero JS por default).
- Mariano ya conoce Cloudflare Pages (dashboard PWA en `index-mariano.pages.dev`).
- Comunidad grande, mantenido, integraciones (sitemap, RSS, image optimization, SEO).

### Por qué Cloudflare Pages (no Netlify, Vercel, etc.)

- Mariano ya tiene cuenta y workflow ahí.
- Free tier amplio (sin cobros sorpresa por egress).
- Edge global gratuito.
- Cloudflare Web Analytics gratis (cookies-less, complementa Google Tag).
- Workers gratis (suficiente para forms).

## Alternativas evaluadas

| Alternativa | Por qué se descartó |
|---|---|
| Mantener todo en WordPress + Cloudflare delante | El WP rinde bien hoy. Pero la home está rota (Lorem Ipsum, CTAs muertos) y mejorar eso en WP requiere meterse con el theme flixita. Refactor en Astro es más rápido y deja base limpia. |
| Migrar todo a Astro (herramientas incluidas) | Las herramientas son JS vanilla — meterlas dentro de Astro implica reescribir IIFE como componentes Astro/React, sin ganar nada. |
| Headless WordPress + Astro frontend | Mantener WordPress como CMS para Mariano + frontend Astro. Costo: mantener 2 stacks. Beneficio: edición visual de cursos/notas. Trade-off no vale para volumen actual. |
| Webflow / Framer | Lock-in con plataforma, no Git-versionable bien, costo mensual. |
| Next.js / Gatsby / SvelteKit | Mariano no las conoce, mayor curva. Astro es más simple para sitios mostly-static. |

## Consecuencias

- 2 repos a mantener (`equipargeo-tools` + `equipargeo-site`).
- Edición de contenido de cursos/noticias pasa de WP-admin a "editar markdown y hacer git commit". Curva chica para Mariano (ya hace esto en sus otros workspaces).
- Si en algún momento Lisandry/Matías o externos editan contenido, considerar sumar Decap CMS (gratis, UI visual sobre Git). Por ahora no.
- Pulido posterior de herramientas (Fase 8) es trabajo de iteraciones individuales sin afectar el sitio principal.
