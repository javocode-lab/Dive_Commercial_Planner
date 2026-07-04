import type {
  DepthUnit,
  OperationalConfirmation,
  PreliminaryDivePlan,
  PreliminaryPlanStatus,
  UnitSystem
} from "./types";

export const EMPTY_OPERATIONAL_CONFIRMATION: OperationalConfirmation = {
  scenarioReviewed: false,
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
    scenario: null,
    portType: null,
    unitSystem: "metric",
    plannedDepth: 18,
    depthUnit: "m",
    depthSource: null,
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

export function isOperationalConfirmationComplete(
  confirmation: OperationalConfirmation
): boolean {
  return Object.values(confirmation).every(Boolean);
}

export function derivePreliminaryPlanStatus(
  plan: PreliminaryDivePlan
): PreliminaryPlanStatus {
  const hasRequiredScenario =
    plan.scenario !== null &&
    (plan.scenario !== "port" || plan.portType !== null);

  const hasRequiredDepth =
    plan.plannedDepth !== null && plan.plannedDepth > 0 && plan.depthSource !== null;

  if (!hasRequiredScenario || !hasRequiredDepth) {
    return "incomplete";
  }

  if (!isOperationalConfirmationComplete(plan.operationalConfirmation)) {
    return "in_progress";
  }

  return "requires_technical_phase";
}
