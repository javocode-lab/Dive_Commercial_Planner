import type { SourceReference } from "../../shared/sourceReference";
import type { PressureGroupTimeRange, RecreationalAirTableRow, RecreationalPressureGroup } from "../air/recreationalAirTypes";

export const CMAS_FEDECAS_TABLE_I_DATASET_VERSION = "cmas_fedecas_table_i_air_proto_v2_3_pressure_groups_2026-08-27";

export const CMAS_FEDECAS_TABLE_I_PRESSURE_GROUP_STATUS =
  "rangos de grupo de presión Tabla I cargados para prototipo; pendientes de auditoría final fila por fila con Wili";

export const CMAS_FEDECAS_TABLE_I_SOURCE: SourceReference = {
  name: "CMAS/FEDECAS - Tablas para Buceo Recreativo",
  table: "Tabla I - Límites de tiempo y letra de clasificación al final de la inmersión",
  version: "Dataset prototipo v2.3",
  basis: "Basado en tablas U.S. Navy, según documento de referencia compartido para validación del prototipo.",
  validationStatus: "Límites NDL validados por Wili para prototipo controlado; rangos de grupo de presión Tabla I cargados y pendientes de auditoría final contra la imagen fuente.",
  notes: [
    "Gas soportado en esta versión: aire.",
    "Solo se usa Tabla I para inmersión simple sin descompresión.",
    "La profundidad se redondea siempre hacia arriba a la siguiente columna disponible.",
    "El tiempo de fondo se evalúa exacto contra el límite; no se redondea.",
    "Los grupos de presión finales A-M se asignan a partir de los rangos de tiempo de Tabla I.",
    "Tabla II y Tabla III quedan fuera de esta versión y se reservan para inmersiones repetitivas.",
    "La tabla no se muestra completa en la UI, pero la trazabilidad se conserva en Detalle del cálculo."
  ]
};

export const CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH = { meters: 39, feet: 130 } as const;

function pressureGroupRanges(maxTimes: Array<[RecreationalPressureGroup, number]>): PressureGroupTimeRange[] {
  let previousMaximum = 0;

  return maxTimes.map(([group, maxInclusiveTimeMinutes]) => {
    const range: PressureGroupTimeRange = {
      group,
      minExclusiveTimeMinutes: previousMaximum,
      maxInclusiveTimeMinutes
    };

    previousMaximum = maxInclusiveTimeMinutes;
    return range;
  });
}

export const recreationalAirCmasFedecasTableI: RecreationalAirTableRow[] = [
  {
    depthMeters: 9,
    depthFeet: 30,
    noDecompressionLimitMinutes: 250,
    pressureGroupRanges: pressureGroupRanges([
      ["A", 15],
      ["B", 30],
      ["C", 45],
      ["D", 60],
      ["E", 75],
      ["F", 95],
      ["G", 120],
      ["H", 145],
      ["I", 170],
      ["J", 205],
      ["K", 250]
    ])
  },
  {
    depthMeters: 10.5,
    depthFeet: 35,
    noDecompressionLimitMinutes: 220,
    pressureGroupRanges: pressureGroupRanges([
      ["A", 5],
      ["B", 15],
      ["C", 25],
      ["D", 40],
      ["E", 50],
      ["F", 60],
      ["G", 80],
      ["H", 100],
      ["I", 120],
      ["J", 140],
      ["K", 160],
      ["L", 190],
      ["M", 220]
    ])
  },
  {
    depthMeters: 12,
    depthFeet: 40,
    noDecompressionLimitMinutes: 150,
    pressureGroupRanges: pressureGroupRanges([
      ["A", 5],
      ["B", 15],
      ["C", 25],
      ["D", 30],
      ["E", 40],
      ["F", 50],
      ["G", 70],
      ["H", 80],
      ["I", 100],
      ["J", 110],
      ["K", 130],
      ["L", 150]
    ])
  },
  {
    depthMeters: 15,
    depthFeet: 50,
    noDecompressionLimitMinutes: 80,
    pressureGroupRanges: pressureGroupRanges([
      ["B", 10],
      ["C", 15],
      ["D", 25],
      ["E", 30],
      ["F", 40],
      ["G", 50],
      ["H", 60],
      ["I", 70],
      ["J", 80]
    ])
  },
  {
    depthMeters: 18,
    depthFeet: 60,
    noDecompressionLimitMinutes: 55,
    pressureGroupRanges: pressureGroupRanges([
      ["B", 10],
      ["C", 15],
      ["D", 20],
      ["E", 25],
      ["F", 30],
      ["G", 40],
      ["H", 50],
      ["I", 55]
    ])
  },
  {
    depthMeters: 21,
    depthFeet: 70,
    noDecompressionLimitMinutes: 40,
    pressureGroupRanges: pressureGroupRanges([
      ["B", 5],
      ["C", 10],
      ["D", 15],
      ["E", 20],
      ["F", 30],
      ["G", 35],
      ["H", 40]
    ])
  },
  {
    depthMeters: 24,
    depthFeet: 80,
    noDecompressionLimitMinutes: 30,
    pressureGroupRanges: pressureGroupRanges([
      ["B", 5],
      ["C", 10],
      ["D", 15],
      ["E", 20],
      ["F", 25],
      ["G", 30]
    ])
  },
  {
    depthMeters: 27,
    depthFeet: 90,
    noDecompressionLimitMinutes: 25,
    pressureGroupRanges: pressureGroupRanges([
      ["B", 5],
      ["C", 10],
      ["D", 12],
      ["E", 15],
      ["F", 20],
      ["G", 25]
    ])
  },
  {
    depthMeters: 30,
    depthFeet: 100,
    noDecompressionLimitMinutes: 20,
    pressureGroupRanges: pressureGroupRanges([
      ["B", 5],
      ["C", 7],
      ["D", 10],
      ["E", 15],
      ["F", 20]
    ])
  },
  {
    depthMeters: 33,
    depthFeet: 110,
    noDecompressionLimitMinutes: 15,
    pressureGroupRanges: pressureGroupRanges([
      ["C", 5],
      ["D", 10],
      ["E", 13],
      ["F", 15]
    ])
  },
  {
    depthMeters: 36,
    depthFeet: 120,
    noDecompressionLimitMinutes: 12,
    pressureGroupRanges: pressureGroupRanges([
      ["C", 5],
      ["D", 10],
      ["E", 12]
    ])
  },
  {
    depthMeters: 39,
    depthFeet: 130,
    noDecompressionLimitMinutes: 5,
    pressureGroupRanges: pressureGroupRanges([["C", 5]])
  }
];
