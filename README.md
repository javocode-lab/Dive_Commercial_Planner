# DIVE Commercial Planner — Recreational Mode v2.3

Prototipo funcional para planificación recreativa simple con aire.

## Alcance v2.3

- Modo recreativo.
- Gas: aire.
- Unidades: métrico e imperial.
- Tabla activa: CMAS/FEDECAS Tabla I.
- Profundidad máxima operativa: 39 m / 130 ft.
- Profundidad: se redondea siempre hacia arriba a la siguiente columna de tabla.
- Tiempo de fondo: se evalúa exacto contra el límite tabular.
- Resultado simple + vista oficial **Detalle del cálculo**.
- Base estructural para **grupo de presión final** desde Tabla I.
- Los rangos A-M de grupos de presión todavía quedan pendientes de carga y validación por Wili.
- Tabla II y Tabla III quedan reservadas para inmersiones repetitivas.
- Checklist de validación manual.

## Advertencia

Esta app es una herramienta de planificación y verificación. No reemplaza formación, tablas oficiales, ordenador de buceo, procedimientos, supervisión ni criterio profesional.

## Scripts

```bash
npm install --include=optional
npm run dev
npm run test
npm run build
```

## Dataset v2.3 — Tabla I / NDL

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

## Estado de grupos repetitivos

v2.3 prepara la estructura para el grupo de presión final, pero no asigna letras todavía.

Próxima fase:

1. Digitalizar rangos de tiempo → grupo A-M desde Tabla I.
2. Validar esos rangos con Wili.
3. Activar `finalPressureGroup.group`.
4. Recién después avanzar con Tabla II y Tabla III para repetitivas.


## v2.3 - Pressure Group Assignment

Se cargaron los rangos de grupo de presión final de Tabla I para el prototipo recreativo con aire.

Reglas implementadas:

- La profundidad se redondea hacia arriba antes de consultar Tabla I.
- El tiempo de fondo se evalúa exacto, sin redondeo.
- Si el tiempo excede el límite NDL, no se asigna grupo de presión final.
- Si el tiempo queda dentro del límite, se asigna letra A-M según el rango de la profundidad efectiva.
- Tabla II y Tabla III siguen reservadas para la fase de inmersiones repetitivas completas.

Estado de validación: dataset candidato cargado para revisión manual de Wili contra la imagen fuente.
