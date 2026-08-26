import { MESSAGES } from "../config/messages";
import { MOCK_AIR_NO_DECO_TABLE } from "../data/tables/mockAirNoDecoTable";
import type {
  CalculationResult,
  CalculationStep,
  DiveAlert,
  DivePlanDraft,
  DivePlanInput,
  DiveTable,
  DiveTableRow,
  ValidationIssue
} from "./types";
import { buildPlanInput, scenarioRequiresAltitude } from "./validation";
import { formatMeters, formatMinutes } from "./units";

function createResultId(): string {
  return `plan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function findCeilDepthRow(
  depthMeters: number,
  rows: DiveTableRow[]
): DiveTableRow | null {
  const sortedRows = [...rows].sort((a, b) => a.depthMeters - b.depthMeters);

  return sortedRows.find((row) => row.depthMeters >= depthMeters) ?? null;
}

function createBaseSteps(
  input: DivePlanInput | null,
  table: DiveTable
): CalculationStep[] {
  if (!input) {
    return [
      {
        title: "Validación inicial",
        detail: "El cálculo no se ejecutó porque el plan tiene errores."
      }
    ];
  }

  return [
    {
      title: "Fuente de tabla",
      detail: `${table.label}. Estado: ${table.validationStatus}.`
    },
    {
      title: "Normalización de unidades",
      detail: `Profundidad normalizada: ${formatMeters(input.depthMeters)}.`
    },
    {
      title: "Tiempo de fondo planificado",
      detail: `Tiempo informado: ${formatMinutes(
        input.plannedBottomTimeMinutes
      )}.`
    }
  ];
}

function createMockTableAlert(): DiveAlert {
  return {
    level: "critical",
    message: MESSAGES.mockTableWarning
  };
}

function createBlockedResult(params: {
  table: DiveTable;
  input: DivePlanInput | null;
  validationIssues: ValidationIssue[];
  alerts: DiveAlert[];
  steps: CalculationStep[];
}): CalculationResult {
  return {
    id: createResultId(),
    createdAt: new Date().toISOString(),
    status: "blocked",
    input: params.input,
    tableId: params.table.id,
    tableLabel: params.table.label,
    matchedDepthMeters: null,
    referenceLimitMinutes: null,
    plannedBottomTimeMinutes:
      params.input?.plannedBottomTimeMinutes ?? null,
    remainingMarginMinutes: null,
    alerts: params.alerts,
    steps: params.steps,
    validationIssues: params.validationIssues
  };
}

export function calculateDivePlan(
  draft: DivePlanDraft,
  table: DiveTable = MOCK_AIR_NO_DECO_TABLE
): CalculationResult {
  const { input, issues } = buildPlanInput(draft);
  const steps = createBaseSteps(input, table);
  const alerts: DiveAlert[] = [createMockTableAlert()];

  if (!input) {
    return createBlockedResult({
      table,
      input,
      validationIssues: issues,
      alerts,
      steps
    });
  }

  if (input.gas !== "air") {
    alerts.push({
      level: "critical",
      message: "v0.1 solo prepara estructura para aire. Otros gases quedan fuera."
    });

    return createBlockedResult({
      table,
      input,
      validationIssues: issues,
      alerts,
      steps
    });
  }

  if (scenarioRequiresAltitude(input.scenario)) {
    steps.push({
      title: "Altitud",
      detail: `Altitud normalizada: ${
        input.altitudeMeters === null
          ? "sin dato"
          : formatMeters(input.altitudeMeters)
      }. Fuente: ${input.altitudeSource}. Confirmada: ${
        input.altitudeConfirmed ? "sí" : "no"
      }.`
    });

    alerts.push({
      level: "critical",
      message: MESSAGES.altitudeModelPending
    });

    return createBlockedResult({
      table,
      input,
      validationIssues: issues,
      alerts,
      steps: [
        ...steps,
        {
          title: "Bloqueo responsable",
          detail:
            "El escenario requiere corrección por altitud/ESLD. En v0.1 queda bloqueado hasta cargar fórmula y tablas validadas."
        }
      ]
    });
  }

  const matchedRow = findCeilDepthRow(input.depthMeters, table.rows);

  if (!matchedRow) {
    alerts.push({
      level: "critical",
      message:
        "La profundidad excede el rango del catálogo mock cargado para v0.1."
    });

    return createBlockedResult({
      table,
      input,
      validationIssues: issues,
      alerts,
      steps: [
        ...steps,
        {
          title: "Búsqueda en tabla",
          detail:
            "No se encontró una fila de profundidad igual o superior en la tabla mock."
        }
      ]
    });
  }

  const remainingMarginMinutes =
    matchedRow.ndlMinutes - input.plannedBottomTimeMinutes;

  steps.push({
    title: "Redondeo conservador de profundidad",
    detail: `Se seleccionó la primera fila mock igual o superior: ${formatMeters(
      matchedRow.depthMeters
    )}.`
  });

  steps.push({
    title: "Comparación contra límite mock",
    detail: `Límite mock: ${formatMinutes(
      matchedRow.ndlMinutes
    )}. Margen preliminar: ${formatMinutes(remainingMarginMinutes)}.`
  });

  if (remainingMarginMinutes < 0) {
    alerts.push({
      level: "critical",
      message:
        "El tiempo de fondo informado supera el límite de la tabla mock."
    });

    return {
      id: createResultId(),
      createdAt: new Date().toISOString(),
      status: "blocked",
      input,
      tableId: table.id,
      tableLabel: table.label,
      matchedDepthMeters: matchedRow.depthMeters,
      referenceLimitMinutes: matchedRow.ndlMinutes,
      plannedBottomTimeMinutes: input.plannedBottomTimeMinutes,
      remainingMarginMinutes,
      alerts,
      steps,
      validationIssues: issues
    };
  }

  alerts.push({
    level: "warning",
    message:
      "Resultado navegable solo para validar flujo. No habilita planificación real."
  });

  return {
    id: createResultId(),
    createdAt: new Date().toISOString(),
    status: "mock_only",
    input,
    tableId: table.id,
    tableLabel: table.label,
    matchedDepthMeters: matchedRow.depthMeters,
    referenceLimitMinutes: matchedRow.ndlMinutes,
    plannedBottomTimeMinutes: input.plannedBottomTimeMinutes,
    remainingMarginMinutes,
    alerts,
    steps,
    validationIssues: issues
  };
}
