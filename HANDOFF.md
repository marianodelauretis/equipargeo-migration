# HANDOFF — equipargeo-migration

> Estado al 15/05/2026. Migración técnica completada, cutover de DNS programado para mañana.

## Estado del proyecto

- Sitio Astro funcional en `repos-target/equipargeo-site/`.
- Tools standalone en `repos-target/equipargeo-tools/`.
- Ambos deployados automáticamente en Cloudflare Pages desde `main`.
- Build limpio: 20 páginas, 0 errores, 0 warnings funcionales.

## Próximo paso operativo

**Cutover de DNS — 16/05/2026.** Cambiar nameservers en DonWeb apuntando a Cloudflare. Propagación típica entre 5 minutos y 4 horas.

Después del cutover:
1. Verificar `https://equipargeo.com/` en incognito desde varias redes.
2. Probar redirects de URLs viejas: `/capacitaciones`, `/curso-gnss-modulo-1`, `/conversor-a-dxf`, `/asesoria-tecnica`.
3. Confirmar que `app.equipargeo.com` resuelva al sitio de tools.

## Pendientes post-cutover

Por orden de prioridad:

1. **Plan editorial — Notas técnicas.** Primera publicación: semana del 18/05/2026. Calendario: 1 nota por semana, alternando argumentativas y educativas neutrales. Las 3 notas placeholder están en `repos-target/equipargeo-site/src/content/noticias/` con `publicada: false`.
2. **Imágenes:** foto-banco propio del rubro + abstractos con Higgsfield. Integración con `astro:assets`.
3. **Refactor URLs hardcodeadas de tools:** 14 ocurrencias de `equipargeo-tools.pages.dev` a reemplazar por env var `PUBLIC_TOOLS_URL`.
4. **Auditoría de tools** individualmente (POSGAR07, Faja, Puntos intermedios, CSV→DXF): copy, UX, responsive.

## Cómo se trabaja

- Branch principal: `main`. Push dispara deploy automático.
- Cambios menores: directo a main.
- Cambios grandes (refactors, features): branch separada.
- Reportes operativos en `docs/audit/`.
- Decisiones técnicas en `decisiones/` (formato ADR).

## Documentación relacionada

- `README.md` — overview del repo y stack.
- `docs/audit/REPORT.md` — auditoría pre-cutover detallada.
- `docs/audit/INVENTORY.md` — inventario inicial del repo.
- `docs/audit/DATOS-CURSOS.json` — precios extraídos del WP, fuente de verdad.
- `docs/audit/COPY-REVIEW.md` — frases prohibidas y normas de copy.
- `decisiones/*.md` — decisiones técnicas del proceso.
