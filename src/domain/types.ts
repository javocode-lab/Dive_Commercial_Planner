export type UnitSystem = "metric" | "imperial";

export type ScenarioType =
  | "sea"
  | "lake"
  | "river"
  | "quarry"
  | "reservoir";

export type DiveGas = "air";

export type AltitudeSource =
  | "not_required"
  | "manual"
  | "gps_estimated";

export type ValidationSeverity = "error" | "warning";

export type AlertLevel = "info" | "warning" | "critical";

export type CalculationStatus =
  | "review_required"
  | "blocked"
  | "mock_only";

export interface UnitSystemOption {
  value: UnitSystem;
  label: string;
  depthLabel: string;
  altitudeLabel: string;
}

export interface ScenarioOption {
  value: ScenarioType;
  label: string;
  requiresAltitude: boolean;
}

export interface DivePlanDraft {
  unitSystem: UnitSystem;
  scenario: ScenarioType;
  depthValue: string;
  plannedBottomTimeMinutes: string;
  altitudeValue: string;
  altitudeSource: AltitudeSource;
  altitudeConfirmed: boolean;
  tableId: string;
  gas: DiveGas;
  acknowledgedLimitations: boolean;
}

export interface DivePlanInput {
  unitSystem: UnitSystem;
  scenario: ScenarioType;
  depthMeters: number;
  plannedBottomTimeMinutes: number;
  altitudeMeters: number | null;
  altitudeSource: AltitudeSource;
  altitudeConfirmed: boolean;
  tableId: string;
  gas: DiveGas;
  acknowledgedLimitations: boolean;
}

export interface ValidationIssue {
  field: keyof DivePlanDraft | "general";
  severity: ValidationSeverity;
  message: string;
}

export interface DiveTableRow {
  depthMeters: number;
  ndlMinutes: number;
}

export type DiveTableValidationStatus =
  | "mock_not_validated"
  | "pending_professional_validation"
  | "validated";

export interface DiveTable {
  id: string;
  label: string;
  sourceReference: string;
  validationStatus: DiveTableValidationStatus;
  rows: DiveTableRow[];
}

export interface CalculationStep {
  title: string;
  detail: string;
}

export interface DiveAlert {
  level: AlertLevel;
  message: string;
}

export interface CalculationResult {
  id: string;
  createdAt: string;
  status: CalculationStatus;
  input: DivePlanInput | null;
  tableId: string;
  tableLabel: string;
  matchedDepthMeters: number | null;
  referenceLimitMinutes: number | null;
  plannedBottomTimeMinutes: number | null;
  remainingMarginMinutes: number | null;
  alerts: DiveAlert[];
  steps: CalculationStep[];
  validationIssues: ValidationIssue[];
}

export interface HistoryItem {
  id: string;
  createdAt: string;
  scenario: ScenarioType;
  depthMeters: number;
  plannedBottomTimeMinutes: number;
  status: CalculationStatus;
  tableLabel: string;
  referenceLimitMinutes: number | null;
}
