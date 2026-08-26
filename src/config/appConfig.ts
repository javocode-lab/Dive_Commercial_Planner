import type { ScenarioOption, UnitSystemOption } from "../domain/types";

export const APP_CONFIG = {
  name: "DIVE COMMERCIAL PLANNER",
  version: "0.1.0-web",
  safetyStatus: "NON_OPERATIONAL_DEVELOPMENT_BUILD",
  maxHistoryItems: 20,
  defaultTableId: "mock_air_ndl_dev_v0_1"
} as const;

export const UNIT_SYSTEM_OPTIONS: UnitSystemOption[] = [
  {
    value: "metric",
    label: "Métrico",
    depthLabel: "metros",
    altitudeLabel: "metros"
  },
  {
    value: "imperial",
    label: "Imperial",
    depthLabel: "pies",
    altitudeLabel: "pies"
  }
];

export const SCENARIO_OPTIONS: ScenarioOption[] = [
  {
    value: "sea",
    label: "Mar",
    requiresAltitude: false
  },
  {
    value: "lake",
    label: "Lago",
    requiresAltitude: true
  },
  {
    value: "river",
    label: "Río",
    requiresAltitude: true
  },
  {
    value: "quarry",
    label: "Cantera",
    requiresAltitude: true
  },
  {
    value: "reservoir",
    label: "Represa",
    requiresAltitude: true
  }
];
