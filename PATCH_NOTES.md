# DIVE Commercial Planner — UX patch

Cambios incluidos:

1. `Tiempo de fondo — primera inmersión` inicia vacío.
   - No contiene un tiempo preseleccionado.
   - `01:30` se muestra solo como ejemplo/placeholder.
   - El botón Calcular permanece deshabilitado hasta ingresar un tiempo válido o elegir un valor rápido.
   - Los botones rápidos conservan etiquetas explícitas (`1 h 30 min`, etc.).

2. Selector de tema simplificado.
   - Se reemplazan `Navy / Light` y la etiqueta `Tema` por un único botón circular.
   - En tema oscuro muestra el icono de sol para pasar a claro.
   - En tema claro muestra el icono de luna para pasar a oscuro.
   - Mantiene `aria-label` y `title` para accesibilidad.

## Archivos afectados

- `src/ui/App.tsx`
- `src/ui/components/DurationInput.tsx`
- `src/ui/components/ThemeToggle.tsx`
- `src/ui/screens/recreational/RecreationalPlanScreen.tsx`
- `src/ui/styles/global.css`

## Aplicación

Copiar estos archivos sobre el proyecto actual conservando la estructura de carpetas.
No reemplaza `package.json` ni `package-lock.json` para no interferir con actualizaciones de dependencias locales.

Luego ejecutar:

```bash
npm run test
npm run build
npm run dev
```
