import { defineCollection, z } from 'astro:content';

const cursos = defineCollection({
  type: 'content',
  schema: z.object({
    programa: z.enum(['gnss', 'topografia', 'fotogrametria']),
    titulo: z.string(),
    descripcion: z.string(),
    modulo: z.number().optional(),
    esPrograma: z.boolean().default(false),
    modalidad: z.enum(['online', 'presencial', 'hibrida']).default('online'),
    duracion: z.string().optional(),
    precio: z.string().optional(),
    instructor: z.string().optional(),
    fechaInicio: z.string().optional(),
    requisitos: z.array(z.string()).optional(),
    temario: z.array(z.string()).optional(),
    orden: z.number().default(0),
    destacado: z.boolean().default(false),
    publicado: z.boolean().default(true),
  }),
});

const noticias = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string(),
    fecha: z.date(),
    categoria: z.enum([
      'instrumental-gnss',
      'estaciones-totales-nivelacion',
      'drones-fotogrametria',
      'escaneres-slam',
      'software-procesamiento',
      'normativa-catastro',
      'casos-practicos',
      'comunidad-eventos',
    ]),
    autor: z.string().default('Equipo EQUIPAR'),
    tags: z.array(z.string()).default([]),
    imagen: z.string().optional(),
    imagenAlt: z.string().optional(),
    cursoRelacionado: z.string().optional(),
    destacada: z.boolean().default(false),
    publicada: z.boolean().default(true),
  }),
});

export const collections = { cursos, noticias };
