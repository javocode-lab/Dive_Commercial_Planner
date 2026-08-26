# DIVE Commercial Planner — Recreational Mode v2.0

Prototipo funcional para planificación recreativa simple con aire.

## Alcance v2.0

- Modo recreativo.
- Gas: aire.
- Unidades: métrico e imperial.
- Tabla activa: CMAS/FEDECAS Tabla I.
- Profundidad máxima operativa: 39 m / 130 ft.
- Profundidad: se redondea siempre hacia arriba a la siguiente columna de tabla.
- Tiempo de fondo: se evalúa exacto contra el límite tabular.
- Tabla II y Tabla III quedan reservadas para inmersiones repetitivas.
- Vista oficial: **Detalle del cálculo**.
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

## Dataset v2.0

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
