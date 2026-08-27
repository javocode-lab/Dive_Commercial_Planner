import type { SourceReference } from "../../shared/sourceReference";
import type { CalculationStep } from "../../shared/trace";
import type { DepthUnit, UnitSystem } from "../../shared/units";

export type RecreationalGas = "air";

export type RecreationalDiveStatus =
  | "within_table_limit"
  | "exceeds_table_time_limit"
  | "unsupported_depth"
  | "invalid_input"
  | "requires_manual_review";

export type RecreationalDiveWarningLevel = "info" | "warning" | "critical";

export type RecreationalDiveWarning = {
  level: RecreationalDiveWarningLevel;
  message: string;
};

export type RecreationalPressureGroup =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M";

export type PressureGroupStatus = "available" | "pending_dataset" | "not_applicable";

export type PressureGroupTimeRange = {
  group: RecreationalPressureGroup;
  minExclusiveTimeMinutes: number;
  maxInclusiveTimeMinutes: number;
};

export type FinalPressureGroup = {
  status: PressureGroupStatus;
  group: RecreationalPressureGroup | null;
  table: "Tabla I";
  datasetStatus: string;
  message: string;
  matchedRange: PressureGroupTimeRange | null;
};

export type RecreationalAirDiveInput = {
  depth: number;
  bottomTime: number;
  unitSystem: UnitSystem;
  gas: RecreationalGas;
  previousDive?: unknown;
  surfaceInterval?: unknown;
  repetitiveDiveData?: unknown;
};

export type NormalizedDiveInput = {
  depthMeters: number;
  depthFeet: number;
  bottomTimeMinutes: number;
};

export type EffectiveDepth = {
  meters: number;
  feet: number;
  unitUsedForLookup: DepthUnit;
};

export type RecreationalAirDiveResult = {
  id: string;
  createdAt: string;
  status: RecreationalDiveStatus;
  resultLabel: string;
  input: RecreationalAirDiveInput;
  normalizedInput: NormalizedDiveInput | null;
  effectiveDepth: EffectiveDepth | null;
  effectiveTime: number | null;
  limit: number | null;
  remainingTime: number | null;
  finalPressureGroup: FinalPressureGroup;
  rounding: {
    depthRounded: boolean;
    depthRule: string;
    timeRounded: boolean;
    timeRule: string;
  };
  conversions: {
    performed: boolean;
    depthOriginal: string;
    depthNormalized: string | null;
  };
  warnings: RecreationalDiveWarning[];
  calculationSteps: CalculationStep[];
  sourceReference: SourceReference;
  datasetVersion: string;
  engineVersion: string;
};

export type RecreationalAirTableRow = {
  depthMeters: number;
  depthFeet: number;
  noDecompressionLimitMinutes: number;
  pressureGroupRanges: PressureGroupTimeRange[];
};
