# DIVE COMMERCIAL PLANNER Web v0.1

Versión web inicial, simple y sin Expo, para validar el flujo funcional del planificador.

## Estado

Esta versión no es operacional. No debe usarse para buceo real.

Los datos de tabla incluidos son mock de desarrollo y deben ser reemplazados por fuentes oficiales validadas.

## Stack

- React
- Vite
- TypeScript
- Vitest
- localStorage
- CSS simple

## Instalación

```bash
npm install
```

## Ejecutar

```bash
npm run dev
```

Abrir la URL indicada por Vite, normalmente:

```txt
http://localhost:5173
```

## Tests

```bash
npm test
```

## Typecheck

```bash
npm run typecheck
```

## Build

```bash
npm run build
```

## Estructura

```txt
src/config      Configuración y mensajes
src/data        Catálogos y tablas mock versionadas
src/domain      Tipos, unidades, validaciones y cálculo
src/services    Persistencia local con localStorage
src/state       Estado del flujo
src/ui          Pantallas, componentes y estilos
__tests__       Tests unitarios de dominio
```

## Flujo v0.1

1. Advertencia inicial.
2. Nuevo plan.
3. Selección de unidades.
4. Selección de escenario.
5. Profundidad.
6. Tiempo de fondo.
7. Altitud si corresponde.
8. Revisión.
9. Resultado.
10. Historial local.

## Limitaciones

- No incluye tablas oficiales.
- No calcula descompresión real.
- No implementa Equivalent Sea Level Depth real.
- No implementa GPS real.
- No implementa inmersiones repetitivas.
- No implementa nitrógeno residual.
- No incluye backend, login ni base de datos real.

## Próximos pasos

1. Validar fuentes normativas.
2. Reemplazar tabla mock por datos oficiales autorizados.
3. Agregar fixtures oficiales de prueba.
4. Mejorar UI para uso táctil móvil.
5. Evaluar PWA antes de volver a móvil nativo.
