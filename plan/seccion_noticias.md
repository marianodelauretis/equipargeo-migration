# Plan — Sección Noticias / Novedades de Instrumental

## Objetivo

Sección de blog/noticias en `equipargeo.com/noticias/` con publicaciones sobre actualizaciones de instrumental, software, normativa y eventos relevantes para profesionales del territorio (agrimensores, topógrafos, ingenieros, arquitectos).

## Valor estratégico

1. **SEO**: contenido fresco con keywords de cola larga (modelos específicos de equipos, versiones de software, nombres de normativas).
2. **Comunidad**: la gente vuelve por novedades, no por páginas estáticas.
3. **Diferenciación**: pocos sitios técnicos de agrimensura en español tienen secciones de noticias activas.
4. **Lead gen**: cada nota puede tener CTA a un curso relacionado o a un lead magnet.

## Stack técnico

- **Astro Content Collections** — definir collection `noticias` con schema tipado.
- **MDX** — para insertar componentes en notas si se necesita (carrousels, comparativas, embeds de YouTube).
- **Astro Image** — optimización automática de imágenes de cada nota.
- **astro-rss** — feed RSS generado automáticamente.

## Schema propuesto del frontmatter

```yaml
---
title: "Trimble R12i: review completo después de 6 meses de uso"
slug: trimble-r12i-review
date: 2026-05-14
author: Mariano De Lauretis
category: Instrumental GNSS    # Ver categorías abajo
tags: [trimble, gnss, rtk, receptor, review]
image: ./images/trimble-r12i.jpg
imageAlt: "Receptor GNSS Trimble R12i sobre trípode en obra"
excerpt: "Probamos el R12i de Trimble durante 6 meses en distintos trabajos. Comparativa con el R10-2 y dónde realmente vale la inversión."
featured: false        # Si va en home como nota destacada
draft: false
---
```

## Categorías iniciales propuestas

1. **Instrumental GNSS** — Receptores, controladoras, antenas (Trimble, Leica, CHC, Sokkia, Topcon, etc).
2. **Estaciones totales** — Robotic, manual, accessories.
3. **Drones / Fotogrametría** — DJI, Autel, sensores, software (Pix4D, Agisoft, DroneDeploy).
4. **Escáneres / SLAM** — Leica BLK, Faro, GeoSLAM, Emesent.
5. **Software** — Carlson, Trimble Business Center, Leica Infinity, CHC Geomatics, tcpMDT.
6. **Normativa / Catastro** — IGN, COPSIS, ARBA, COCAB, cambios provinciales.
7. **Eventos** — Congresos, ferias, jornadas, capacitaciones externas.
8. **Casos prácticos** — Tutoriales y resolución de problemas reales.
9. **Comunidad EQUIPAR** — Anuncios, alumnos destacados, novedades del canal.

## Estrategia editorial inicial

**Cadencia objetivo:** 1 nota por semana (mínimo). 2-3 cuando se pueda.

**Primeras 5 notas piloto** (decisión de Mariano):
- ¿Cuáles son las 5 notas que tendrías ganas de escribir mañana? Esas son las que arrancan la sección.

**Larga cola SEO**: cada nota debería rankear por:
- Modelo específico del equipo (ej: "trimble r12i")
- Tipo + uso (ej: "receptor gnss para usucapión")
- Comparativa (ej: "trimble vs leica gnss")
- Tutorial (ej: "como configurar rtk con r12i")

## Plantilla de nota nueva

Crear archivo `src/content/noticias/_template.md` con:

```markdown
---
title: ""
slug: ""
date: 2026-05-14
author: Mariano De Lauretis
category: ""
tags: []
image: ./images/____.jpg
imageAlt: ""
excerpt: ""
featured: false
draft: true
---

## Introducción

Qué es esto y por qué importa.

## Cuerpo

Desarrollar.

## Conclusión

Recomendación, próximos pasos, dónde profundizar.

## Recursos

- Link 1
- Link 2

---

**¿Te interesó este tema?** En el [Módulo X del Curso GNSS](https://equipargeo.com/cursos/gnss-modulo-2) profundizamos en este uso del equipo.
```

## CTA por defecto al final de cada nota

Cada nota tiene un CTA cerrando que linkea al curso relacionado (cuando aplica) + opción de suscripción al newsletter.

## RSS Feed

`/rss.xml` generado automáticamente. Útil para:
- Suscriptores que usen Feedly / Inoreader.
- Auto-publicar en redes con Zapier / IFTTT.
- Indexación más rápida por Google News si se aplica.

## Pendientes / decisiones a tomar antes de implementar

1. ¿Confirmás las 9 categorías propuestas? ¿Falta alguna? ¿Sobra alguna?
2. ¿Newsletter desde el día 1, o lo sumamos después? (Recomiendo: día 1, con MailerLite free hasta 1000 contactos o Buttondown).
3. ¿Las imágenes destacadas las generamos con IA (DALL-E / Imagen 4) o usamos fotos reales / stock?
4. ¿Las primeras 5 notas piloto las escribís vos mismo, o usamos un workflow con Claude para drafting + tu edición?
