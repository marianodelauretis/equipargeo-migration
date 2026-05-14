# Plan migración — Consulta de faja (GNSS)

## Identificación

- **URL actual:** https://equipargeo.com/herramientas-gnss/
- **URL destino:** https://app.equipargeo.com/faja/
- **Carpeta destino:** `repos-target/equipargeo-tools/faja/`
- **Categoría:** (a) JS vanilla custom inline.
- **Tamaño JS:** ~3.3 KB.
- **Tamaño HTML:** ~1.5 KB.
- **Decisión:** Migración trivial. Empezar por esta para validar el flujo end-to-end.

## Funcionalidad

Determina si conviene usar una faja local en función de la ubicación geográfica del usuario (dentro de ±1° del meridiano central de una faja 1-7 de POSGAR07). Usa `navigator.geolocation` o entrada manual de lat/lon.

## Componentes detectados (del reporte de Chrome)

- Contenedor: `<section id="faja-local-tool">` con `div.wrap`, `h2`, `p.sub`, `div.actions` con 3 botones, y 5 `div` de output.
- Botones: `#btnUbicacion`, `#btnAnalizar`, `#btnUsarManual`.
- Outputs: `#faja_coordenadas`, `#faja_detalle`, `#faja_error`, `#faja_resultado`, `#faja_sugerencia`.
- JS: 1 IIFE con funciones `toDMS, toDMSabs, reset, obtenerUbicacion, usarManual, analizar`.
- API browser usada: `navigator.geolocation.getCurrentPosition` (requiere HTTPS — Cloudflare Pages OK).
- Sin red externa, sin librerías.

## Pasos de migración

### 1. Bajar el HTML crudo

```bash
curl -sL "https://equipargeo.com/herramientas-gnss/" -o "/tmp/faja-raw.html"
```

O en su defecto, copiar el HTML desde el editor de WP.

### 2. Extraer las 3 piezas

- **HTML:** copiar todo el `<section id="faja-local-tool">...</section>` íntegro.
- **CSS:** copiar el `<style>` que tenga selectores `#faja-local-tool` o `.wrap .actions` (scoped al tool).
- **JS:** copiar el `<script>` con el IIFE que define `obtenerUbicacion / analizar / usarManual`.

### 3. Armar el `index.html` standalone

Estructura mínima:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consulta de faja — EQUIPAR</title>
  <meta name="description" content="Determiná si conviene usar una faja local para tu trabajo GNSS según tu ubicación. Herramienta gratuita de EQUIPAR.">
  <link rel="canonical" href="https://app.equipargeo.com/faja/">

  <!-- PWA -->
  <link rel="manifest" href="/shared/manifest.json">
  <meta name="theme-color" content="#0E2841">

  <!-- Open Graph -->
  <meta property="og:title" content="Consulta de faja — EQUIPAR">
  <meta property="og:description" content="Determiná si conviene usar una faja local para tu trabajo GNSS.">
  <meta property="og:type" content="website">

  <!-- CSS común -->
  <link rel="stylesheet" href="/shared/base.css">

  <!-- CSS específico de la herramienta -->
  <style>
    /* PEGAR ACÁ el <style> scoped a #faja-local-tool */
  </style>

  <!-- Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=GT-NNQ4JFFT"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GT-NNQ4JFFT');
  </script>
</head>
<body>
  <header>
    <a href="/">← Herramientas EQUIPAR</a>
  </header>

  <main>
    <!-- PEGAR ACÁ el <section id="faja-local-tool">...</section> -->
  </main>

  <footer>
    <p>EQUIPAR · <a href="https://equipargeo.com">equipargeo.com</a></p>
  </footer>

  <!-- JS de la herramienta -->
  <script>
    /* PEGAR ACÁ el IIFE de la herramienta */
  </script>
</body>
</html>
```

### 4. Verificar funcionamiento local

```bash
cd repos-target/equipargeo-tools/faja/
python -m http.server 8000
# o
npx serve .
```

Abrir `http://localhost:8000/` (o el puerto que sea), probar:
- Botón "Obtener mi ubicación" pide permiso (esperado).
- Si se concede, calcula faja correctamente.
- Botón "Usar manual" permite ingresar lat/lon a mano.
- Botón "Analizar" devuelve resultado correcto.

### 5. Commit

```bash
git add repos-target/equipargeo-tools/faja/
git commit -m "feat(faja): migrar herramienta Consulta de faja a HTML estático standalone"
```

## Criterios de aceptación

- [ ] Funciona idéntica al original en `equipargeo.com/herramientas-gnss/`.
- [ ] No carga `jquery.min.js`, `bootstrap.min.js`, `owl.carousel.min.js`, `wow.min.js`, `custom.js` ni Font Awesome del theme.
- [ ] `navigator.geolocation` funciona en HTTPS (validar al deploy).
- [ ] El HTML pesa < 20KB total (incluyendo HTML + CSS + JS).
- [ ] Lighthouse Performance > 95.

## Notas

- Esta es la herramienta más simple. Si esta no funciona, no avanzar a las otras.
- Útil para validar shell HTML compartido (`shared/base.css`) que se reusará en las 5 restantes.
