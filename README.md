# DIVE Commercial Planner — Recreational Mode v2.5.2

Prototipo funcional para planificación recreativa con aire, inmersión simple y primera versión de buceo repetitivo.

## Alcance v2.5

- Modo recreativo.
- Gas: aire.
- Unidades: métrico e imperial.
- Tabla activa para inmersión simple: CMAS/FEDECAS Tabla I.
- Tabla activa para intervalo en superficie: CMAS/FEDECAS Tabla II.
- Tabla activa para nitrógeno residual: CMAS/FEDECAS Tabla III.
- Profundidad máxima operativa: 39 m / 130 ft.
- Profundidad: se redondea siempre hacia arriba a la siguiente columna/fila disponible.
- Tiempo de fondo: se evalúa exacto contra el límite tabular.
- Resultado simple + vista oficial **Detalle del cálculo**.
- Grupo de presión final de la primera inmersión.
- Entrada de intervalo en superficie: tiempo que el usuario permaneció fuera del agua.
- Nuevo grupo de presión después del intervalo.
- Nitrógeno residual expresado en minutos según Tabla III.
- Límite ajustado sin descompresión para segunda inmersión cuando la celda lo permite.
- Checklist de validación manual.

## Advertencia

Esta app es una herramienta de planificación y verificación. No reemplaza formación, tablas oficiales, ordenador de buceo, procedimientos, supervisión ni criterio profesional.

El “nitrógeno residual” se muestra como **tiempo de nitrógeno residual en minutos según Tabla III**. No debe interpretarse como medición médica directa de nitrógeno en sangre.

## Scripts

```bash
npm install --include=optional
npm run dev
npm run test
npm run build
```

## Dataset v2.5 — Tabla I / NDL

```text
9 m / 30 ft    → 250 min
10.5 m / 35 ft → 220 min
12 m / 40 ft   → 150 min
15 m / 50 ft   → 80 min
18 m / 60 ft   → 55 min
21 m / 70 ft   → 40 min
24 m / 80 ft   → 30 min
27 m / 90 ft   → 25 min
30 m / 100 ft  → 20 min
33 m / 110 ft  → 15 min
36 m / 120 ft  → 12 min
39 m / 130 ft  → 5 min
```

## Repetitivas v2.5

Flujo implementado:

```text
Primera inmersión
→ profundidad
→ tiempo de fondo
→ límite Tabla I
→ grupo de presión final

Intervalo en superficie
→ tiempo fuera del agua
→ Tabla II
→ nuevo grupo de presión

Segunda inmersión
→ profundidad planificada
→ tiempo de fondo planificado
→ Tabla III
→ nitrógeno residual en minutos
→ límite ajustado
→ tiempo equivalente total
```

## Estado de validación

- Tabla I: límites NDL confirmados para prototipo por Fernando/Wili.
- Tabla I: grupos de presión cargados desde la imagen fuente, pendientes de auditoría final fila por fila.
- Tabla II: rangos de intervalo en superficie cargados desde la imagen fuente, pendientes de auditoría final fila por fila.
- Tabla III: nitrógeno residual y límites ajustados cargados desde la imagen fuente, pendientes de auditoría final fila por fila.

## Regla de seguridad

No usar esta versión como única fuente para planificar o ejecutar inmersiones reales. Toda salida debe validarse manualmente contra la fuente técnica, criterio profesional y condiciones reales.


## v2.5.1 — Unified duration UX

- Tiempo de fondo, intervalo en superficie y segundo tiempo de fondo se presentan como un único dato de duración.
- Formato visible: `HH h MM min`.
- La edición se realiza dentro de un selector único de duración, con horas y minutos claramente rotulados.
- El motor continúa recibiendo minutos totales; no cambia ninguna regla de cálculo.

## v2.5.2 — Single HH:MM duration input

- Los tiempos se cargan ahora en un único campo `HH:MM`.
- Ejemplo visible: `01:30 = 1 h 30 min`.
- Se mantienen los botones rápidos con etiquetas explícitas como `1 h 30 min`.
- El motor continúa recibiendo minutos totales; no cambia ninguna regla de cálculo.
- La misma UX se usa para tiempo de fondo, intervalo en superficie y segunda inmersión.
