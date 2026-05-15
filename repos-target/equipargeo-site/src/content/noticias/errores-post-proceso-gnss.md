---
titulo: "Post-proceso GNSS: 5 errores típicos que te arruinan los datos (y cómo detectarlos a tiempo)"
descripcion: "Ambigüedades mal resueltas, época de observación corta, multipath en zonas urbanas, baselines excesivos y máscara de elevación mal configurada. Los 5 errores más frecuentes en post-proceso y cómo identificarlos antes de presentar el trabajo."
fecha: 2026-05-12
categoria: casos-practicos
autor: "Equipo EQUIPAR"
tags: ["post-proceso", "gnss", "ambigüedades", "multipath", "qa-qc", "rinex"]
cursoRelacionado: /cursos/gnss-modulo-3/
destacada: true
publicada: false
---

En el post-proceso GNSS, la mayoría de los errores que cuestan trabajo y reputación no son errores del software: son **errores del operador que el software permite que pasen**. Un fix verde no garantiza un resultado correcto, y los reportes con tablas prolijas pueden ocultar problemas serios si no sabés qué mirar.

Estos son los 5 errores que más vemos repetidos en revisiones técnicas, cómo detectarlos y cómo prevenirlos en tu próximo trabajo.

## 1. Ambigüedades "fijadas" que en realidad están mal

**Qué pasa:** el software te indica que las ambigüedades están fixed (resueltas como enteros), pero en realidad el algoritmo se quedó con un valor incorrecto. El resultado: coordenadas que parecen precisas pero están desplazadas decímetros (o más).

**Cómo detectarlo:**
- Revisar los **residuos** de cada satélite, no solo el RMS global.
- Comparar la solución con una **segunda solución** procesada con parámetros distintos. Si difieren más allá del ruido esperado, hay problema.
- Si tenés baseline conocida, **chequear contra coordenadas previas** que sabés que están bien.

**Cómo prevenirlo:** trabajar con observaciones suficientemente largas para que el algoritmo tenga datos para fijar correctamente, y usar **efemérides precisas** (no las broadcast).

## 2. Época de observación demasiado corta

**Qué pasa:** mediciones estáticas o rápido-estáticas con tiempo insuficiente para la baseline o las condiciones atmosféricas del momento. El software igual te entrega resultado, pero la precisión nominal del receptor no se cumple.

**Cómo detectarlo:**
- Si el receptor da "ms" o variantes rápidas, **comparar contra una sesión estática larga** en el mismo punto.
- Revisar el reporte del receptor: cantidad de épocas usadas, ambigüedades resueltas, calidad de la geometría.

**Cómo prevenirlo:** seguir las **recomendaciones de tiempo según baseline** que dan los manuales del receptor (no las de "trabajo rápido en obra"). Para POSGAR07 con baselines >20 km, sumar tiempo.

## 3. Multipath en zonas urbanas o con vegetación densa

<!-- COMPLETAR: descripción detallada del problema multipath, ejemplos de zonas problemáticas en GBA/CABA, cómo detectarlo en los datos crudos -->

## 4. Baseline excesivo respecto al instrumental y observación

<!-- COMPLETAR: explicar la relación entre longitud de baseline, precisión esperable y tiempo de observación. Mencionar casos donde una baseline larga "fixed" da error sistemático -->

## 5. Máscara de elevación mal configurada

<!-- COMPLETAR: cuál es el problema con máscaras demasiado bajas (incluyen señales de baja calidad) o demasiado altas (descartan satélites útiles), cómo decidir el valor según el entorno -->

## Cómo detectar todo esto en tu próximo trabajo

El denominador común de estos 5 errores es que **el software no te avisa**. La protección está en:

1. **Procesar dos veces con parámetros distintos** y comparar resultados.
2. **Revisar residuos por satélite**, no solo RMS global.
3. **Documentar el QA/QC** en el informe, no solo presentar coordenadas.
4. **Tener puntos de control conocidos** en cada trabajo importante para validación externa.

Si lo de revisar residuos por satélite te suena vago, ese es exactamente el tipo de cosa que cubrimos en detalle en el [**Módulo 3 — Post-proceso GNSS Profesional**](/cursos/gnss-modulo-3/), con ejemplos reales de datasets que pasaron filtros automáticos pero tenían errores que un revisor detecta enseguida.

---

*¿Te tocó vivir alguno de estos errores en obra? [Contanos tu caso](https://wa.me/5491155722266) y lo incorporamos a la próxima nota.*
