# DECISIONS — equipargeo (estrategicas)

> Registro append-only de decisiones estrategicas del proyecto EQUIPAR (D1-D21).
> Migrado del vault `mariano-workspace/proyectos/equipargeo/` el 2026-06-12; el stub del vault apunta aca.
> Los ADR tecnicos puntuales del proceso de migracion viven en `decisiones/*.md` (formato un-archivo-por-decision).
> Este archivo es la fuente de verdad para decisiones estrategicas; nuevas entradas se agregan abajo.

Registro append-only de decisiones estratégicas. Una entrada por decisión.

---

## 2026-05-14 — Decisiones técnicas iniciales de la migración

> Sesión de planificación arquitectónica previa al desarrollo. 11 decisiones documentadas que definen el stack y patrones del proyecto.

### D1 — Arquitectura split (sitio principal + subdomain de tools)

**Decisión:** Separar las 4 herramientas en `app.equipargeo.com` (HTML+JS vanilla) del sitio principal en `equipargeo.com` (Astro).

**Por qué:**
- Las herramientas no necesitan build, son standalone y funcionan offline
- Permite cache agresivo (immutable) sobre las tools sin afectar el deploy del sitio
- Separación cognitiva: marketing/contenido vs aplicación
- Facilita el día que las tools migren a PWA con service worker

**Alternativas descartadas:**
- Todo en Astro (sobre-ingeniería para 4 herramientas que ya son JS puro)
- Iframe de tools dentro del sitio principal (peor UX, peor cache)

### D2 — Astro 5 sobre Next.js, Eleventy o WordPress headless

**Decisión:** Astro 5 + Tailwind + MDX para el sitio principal.

**Por qué:**
- Static site generation con islands architecture: cero JS por defecto, hidratación selectiva
- Build extremadamente rápido (23 páginas en ~2s)
- Type-safe content collections con Zod schemas
- MDX permite embeds en notas técnicas sin friction
- Tailwind para no escribir CSS desde cero pero tener libertad de diseño

**Alternativas descartadas:**
- WordPress headless: agrega complejidad sin beneficio para este volumen
- Next.js: overkill para sitio estático, requiere Node runtime
- Eleventy: menos type-safety y tooling más viejo
- Hugo: Go templates más rígidos que JSX/Astro

### D3 — Cloudflare Pages como hosting

**Decisión:** Cloudflare Pages para ambos sitios.

**Por qué:**
- Tier gratuito cubre lo que necesitamos (500 builds/mes, bandwidth ilimitado)
- CDN global incluido, sin config extra
- SSL automático
- Web Analytics gratuito sin cookies (no requiere banner de cookies)
- Deploy automático on `git push`
- `_redirects` y `_headers` con sintaxis familiar (similar Netlify)

**Alternativas descartadas:**
- Netlify: similar pero costos de bandwidth más altos a escala
- Vercel: enfocado en Next.js, menos óptimo para Astro estático
- GitHub Pages: sin redirects ni headers customs

### D4 — Mono-repo vs dos repos separados

**Decisión:** Mono-repo `equipargeo-migration` con 2 proyectos de Cloudflare Pages apuntando a subdirectorios diferentes.

**Por qué:**
- Cero trabajo extra de setup (ya estaba todo en una carpeta)
- Las decisiones técnicas y el roadmap se mantienen juntos
- Cloudflare Pages soporta nativamente apuntar a `root directory` distinto del repo root
- Cada proyecto solo rebuilea si cambia su subdirectorio

### D5 — Google Forms vía link, no iframe

**Decisión:** En `/agenda/`, las 3 cards de cursos linkean a `forms.gle/<id>` en nueva pestaña, NO iframe embebido.

**Por qué (decisión temporal):**
- Las URLs embed de Google Forms requieren generación desde el panel del propietario del form
- Los short URLs funcionan perfecto y se abren en una pestaña nueva
- Cuando se obtengan las URLs embed reales, basta reemplazar 3 constantes en `agenda.astro`

### D6 — Newsletter pospuesto, no integrado

**Decisión:** Componente `Newsletter.astro` renderiza placeholder "Próximamente" sin form activo.

**Por qué:**
- Sin MailerLite configurado
- Sin 3-5 notas mínimas publicadas, un newsletter no tiene contenido recurrente
- Mejor no tener form que tener form que no sirve

### D7 — Frontmatter con marcadores `<!-- COMPLETAR -->`

**Decisión:** Los 12 cursos y las 3 notas tienen marcadores `<!-- COMPLETAR -->` en datos sensibles que Mariano debe validar antes del go-live.

**Por qué:**
- Generar contenido inferido completo sin marcar lo que es asunción crea riesgo de error en producción
- Los marcadores son fáciles de buscar (`grep -r COMPLETAR src/content/`)

