# equipargeo-tools

Herramientas técnicas de EQUIPAR como apps estáticas HTML+JS vanilla.

**Producción:** `app.equipargeo.com` (Cloudflare Pages).

## Herramientas

- `/lat-lon-dxf/` — Lat/Lon → POSGAR07 GK + DXF (decimal y DMS, batch, canvas preview, mapa Leaflet)
- `/faja/` — Consulta de faja GNSS
- `/puntos-intermedios/` — Generador de puntos intermedios entre dos coordenadas
- `/conversor-dxf/` — Conversor CSV/TXT a DXF R12
- `/rinex/` — Caja de herramientas RINEX (inspección, corte, decimado, reparación, coordenadas POSGAR07, mapa Leaflet, descarga de efemérides)
- `/verificador-angulos/` — Verificador ISO de ángulos (próximamente)
- `/tin-curvas-nivel/` — TIN + Curvas de nivel (próximamente)

## Pages Functions

- `/api/brdc` — Proxy server-side que descarga efemérides broadcast (BRDC) de BKG y las descomprime al vuelo. Código en `functions/api/brdc.js`.

## Stack

HTML + JS vanilla puro. Sin frameworks. Leaflet como dependencia externa para el mapa de la herramienta RINEX (cargado desde CDN de Cloudflare). Estilos compartidos en `shared/base.css`.

## Desarrollo local

```bash
npx wrangler pages dev .    # http://localhost:8788
```

Esto levanta las herramientas y las Pages Functions. Abrir `http://localhost:8788/` para el index.

## Deploy

Cloudflare Pages con autodeploy desde `main`. Root directory configurado en `repos-target/equipargeo-tools` para que detecte `functions/`.
