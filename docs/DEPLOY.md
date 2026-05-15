# Deploy a Cloudflare Pages

Esta guía cubre el setup de los dos proyectos de Cloudflare Pages que sirven el dominio `equipargeo.com` y el subdominio `app.equipargeo.com` desde el mismo repo `equipargeo-migration`.

## Arquitectura

- **Repo único en GitHub:** `marianodelauretis/equipargeo-migration`
- **Dos proyectos en Cloudflare Pages**, cada uno con root directory distinto:
  - **Proyecto A** sirve `app.equipargeo.com` (las 4 herramientas standalone, sin build)
  - **Proyecto B** sirve `equipargeo.com` (Astro con build)

## Proyecto A — `app.equipargeo.com` (herramientas)

Sirve archivos HTML+JS+CSS directos, sin build.

### Setup en Cloudflare Pages

1. Dashboard de Cloudflare → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Conectar la cuenta de GitHub y elegir el repo `equipargeo-migration`
3. **Project name:** `equipargeo-tools`
4. **Production branch:** `main`
5. **Build settings:**
   - Framework preset: `None`
   - **Build command:** (vacío — no requiere build)
   - **Build output directory:** `repos-target/equipargeo-tools`
   - **Root directory (advanced):** dejar vacío
6. **Save and Deploy**

### Custom domain

Una vez que el primer deploy completó:

1. En el proyecto → **Custom domains** → **Set up a custom domain**
2. Agregar `app.equipargeo.com`
3. Cloudflare detecta si el DNS del dominio está en Cloudflare. Si está, agrega el CNAME automáticamente. Si no, te muestra qué CNAME hay que crear en tu proveedor DNS actual.

### Validar

Después del deploy, abrir `https://equipargeo-tools.pages.dev` (URL temporal de Cloudflare) y verificar:
- Landing en `/`
- Cada herramienta en `/posgar07/`, `/faja/`, `/puntos-intermedios/`, `/conversor-dxf/`

## Proyecto B — `equipargeo.com` (sitio Astro)

Sirve el sitio Astro builded.

### Setup en Cloudflare Pages

1. Dashboard de Cloudflare → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Conectar el repo `equipargeo-migration` (ya está conectado del Proyecto A)
3. **Project name:** `equipargeo-site`
4. **Production branch:** `main`
5. **Build settings:**
   - Framework preset: `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `repos-target/equipargeo-site/dist`
   - **Root directory (advanced):** `repos-target/equipargeo-site`
6. **Environment variables:**
   - `NODE_VERSION` = `20.11.0`
   - `NPM_VERSION` = `10`
7. **Save and Deploy**

### Custom domain

1. En el proyecto → **Custom domains** → **Set up a custom domain**
2. Agregar `equipargeo.com` (apex)
3. Agregar también `www.equipargeo.com` y configurar redirect a apex (en Cloudflare DNS, no en `_redirects`)

### Validar

Después del primer deploy, abrir `https://equipargeo-site.pages.dev` y verificar:
- Home en `/`
- Cursos en `/cursos/` y rutas dinámicas (`/cursos/gnss/`, etc — total 12)
- Noticias en `/noticias/` y rutas dinámicas (3 notas)
- Páginas auxiliares: `/sobre/`, `/asesoria/`, `/agenda/`, `/contacto/`, `/404/`
- Redirects de URLs viejas (probar al menos 3-4 a mano)
- Cabecera de cache correcta (Network tab del browser → ver `Cache-Control`)

## Re-deploys

Cualquier `git push` a `main` dispara un build automático en ambos proyectos. Cloudflare Pages detecta cambios en el subdirectorio correspondiente y solo rebuildea ese proyecto. Si tocás solo herramientas, solo rebuilea `equipargeo-tools`; si tocás solo el sitio Astro, solo `equipargeo-site`.

## Costos

Cloudflare Pages tiene tier gratuito que cubre lo que necesitamos:
- 500 builds/mes (más que suficiente)
- Bandwidth ilimitado
- 100 custom domains
- Sin límite de páginas estáticas

Si en algún momento se llega al límite de builds, el tier pago arranca en USD 5/mes.

## Web Analytics

Una vez deployado, activar **Cloudflare Web Analytics** (gratis, sin cookies):

1. Dashboard → **Web Analytics** → **Add a site**
2. Elegir `equipargeo.com`
3. **No agregar el snippet manualmente** — para sitios servidos por Cloudflare Pages, las analíticas se activan automáticamente sin tocar código

Para tracking más avanzado (eventos custom, conversiones, integración Google Ads) más adelante, activar el bloque GTM en `BaseLayout.astro` (ya está dejado como comentario, solo descomentar y poner el container ID real).
