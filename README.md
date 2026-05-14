# equipargeo-migration

Proyecto de migración de equipargeo.com desde WordPress (theme flixita + child britely) a una arquitectura split en Cloudflare Pages.

## Arquitectura objetivo

- **`app.equipargeo.com`** — subdomain de herramientas técnicas (6 apps estáticas HTML+JS vanilla, instalables como PWA).
- **`equipargeo.com`** (root) — sitio principal en Astro con home, cursos, asesoría, agenda, contacto y sección de noticias/novedades de instrumental.

## Stack

| Capa | Stack | Razón |
|---|---|---|
| Herramientas | HTML + JS vanilla puro | Las herramientas ya están en JS vanilla, no hay nada que ganar con framework. |
| Sitio principal | Astro 5.x + Tailwind | Content collections para noticias, MDX si se necesita, perfomance brutal por default. |
| Hosting ambos | Cloudflare Pages | Free tier amplio, autodeploy desde Git, edge global. |
| Analytics | Google Tag `GT-NNQ4JFFT` + Cloudflare Web Analytics (paralelo) | Mantener tracking actual + cookies-less complementario. |

## Estructura del repo

- `auditoria/` — punto cero del proyecto. Reporte técnico de Chrome con estado del sitio actual. Inmutable.
- `plan/` — planes de migración (general, por herramienta, sitio principal, sección noticias, fase pulido).
- `decisiones/` — registro append-only de decisiones arquitectónicas tomadas.
- `repos-target/equipargeo-tools/` — scaffold del repo destino de herramientas (subdominio `app.equipargeo.com`).
- `repos-target/equipargeo-site/` — placeholder del repo destino del sitio principal (Astro, scaffold en otra sesión).

## Fases

1. **Fase 1 — Cloudflare delante de WP actual** (1 hora). Ganancia: SSL, HTTP/3, Brotli, protección DDoS, métricas. Riesgo cero, reversible. *No urgente — el sitio actual ya rinde bien.*
2. **Fase 2 — Migración de 6 herramientas a `app.equipargeo.com`** (2 fines de semana). Migrar tal cual están, sin refactorizar.
3. **Fase 3 — Setup Astro + home nueva + layouts** (1 fin de semana).
4. **Fase 4 — Páginas de cursos** (1-2 fines de semana). Solo copiar contenido a markdown, layouts ya están.
5. **Fase 5 — Sección noticias** (1 fin de semana). Content collection + primeras 3-5 notas piloto.
6. **Fase 6 — Forms, analytics, 301 redirects, SEO** (1 fin de semana). Lo más delicado.
7. **Fase 7 — Cutover final** (1 día). Switch de DNS, monitoreo.
8. **Fase 8 (futuro, no urgente) — Pulido de herramientas**: refactor, eliminación de cross-page bleed, mejoras de UX, conversión a Lit/Web Components si se quiere.

## Cómo retomar

Leer `HANDOFF.md`.

## Convenciones

- Conventional Commits en español.
- No pushear sin revisión manual.
- Mantener la auditoría base inmutable.

---

**Última actualización:** 2026-05-14
**Proyecto técnico hermano (ya cerrado):** `C:\Users\agrim\GitHub\axioma-ads-audit\`
**Workspace de gestión:** `C:\Users\agrim\GitHub\mariano-workspace\` (integración pendiente en otra sesión).