### D8 — GTM placeholder comentado, Cloudflare Web Analytics primero

**Decisión:** GTM se deja como snippet comentado en `BaseLayout.astro`. Post-cutover se activa CF Web Analytics primero (sin tocar código).

**Por qué:**
- CF Web Analytics es gratis, sin cookies, no requiere banner
- GTM se activa cuando se quiera integrar Google Ads o conversiones

### D9 — `_redirects` exhaustivo con 410 para paths WP

**Decisión:** Paths típicos de WordPress (`/wp-admin/*`, `/xmlrpc.php`, `/wp-json/*`, etc) devuelven 410 (Gone) en lugar de 404.

**Por qué:**
- 410 le dice a Google "esta URL no va a volver", deindexa más rápido
- Reduce ruido en Search Console
- Bots de exploración dejan de reintentar más rápido

### D10 — Filtro argentino-técnico para copy

**Decisión:** Todo copy se redacta evitando lenguaje marketinero/IA y usando concreto argentino técnico.

**Cosas a evitar:** "profesionales del territorio", "capacitación integral", "100% práctico", "la puerta de entrada"
**Cosas a usar:** nombres directos (agrimensores, topógrafos), términos del oficio (obra, gabinete, mensura, replanteo)

**Estado:** El copy del scaffold tiene contagio del problema. Se pule manualmente antes del cutover.

### D11 — WhatsApp +54 9 11 5572-2266 conservado

**Decisión:** Mantener el mismo número WhatsApp que estaba en el WP.

**Por qué:** Es el canal principal de contacto, tiene historial y está difundido.

---

## 2026-05-15 — Auditoría pre-cutover y pulido estético

> Decisiones consolidadas de la sesión de auditoría pre-cutover. Detalle completo en `HANDOFF.md`.

**Resumen de decisiones tomadas en esta sesión:**

- **EQUIPAR independiente de AXIOMA.** No mencionar el estudio, matrículas ni nombres propios en el sitio. EQUIPAR se posiciona neutral.
- **Estrategia editorial — Notas técnicas.** Sesgo sutil contra "primera marca = excelencia automática". Mencionar varias alternativas (STEC, CHCNAV, Stonex, Hi-Target, South, Emlid), no solo una. Calendario alternado (argumentativa/educativa neutral). Empezar con checklist 2026.
- **Imágenes IA — Higgsfield SÍ para conceptual/atmosférico, NO para fotos del rubro técnico.** Público experto detecta IA generation de equipo. Fotos realistas de receptor/estación total/software = foto propia siempre.
- **Precios públicos en sitio.** 3 niveles (general / Comunidad EQUIPAR 75% OFF / +Asesoría), en ARS y USD. Programas completos = suma de módulos.
- **Filtro de copy.** Frases prohibidas enumeradas: profesionales del territorio, soluciones a medida, capacitación integral, transformar tu perfil, 100% práctico, experiencias transformadoras, potenciar tu carrera, llevar tu trabajo al siguiente nivel, Receivers, in-company.
- **CTAs específicos.** "Ver cursos" → "Ver cursos y precios". "Pedir asesoría" → "Consultar por proyecto técnico". Pattern: CTAs deben anunciar la acción concreta, no genéricos.
- **Estructura del sitio:** cards de módulo profesionales (componente ModuloCard.astro). Bloque CTA prominente al pie de cada curso (componente CtaCurso.astro). Cero emojis decorativos.

---

## 2026-06-01 — Integración RINEX, migración STEC y cutover de DNS

> Sesión doble: integración de herramienta RINEX al subdomain de tools, migración de la landing STEC del WordPress viejo al sitio Astro, y cierre del cutover de DNS.

### D12 — Herramienta RINEX como 5a tool en app.equipargeo.com

**Decisión:** Integrar la Caja de herramientas RINEX como vanilla HTML+JS en `app.equipargeo.com/rinex/`, siguiendo el patrón de las 4 tools existentes. Primera Cloudflare Pages Function del proyecto (`functions/api/brdc.js`).

**Por qué:**
- Mantiene consistencia con las demás tools (HTML standalone, sin framework)
- Reutiliza `shared/base.css` y el sistema de diseño existente (paleta `--eg-*`, topbar, footer)
- La Pages Function permite descargar efemérides BRDC de BKG sin exponer al usuario a CORS ni a descompresión manual de .gz

**Alternativas descartadas:**
- Integrar al sitio Astro principal: rompe la arquitectura split (D1), las tools son vanilla
- Mantener la estética provisoria (grafito+verde, Google Fonts): inconsistente con el resto del sitio

### D13 — Página STEC migrada a /stec/ sin password protection

**Decisión:** Crear `/stec/` como landing dedicada en el sitio Astro, con contenido público (sin password), separada de `/agenda/`.

