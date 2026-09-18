import {
  CMAS_FEDECAS_TABLE_I_DATASET_VERSION,
  CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH,
  CMAS_FEDECAS_TABLE_I_PRESSURE_GROUP_STATUS,
  CMAS_FEDECAS_TABLE_I_SOURCE,
  recreationalAirCmasFedecasTableI
} from "../datasets/cmasFedecasTableI";
import {
  CMAS_FEDECAS_TABLE_II_DATASET_VERSION,
  CMAS_FEDECAS_TABLE_II_STATUS,
  cmasFedecasTableIISurfaceIntervalTransitions
} from "../datasets/cmasFedecasTableII";
import {
  CMAS_FEDECAS_TABLE_III_DATASET_VERSION,
  CMAS_FEDECAS_TABLE_III_MAX_DEPTH,
  CMAS_FEDECAS_TABLE_III_STATUS,
  cmasFedecasTableIIIResidualNitrogenEntries
} from "../datasets/cmasFedecasTableIII";
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
  RecreationalDiveWarning,
  RepetitiveDiveAnalysis,
  RepetitiveDiveReadiness,
  ResidualNitrogenAnalysis,
  ResidualNitrogenTableEntry,
  SurfaceIntervalAnalysis
} from "./recreationalAirTypes";

export const RECREATIONAL_AIR_ENGINE_VERSION = "recreational-air-engine-v0.2.5";

const COMBINED_DATASET_VERSION = [
  CMAS_FEDECAS_TABLE_I_DATASET_VERSION,
  CMAS_FEDECAS_TABLE_II_DATASET_VERSION,
  CMAS_FEDECAS_TABLE_III_DATASET_VERSION
].join(" + ");

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

function formatClockMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins.toString().padStart(2, "0")}`;
}

function normalizeInput(input: RecreationalAirDiveInput): NormalizedDiveInput {
  return input.unitSystem === "metric"
    ? { depthMeters: input.depth, depthFeet: metersToFeet(input.depth), bottomTimeMinutes: input.bottomTime }
    : { depthMeters: feetToMeters(input.depth), depthFeet: input.depth, bottomTimeMinutes: input.bottomTime };
}

function findEffectiveDepthRow(depth: number, unitSystem: RecreationalAirDiveInput["unitSystem"]): RecreationalAirTableRow | null {
  const rows = [...recreationalAirCmasFedecasTableI].sort((a, b) =>
    unitSystem === "metric" ? a.depthMeters - b.depthMeters : a.depthFeet - b.depthFeet
  );

  return unitSystem === "metric"
    ? rows.find((row) => row.depthMeters >= depth) ?? null
    : rows.find((row) => row.depthFeet >= depth) ?? null;
}

function isDepthAboveOperationalMaximum(depth: number, unitSystem: RecreationalAirDiveInput["unitSystem"]): boolean {
  return unitSystem === "metric"
    ? depth > CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH.meters
    : depth > CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH.feet;
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

function emptySurfaceIntervalAnalysis(
  status: SurfaceIntervalAnalysis["status"],
  message: string,
  input: RecreationalAirDiveInput,
  previousDivePressureGroup: SurfaceIntervalAnalysis["previousDivePressureGroup"] = null
): SurfaceIntervalAnalysis {
  return {
    status,
    table: "Tabla II",
    previousDivePressureGroup,
    inputSurfaceIntervalMinutes: input.repetitiveDive?.surfaceIntervalMinutes ?? null,
    resultingPressureGroup: null,
    matchedRange: null,
    datasetStatus: CMAS_FEDECAS_TABLE_II_STATUS,
    message
  };
}

function emptyResidualNitrogenAnalysis(
  status: ResidualNitrogenAnalysis["status"],
  message: string,
  input: RecreationalAirDiveInput,
  pressureGroupAfterSurfaceInterval: ResidualNitrogenAnalysis["pressureGroupAfterSurfaceInterval"] = null
): ResidualNitrogenAnalysis {
  return {
    status,
    table: "Tabla III",
    pressureGroupAfterSurfaceInterval,
    secondDiveInputDepth: input.repetitiveDive?.secondDiveDepth ?? null,
    secondDiveInputBottomTime: input.repetitiveDive?.secondDiveBottomTime ?? null,
    secondDiveEffectiveDepth: null,
    secondDiveDepthRounded: false,
    residualNitrogenMinutes: null,
    adjustedNoDecompressionLimitMinutes: null,
    totalEquivalentBottomTimeMinutes: null,
    remainingAdjustedNoDecompressionTimeMinutes: null,
    matchedEntry: null,
    datasetStatus: CMAS_FEDECAS_TABLE_III_STATUS,
    message
  };
}

function buildRepetitiveDiveReadiness(analysis: RepetitiveDiveAnalysis): RepetitiveDiveReadiness {
  return {
    status:
      analysis.status === "not_requested" && analysis.surfaceInterval.previousDivePressureGroup
        ? "ready_for_repetitive_input"
        : analysis.status === "calculated_within_adjusted_limit" || analysis.status === "exceeds_adjusted_no_decompression_limit"
          ? "repetitive_calculated"
          : analysis.status === "ready_for_repetitive_input"
            ? "ready_for_repetitive_input"
            : analysis.status === "blocked_by_first_dive"
              ? "pending_final_pressure_group"
              : "not_applicable",
    table: "Tabla II",
    previousDivePressureGroup: analysis.surfaceInterval.previousDivePressureGroup,
    surfaceIntervalMinutes: analysis.surfaceInterval.inputSurfaceIntervalMinutes,
    resultingPressureGroup: analysis.surfaceInterval.resultingPressureGroup,
    datasetStatus: analysis.surfaceInterval.datasetStatus,
    message: analysis.message
  };
}

function findSurfaceIntervalAnalysis(
  input: RecreationalAirDiveInput,
  finalPressureGroup: FinalPressureGroup
): SurfaceIntervalAnalysis {
  if (!input.repetitiveDive) {
    return emptySurfaceIntervalAnalysis(
      "not_requested",
      finalPressureGroup.group
        ? `Primera inmersión con grupo final ${finalPressureGroup.group}. Se puede ingresar intervalo en superficie para calcular repetitiva.`
        : "No se solicitó cálculo repetitivo.",
      input,
      finalPressureGroup.group
    );
  }

  if (finalPressureGroup.status !== "available" || !finalPressureGroup.group) {
    return emptySurfaceIntervalAnalysis(
      "blocked_by_first_dive",
      "No se puede aplicar Tabla II porque la primera inmersión no produjo un grupo de presión final utilizable.",
      input
    );
  }

  const surfaceIntervalMinutes = input.repetitiveDive.surfaceIntervalMinutes;

  if (!isPositiveFiniteNumber(surfaceIntervalMinutes)) {
    return emptySurfaceIntervalAnalysis(
      "invalid_surface_interval",
      "El intervalo en superficie debe ser un valor positivo en minutos.",
      input,
      finalPressureGroup.group
    );
  }

  const matchingRange = cmasFedecasTableIISurfaceIntervalTransitions.find(
    (range) =>
      range.initialGroup === finalPressureGroup.group &&
      surfaceIntervalMinutes >= range.minInclusiveMinutes &&
      surfaceIntervalMinutes <= range.maxInclusiveMinutes
  );

  if (!matchingRange) {
    return emptySurfaceIntervalAnalysis(
      "surface_interval_out_of_range",
      "El intervalo en superficie ingresado queda fuera de los rangos cargados de Tabla II. El prototipo no extrapola fuera de 0:10 a 12:00.",
      input,
      finalPressureGroup.group
    );
  }

  return {
    status: "available",
    table: "Tabla II",
    previousDivePressureGroup: finalPressureGroup.group,
    inputSurfaceIntervalMinutes: surfaceIntervalMinutes,
    resultingPressureGroup: matchingRange.resultingGroup,
    matchedRange: matchingRange,
    datasetStatus: CMAS_FEDECAS_TABLE_II_STATUS,
    message:
      `Tabla II: grupo inicial ${finalPressureGroup.group}, intervalo ${formatClockMinutes(surfaceIntervalMinutes)}, rango ${formatClockMinutes(matchingRange.minInclusiveMinutes)} a ${formatClockMinutes(matchingRange.maxInclusiveMinutes)}. Nuevo grupo de presión: ${matchingRange.resultingGroup}.`
  };
}

function findTableIIIEntry(
  pressureGroup: ResidualNitrogenTableEntry["pressureGroup"],
  secondDiveDepth: number,
  unitSystem: RecreationalAirDiveInput["unitSystem"]
): { entry: ResidualNitrogenTableEntry | null; effectiveDepth: EffectiveDepth | null; depthRounded: boolean } {
  if (unitSystem === "metric" ? secondDiveDepth > CMAS_FEDECAS_TABLE_III_MAX_DEPTH.meters : secondDiveDepth > CMAS_FEDECAS_TABLE_III_MAX_DEPTH.feet) {
    return { entry: null, effectiveDepth: null, depthRounded: false };
  }

  const rows = [...new Map(cmasFedecasTableIIIResidualNitrogenEntries.map((entry) => [`${entry.depthMeters}-${entry.depthFeet}`, entry])).values()]
    .sort((a, b) => (unitSystem === "metric" ? a.depthMeters - b.depthMeters : a.depthFeet - b.depthFeet));

  const effectiveRow = unitSystem === "metric"
    ? rows.find((row) => row.depthMeters >= secondDiveDepth) ?? null
    : rows.find((row) => row.depthFeet >= secondDiveDepth) ?? null;

  if (!effectiveRow) {
    return { entry: null, effectiveDepth: null, depthRounded: false };
  }

  const entry = cmasFedecasTableIIIResidualNitrogenEntries.find(
    (candidate) => candidate.depthMeters === effectiveRow.depthMeters && candidate.pressureGroup === pressureGroup
  ) ?? null;

  return {
    entry,
    effectiveDepth: {
      meters: effectiveRow.depthMeters,
      feet: effectiveRow.depthFeet,
      unitUsedForLookup: unitSystem === "metric" ? "m" : "ft"
    },
    depthRounded: unitSystem === "metric" ? effectiveRow.depthMeters !== secondDiveDepth : effectiveRow.depthFeet !== secondDiveDepth
  };
}

function analyzeResidualNitrogen(
  input: RecreationalAirDiveInput,
  surfaceInterval: SurfaceIntervalAnalysis
): ResidualNitrogenAnalysis {
  if (!input.repetitiveDive) {
    return emptyResidualNitrogenAnalysis("not_requested", "No se solicitó cálculo de nitrógeno residual.", input, surfaceInterval.resultingPressureGroup);
  }

  if (surfaceInterval.status === "blocked_by_first_dive") {
    return emptyResidualNitrogenAnalysis("blocked_by_first_dive", "No se calcula Tabla III porque la primera inmersión no dejó grupo final utilizable.", input);
  }

  if (surfaceInterval.status !== "available" || !surfaceInterval.resultingPressureGroup) {
    return emptyResidualNitrogenAnalysis("blocked_by_surface_interval", "No se calcula Tabla III porque el intervalo en superficie no produjo nuevo grupo de presión.", input);
  }

  const { secondDiveDepth, secondDiveBottomTime } = input.repetitiveDive;

  if (!isPositiveFiniteNumber(secondDiveDepth) || !isPositiveFiniteNumber(secondDiveBottomTime)) {
    return emptyResidualNitrogenAnalysis(
      "invalid_second_dive_input",
      "La segunda inmersión necesita profundidad y tiempo de fondo positivos para consultar Tabla III.",
      input,
      surfaceInterval.resultingPressureGroup
    );
  }

  const lookup = findTableIIIEntry(surfaceInterval.resultingPressureGroup, secondDiveDepth, input.unitSystem);

  if (!lookup.effectiveDepth || !lookup.entry) {
    return emptyResidualNitrogenAnalysis(
      "unsupported_second_dive_depth",
      "La profundidad de la segunda inmersión queda fuera del rango de Tabla III para este prototipo.",
      input,
      surfaceInterval.resultingPressureGroup
    );
  }

  const totalEquivalentBottomTimeMinutes = lookup.entry.residualNitrogenMinutes + secondDiveBottomTime;

  if (lookup.entry.adjustedNoDecompressionLimitMinutes === null) {
    return {
      status: "entry_not_supported",
      table: "Tabla III",
      pressureGroupAfterSurfaceInterval: surfaceInterval.resultingPressureGroup,
      secondDiveInputDepth: secondDiveDepth,
      secondDiveInputBottomTime: secondDiveBottomTime,
      secondDiveEffectiveDepth: lookup.effectiveDepth,
      secondDiveDepthRounded: lookup.depthRounded,
      residualNitrogenMinutes: lookup.entry.residualNitrogenMinutes,
      adjustedNoDecompressionLimitMinutes: null,
      totalEquivalentBottomTimeMinutes,
      remainingAdjustedNoDecompressionTimeMinutes: null,
      matchedEntry: lookup.entry,
      datasetStatus: CMAS_FEDECAS_TABLE_III_STATUS,
      message:
        `Tabla III devuelve ${lookup.entry.residualNitrogenMinutes} min de nitrógeno residual para grupo ${surfaceInterval.resultingPressureGroup} a ${lookup.effectiveDepth.meters} m / ${lookup.effectiveDepth.feet} ft, pero la celda no muestra límite ajustado utilizable. El prototipo bloquea la segunda inmersión y exige revisión manual.`
    };
  }

  const remainingAdjustedNoDecompressionTimeMinutes = lookup.entry.adjustedNoDecompressionLimitMinutes - secondDiveBottomTime;

  return {
    status: "available",
    table: "Tabla III",
    pressureGroupAfterSurfaceInterval: surfaceInterval.resultingPressureGroup,
    secondDiveInputDepth: secondDiveDepth,
    secondDiveInputBottomTime: secondDiveBottomTime,
    secondDiveEffectiveDepth: lookup.effectiveDepth,
    secondDiveDepthRounded: lookup.depthRounded,
    residualNitrogenMinutes: lookup.entry.residualNitrogenMinutes,
    adjustedNoDecompressionLimitMinutes: lookup.entry.adjustedNoDecompressionLimitMinutes,
    totalEquivalentBottomTimeMinutes,
    remainingAdjustedNoDecompressionTimeMinutes,
    matchedEntry: lookup.entry,
    datasetStatus: CMAS_FEDECAS_TABLE_III_STATUS,
    message:
      `Tabla III: grupo ${surfaceInterval.resultingPressureGroup}, segunda profundidad efectiva ${lookup.effectiveDepth.meters} m / ${lookup.effectiveDepth.feet} ft. Nitrógeno residual: ${lookup.entry.residualNitrogenMinutes} min. Límite ajustado: ${lookup.entry.adjustedNoDecompressionLimitMinutes} min.`
  };
}

function buildRepetitiveAnalysis(
  input: RecreationalAirDiveInput,
  firstDiveStatus: RecreationalDiveStatus,
  finalPressureGroup: FinalPressureGroup
): RepetitiveDiveAnalysis {
  const surfaceInterval = findSurfaceIntervalAnalysis(input, finalPressureGroup);
  const residualNitrogen = analyzeResidualNitrogen(input, surfaceInterval);

  if (!input.repetitiveDive) {
    return {
      requested: false,
      status: finalPressureGroup.status === "available" ? "ready_for_repetitive_input" : "not_requested",
      surfaceInterval,
      residualNitrogen,
      message: surfaceInterval.message
    };
  }

  if (firstDiveStatus !== "within_table_limit") {
    return {
      requested: true,
      status: "blocked_by_first_dive",
      surfaceInterval,
      residualNitrogen,
      message: "El cálculo repetitivo queda bloqueado porque la primera inmersión no está dentro del límite tabular."
    };
  }

  if (surfaceInterval.status === "invalid_surface_interval") {
    return { requested: true, status: "invalid_repetitive_input", surfaceInterval, residualNitrogen, message: surfaceInterval.message };
  }

  if (surfaceInterval.status === "surface_interval_out_of_range") {
    return { requested: true, status: "surface_interval_out_of_range", surfaceInterval, residualNitrogen, message: surfaceInterval.message };
  }

  if (residualNitrogen.status === "invalid_second_dive_input") {
    return { requested: true, status: "invalid_repetitive_input", surfaceInterval, residualNitrogen, message: residualNitrogen.message };
  }

  if (residualNitrogen.status === "unsupported_second_dive_depth") {
    return { requested: true, status: "unsupported_second_dive_depth", surfaceInterval, residualNitrogen, message: residualNitrogen.message };
  }

  if (residualNitrogen.status === "entry_not_supported") {
    return { requested: true, status: "residual_table_entry_not_supported", surfaceInterval, residualNitrogen, message: residualNitrogen.message };
  }

  if (
    residualNitrogen.status === "available" &&
    residualNitrogen.remainingAdjustedNoDecompressionTimeMinutes !== null &&
    residualNitrogen.remainingAdjustedNoDecompressionTimeMinutes < 0
  ) {
    return {
      requested: true,
      status: "exceeds_adjusted_no_decompression_limit",
      surfaceInterval,
      residualNitrogen,
      message: `La segunda inmersión excede el límite ajustado por ${Math.abs(residualNitrogen.remainingAdjustedNoDecompressionTimeMinutes)} min.`
    };
  }

  if (residualNitrogen.status === "available") {
    return {
      requested: true,
      status: "calculated_within_adjusted_limit",
      surfaceInterval,
      residualNitrogen,
      message: "Buceo repetitivo calculado dentro del límite ajustado de Tabla III, sujeto a revisión manual."
    };
  }

  return { requested: true, status: "invalid_repetitive_input", surfaceInterval, residualNitrogen, message: "No se pudo completar el cálculo repetitivo." };
}

function appendRepetitiveSteps(
  steps: CalculationStep[],
  input: RecreationalAirDiveInput,
  analysis: RepetitiveDiveAnalysis
): void {
  if (!input.repetitiveDive) {
    steps.push(
      createStep(
        "surface-interval-004",
        "surfaceInterval",
        "Intervalo en superficie",
        analysis.surfaceInterval.message,
        {
          repetitiveRequested: false,
          previousDivePressureGroup: analysis.surfaceInterval.previousDivePressureGroup,
          surfaceIntervalMinutes: null,
          resultingPressureGroup: null
        }
      )
    );
    return;
  }

  steps.push(
    createStep(
      "surface-interval-004",
      "surfaceInterval",
      "Intervalo en superficie / Tabla II",
      analysis.surfaceInterval.message,
      {
        repetitiveRequested: true,
        previousDivePressureGroup: analysis.surfaceInterval.previousDivePressureGroup,
        surfaceIntervalMinutes: analysis.surfaceInterval.inputSurfaceIntervalMinutes,
        surfaceIntervalRangeStart: analysis.surfaceInterval.matchedRange?.minInclusiveMinutes ?? null,
        surfaceIntervalRangeEnd: analysis.surfaceInterval.matchedRange?.maxInclusiveMinutes ?? null,
        resultingPressureGroup: analysis.surfaceInterval.resultingPressureGroup
      }
    ),
    createStep(
      "residual-nitrogen-001",
      "residualNitrogen",
      "Nitrógeno residual / Tabla III",
      analysis.residualNitrogen.message,
      {
        pressureGroupAfterSurfaceInterval: analysis.residualNitrogen.pressureGroupAfterSurfaceInterval,
        secondDiveInputDepth: analysis.residualNitrogen.secondDiveInputDepth,
        secondDiveInputBottomTime: analysis.residualNitrogen.secondDiveInputBottomTime,
        secondDiveEffectiveDepthMeters: analysis.residualNitrogen.secondDiveEffectiveDepth?.meters ?? null,
        secondDiveEffectiveDepthFeet: analysis.residualNitrogen.secondDiveEffectiveDepth?.feet ?? null,
        secondDiveDepthRounded: analysis.residualNitrogen.secondDiveDepthRounded,
        residualNitrogenMinutes: analysis.residualNitrogen.residualNitrogenMinutes,
        adjustedNoDecompressionLimitMinutes: analysis.residualNitrogen.adjustedNoDecompressionLimitMinutes
      }
    )
  );

  if (analysis.residualNitrogen.status === "available") {
    steps.push(
      createStep(
        "repetitive-dive-001",
        "repetitiveDive",
        "Evaluación de segunda inmersión",
        `Tiempo equivalente total: ${analysis.residualNitrogen.residualNitrogenMinutes} min de nitrógeno residual + ${analysis.residualNitrogen.secondDiveInputBottomTime} min de segunda inmersión = ${analysis.residualNitrogen.totalEquivalentBottomTimeMinutes} min. Tiempo restante contra límite ajustado: ${analysis.residualNitrogen.remainingAdjustedNoDecompressionTimeMinutes} min.`,
        {
          residualNitrogenMinutes: analysis.residualNitrogen.residualNitrogenMinutes,
          secondDiveBottomTimeMinutes: analysis.residualNitrogen.secondDiveInputBottomTime,
          totalEquivalentBottomTimeMinutes: analysis.residualNitrogen.totalEquivalentBottomTimeMinutes,
          adjustedNoDecompressionLimitMinutes: analysis.residualNitrogen.adjustedNoDecompressionLimitMinutes,
          remainingAdjustedNoDecompressionTimeMinutes: analysis.residualNitrogen.remainingAdjustedNoDecompressionTimeMinutes
        }
      )
    );
  }
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
  repetitiveDiveAnalysis: RepetitiveDiveAnalysis;
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
    repetitiveDiveAnalysis: params.repetitiveDiveAnalysis,
    repetitiveDiveReadiness: buildRepetitiveDiveReadiness(params.repetitiveDiveAnalysis),
    rounding: params.rounding,
    conversions: params.conversions,
    warnings: params.warnings,
    calculationSteps: params.calculationSteps,
    sourceReference: CMAS_FEDECAS_TABLE_I_SOURCE,
    datasetVersion: COMBINED_DATASET_VERSION,
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
      `Profundidad primera inmersión: ${formatDepth(input.depth, depthUnit)}. Tiempo de fondo primera inmersión: ${formatMinutes(input.bottomTime)}. Gas: aire. Sistema: ${input.unitSystem === "metric" ? "métrico" : "imperial"}.${input.repetitiveDive ? ` Repetitiva solicitada: intervalo en superficie ${formatMinutes(input.repetitiveDive.surfaceIntervalMinutes)}, segunda profundidad ${formatDepth(input.repetitiveDive.secondDiveDepth, depthUnit)}, segundo tiempo ${formatMinutes(input.repetitiveDive.secondDiveBottomTime)}.` : " Repetitiva no solicitada."}`,
      {
        depth: input.depth,
        unitSystem: input.unitSystem,
        bottomTime: input.bottomTime,
        gas: input.gas,
        repetitiveRequested: Boolean(input.repetitiveDive),
        surfaceIntervalMinutes: input.repetitiveDive?.surfaceIntervalMinutes ?? null,
        secondDiveDepth: input.repetitiveDive?.secondDiveDepth ?? null,
        secondDiveBottomTime: input.repetitiveDive?.secondDiveBottomTime ?? null
      }
    ),
    createStep(
      "source-001",
      "source",
      "Fuente técnica seleccionada",
      `${CMAS_FEDECAS_TABLE_I_SOURCE.name}. Tabla I, Tabla II y Tabla III. Datasets: ${COMBINED_DATASET_VERSION}. Motor: ${RECREATIONAL_AIR_ENGINE_VERSION}.`
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
      createStep("validation-001", "validation", "Validación de entrada", "Los datos ingresados no permiten ejecutar el cálculo tabular."),
      createStep("pressure-group-001", "pressureGroup", "Grupo de presión final", "No aplica porque el cálculo quedó bloqueado por datos inválidos.")
    );

    const finalPressureGroup = notApplicablePressureGroup("No aplica por datos inválidos.");
    const repetitiveDiveAnalysis = buildRepetitiveAnalysis(input, "invalid_input", finalPressureGroup);
    appendRepetitiveSteps(steps, input, repetitiveDiveAnalysis);

    return buildBaseResult({
      input,
      status: "invalid_input",
      resultLabel: "Datos inválidos",
      normalizedInput: null,
      effectiveDepth: null,
      effectiveTime: null,
      limit: null,
      remainingTime: null,
      finalPressureGroup,
      repetitiveDiveAnalysis,
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
      conversionPerformed
        ? `Entrada imperial detectada. ${formatDepth(input.depth, "ft")} equivale aproximadamente a ${formatDepth(Number(normalizedInput.depthMeters.toFixed(1)), "m")}. El motor conserva la equivalencia métrico/imperial de la tabla para trazabilidad.`
        : `Entrada métrica detectada. ${formatDepth(input.depth, "m")} equivale aproximadamente a ${formatDepth(Number(normalizedInput.depthFeet.toFixed(1)), "ft")}. No se cambia la unidad ingresada para buscar columna métrica.`,
      {
        conversionPerformed,
        normalizedDepthMeters: Number(normalizedInput.depthMeters.toFixed(2)),
        normalizedDepthFeet: Number(normalizedInput.depthFeet.toFixed(2))
      }
    ),
    createStep(
      "validation-002",
      "validation",
      "Validación de alcance",
      `Máximo operativo cargado: ${CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH.meters} m / ${CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH.feet} ft.`,
      {
        maxOperationalDepthMeters: CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH.meters,
        maxOperationalDepthFeet: CMAS_FEDECAS_TABLE_I_MAX_OPERATIONAL_DEPTH.feet
      }
    )
  );

  if (isDepthAboveOperationalMaximum(input.depth, input.unitSystem)) {
    warnings.push({ level: "critical", message: "La profundidad ingresada excede el máximo operativo cubierto por Tabla I." });
    steps.push(
      createStep("lookup-001", "lookup", "Búsqueda de profundidad", "No se consulta Tabla I porque la profundidad supera el máximo operativo configurado."),
      createStep("pressure-group-002", "pressureGroup", "Grupo de presión final", "No se asigna grupo para un caso fuera de alcance.")
    );

    const finalPressureGroup = notApplicablePressureGroup("No aplica porque la profundidad excede el máximo operativo de la tabla.");
    const repetitiveDiveAnalysis = buildRepetitiveAnalysis(input, "unsupported_depth", finalPressureGroup);
    appendRepetitiveSteps(steps, input, repetitiveDiveAnalysis);

    return buildBaseResult({
      input,
      status: "unsupported_depth",
      resultLabel: "Profundidad fuera del alcance de la tabla",
      normalizedInput,
      effectiveDepth: null,
      effectiveTime: input.bottomTime,
      limit: null,
      remainingTime: null,
      finalPressureGroup,
      repetitiveDiveAnalysis,
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

  const effectiveRow = findEffectiveDepthRow(input.depth, input.unitSystem);

  if (!effectiveRow) {
    warnings.push({ level: "critical", message: "No se encontró una profundidad tabular igual o superior." });
    steps.push(
      createStep("lookup-001", "lookup", "Búsqueda de profundidad", "No se encontró una columna de profundidad aplicable. El cálculo queda bloqueado."),
      createStep("pressure-group-003", "pressureGroup", "Grupo de presión final", "No aplica porque no hubo profundidad tabular aplicable.")
    );

    const finalPressureGroup = notApplicablePressureGroup("No aplica porque no hubo profundidad tabular aplicable.");
    const repetitiveDiveAnalysis = buildRepetitiveAnalysis(input, "unsupported_depth", finalPressureGroup);
    appendRepetitiveSteps(steps, input, repetitiveDiveAnalysis);

    return buildBaseResult({
      input,
      status: "unsupported_depth",
      resultLabel: "Profundidad fuera del alcance de la tabla",
      normalizedInput,
      effectiveDepth: null,
      effectiveTime: input.bottomTime,
      limit: null,
      remainingTime: null,
      finalPressureGroup,
      repetitiveDiveAnalysis,
      rounding: { depthRounded: false, depthRule: "No hubo fila tabular aplicable.", timeRounded: false, timeRule: "El tiempo no se redondea." },
      conversions: { performed: conversionPerformed, depthOriginal: formatDepth(input.depth, depthUnit), depthNormalized: normalizedLabel },
      warnings,
      calculationSteps: steps
    });
  }

  const effectiveDepth: EffectiveDepth = { meters: effectiveRow.depthMeters, feet: effectiveRow.depthFeet, unitUsedForLookup: depthUnit };
  const depthRounded = input.unitSystem === "metric" ? effectiveRow.depthMeters !== input.depth : effectiveRow.depthFeet !== input.depth;
  const remainingTime = effectiveRow.noDecompressionLimitMinutes - input.bottomTime;
  const primaryStatus: RecreationalDiveStatus = remainingTime >= 0 ? "within_table_limit" : "exceeds_table_time_limit";
  const finalPressureGroup = remainingTime >= 0
    ? determineFinalPressureGroup(effectiveRow, input.bottomTime)
    : notApplicablePressureGroup("No se asigna grupo de presión final porque el tiempo excede el límite sin descompresión de la profundidad efectiva.");
  const repetitiveDiveAnalysis = buildRepetitiveAnalysis(input, primaryStatus, finalPressureGroup);

  steps.push(
    createStep(
      "rounding-001",
      "rounding",
      "Redondeo de profundidad",
      depthRounded
        ? `La profundidad ingresada no coincide exactamente con una columna. Regla aplicada: redondear siempre hacia arriba. Profundidad efectiva primera inmersión: ${effectiveRow.depthMeters} m / ${effectiveRow.depthFeet} ft.`
        : `La profundidad ingresada coincide con una columna de tabla. Profundidad efectiva primera inmersión: ${effectiveRow.depthMeters} m / ${effectiveRow.depthFeet} ft.`,
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
      `Se consulta Tabla I para obtener la letra de clasificación al final de la primera inmersión. Profundidad efectiva: ${effectiveRow.depthMeters} m / ${effectiveRow.depthFeet} ft. Tiempo evaluado: ${input.bottomTime} min. Decisión: ${finalPressureGroup.message}.`,
      {
        finalPressureGroupAvailable: finalPressureGroup.status === "available",
        finalPressureGroup: finalPressureGroup.group,
        effectiveDepthMeters: effectiveRow.depthMeters,
        effectiveDepthFeet: effectiveRow.depthFeet,
        bottomTimeMinutes: input.bottomTime,
        matchedRangeGroup: finalPressureGroup.matchedRange?.group ?? null,
        matchedRangeMinExclusiveMinutes: finalPressureGroup.matchedRange?.minExclusiveTimeMinutes ?? null,
        matchedRangeMaxInclusiveMinutes: finalPressureGroup.matchedRange?.maxInclusiveTimeMinutes ?? null
      }
    )
  );

  appendRepetitiveSteps(steps, input, repetitiveDiveAnalysis);

  steps.push(
    createStep(
      "comparison-001",
      "comparison",
      "Comparación de tiempo primera inmersión",
      `El tiempo ingresado se evalúa exacto, sin redondeo. Cálculo: ${effectiveRow.noDecompressionLimitMinutes} - ${input.bottomTime} = ${remainingTime} minutos.`,
      { limitMinutes: effectiveRow.noDecompressionLimitMinutes, bottomTimeMinutes: input.bottomTime, remainingTimeMinutes: remainingTime }
    )
  );

  if (remainingTime < 0) {
    warnings.push({ level: "critical", message: `El tiempo de fondo excede el límite tabular por ${Math.abs(remainingTime)} minutos.` });
  }

  if (input.repetitiveDive) {
    if (repetitiveDiveAnalysis.status === "calculated_within_adjusted_limit") {
      warnings.push({
        level: "warning",
        message: "Buceo repetitivo calculado como prototipo. Debe validarse manualmente contra Tabla II y Tabla III antes de cualquier uso real."
      });
    }

    if (repetitiveDiveAnalysis.status === "exceeds_adjusted_no_decompression_limit") {
      warnings.push({
        level: "critical",
        message: repetitiveDiveAnalysis.message
      });
    }

    if (
      repetitiveDiveAnalysis.status === "surface_interval_out_of_range" ||
      repetitiveDiveAnalysis.status === "unsupported_second_dive_depth" ||
      repetitiveDiveAnalysis.status === "residual_table_entry_not_supported" ||
      repetitiveDiveAnalysis.status === "invalid_repetitive_input"
    ) {
      warnings.push({
        level: "critical",
        message: repetitiveDiveAnalysis.message
      });
    }
  }

  steps.push(
    createStep(
      "result-001",
      "result",
      "Resultado final",
      remainingTime < 0
        ? "El tiempo de fondo de la primera inmersión supera el límite de la profundidad efectiva. El resultado no debe presentarse como planificación válida."
        : input.repetitiveDive
          ? `Primera inmersión dentro del límite de Tabla I. Estado repetitivo: ${repetitiveDiveAnalysis.message}`
          : "La primera inmersión queda dentro del límite tabular, sujeta a revisión manual. Para repetitivas, ingresar intervalo en superficie y segunda inmersión."
    )
  );

  return buildBaseResult({
    input,
    status: primaryStatus,
    resultLabel: remainingTime >= 0 ? "Dentro del límite tabular" : "Excede el límite tabular",
    normalizedInput,
    effectiveDepth,
    effectiveTime: input.bottomTime,
    limit: effectiveRow.noDecompressionLimitMinutes,
    remainingTime,
    finalPressureGroup,
    repetitiveDiveAnalysis,
    rounding: {
      depthRounded,
      depthRule: "La profundidad se redondea siempre hacia arriba a la siguiente columna disponible.",
      timeRounded: false,
      timeRule: "El tiempo de fondo se evalúa exacto contra el límite; no se redondea."
    },
    conversions: { performed: conversionPerformed, depthOriginal: formatDepth(input.depth, depthUnit), depthNormalized: normalizedLabel },
    warnings,
    calculationSteps: steps
  });
}
