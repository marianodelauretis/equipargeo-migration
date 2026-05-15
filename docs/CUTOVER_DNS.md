# Cutover DNS de equipargeo.com

Plan paso a paso para mover el dominio `equipargeo.com` desde el hosting actual (WordPress en Webnode / otro proveedor) al nuevo setup en Cloudflare Pages.

## Pre-requisitos

- [ ] Ambos proyectos de Cloudflare Pages deployados y funcionando en sus URLs temporales (`*.pages.dev`)
- [ ] Validación completa hecha en `equipargeo-site.pages.dev` y `equipargeo-tools.pages.dev`
- [ ] Marcadores `<!-- COMPLETAR -->` revisados y editados a mano (precios, fechas, contenido de notas)
- [ ] Backup del WordPress actual: export de contenido, base de datos, archivos uploadeados
- [ ] Acceso al panel del proveedor DNS actual

## Estrategia

Para minimizar downtime y riesgo:

1. Bajar el TTL del dominio actual a 5 minutos **48 horas antes** del cutover (para que los cambios DNS se propaguen rápido cuando los hagas)
2. Hacer el cutover en horario de bajo tráfico (madrugada, fin de semana)
3. Mantener el sitio WordPress accesible en una URL temporal por **48 horas más** después del cutover, por si hay que rollback

## Paso 1 — Pre-cutover (48 hs antes)

### En el proveedor DNS actual de equipargeo.com

1. Acceder al panel DNS
2. Bajar el TTL del registro A o CNAME que apunta al hosting actual de 24 hs (3600 o 86400) a **300 segundos (5 minutos)**
3. Guardar y esperar 24-48 hs para que los caches DNS del mundo recojan el TTL nuevo

### Backup completo del WordPress

1. Exportar contenido (Tools → Export en WP admin)
2. Backup de base de datos (si tenés acceso al panel del hosting)
3. Backup de uploads (carpeta `/wp-content/uploads/`)
4. Guardar todo en un zip en `C:\Users\agrim\OneDrive\BACKUPS\equipargeo-pre-migration-AAAAMMDD.zip`

## Paso 2 — Cutover (ventana de 30 minutos)

### En Cloudflare

1. Verificar que ambos proyectos están deployados y up-to-date:
   - `equipargeo-tools.pages.dev` accesible y funcionando
   - `equipargeo-site.pages.dev` accesible y funcionando

2. Si el dominio `equipargeo.com` **no está aún en Cloudflare**:
   - Cloudflare dashboard → **Add a site** → ingresar `equipargeo.com`
   - Cloudflare escanea los DNS records actuales y los pre-carga
   - Te da 2 nameservers de Cloudflare (ej: `xxxx.ns.cloudflare.com`)
   - **Anotarlos** — los vas a necesitar en el paso siguiente

3. En el proyecto Cloudflare Pages `equipargeo-site`:
   - Custom domains → Add `equipargeo.com`
   - Custom domains → Add `www.equipargeo.com`

4. En el proyecto Cloudflare Pages `equipargeo-tools`:
   - Custom domains → Add `app.equipargeo.com`

### En el proveedor DNS actual (registrar del dominio)

Si vas a mantener el registro del dominio donde está pero solo mover los nameservers:

1. Acceder al panel del registrar
2. Cambiar los **nameservers** de los actuales a los 2 que te dio Cloudflare
3. Guardar

Si vas a transferir el dominio entero a Cloudflare (opcional, no urgente):
- Eso se puede hacer después del cutover sin urgencia, solo cambia quién factura el renew anual

### Propagación

El cambio de nameservers tarda 5-30 minutos en propagarse (con TTL bajado previamente). Para chequear:

```bash
# Linux/Mac/WSL
dig equipargeo.com NS

# Windows PowerShell
nslookup -type=ns equipargeo.com
```

Debería mostrar los nameservers de Cloudflare. Si todavía muestra los viejos, esperar 10 min y reintentar.

## Paso 3 — Validación post-cutover

Una vez que el DNS propagó:

- [ ] `https://equipargeo.com` carga el sitio nuevo Astro (no el WP viejo)
- [ ] `https://www.equipargeo.com` redirige a `https://equipargeo.com`
- [ ] `https://app.equipargeo.com` carga la landing de herramientas
- [ ] `https://equipargeo.com/cursos/gnss/` carga el programa GNSS
- [ ] `https://equipargeo.com/cursos/gnss-modulo-1/` carga el módulo 1
- [ ] `https://equipargeo.com/programa-completo-curso-gnss/` redirige a `/cursos/gnss/` con 301
- [ ] `https://equipargeo.com/conversor-coordenadas/` redirige a `app.equipargeo.com/posgar07/`
- [ ] Certificate SSL válido en ambos dominios (Cloudflare lo emite automático)
- [ ] No hay errores en la consola del browser
- [ ] El botón de WhatsApp flotante funciona
- [ ] Los Google Forms abren desde `/agenda/`

## Paso 4 — Post-deploy

### Activar Cloudflare Web Analytics

1. Cloudflare dashboard → **Web Analytics** → **Add a site**
2. Elegir `equipargeo.com`
3. No necesita snippet (se activa automático para sitios servidos por CF Pages)

### Submit del sitemap a Google Search Console

1. Crear/usar una propiedad en Google Search Console para `equipargeo.com`
2. Verificar la propiedad (Cloudflare facilita esto agregando un TXT record automático)
3. Submitir `https://equipargeo.com/sitemap-index.xml`
4. Esperar 24-48 hs para que Google empiece a re-crawlear con los redirects nuevos

### Notificar el cambio de URLs

Si tenés clientes/inscriptos que pueden tener bookmarks viejos, opcional mandar un mail anunciando el sitio nuevo con la URL principal sin cambios. No es urgente — los 301 redirects hacen el trabajo silenciosamente.

## Paso 5 — Rollback (si algo sale mal)

Si después del cutover algo no funciona y necesitás volver al WordPress:

1. En el panel del registrar/DNS, volver los **nameservers a los anteriores**
2. Esperar 5-30 minutos para que propague
3. El WP vuelve a estar accesible en `equipargeo.com`
4. Diagnosticar qué falló en el nuevo setup, arreglar, y reintentar cutover

**Por eso es crítico no apagar el WP hasta 48 hs después del cutover exitoso.**

## Paso 6 — Cleanup (después de 1 semana sin incidentes)

- [ ] Apagar/eliminar el hosting WordPress viejo (cancelar Webnode si corresponde)
- [ ] Eliminar backups locales viejos si ocupan mucho espacio (mantener al menos uno por seguridad)
- [ ] Actualizar tarjeta de presentación, firma de email, redes sociales con URLs nuevas (si cambiaron — en este caso no, todas siguen iguales)
- [ ] Actualizar perfiles de Google Business Profile, LinkedIn, etc

## Notas

- Cloudflare emite y renueva certificados SSL automáticamente. No tenés que pagar ni gestionar nada.
- Los redirects 301 son procesados por Cloudflare en el edge, antes de llegar al sitio Astro. Eso significa que son **instantáneos** y no cuentan como pageviews.
- Cloudflare Web Analytics empieza a contar visitas desde el momento que activás, no retroactivo.
