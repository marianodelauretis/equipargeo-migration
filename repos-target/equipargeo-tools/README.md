# equipargeo-tools

Herramientas técnicas de EQUIPAR como apps estáticas HTML+JS vanilla.

**Destino:** `app.equipargeo.com` (Cloudflare Pages).

## Herramientas

- `/faja/` — Consulta de faja GNSS
- `/posgar07/` — Conversor coordenadas Lat/Lon ↔ POSGAR07
- `/puntos-intermedios/` — Generador de puntos intermedios entre dos coordenadas
- `/conversor-dxf/` — Conversor CSV/TXT a DXF R12
- `/verificador-angulos/` — Verificador ISO de ángulos (próximamente)
- `/tin-curvas-nivel/` — TIN + Curvas de nivel (próximamente)

## Stack

HTML + JS vanilla puro. Sin frameworks, sin librerías externas.
Solo `gtag` para analytics.

## Deploy

Cloudflare Pages con autodeploy desde `main`.
