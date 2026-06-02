# HANDOFF — equipargeo-migration

> Estado al 02/06/2026. Sitio en producción. Cutover de DNS cerrado.

## Estado del proyecto

- Sitio en producción en `https://equipargeo.com` desde el 02/06/2026.
- 5 herramientas en `https://app.equipargeo.com` (POSGAR07, Faja, Puntos intermedios, Conversor DXF, Caja de herramientas RINEX).
- 1 Cloudflare Pages Function operativa (`/api/brdc` — proxy de efemérides BRDC).
- Sitio Astro: 21 páginas, build limpio, 0 errores.
- Ambos proyectos deployados automáticamente en Cloudflare Pages desde `main`.
- SSL: Google Trust Services (WE1). Always Use HTTPS habilitado.
- Web Analytics: Cloudflare (modo automatic, sin cookies).

## Próximos pasos

### Operativos

1. **Links del header de tools.** Revisar que los links del nav en `equipargeo-tools` apunten correctamente (algunos apuntan al apex en vez de `www`).
2. **Herramientas fantasma.** Decidir si activar `tin-curvas-nivel` y `verificador-angulos` (ya tienen código, faltan en el index de tools). Ver `decisiones/2026-05-14_herramientas_fantasma_activar.md`.
3. **Plan editorial — Notas técnicas.** Las 3 notas placeholder están en `repos-target/equipargeo-site/src/content/noticias/` con `publicada: false`. Calendario: 1 nota por semana, alternando argumentativas y educativas neutrales.
4. **Imágenes.** Foto-banco propio del rubro (salir a sacar 30-50 fotos de campo/gabinete/instrumental). Integración con `astro:assets`.
5. **Refactor URLs hardcodeadas de tools.** 14 ocurrencias de `equipargeo-tools.pages.dev` a reemplazar por env var `PUBLIC_TOOLS_URL`.

### Mejoras futuras para la Caja de herramientas RINEX

1. **Endpoint SP3.** Agregar proxy `/api/sp3` para efemérides precisas IGS (SP3).
2. **Splitter RINEX 3 → RINEX 2.** Conversión de RINEX v3 a v2 por constelación, para compatibilidad con software viejo.

### Dar de baja WordPress

En 2-4 semanas (cuando se confirme que no hay incidentes): dar de baja el plan de hosting WordPress en DonWeb. Solo el hosting — el dominio queda registrado en DonWeb con nameservers apuntando a Cloudflare.

## Cómo se trabaja

- Branch principal: `main`. Push dispara deploy automático.
- Cambios menores: directo a main.
- Cambios grandes (refactors, features): branch separada.
- Reportes operativos en `docs/audit/`.
- Decisiones técnicas en `decisiones/` (formato ADR).
- Decisiones estratégicas del proyecto en el vault `mariano-workspace/proyectos/equipargeo/DECISIONS.md` (D1-D16).

## Documentación relacionada

- `README.md` — overview del repo y stack.
- `docs/DEPLOY.md` — setup de Cloudflare Pages para ambos proyectos.
- `docs/CUTOVER_DNS.md` — procedimiento de cutover (completado 02/06/2026).
- `docs/audit/REPORT.md` — auditoría pre-cutover detallada.
- `docs/audit/INVENTORY.md` — inventario inicial del repo.
- `docs/audit/DATOS-CURSOS.json` — precios extraídos del WP, fuente de verdad.
- `docs/audit/COPY-REVIEW.md` — frases prohibidas y normas de copy.
- `decisiones/*.md` — decisiones técnicas del proceso de migración.
- `docs/historico/BUNDLE_PARA_CLAUDE.md` — bundle del contenido WP usado durante la migración (artefacto histórico).