**Por qué:**
- `/agenda/` sirve los formularios de inscripción a los 3 programas de cursos (GNSS, Topografía, Fotogrametría); STEC es un producto/servicio distinto con su propio calendario de Google Appointments
- La página original en WP estaba protegida por contraseña (`post_password`), lo que impedía indexación y generaba fricción innecesaria — el contenido no es confidencial
- La extracción del 14/05 capturó solo el form de login, no el contenido real; se reconstruyó desde los datos extraídos por Claude for Chrome

**Alternativas descartadas:**
- `/agenda-stec/`: prefijo `agenda-` sugiere que es una subpágina de `/agenda/`, confunde la IA
- `/capacitacion-stec/`: demasiado largo, no sigue el patrón corto del sitio (`/asesoria/`, `/sobre/`, `/cursos/`)
- `/agenda-tu-curso/` idéntico al WP: arrastra el slug viejo y la asociación con la protección por password

### D14 — Reactivación de Custom Domains vía dashboard de CF Pages

**Decisión:** Reactivar Custom Domains (`equipargeo.com`, `www.equipargeo.com`, `app.equipargeo.com`) desde el dashboard de Cloudflare Pages usando el flujo "Reactivate → Check DNS records", no vía API.

**Por qué:**
- La API PATCH para Custom Domains devuelve 403 por protección CSRF
- El flujo del dashboard funciona correctamente y valida los registros DNS en tiempo real
- No hay necesidad de automatizar esto: es una operación one-time post-cutover

### D15 — Email del dominio no operacional, MX preservados por completitud

**Decisión:** Los registros MX del dominio `equipargeo.com` se preservan en Cloudflare DNS pero el email del dominio no está operativo ni se usa.

**Por qué:**
- El canal principal de contacto es `equipargeo@gmail.com` (Gmail directo)
- Los MX apuntan a la config anterior de DonWeb; no se usa email con el dominio
- Eliminarlos no aporta nada; preservarlos evita sorpresas si en algún momento se decide activar email con dominio propio

### D16 — Config root_dir de CF Pages en mono-repos debe apuntar al subdirectorio del proyecto

**Decisión:** En la config de Cloudflare Pages para `equipargeo-tools`, el `root_dir` (Build settings → Root directory) debe apuntar a `repos-target/equipargeo-tools/` para que el framework detecte la carpeta `functions/` y compile las Pages Functions.

**Por qué:**
- Con root en la raíz del mono-repo, CF Pages no encuentra `functions/` y la ruta `/api/brdc` devuelve 404
- Con root apuntando al subdirectorio del proyecto Pages, el build detecta `functions/api/brdc.js` automáticamente
- Patrón aplicable a futuros proyectos CF Pages en mono-repos

**Estado:** Configurado y validado. Documentar como lección aprendida para el site principal si alguna vez necesita Functions.

---

## 2026-06-04 Decisiones

### D17 — Bug histórico FN_SUR identificado y fixeado
La convención POSGAR07 argentina es lat_0=-90° (polo sur), no
lat_0=0° (ecuador). FN_SUR correcto = -M(-90°) = a·A0·π/2 con
GRS80 ≈ 10001965.729m. Validado contra TBC, otro software y
pyproj con precisión sub-milimétrica.

### D18 — Consolidar POSGAR07 vieja en Lat/Lon a DXF
La tool nueva cubre todo el caso de uso de la vieja + batch + DXF
+ DMS + canvas + mapa. POSGAR07 vieja eliminada con redirect 301
a /lat-lon-dxf/.

### D19 — Renombrar tool a "Conversor POSGAR07"
Reusa el nombre histórico que la gente buscaba. URL se mantiene
/lat-lon-dxf/ por SEO ya indexado. Coherente con sobre.astro y
meta-descriptions del sitio.

### D20 — Convención de copy del sitio
Castellano técnico argentino con voseo. Sin anglicismos cuando hay
equivalente claro (input→entrada, preview→vista previa, click→clic,
pan→desplazá, etc). Cardinales en español (O en lugar de W en
textos visibles, aunque el parser DMS sigue aceptando W).

### D21 — Conversor POSGAR07 reemplaza POSGAR07 viejo en home
En HerramientasFeatured.astro, la card de POSGAR07 vieja queda
reemplazada por la nueva. Grid sigue siendo de 4 columnas
(Conversor POSGAR07, Consulta de faja, Puntos intermedios,
CSV → DXF). RINEX no destacado en home, accesible desde index de
tools.

---

Próximas decisiones se agregan abajo con formato:

## YYYY-MM-DD — Título breve

**Decisión:** qué se decidió
**Alternativas evaluadas:** A vs B vs C
**Razón:** por qué se eligió eso
**Consecuencias:** qué cambia
