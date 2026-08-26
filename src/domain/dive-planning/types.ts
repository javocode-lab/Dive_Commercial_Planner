export type WaterType = "saltwater" | "freshwater";

export type ScenarioType =
  | "sea"
  | "lake"
  | "river"
  | "quarry"
  | "port"
  | "offshore"
  | "dam"
  | "underwater_work";

export type PortType = "maritime" | "river_or_inland" | "unknown";

export type UnitSystem = "metric" | "imperial";

export type DepthUnit = "m" | "ft";

export type AltitudeUnit = "m" | "ft";

export type DepthSource =
  | "supervisor"
  | "estimated"
  | "chart_or_plan"
  | "sonar_or_measurement";

export type AltitudeSource =
  | "not_required"
  | "pending"
  | "manual"
  | "gps_estimated";

export type PreliminaryPlanStatus =
  | "not_started"
  | "in_progress"
  | "incomplete"
  | "preliminary_complete"
  | "requires_technical_phase";

export type OperationalConfirmation = {
  waterTypeReviewed: boolean;
  altitudeReviewedIfNeeded: boolean;
  unitSystemConfirmed: boolean;
  depthReviewed: boolean;
  depthSourceIdentified: boolean;
  supervisorResponsible: boolean;
  prototypeDisclaimerAccepted: boolean;
};

export type PreliminaryDivePlan = {
  id: string;
  createdAt: string;
  waterType: WaterType | null;
  scenario: ScenarioType | null;
  portType: PortType | null;
  unitSystem: UnitSystem;
  plannedDepth: number | null;
  depthUnit: DepthUnit;
  depthSource: DepthSource | null;
  altitudeValue: number | null;
  altitudeUnit: AltitudeUnit;
  altitudeSource: AltitudeSource;
  altitudeConfirmed: boolean;
  operationalConfirmation: OperationalConfirmation;
  status: PreliminaryPlanStatus;
};

export type WizardStep =
  | "start"
  | "intro"
  | "scenario"
  | "units"
  | "depth"
  | "confirmation"
  | "summary";
