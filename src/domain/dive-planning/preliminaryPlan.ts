import type {
  AltitudeUnit,
  DepthUnit,
  OperationalConfirmation,
  PreliminaryDivePlan,
  PreliminaryPlanStatus,
  UnitSystem
} from "./types";

export const EMPTY_OPERATIONAL_CONFIRMATION: OperationalConfirmation = {
  waterTypeReviewed: false,
  altitudeReviewedIfNeeded: false,
  unitSystemConfirmed: false,
  depthReviewed: false,
  depthSourceIdentified: false,
  supervisorResponsible: false,
  prototypeDisclaimerAccepted: false
};

export function createInitialPreliminaryPlan(): PreliminaryDivePlan {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    waterType: null,
    scenario: null,
    portType: null,
    unitSystem: "metric",
    plannedDepth: 18,
    depthUnit: "m",
    depthSource: null,
    altitudeValue: null,
    altitudeUnit: "m",
    altitudeSource: "not_required",
    altitudeConfirmed: false,
    operationalConfirmation: { ...EMPTY_OPERATIONAL_CONFIRMATION },
    status: "not_started"
  };
}

export function getDefaultDepthForUnitSystem(unitSystem: UnitSystem): number {
  return unitSystem === "metric" ? 18 : 60;
}

export function getDepthUnitForUnitSystem(unitSystem: UnitSystem): DepthUnit {
  return unitSystem === "metric" ? "m" : "ft";
}

export function getAltitudeUnitForUnitSystem(unitSystem: UnitSystem): AltitudeUnit {
  return unitSystem === "metric" ? "m" : "ft";
}

export function convertAltitudeValue(
  value: number | null,
  fromUnit: AltitudeUnit,
  toUnit: AltitudeUnit
): number | null {
  if (value === null || fromUnit === toUnit) {
    return value;
  }

  return toUnit === "ft"
    ? Math.round(value * 3.28084)
    : Math.round(value / 3.28084);
}

export function isOperationalConfirmationComplete(
  confirmation: OperationalConfirmation
): boolean {
  return Object.values(confirmation).every(Boolean);
}

export function derivePreliminaryPlanStatus(
  plan: PreliminaryDivePlan
): PreliminaryPlanStatus {
  const hasRequiredWaterType = plan.waterType !== null;

  const hasRequiredDepth =
    plan.plannedDepth !== null && plan.plannedDepth > 0 && plan.depthSource !== null;

  const hasValidManualAltitude =
    plan.waterType !== "freshwater" ||
    plan.altitudeSource !== "manual" ||
    (plan.altitudeValue !== null && plan.altitudeValue >= 0 && plan.altitudeConfirmed);

  if (!hasRequiredWaterType || !hasRequiredDepth || !hasValidManualAltitude) {
    return "incomplete";
  }

  if (!isOperationalConfirmationComplete(plan.operationalConfirmation)) {
    return "in_progress";
  }

  return "requires_technical_phase";
}
