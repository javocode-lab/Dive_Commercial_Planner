# DIVE Commercial Planner — v2.5.3 responsive calculation detail

Corrección UX responsive para la pantalla **Detalle del cálculo**.

## Cambios

- La pantalla ahora tiene una clase específica `screen--calculation-detail`.
- Se eliminan desbordes horizontales en móvil mediante `min-width: 0`, `max-width: 100%` y wrapping seguro.
- Cards de pasos y Fuente técnica pasan a una sola columna en pantallas angostas.
- Los textos largos de dataset, motor, fuente y pasos pueden cortar línea sin ensanchar la página.
- Se reducen paddings/radios/tipografías en móvil para aprovechar mejor 320–640 px.
- Los pasos numerados usan `minmax(0, 1fr)` para que la columna de contenido pueda encogerse.
- La barra inferior conserva ambas acciones y ajusta labels en pantallas muy angostas.

## Archivos afectados

- `src/ui/screens/recreational/CalculationDetailScreen.tsx`
- `src/ui/styles/global.css`

## Validación local recomendada

```bash
npm run test
npm run build
npm run dev
```

Probar especialmente con DevTools en 320 px, 360 px, 390 px y 430 px de ancho.
