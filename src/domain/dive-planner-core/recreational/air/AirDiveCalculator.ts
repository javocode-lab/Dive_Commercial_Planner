import {
  CMAS_FEDECAS_TABLE_I_DATASET_VERSION,
  CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH,
  CMAS_FEDECAS_TABLE_I_PRESSURE_GROUP_STATUS,
  CMAS_FEDECAS_TABLE_I_SOURCE,
  recreationalAirCmasFedecasTableI
} from "../datasets/cmasFedecasTableI";
import type { CalculationStep } from "../../shared/trace";
import { feetToMeters, formatDepth, formatMinutes, getDepthUnit, metersToFeet } from "../../shared/units";
import type {
  EffectiveDepth,
  FinalPressureGroup,
  NormalizedDiveInput,
  RecreationalAirDiveInput,
  RecreationalAirDiveResult,
  RecreationalAirTableRow,
  RecreationalDiveStatus,
  RecreationalDiveWarning
} from "./recreationalAirTypes";

export const RECREATIONAL_AIR_ENGINE_VERSION = "recreational-air-engine-v0.2.3";

function createResultId(): string {
  return `recreational_air_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function createStep(
  id: string,
  category: CalculationStep["category"],
  title: string,
  detail: string,
  data?: CalculationStep["data"]
): CalculationStep {
  return { id, category, title, detail, data };
}

function isPositiveFiniteNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function normalizeInput(input: RecreationalAirDiveInput): NormalizedDiveInput {
  return input.unitSystem === "metric"
    ? { depthMeters: input.depth, depthFeet: metersToFeet(input.depth), bottomTimeMinutes: input.bottomTime }
    : { depthMeters: feetToMeters(input.depth), depthFeet: input.depth, bottomTimeMinutes: input.bottomTime };
}

function findEffectiveDepthRow(input: RecreationalAirDiveInput): RecreationalAirTableRow | null {
  const rows = [...recreationalAirCmasFedecasTableI].sort((a, b) =>
    input.unitSystem === "metric" ? a.depthMeters - b.depthMeters : a.depthFeet - b.depthFeet
  );

  return input.unitSystem === "metric"
    ? rows.find((row) => row.depthMeters >= input.depth) ?? null
    : rows.find((row) => row.depthFeet >= input.depth) ?? null;
}

function isDepthAboveOperationalMaximum(input: RecreationalAirDiveInput): boolean {
  return input.unitSystem === "metric"
    ? input.depth > CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH.meters
    : input.depth > CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH.feet;
}

function notApplicablePressureGroup(message: string): FinalPressureGroup {
  return {
    status: "not_applicable",
    group: null,
    table: "Tabla I",
    datasetStatus: CMAS_FEDECAS_TABLE_I_PRESSURE_GROUP_STATUS,
    message,
    matchedRange: null
  };
}

function determineFinalPressureGroup(row: RecreationalAirTableRow, bottomTime: number): FinalPressureGroup {
  const hasValidatedRanges = row.pressureGroupRanges.length > 0;

  if (!hasValidatedRanges) {
    return {
      status: "pending_dataset",
      group: null,
      table: "Tabla I",
      datasetStatus: CMAS_FEDECAS_TABLE_I_PRESSURE_GROUP_STATUS,
      message:
        `Grupo de presión final no asignado todavía. La estructura está preparada para ${row.depthMeters} m / ${row.depthFeet} ft y ${bottomTime} min, pero faltan los rangos A-M validados.`,
      matchedRange: null
    };
  }

  const matchingRange = row.pressureGroupRanges.find(
    (range) => bottomTime > range.minExclusiveTimeMinutes && bottomTime <= range.maxInclusiveTimeMinutes
  );

  return matchingRange
    ? {
      status: "available",
      group: matchingRange.group,
      table: "Tabla I",
      datasetStatus: CMAS_FEDECAS_TABLE_I_PRESSURE_GROUP_STATUS,
      message:
        `Grupo de presión final asignado: ${matchingRange.group}. Rango usado: más de ${matchingRange.minExclusiveTimeMinutes} min y hasta ${matchingRange.maxInclusiveTimeMinutes} min para ${row.depthMeters} m / ${row.depthFeet} ft.`,
      matchedRange: matchingRange
    }
    : {
      status: "pending_dataset",
      group: null,
      table: "Tabla I",
      datasetStatus: CMAS_FEDECAS_TABLE_I_PRESSURE_GROUP_STATUS,
      message: "No se encontró un rango de grupo de presión aplicable para el tiempo evaluado.",
      matchedRange: null
    };
}

function buildBaseResult(params: {
  input: RecreationalAirDiveInput;
  status: RecreationalDiveStatus;
  resultLabel: string;
  normalizedInput: NormalizedDiveInput | null;
  effectiveDepth: EffectiveDepth | null;
  effectiveTime: number | null;
  limit: number | null;
  remainingTime: number | null;
  finalPressureGroup: FinalPressureGroup;
  rounding: RecreationalAirDiveResult["rounding"];
  conversions: RecreationalAirDiveResult["conversions"];
  warnings: RecreationalDiveWarning[];
  calculationSteps: CalculationStep[];
}): RecreationalAirDiveResult {
  return {
    id: createResultId(),
    createdAt: new Date().toISOString(),
    status: params.status,
    resultLabel: params.resultLabel,
    input: params.input,
    normalizedInput: params.normalizedInput,
    effectiveDepth: params.effectiveDepth,
    effectiveTime: params.effectiveTime,
    limit: params.limit,
    remainingTime: params.remainingTime,
    finalPressureGroup: params.finalPressureGroup,
    rounding: params.rounding,
    conversions: params.conversions,
    warnings: params.warnings,
    calculationSteps: params.calculationSteps,
    sourceReference: CMAS_FEDECAS_TABLE_I_SOURCE,
    datasetVersion: CMAS_FEDECAS_TABLE_I_DATASET_VERSION,
    engineVersion: RECREATIONAL_AIR_ENGINE_VERSION
  };
}

export function calculateRecreationalAirDive(input: RecreationalAirDiveInput): RecreationalAirDiveResult {
  const depthUnit = getDepthUnit(input.unitSystem);
  const warnings: RecreationalDiveWarning[] = [];
  const steps: CalculationStep[] = [
    createStep(
      "input-001",
      "input",
      "Datos ingresados",
      `Profundidad: ${formatDepth(input.depth, depthUnit)}. Tiempo de fondo: ${formatMinutes(input.bottomTime)}. Gas: aire. Sistema: ${input.unitSystem === "metric" ? "métrico" : "imperial"}.`,
      { depth: input.depth, unitSystem: input.unitSystem, bottomTime: input.bottomTime, gas: input.gas }
    ),
    createStep(
      "source-001",
      "source",
      "Fuente técnica seleccionada",
      `${CMAS_FEDECAS_TABLE_I_SOURCE.name}. ${CMAS_FEDECAS_TABLE_I_SOURCE.table}. Dataset: ${CMAS_FEDECAS_TABLE_I_DATASET_VERSION}. Motor: ${RECREATIONAL_AIR_ENGINE_VERSION}.`
    )
  ];

  const emptyRounding = {
    depthRounded: false,
    depthRule: "Profundidad no evaluada por error de entrada.",
    timeRounded: false,
    timeRule: "El tiempo no se redondea; se compara exacto contra el límite tabular."
  };

  if (input.gas !== "air" || !isPositiveFiniteNumber(input.depth) || !isPositiveFiniteNumber(input.bottomTime)) {
    warnings.push({
      level: "critical",
      message:
        input.gas !== "air"
          ? "Esta versión del motor recreativo solo soporta aire."
          : "La profundidad y el tiempo de fondo deben ser valores numéricos positivos."
    });
    steps.push(
      createStep(
        "validation-001",
        "validation",
        "Validación de entrada",
        "Los datos ingresados no permiten ejecutar el cálculo tabular."
      ),
      createStep(
        "pressure-group-001",
        "pressureGroup",
        "Grupo de presión final",
        "No aplica porque el cálculo quedó bloqueado por datos inválidos. No se consulta la estructura de grupos repetitivos."
      )
    );

    return buildBaseResult({
      input,
      status: "invalid_input",
      resultLabel: "Datos inválidos",
      normalizedInput: null,
      effectiveDepth: null,
      effectiveTime: null,
      limit: null,
      remainingTime: null,
      finalPressureGroup: notApplicablePressureGroup("No aplica por datos inválidos."),
      rounding: emptyRounding,
      conversions: { performed: false, depthOriginal: formatDepth(input.depth, depthUnit), depthNormalized: null },
      warnings,
      calculationSteps: steps
    });
  }

  const normalizedInput = normalizeInput(input);
  const conversionPerformed = input.unitSystem === "imperial";
  const normalizedLabel = `${formatDepth(Number(normalizedInput.depthMeters.toFixed(1)), "m")} / ${formatDepth(Number(normalizedInput.depthFeet.toFixed(1)), "ft")}`;

  steps.push(
    createStep(
      "conversion-001",
      "conversion",
      "Conversión y normalización",
      input.unitSystem === "metric"
        ? `No se convierte la profundidad para buscar en la columna métrica. Valor normalizado: ${formatDepth(input.depth, "m")} ≈ ${formatDepth(Number(normalizedInput.depthFeet.toFixed(1)), "ft")}.`
        : `Profundidad ingresada: ${formatDepth(input.depth, "ft")}. Equivalencia informativa: ${formatDepth(Number(normalizedInput.depthMeters.toFixed(1)), "m")}. La búsqueda se realiza contra columnas imperiales de la tabla.`,
      { depthMeters: Number(normalizedInput.depthMeters.toFixed(2)), depthFeet: Number(normalizedInput.depthFeet.toFixed(2)) }
    )
  );

  if (isDepthAboveOperationalMaximum(input)) {
    warnings.push({
      level: "critical",
      message: `La profundidad excede el máximo operativo de la Tabla I (${CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH.meters} m / ${CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH.feet} ft).`
    });
    steps.push(
      createStep(
        "validation-003",
        "validation",
        "Validación de profundidad máxima",
        `Máximo operativo configurado: ${CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH.meters} m / ${CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH.feet} ft. La profundidad ingresada queda fuera de alcance. No se busca límite tabular.`
      ),
      createStep(
        "pressure-group-002",
        "pressureGroup",
        "Grupo de presión final",
        "No aplica porque la profundidad excede el máximo operativo de Tabla I. No se asigna grupo para un caso fuera de alcance."
      )
    );

    return buildBaseResult({
      input,
      status: "unsupported_depth",
      resultLabel: "Profundidad fuera del alcance de la tabla",
      normalizedInput,
      effectiveDepth: null,
      effectiveTime: input.bottomTime,
      limit: null,
      remainingTime: null,
      finalPressureGroup: notApplicablePressureGroup("No aplica porque la profundidad excede el máximo operativo de la tabla."),
      rounding: {
        depthRounded: false,
        depthRule: "No se redondea porque la profundidad excede el máximo operativo.",
        timeRounded: false,
        timeRule: "El tiempo no se evalúa porque no hay profundidad tabular aplicable."
      },
      conversions: { performed: conversionPerformed, depthOriginal: formatDepth(input.depth, depthUnit), depthNormalized: normalizedLabel },
      warnings,
      calculationSteps: steps
    });
  }

  const effectiveRow = findEffectiveDepthRow(input);

  if (!effectiveRow) {
    warnings.push({ level: "critical", message: "No se encontró una profundidad tabular igual o superior." });
    steps.push(
      createStep("lookup-001", "lookup", "Búsqueda de profundidad", "No se encontró una columna de profundidad aplicable. El cálculo queda bloqueado."),
      createStep("pressure-group-003", "pressureGroup", "Grupo de presión final", "No aplica porque no hubo profundidad tabular aplicable.")
    );

    return buildBaseResult({
      input,
      status: "unsupported_depth",
      resultLabel: "Profundidad fuera del alcance de la tabla",
      normalizedInput,
      effectiveDepth: null,
      effectiveTime: input.bottomTime,
      limit: null,
      remainingTime: null,
      finalPressureGroup: notApplicablePressureGroup("No aplica porque no hubo profundidad tabular aplicable."),
      rounding: { depthRounded: false, depthRule: "No hubo fila tabular aplicable.", timeRounded: false, timeRule: "El tiempo no se redondea." },
      conversions: { performed: conversionPerformed, depthOriginal: formatDepth(input.depth, depthUnit), depthNormalized: normalizedLabel },
      warnings,
      calculationSteps: steps
    });
  }

  const effectiveDepth: EffectiveDepth = { meters: effectiveRow.depthMeters, feet: effectiveRow.depthFeet, unitUsedForLookup: depthUnit };
  const depthRounded = input.unitSystem === "metric" ? effectiveRow.depthMeters !== input.depth : effectiveRow.depthFeet !== input.depth;
  const remainingTime = effectiveRow.noDecompressionLimitMinutes - input.bottomTime;
  const finalPressureGroup = remainingTime >= 0
    ? determineFinalPressureGroup(effectiveRow, input.bottomTime)
    : notApplicablePressureGroup("No se asigna grupo de presión final porque el tiempo excede el límite sin descompresión de la profundidad efectiva.");

  steps.push(
    createStep(
      "rounding-001",
      "rounding",
      "Redondeo de profundidad",
      depthRounded
        ? `La profundidad ingresada no coincide exactamente con una columna. Regla aplicada: redondear siempre hacia arriba. Profundidad efectiva: ${effectiveRow.depthMeters} m / ${effectiveRow.depthFeet} ft.`
        : `La profundidad ingresada coincide con una columna de tabla. Profundidad efectiva: ${effectiveRow.depthMeters} m / ${effectiveRow.depthFeet} ft.`,
      { depthRounded, effectiveDepthMeters: effectiveRow.depthMeters, effectiveDepthFeet: effectiveRow.depthFeet }
    ),
    createStep(
      "lookup-002",
      "lookup",
      "Límite tabular encontrado",
      `Para ${effectiveRow.depthMeters} m / ${effectiveRow.depthFeet} ft, Tabla I indica un límite sin descompresión de ${effectiveRow.noDecompressionLimitMinutes} minutos.`,
      { limitMinutes: effectiveRow.noDecompressionLimitMinutes }
    ),
    createStep(
      "pressure-group-004",
      "pressureGroup",
      "Grupo de presión final",
      `Se consulta Tabla I para obtener la letra de clasificación al final de la inmersión. Profundidad efectiva: ${effectiveRow.depthMeters} m / ${effectiveRow.depthFeet} ft. Tiempo evaluado: ${input.bottomTime} min. Decisión: ${finalPressureGroup.message}.`,
      {
        finalPressureGroupAvailable: finalPressureGroup.status === "available",
        finalPressureGroup: finalPressureGroup.group,
        effectiveDepthMeters: effectiveRow.depthMeters,
        effectiveDepthFeet: effectiveRow.depthFeet,
        bottomTimeMinutes: input.bottomTime,
        matchedRangeGroup: finalPressureGroup.matchedRange?.group ?? null,
        matchedRangeMinExclusiveMinutes:
          finalPressureGroup.matchedRange?.minExclusiveTimeMinutes ?? null,
        matchedRangeMaxInclusiveMinutes:
          finalPressureGroup.matchedRange?.maxInclusiveTimeMinutes ?? null
      }
    ),
    createStep(
      "comparison-001",
      "comparison",
      "Comparación de tiempo",
      `El tiempo ingresado se evalúa exacto, sin redondeo. Cálculo: ${effectiveRow.noDecompressionLimitMinutes} - ${input.bottomTime} = ${remainingTime} minutos.`,
      { limitMinutes: effectiveRow.noDecompressionLimitMinutes, bottomTimeMinutes: input.bottomTime, remainingTimeMinutes: remainingTime }
    )
  );

  if (remainingTime < 0) {
    warnings.push({ level: "critical", message: `El tiempo de fondo excede el límite tabular por ${Math.abs(remainingTime)} minutos.` });
    steps.push(
      createStep(
        "result-001",
        "result",
        "Resultado final",
        "El tiempo de fondo supera el límite de la profundidad efectiva. El resultado no debe presentarse como planificación válida."
      )
    );

    return buildBaseResult({
      input,
      status: "exceeds_table_time_limit",
      resultLabel: "Excede el límite tabular",
      normalizedInput,
      effectiveDepth,
      effectiveTime: input.bottomTime,
      limit: effectiveRow.noDecompressionLimitMinutes,
      remainingTime,
      finalPressureGroup,
      rounding: {
        depthRounded,
        depthRule: "Profundidad redondeada siempre hacia arriba a la siguiente columna disponible.",
        timeRounded: false,
        timeRule: "El tiempo no se redondea; se compara exacto contra el límite tabular."
      },
      conversions: { performed: conversionPerformed, depthOriginal: formatDepth(input.depth, depthUnit), depthNormalized: normalizedLabel },
      warnings,
      calculationSteps: steps
    });
  }

  warnings.push({
    level: remainingTime <= 5 ? "warning" : "info",
    message:
      remainingTime <= 5
        ? "Margen bajo contra el límite tabular. Requiere revisión manual cuidadosa."
        : "Resultado calculado para revisión manual; no autoriza una inmersión."
  });

  if (finalPressureGroup.status === "available" && finalPressureGroup.group) {
    warnings.push({
      level: "info",
      message: `Grupo de presión final calculado para revisión manual: ${finalPressureGroup.group}.`
    });
  }

  steps.push(
    createStep(
      "result-002",
      "result",
      "Resultado final",
      `El tiempo de fondo queda dentro del límite tabular. Tiempo restante: ${remainingTime} minutos. Requiere validación manual.`,
      { status: "within_table_limit", remainingTimeMinutes: remainingTime }
    )
  );

  return buildBaseResult({
    input,
    status: "within_table_limit",
    resultLabel: "Dentro del límite tabular",
    normalizedInput,
    effectiveDepth,
    effectiveTime: input.bottomTime,
    limit: effectiveRow.noDecompressionLimitMinutes,
    remainingTime,
    finalPressureGroup,
    rounding: {
      depthRounded,
      depthRule: "Profundidad redondeada siempre hacia arriba a la siguiente columna disponible.",
      timeRounded: false,
      timeRule: "El tiempo no se redondea; se compara exacto contra el límite tabular."
    },
    conversions: { performed: conversionPerformed, depthOriginal: formatDepth(input.depth, depthUnit), depthNormalized: normalizedLabel },
    warnings,
    calculationSteps: steps
  });
}
