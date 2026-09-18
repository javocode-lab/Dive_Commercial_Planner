import type { SourceReference } from "../../shared/sourceReference";
import type { RecreationalPressureGroup, SurfaceIntervalRange } from "../air/recreationalAirTypes";

export const CMAS_FEDECAS_TABLE_II_DATASET_VERSION =
  "cmas_fedecas_table_ii_surface_interval_v2_5_2026-09-05";

export const CMAS_FEDECAS_TABLE_II_STATUS =
  "rangos de intervalo en superficie Tabla II cargados para prototipo; pendientes de auditoría final fila por fila con Wili";

export const CMAS_FEDECAS_TABLE_II_SOURCE: SourceReference = {
  name: "CMAS/FEDECAS - Tablas para Buceo Recreativo",
  table: "Tabla II - Tiempos de intervalo en superficie",
  version: "Dataset prototipo v2.5",
  basis: "Basado en el documento de referencia compartido para validación del prototipo.",
  validationStatus:
    "Tabla II digitalizada para calcular nuevo grupo de presión después del intervalo en superficie; pendiente de auditoría final con Wili.",
  notes: [
    "La entrada requerida es el tiempo que el usuario permaneció fuera del agua entre inmersiones.",
    "El grupo inicial proviene del grupo de presión final de Tabla I.",
    "El rango operativo de Tabla II va de 0:10 a 12:00 en el documento de referencia.",
    "Si el intervalo queda fuera del rango de Tabla II, el cálculo repetitivo queda bloqueado y requiere revisión manual.",
    "El nuevo grupo calculado se usa como entrada para Tabla III."
  ]
};

function minutes(hours: number, mins: number): number {
  return hours * 60 + mins;
}

function transition(
  initialGroup: RecreationalPressureGroup,
  resultingGroup: RecreationalPressureGroup,
  start: [number, number],
  end: [number, number]
): SurfaceIntervalRange {
  return {
    initialGroup,
    resultingGroup,
    minInclusiveMinutes: minutes(start[0], start[1]),
    maxInclusiveMinutes: minutes(end[0], end[1])
  };
}

export const cmasFedecasTableIISurfaceIntervalTransitions: SurfaceIntervalRange[] = [
  transition("A", "A", [0, 10], [12, 0]),

  transition("B", "B", [0, 10], [2, 10]),
  transition("B", "A", [2, 11], [12, 0]),

  transition("C", "C", [0, 10], [1, 39]),
  transition("C", "B", [1, 40], [2, 49]),
  transition("C", "A", [2, 50], [12, 0]),

  transition("D", "D", [0, 10], [1, 9]),
  transition("D", "C", [1, 10], [2, 38]),
  transition("D", "B", [2, 39], [5, 48]),
  transition("D", "A", [5, 49], [12, 0]),

  transition("E", "E", [0, 10], [0, 54]),
  transition("E", "D", [0, 55], [1, 57]),
  transition("E", "C", [1, 58], [3, 22]),
  transition("E", "B", [3, 23], [6, 32]),
  transition("E", "A", [6, 33], [12, 0]),

  transition("F", "F", [0, 10], [0, 45]),
  transition("F", "E", [0, 46], [1, 29]),
  transition("F", "D", [1, 30], [2, 28]),
  transition("F", "C", [2, 29], [3, 57]),
  transition("F", "B", [3, 58], [7, 5]),
  transition("F", "A", [7, 6], [12, 0]),

  transition("G", "G", [0, 10], [0, 40]),
  transition("G", "F", [0, 41], [1, 15]),
  transition("G", "E", [1, 16], [1, 59]),
  transition("G", "D", [2, 0], [2, 58]),
  transition("G", "C", [2, 59], [4, 25]),
  transition("G", "B", [4, 26], [7, 35]),
  transition("G", "A", [7, 36], [12, 0]),

  transition("H", "H", [0, 10], [0, 36]),
  transition("H", "G", [0, 37], [1, 6]),
  transition("H", "F", [1, 7], [1, 41]),
  transition("H", "E", [1, 42], [2, 23]),
  transition("H", "D", [2, 24], [3, 20]),
  transition("H", "C", [3, 21], [4, 49]),
  transition("H", "B", [4, 50], [7, 59]),
  transition("H", "A", [8, 0], [12, 0]),

  transition("I", "I", [0, 10], [0, 33]),
  transition("I", "H", [0, 34], [0, 59]),
  transition("I", "G", [1, 0], [1, 29]),
  transition("I", "F", [1, 30], [2, 3]),
  transition("I", "E", [2, 4], [2, 44]),
  transition("I", "D", [2, 45], [3, 43]),
  transition("I", "C", [3, 44], [5, 12]),
  transition("I", "B", [5, 13], [8, 21]),
  transition("I", "A", [8, 22], [12, 0]),

  transition("J", "J", [0, 10], [0, 31]),
  transition("J", "I", [0, 32], [0, 54]),
  transition("J", "H", [0, 55], [1, 19]),
  transition("J", "G", [1, 20], [1, 47]),
  transition("J", "F", [1, 48], [2, 20]),
  transition("J", "E", [2, 21], [3, 4]),
  transition("J", "D", [3, 5], [4, 2]),
  transition("J", "C", [4, 3], [5, 40]),
  transition("J", "B", [5, 41], [8, 40]),
  transition("J", "A", [8, 41], [12, 0]),

  transition("K", "K", [0, 10], [0, 28]),
  transition("K", "J", [0, 29], [0, 49]),
  transition("K", "I", [0, 50], [1, 11]),
  transition("K", "H", [1, 12], [1, 35]),
  transition("K", "G", [1, 36], [2, 3]),
  transition("K", "F", [2, 4], [2, 38]),
  transition("K", "E", [2, 39], [3, 21]),
  transition("K", "D", [3, 22], [4, 19]),
  transition("K", "C", [4, 20], [5, 48]),
  transition("K", "B", [5, 49], [8, 58]),
  transition("K", "A", [8, 59], [12, 0]),

  transition("L", "L", [0, 10], [0, 26]),
  transition("L", "K", [0, 27], [0, 45]),
  transition("L", "J", [0, 46], [1, 4]),
  transition("L", "I", [1, 5], [1, 25]),
  transition("L", "H", [1, 26], [1, 49]),
  transition("L", "G", [1, 50], [2, 19]),
  transition("L", "F", [2, 20], [2, 53]),
  transition("L", "E", [2, 54], [3, 36]),
  transition("L", "D", [3, 37], [4, 35]),
  transition("L", "C", [4, 36], [6, 2]),
  transition("L", "B", [6, 3], [9, 12]),
  transition("L", "A", [9, 13], [12, 0]),

  transition("M", "M", [0, 10], [0, 25]),
  transition("M", "L", [0, 26], [0, 42]),
  transition("M", "K", [0, 43], [0, 59]),
  transition("M", "J", [1, 0], [1, 18]),
  transition("M", "I", [1, 19], [1, 39]),
  transition("M", "H", [1, 40], [2, 5]),
  transition("M", "G", [2, 6], [2, 34]),
  transition("M", "F", [2, 35], [3, 8]),
  transition("M", "E", [3, 9], [3, 52]),
  transition("M", "D", [3, 53], [4, 49]),
  transition("M", "C", [4, 50], [6, 18]),
  transition("M", "B", [6, 19], [9, 28]),
  transition("M", "A", [9, 29], [12, 0])
];
