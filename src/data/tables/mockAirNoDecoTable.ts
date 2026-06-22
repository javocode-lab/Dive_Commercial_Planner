import type { DiveTable } from "../../domain/types";

export const MOCK_AIR_NO_DECO_TABLE: DiveTable = {
  id: "mock_air_ndl_dev_v0_1",
  label: "Mock Air NDL DEV v0.1",
  sourceReference:
    "Estructura preparada para reemplazar por U.S. Navy Diving Manual Rev. 7 / Change A. Datos actuales: mock de desarrollo, no oficiales.",
  validationStatus: "mock_not_validated",
  rows: [
    {
      depthMeters: 6,
      ndlMinutes: 60
    },
    {
      depthMeters: 9,
      ndlMinutes: 45
    },
    {
      depthMeters: 12,
      ndlMinutes: 30
    },
    {
      depthMeters: 15,
      ndlMinutes: 20
    },
    {
      depthMeters: 18,
      ndlMinutes: 15
    },
    {
      depthMeters: 21,
      ndlMinutes: 10
    },
    {
      depthMeters: 24,
      ndlMinutes: 5
    }
  ]
};
