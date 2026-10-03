# DIVE Commercial Planner — Sprint BETA-01

## Objetivo
Internacionalizar el flujo activo de Recreational Mode para una beta cerrada en Brasil.

## Implementado
- `pt-BR` y `es-AR` con infraestructura centralizada en `src/i18n/`.
- Portugués de Brasil como idioma predeterminado cuando no existe preferencia guardada.
- Selector persistente `PT / ES` junto al control de tema.
- `document.documentElement.lang` actualizado según idioma activo.
- Traducción del flujo activo: inicio, planificación, resultado, Detalle del cálculo y validación manual.
- Traducción de mensajes de duración, accesibilidad del selector de profundidad y tema.
- Presentación localizada de estados, advertencias y trazas del motor sin modificar sus datos numéricos.
- Fuente/dataset/motor preservados para trazabilidad.

## No incluido en BETA-01
- Login / Auth.
- Base de datos.
- Telemetría de uso.
- Panel administrador.
- Traducción de pantallas legacy no utilizadas por el flujo actual.

## Validación local recomendada
```bash
npm run test
npm run build
npm run dev
```

Revisar en PT y ES:
1. Inmersión simple.
2. Redondeo de profundidad.
3. Límite excedido.
4. Mergulho repetitivo.
5. Detalhes do cálculo.
6. Validação manual.
7. Persistencia de idioma al recargar.
