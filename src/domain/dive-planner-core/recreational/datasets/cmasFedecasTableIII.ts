import type { SourceReference } from "../../shared/sourceReference";
import type { RecreationalPressureGroup, ResidualNitrogenTableEntry } from "../air/recreationalAirTypes";

export const CMAS_FEDECAS_TABLE_III_DATASET_VERSION =
  "cmas_fedecas_table_iii_residual_nitrogen_v2_5_2026-09-05";

export const CMAS_FEDECAS_TABLE_III_STATUS =
  "tiempos de nitrógeno residual y límites ajustados Tabla III cargados para prototipo; pendientes de auditoría final fila por fila con Wili";

export const CMAS_FEDECAS_TABLE_III_SOURCE: SourceReference = {
  name: "CMAS/FEDECAS - Tablas para Buceo Recreativo",
  table: "Tabla III - Tiempo de nitrógeno residual y límite ajustado sin descompresión para buceo sucesivo",
  version: "Dataset prototipo v2.5",
  basis: "Basado en el documento de referencia compartido para validación del prototipo.",
  validationStatus:
    "Tabla III digitalizada para calcular tiempo de nitrógeno residual en minutos y límite ajustado para la segunda inmersión; pendiente de auditoría final con Wili.",
  notes: [
    "El nitrógeno residual se expresa como tiempo equivalente en minutos según Tabla III.",
    "No representa una medición médica directa de nitrógeno en sangre.",
    "La profundidad de la segunda inmersión se redondea hacia arriba a la siguiente fila disponible de Tabla III.",
    "Si una celda no muestra límite ajustado en la tabla fuente, el motor muestra el tiempo residual pero bloquea la segunda inmersión como no soportada por esa celda.",
    "El tiempo equivalente total se calcula como tiempo de fondo de segunda inmersión + tiempo de nitrógeno residual."
  ]
};

const GROUP_ORDER: RecreationalPressureGroup[] = ["M", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B", "A"];

type ResidualRowConfig = {
  depthMeters: number;
  depthFeet: number;
  noDecompressionLimitMinutes: number;
  residualsByGroupOrder: number[];
  firstGroupWithAdjustedLimit: RecreationalPressureGroup;
};

function entriesForRow(config: ResidualRowConfig): ResidualNitrogenTableEntry[] {
  const firstAdjustedIndex = GROUP_ORDER.indexOf(config.firstGroupWithAdjustedLimit);

  return GROUP_ORDER.map((pressureGroup, index) => {
    const residualNitrogenMinutes = config.residualsByGroupOrder[index];
    const adjustedNoDecompressionLimitMinutes =
      index >= firstAdjustedIndex
        ? config.noDecompressionLimitMinutes - residualNitrogenMinutes
        : null;

    return {
      depthMeters: config.depthMeters,
      depthFeet: config.depthFeet,
      pressureGroup,
      residualNitrogenMinutes,
      adjustedNoDecompressionLimitMinutes
    };
  });
}

export const cmasFedecasTableIIIResidualNitrogenEntries: ResidualNitrogenTableEntry[] = [
  ...entriesForRow({
    depthMeters: 12,
    depthFeet: 40,
    noDecompressionLimitMinutes: 150,
    firstGroupWithAdjustedLimit: "K",
    residualsByGroupOrder: [187, 161, 138, 116, 101, 87, 73, 61, 49, 37, 25, 17, 7]
  }),
  ...entriesForRow({
    depthMeters: 15,
    depthFeet: 50,
    noDecompressionLimitMinutes: 80,
    firstGroupWithAdjustedLimit: "I",
    residualsByGroupOrder: [124, 111, 99, 87, 76, 66, 56, 47, 38, 29, 21, 13, 6]
  }),
  ...entriesForRow({
    depthMeters: 18,
    depthFeet: 60,
    noDecompressionLimitMinutes: 55,
    firstGroupWithAdjustedLimit: "G",
    residualsByGroupOrder: [97, 88, 79, 70, 61, 52, 44, 36, 30, 24, 17, 11, 5]
  }),
  ...entriesForRow({
    depthMeters: 21,
    depthFeet: 70,
    noDecompressionLimitMinutes: 40,
    firstGroupWithAdjustedLimit: "G",
    residualsByGroupOrder: [80, 72, 64, 57, 50, 43, 37, 31, 26, 20, 15, 9, 4]
  }),
  ...entriesForRow({
    depthMeters: 24,
    depthFeet: 80,
    noDecompressionLimitMinutes: 30,
    firstGroupWithAdjustedLimit: "F",
    residualsByGroupOrder: [68, 61, 54, 48, 43, 38, 32, 28, 23, 18, 13, 8, 4]
  }),
  ...entriesForRow({
    depthMeters: 27,
    depthFeet: 90,
    noDecompressionLimitMinutes: 25,
    firstGroupWithAdjustedLimit: "F",
    residualsByGroupOrder: [58, 53, 47, 43, 38, 33, 29, 24, 20, 16, 11, 7, 3]
  }),
  ...entriesForRow({
    depthMeters: 30,
    depthFeet: 100,
    noDecompressionLimitMinutes: 20,
    firstGroupWithAdjustedLimit: "E",
    residualsByGroupOrder: [52, 48, 43, 38, 34, 30, 26, 22, 18, 14, 10, 7, 3]
  }),
  ...entriesForRow({
    depthMeters: 33,
    depthFeet: 110,
    noDecompressionLimitMinutes: 15,
    firstGroupWithAdjustedLimit: "D",
    residualsByGroupOrder: [47, 42, 38, 34, 31, 27, 24, 20, 16, 13, 10, 6, 3]
  }),
  ...entriesForRow({
    depthMeters: 36,
    depthFeet: 120,
    noDecompressionLimitMinutes: 12,
    firstGroupWithAdjustedLimit: "C",
    residualsByGroupOrder: [43, 39, 35, 32, 28, 25, 21, 18, 15, 12, 9, 6, 3]
  }),
  ...entriesForRow({
    depthMeters: 39,
    depthFeet: 130,
    noDecompressionLimitMinutes: 5,
    firstGroupWithAdjustedLimit: "A",
    residualsByGroupOrder: [38, 35, 31, 28, 25, 22, 19, 16, 13, 11, 8, 6, 3]
  })
];

export const CMAS_FEDECAS_TABLE_III_MIN_DEPTH = { meters: 12, feet: 40 } as const;
export const CMAS_FEDECAS_TABLE_III_MAX_DEPTH = { meters: 39, feet: 130 } as const;
