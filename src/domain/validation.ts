import { MESSAGES } from "../config/messages";
import type {
  DivePlanDraft,
  DivePlanInput,
  ScenarioType,
  ValidationIssue
} from "./types";
import {
  convertAltitudeToMeters,
  convertDepthToMeters,
  parsePositiveNumber
} from "./units";

export function scenarioRequiresAltitude(scenario: ScenarioType): boolean {
  return scenario !== "sea";
}

export function buildPlanInput(
  draft: DivePlanDraft
): {
  input: DivePlanInput | null;
  issues: ValidationIssue[];
} {
  const issues: ValidationIssue[] = [];

  if (!draft.acknowledgedLimitations) {
    issues.push({
      field: "acknowledgedLimitations",
      severity: "error",
      message: "Debés aceptar las limitaciones de uso antes de continuar."
    });
  }

  const depthValue = parsePositiveNumber(draft.depthValue);

  if (depthValue === null) {
    issues.push({
      field: "depthValue",
      severity: "error",
      message: "Ingresá una profundidad válida mayor a cero."
    });
  }

  const plannedBottomTime = parsePositiveNumber(
    draft.plannedBottomTimeMinutes
  );

  if (plannedBottomTime === null) {
    issues.push({
      field: "plannedBottomTimeMinutes",
      severity: "error",
      message: "Ingresá un tiempo de fondo válido mayor a cero."
    });
  }

  const requiresAltitude = scenarioRequiresAltitude(draft.scenario);
  let altitudeMeters: number | null = null;

  if (requiresAltitude) {
    const altitudeValue = parsePositiveNumber(draft.altitudeValue);

    if (altitudeValue === null) {
      issues.push({
        field: "altitudeValue",
        severity: "error",
        message: MESSAGES.altitudeRequired
      });
    } else {
      altitudeMeters = convertAltitudeToMeters(
        altitudeValue,
        draft.unitSystem
      );
    }

    if (!draft.altitudeConfirmed) {
      issues.push({
        field: "altitudeConfirmed",
        severity: "error",
        message: MESSAGES.altitudeConfirmationRequired
      });
    }

    if (draft.altitudeSource === "gps_estimated") {
      issues.push({
        field: "altitudeSource",
        severity: "warning",
        message: MESSAGES.gpsPending
      });
    }
  }

  if (!requiresAltitude && draft.altitudeSource !== "not_required") {
    issues.push({
      field: "altitudeSource",
      severity: "warning",
      message: "La altitud no se usa para escenario mar en esta versión."
    });
  }

  const hasErrors = issues.some((issue) => issue.severity === "error");

  if (hasErrors || depthValue === null || plannedBottomTime === null) {
    return {
      input: null,
      issues
    };
  }

  return {
    input: {
      unitSystem: draft.unitSystem,
      scenario: draft.scenario,
      depthMeters: convertDepthToMeters(depthValue, draft.unitSystem),
      plannedBottomTimeMinutes: plannedBottomTime,
      altitudeMeters,
      altitudeSource: requiresAltitude
        ? draft.altitudeSource
        : "not_required",
      altitudeConfirmed: requiresAltitude
        ? draft.altitudeConfirmed
        : true,
      tableId: draft.tableId,
      gas: draft.gas,
      acknowledgedLimitations: draft.acknowledgedLimitations
    },
    issues
  };
}
