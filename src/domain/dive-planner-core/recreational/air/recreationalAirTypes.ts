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

export type RepetitiveDiveReadinessStatus =
  | "ready_for_repetitive_input"
  | "repetitive_calculated"
  | "pending_final_pressure_group"
  | "not_applicable";

export type RepetitiveDiveReadiness = {
  status: RepetitiveDiveReadinessStatus;
  table: "Tabla II";
  previousDivePressureGroup: RecreationalPressureGroup | null;
  surfaceIntervalMinutes: number | null;
  resultingPressureGroup: RecreationalPressureGroup | null;
  datasetStatus: string;
  message: string;
};

export type RepetitiveDiveInput = {
  surfaceIntervalMinutes: number;
  secondDiveDepth: number;
  secondDiveBottomTime: number;
};

export type SurfaceIntervalStatus =
  | "not_requested"
  | "available"
  | "blocked_by_first_dive"
  | "invalid_surface_interval"
  | "surface_interval_out_of_range"
  | "pending_dataset";

export type SurfaceIntervalRange = {
  initialGroup: RecreationalPressureGroup;
  resultingGroup: RecreationalPressureGroup;
  minInclusiveMinutes: number;
  maxInclusiveMinutes: number;
};

export type SurfaceIntervalAnalysis = {
  status: SurfaceIntervalStatus;
  table: "Tabla II";
  previousDivePressureGroup: RecreationalPressureGroup | null;
  inputSurfaceIntervalMinutes: number | null;
  resultingPressureGroup: RecreationalPressureGroup | null;
  matchedRange: SurfaceIntervalRange | null;
  datasetStatus: string;
  message: string;
};

export type ResidualNitrogenStatus =
  | "not_requested"
  | "available"
  | "blocked_by_first_dive"
  | "blocked_by_surface_interval"
  | "invalid_second_dive_input"
  | "unsupported_second_dive_depth"
  | "entry_not_supported";

export type ResidualNitrogenTableEntry = {
  depthMeters: number;
  depthFeet: number;
  pressureGroup: RecreationalPressureGroup;
  residualNitrogenMinutes: number;
  adjustedNoDecompressionLimitMinutes: number | null;
};

export type ResidualNitrogenAnalysis = {
  status: ResidualNitrogenStatus;
  table: "Tabla III";
  pressureGroupAfterSurfaceInterval: RecreationalPressureGroup | null;
  secondDiveInputDepth: number | null;
  secondDiveInputBottomTime: number | null;
  secondDiveEffectiveDepth: EffectiveDepth | null;
  secondDiveDepthRounded: boolean;
  residualNitrogenMinutes: number | null;
  adjustedNoDecompressionLimitMinutes: number | null;
  totalEquivalentBottomTimeMinutes: number | null;
  remainingAdjustedNoDecompressionTimeMinutes: number | null;
  matchedEntry: ResidualNitrogenTableEntry | null;
  datasetStatus: string;
  message: string;
};

export type RepetitiveDiveStatus =
  | "not_requested"
  | "ready_for_repetitive_input"
  | "calculated_within_adjusted_limit"
  | "exceeds_adjusted_no_decompression_limit"
  | "blocked_by_first_dive"
  | "invalid_repetitive_input"
  | "surface_interval_out_of_range"
  | "unsupported_second_dive_depth"
  | "residual_table_entry_not_supported";

export type RepetitiveDiveAnalysis = {
  requested: boolean;
  status: RepetitiveDiveStatus;
  surfaceInterval: SurfaceIntervalAnalysis;
  residualNitrogen: ResidualNitrogenAnalysis;
  message: string;
};

export type RecreationalAirDiveInput = {
  depth: number;
  bottomTime: number;
  unitSystem: UnitSystem;
  gas: RecreationalGas;
  repetitiveDive?: RepetitiveDiveInput;
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
  repetitiveDiveReadiness: RepetitiveDiveReadiness;
  repetitiveDiveAnalysis: RepetitiveDiveAnalysis;
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
