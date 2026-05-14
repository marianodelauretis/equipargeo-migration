---
tipo: handoff
proyecto: equipargeo-migration
sprint: scaffold-inicial
estado: scaffold-creado
ultimo_cambio: 2026-05-14
tags:
  - equipargeo
  - migracion
  - cloudflare-pages
  - astro
---

# HANDOFF — equipargeo-migration

## Estado actual

**Fase:** Scaffold inicial creado. Pre-Fase 1.

## Lo que ya está hecho

1. Auditoría técnica completa con Claude for Chrome de las 4 herramientas operativas + 2 fantasma detectadas (Verificador ISO Ángulos + TIN/Curvas de nivel) — ver `auditoria/2026-05-14_chrome_audit_equipargeo.md`.
2. Plan de migración por fases documentado en `plan/`.
3. Decisiones arquitectónicas registradas en `decisiones/`.
4. Scaffold inicial del repo target `equipargeo-tools/` creado en `repos-target/`.

## Lo que viene

### Inmediato (próxima sesión)

**Fase 2 — Migrar las 6 herramientas a Cloudflare Pages.** El plan está en `plan/herramienta_*.md`. Orden recomendado por complejidad ascendente:

1. Consulta de faja (3.3 KB JS) — *prueba de concepto del flujo*
2. Conversor POSGAR07 (7.3 KB JS)
3. Generador puntos intermedios (7.8 KB JS, canvas)
4. Conversor CSV→DXF (18.4 KB JS, FileReader + canvas + DXF)
5. Verificador ISO Ángulos (21 KB JS, fantasma)
6. TIN/Curvas de nivel (18 KB JS, fantasma — la más rica)

**Pasos operativos por herramienta:**
- Bajar el HTML crudo de la página WP (usar `curl` o copiar desde editor WP).
- Extraer el `<section>` de la herramienta + su `<script>` IIFE + sus `<style>` inline.
- Pegar en `repos-target/equipargeo-tools/<slug>/index.html` con shell HTML mínimo.
- Verificar que funciona localmente (`python -m http.server` o `npx serve`).
- Commit en este repo (`equipargeo-migration`) con el HTML migrado.

### Medio plazo

- Fase 3-7: ver `README.md` para fases completas.
- Integración con `mariano-workspace` (siguiendo patrón axioma-ads): crear `proyectos/equipargeo/` con HANDOFF stub + DECISIONS + WORKLOG + entrada en INDEX. **Esto va en otra sesión separada.**

### Largo plazo / pendiente

- Cuando el subdominio `app.equipargeo.com` esté funcionando, crear el repo independiente `equipargeo-tools` en GitHub a partir de `repos-target/equipargeo-tools/`.
- Cuando el sitio principal esté listo, crear el repo `equipargeo-site` a partir de `repos-target/equipargeo-site/`.

## Decisiones pendientes

1. ¿Cloudflare Web Analytics en paralelo a Google Tag, o solo Google Tag? (default propuesto: ambos, sin redundar tracking).
2. ¿Cuenta de Cloudflare donde hostear: la misma del dashboard PWA (`index-mariano.pages.dev`) o cuenta separada para AXIOMA / EQUIPAR? (default propuesto: misma cuenta, proyectos separados).
3. ¿Categorías iniciales para sección Noticias? (propuesta en `plan/seccion_noticias.md`, validar antes de implementar).

## Archivos clave a leer al retomar

1. Este `HANDOFF.md` (punto de entrada).
2. `auditoria/2026-05-14_chrome_audit_equipargeo.md` (estado del sitio actual, inmutable).
3. `plan/plan_general.md` (overview de fases).
4. `plan/herramienta_01_faja.md` (próximo paso operativo).
