# Plan general de migración — equipargeo.com

## Objetivo

Migrar `equipargeo.com` desde WordPress monolítico a arquitectura split en Cloudflare Pages:
- Subdominio `app.equipargeo.com` para las 6 herramientas técnicas (HTML+JS estático)
- Dominio raíz `equipargeo.com` para sitio principal (Astro + sección noticias)

## Restricciones

- No interrumpir el funcionamiento actual del WP durante la migración (mantener vivo hasta cutover).
- Mantener todas las URLs vivas con 301 redirects al hacer switch.
- No perder ranking SEO durante la transición (mismas URLs o redirects correctos).
- Mantener Google Tag `GT-NNQ4JFFT` activo en ambos destinos.
- Conservar Site Kit by Google si es posible (o reconfigurar Search Console + Analytics post-migración).

## Fases

### Fase 1 — Cloudflare delante de WP actual

**Tiempo:** 1 hora.
**Riesgo:** muy bajo, reversible.
**Ganancia:** SSL, HTTP/3, Brotli, DDoS protection, métricas, cache CDN.
**Urgencia:** baja (el sitio ya rinde bien: TTFB 204ms, Load 514ms).

**Pasos:**
1. Crear cuenta Cloudflare (si no existe).
2. Agregar `equipargeo.com` como dominio.
3. Cambiar nameservers en el registrador del dominio a los de Cloudflare.
4. Activar proxy naranja en el record A/CNAME del WP.
5. Configurar cache rules para HTML (TTL bajo) e imágenes (TTL alto).
6. Activar Brotli + Auto Minify.
7. Verificar SSL Universal.
8. Verificar que el sitio sigue funcionando.

**Criterios de aceptación:**
- `https://equipargeo.com` resuelve a través de Cloudflare (verificar con `curl -I` → header `cf-cache-status`).
- WP-admin sigue accesible (sin cache).
- Site Kit / Google Tag siguen reportando.

### Fase 2 — Migrar 6 herramientas a `app.equipargeo.com`

**Tiempo:** 2 fines de semana.
**Detalle:** ver `plan/herramienta_*.md`.

**Output:** repo `equipargeo-tools` corriendo en Cloudflare Pages como `app.equipargeo.com`, con las 6 herramientas funcionando idénticas a hoy pero más rápidas y sin cross-page bleed.

### Fase 3 — Setup Astro + home nueva + layouts

**Tiempo:** 1 fin de semana.
**Detalle:** ver `plan/sitio_principal_astro.md`.

### Fase 4 — Páginas de cursos

**Tiempo:** 1-2 fines de semana.
**Páginas a migrar:**
- Programa completo Curso GNSS (overview)
- Módulo 1 GNSS - Fundamentos y Teoría
- Módulo 2 GNSS - RTK Configuración y Obra
- Módulo 3 GNSS - Post-proceso Profesional
- Programa completo Topografía (overview)
- Módulo 1 Topografía Básica
- Módulo 2 Nivelación
- Módulo 3 Estación Total
- Programa completo Fotogrametría (overview)
- Módulo 1 Manejo Básico de Drones
- Módulo 2 Captura de Datos y Fotogrametría Aplicada
- Módulo 3 Procesamiento y Productos Avanzados

12 páginas. Copy del texto a markdown, sin replicar el diseño actual.

### Fase 5 — Sección noticias

**Tiempo:** 1 fin de semana.
**Detalle:** ver `plan/seccion_noticias.md`.

### Fase 6 — Forms, analytics, 301 redirects, SEO

**Tiempo:** 1 fin de semana.
**Tareas:**
- Forms de contacto + agenda (Cloudflare Workers / Formspree / Web3Forms).
- Reconfigurar Google Tag para nuevo sitio.
- Mapa de 301 redirects exhaustivo (todas las URLs viejas → nuevas).
- Schema markup `Course` para cursos.
- Sitemap, robots, RSS feed para noticias.
- Open Graph + Twitter Cards.

### Fase 7 — Cutover final

**Tiempo:** 1 día.
**Tareas:**
- Cambiar DNS de `equipargeo.com` para apuntar al nuevo sitio Astro en Pages.
- Cambiar DNS de `app.equipargeo.com` (ya hecho en Fase 2).
- Monitorear analítica las 48hs siguientes.
- Mantener WP encendido como backup 30 días, después archivar.

### Fase 8 (futuro, no urgente) — Pulido de herramientas

**Detalle:** ver `plan/fase_pulido_herramientas.md`.

## Estimación total

5-7 fines de semana de trabajo concentrado, distribuido en 2-3 meses en paralelo con otros proyectos.
