import type { SourceReference } from "../../shared/sourceReference";
import type { RecreationalAirTableRow } from "../air/recreationalAirTypes";
export const CMAS_FEDECAS_TABLE_I_DATASET_VERSION = "cmas_fedecas_table_i_air_proto_v2_0_2026-08-25";
export const CMAS_FEDECAS_TABLE_I_SOURCE: SourceReference = {
  name: "CMAS/FEDECAS - Tablas para Buceo Recreativo",
  table: "Tabla I - Límites de tiempo y letra de clasificación al final de la inmersión",
  version: "Dataset prototipo v2.0",
  basis: "Basado en tablas U.S. Navy, según documento de referencia compartido para validación del prototipo.",
  validationStatus: "Validada por Wili para prototipo controlado; pendiente de auditoría final antes de uso productivo.",
  notes: ["Gas soportado en esta versión: aire.", "Solo se usa Tabla I para inmersión simple sin descompresión.", "Tabla II y Tabla III quedan fuera de esta versión y se reservan para inmersiones repetitivas.", "La tabla no se muestra completa en la UI, pero la trazabilidad se conserva en Detalle del cálculo."]
};
export const CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH = { meters: 39, feet: 130 } as const;
export const recreationalAirCmasFedecasTableI: RecreationalAirTableRow[] = [
  { depthMeters: 9, depthFeet: 30, noDecompressionLimitMinutes: 250 },
  { depthMeters: 10.5, depthFeet: 35, noDecompressionLimitMinutes: 220 },
  { depthMeters: 12, depthFeet: 40, noDecompressionLimitMinutes: 150 },
  { depthMeters: 15, depthFeet: 50, noDecompressionLimitMinutes: 80 },
  { depthMeters: 18, depthFeet: 60, noDecompressionLimitMinutes: 55 },
  { depthMeters: 21, depthFeet: 70, noDecompressionLimitMinutes: 40 },
  { depthMeters: 24, depthFeet: 80, noDecompressionLimitMinutes: 30 },
  { depthMeters: 27, depthFeet: 90, noDecompressionLimitMinutes: 25 },
  { depthMeters: 30, depthFeet: 100, noDecompressionLimitMinutes: 20 },
  { depthMeters: 33, depthFeet: 110, noDecompressionLimitMinutes: 15 },
  { depthMeters: 36, depthFeet: 120, noDecompressionLimitMinutes: 12 },
  { depthMeters: 39, depthFeet: 130, noDecompressionLimitMinutes: 5 }
];
