---
fecha: 2026-05-14
tipo: decision
estado: vigente
---

# Decisión — Incluir sección de noticias en el sitio principal

## Contexto

Mariano propone sumar una sección de noticias / novedades de instrumental al sitio principal nuevo. Hoy no existe en WordPress.

## Decisión

**Incluir desde el día 1 del lanzamiento del sitio nuevo (Fase 5).**

## Razón

1. **SEO** — contenido fresco con keywords de cola larga (modelos específicos de equipos).
2. **Diferenciación** — pocos sitios técnicos de agrimensura en español tienen blogs activos.
3. **Lead gen** — cada nota es un CTA potencial a un curso relacionado.
4. **Comunidad** — la gente vuelve por novedades, no por páginas estáticas.

## Implementación

- Astro Content Collections con schema tipado.
- MDX para flexibilidad en posts ricos.
- 9 categorías iniciales (ver `plan/seccion_noticias.md`).
- Cadencia objetivo: 1 nota/semana mínimo.
- RSS feed automático.
- 5 notas piloto al lanzar.

## Pendientes de decisión

1. Categorías exactas — propuesta de 9, validar con Mariano.
2. Newsletter — ¿día 1 (MailerLite/Buttondown) o después?
3. Imágenes destacadas — ¿generadas con IA o reales/stock?
4. Primeras 5 notas piloto — definir tópicos.

## Consecuencias

- Fase 5 del plan general dedicada a esto.
- Workflow editorial nuevo para Mariano (escribir + publicar regularmente).
- Considera sumar Decap CMS si se vuelve pesado editar markdown a mano.
