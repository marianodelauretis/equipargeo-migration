# Plan migración — TIN + Curvas de nivel (fantasma → activar)

## Identificación

- **URL actual:** NO PUBLICADA. Código cargando con namespace `egs-*` pero sin contenedor.
- **URL destino:** https://app.equipargeo.com/tin-curvas-nivel/
- **Categoría:** (a) JS vanilla custom inline.
- **Tamaño JS:** ~18 KB.
- **Decisión:** Activar y publicar. **Esta es probablemente la herramienta más fuerte SEO-mente** ("curvas de nivel online" tiene volumen alto en agrimensores). Prioridad alta a largo plazo.

## Funcionalidad detectada (del reporte de Chrome)

Generador de TIN (Triangulated Irregular Network) por Delaunay + curvas de nivel via marching squares con suavizado Chaikin + breaklines por código. Export DXF R12 con polilíneas 3D y 3DFACE.

Funciones detectadas: `delaunay, circum, addEdge, convexHull, pointInPoly, gridIDW, marchingSquares, stitchSegments, smoothChaikin, headerR12, footerR12, ent3DFACE, entPLINE3D, exportDXF, parseCodes, breaklinesByCode`.

Es una herramienta TÉCNICAMENTE COMPLEJA pero ya implementada. Solo falta el container HTML.

## Pasos

Mismos que herramienta 05 (fantasma): primero conseguir el HTML container.

## Pregunta abierta

Misma que herramienta 05: **¿el HTML container existe en algún lado, o hay que reconstruirlo?**

Si hay que reconstruirlo, inferir IDs/inputs a partir del JS:
- Input para coordenadas (carga CSV de puntos con código)
- Configuración de intervalo de curvas (mayores y menores)
- Configuración de breaklines por código
- Canvas para preview
- Export DXF

## Notas estratégicas

Si la herramienta funciona completa y se publica, **renombrar la página para SEO**:
- URL: `/curvas-de-nivel/` o `/tin-curvas-de-nivel/`
- Title: `Generador de curvas de nivel online — EQUIPAR`
- H1: `Curvas de nivel desde puntos topográficos`

Esto captura volumen de búsqueda hiperespecífico de agrimensores que hoy tienen que pagar AutoCAD Civil 3D o tcpMDT solo para esto. **Imán SEO fuerte.**

## Criterios de aceptación

- [ ] Container HTML completo.
- [ ] Carga de CSV con coordenadas + códigos.
- [ ] Genera TIN visible.
- [ ] Genera curvas de nivel a intervalos configurables.
- [ ] Aplica breaklines correctamente.
- [ ] Export DXF con triángulos + curvas + breaklines en layers separados.
- [ ] Caso de prueba: 50 puntos formando un cono → genera curvas circulares concéntricas.
