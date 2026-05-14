---
fecha: 2026-05-14
tipo: decision
estado: vigente
---

# Decisión — Activar las 2 herramientas fantasma

## Contexto

La auditoría técnica de Chrome detectó 2 herramientas implementadas en el código JS de equipargeo.com pero sin contenedor HTML publicado en ninguna página:

1. **Verificador ISO de Ángulos** (`#ang-verif-tool`, ~21 KB) — Control angular con análisis estadístico.
2. **TIN + Curvas de nivel** (`egs-*`, ~18 KB) — Triangulación Delaunay + marching squares + breaklines.

## Decisión

**(A) Activar ambas y sumarlas al scope de migración.**

## Razón

1. **Están implementadas** — el código existe, no hay que escribirlo desde cero. Solo falta el HTML container.
2. **TIN + curvas de nivel es imán SEO fuerte** — "curvas de nivel online" tiene volumen alto en agrimensores que hoy pagan AutoCAD Civil 3D o tcpMDT solo para esto. Diferenciación clara.
3. **Verificador ISO de Ángulos** — herramienta técnica nicho que diferencia EQUIPAR de competencia. Útil para topógrafos cumpliendo normativa ISO 17123-3.
4. **Costo de activarlas es marginal** — el JS ya viaja al cliente (cross-page bleed). Activar = sumar el container + publicar URL.

## Pregunta abierta

**¿El HTML container de cada una existe guardado en algún lado (Notion, Drive, archivo local), o hay que reconstruirlo a partir del JS?**

Resolver antes de empezar la migración de estas dos. Si hay que reconstruirlo, sube la complejidad por ~50% (de "trivial" a "media").

## Consecuencias

- Scope pasa de 4 a 6 herramientas a migrar.
- Cada una tendrá URL propia bajo `app.equipargeo.com/`.
- Plan detallado por herramienta en `plan/herramienta_05_*.md` y `plan/herramienta_06_*.md`.
