import type { RecreationalAirDiveResult } from "../../../domain/dive-planner-core/recreational/air/recreationalAirTypes";
import { NoticeBox } from "../../components/NoticeBox";
import { PrimaryActionBar } from "../../components/PrimaryActionBar";
import { StepHeader } from "../../components/StepHeader";
import { SummaryCard } from "../../components/SummaryCard";

type Props = {
  result: RecreationalAirDiveResult;
  onBack: () => void;
  onDetail: () => void;
  onValidate: () => void;
  onNewPlan: () => void;
};

function getTone(status: RecreationalAirDiveResult["status"]): "success" | "warning" | "critical" {
  return status === "within_table_limit" ? "success" : status === "requires_manual_review" ? "warning" : "critical";
}

function formatValue(value: number | null, suffix: string): string {
  return value === null ? "No aplica" : `${value} ${suffix}`;
}

function formatInterval(minutes: number | null): string {
  if (minutes === null) return "No aplica";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours} h ${mins.toString().padStart(2, "0")} min` : `${mins} min`;
}

function getPressureGroupValue(result: RecreationalAirDiveResult): string {
  if (result.finalPressureGroup.status === "available" && result.finalPressureGroup.group) return result.finalPressureGroup.group;
  if (result.finalPressureGroup.status === "pending_dataset") return "Pendiente";
  return "No aplica";
}

function getPressureGroupDetail(result: RecreationalAirDiveResult): string {
  if (result.finalPressureGroup.status === "available") return "Asignado por Tabla I";
  if (result.finalPressureGroup.status === "pending_dataset") return "Estructura preparada para repetitivas";
  return "Sin cálculo de grupo";
}

function getRepetitiveStatusLabel(result: RecreationalAirDiveResult): string {
  switch (result.repetitiveDiveAnalysis.status) {
    case "not_requested":
    case "ready_for_repetitive_input":
      return result.repetitiveDiveAnalysis.requested ? "Pendiente" : "No solicitado";
    case "calculated_within_adjusted_limit":
      return "Dentro del límite ajustado";
    case "exceeds_adjusted_no_decompression_limit":
      return "Excede límite ajustado";
    case "surface_interval_out_of_range":
      return "Intervalo fuera de tabla";
    case "unsupported_second_dive_depth":
      return "Segunda profundidad no soportada";
    case "residual_table_entry_not_supported":
      return "Celda no soportada";
    case "blocked_by_first_dive":
      return "Bloqueado por primera inmersión";
    case "invalid_repetitive_input":
      return "Datos repetitivos inválidos";
    default:
      return "Requiere revisión";
  }
}

export function RecreationalResultScreen({ result, onBack, onDetail, onValidate, onNewPlan }: Props) {
  const inputDepthUnit = result.input.unitSystem === "metric" ? "m" : "ft";
  const residual = result.repetitiveDiveAnalysis.residualNitrogen;
  const surface = result.repetitiveDiveAnalysis.surfaceInterval;
  const isRepetitive = result.repetitiveDiveAnalysis.requested;

  return (
    <section className="screen">
      <StepHeader
        title="Resultado recreativo"
        subtitle="Resumen simple. El procedimiento completo está en Detalle del cálculo."
        currentStep={2}
        totalSteps={4}
        onBack={onBack}
      />

      <NoticeBox
        tone={getTone(result.status)}
        title={result.resultLabel}
        message="Resultado generado para revisión manual. No reemplaza formación, tablas oficiales, ordenador de buceo ni criterio profesional."
      />

      <div className="summary-grid">
        <SummaryCard title="Tipo de plan" value={isRepetitive ? "Repetitivo" : "Simple"} />
        <SummaryCard title="Profundidad 1" value={`${result.input.depth} ${inputDepthUnit}`} />
        <SummaryCard title="Tiempo fondo 1" value={`${result.input.bottomTime} min`} />
        <SummaryCard title="Gas" value="Aire" />
        <SummaryCard
          title="Profundidad efectiva 1"
          value={result.effectiveDepth ? `${result.effectiveDepth.meters} m / ${result.effectiveDepth.feet} ft` : "No aplica"}
          detail={result.rounding.depthRounded ? "Redondeada hacia arriba" : "Sin redondeo de profundidad"}
        />
        <SummaryCard title="Límite Tabla I" value={formatValue(result.limit, "min")} />
        <SummaryCard
          title="Tiempo restante 1"
          value={formatValue(result.remainingTime, "min")}
          detail={result.remainingTime !== null && result.remainingTime < 0 ? "Excede el límite" : undefined}
        />
        <SummaryCard title="Grupo presión final" value={getPressureGroupValue(result)} detail={getPressureGroupDetail(result)} />
      </div>

      {isRepetitive && (
        <div className="content-card repetitive-result-card">
          <h2>Buceo repetitivo</h2>
          <div className="summary-grid">
            <SummaryCard title="Intervalo superficie" value={formatInterval(surface.inputSurfaceIntervalMinutes)} detail="Tiempo fuera del agua" />
            <SummaryCard title="Nuevo grupo" value={surface.resultingPressureGroup ?? "No aplica"} detail="Calculado por Tabla II" />
            <SummaryCard
              title="Profundidad efectiva 2"
              value={residual.secondDiveEffectiveDepth ? `${residual.secondDiveEffectiveDepth.meters} m / ${residual.secondDiveEffectiveDepth.feet} ft` : "No aplica"}
              detail={residual.secondDiveDepthRounded ? "Redondeada hacia arriba" : "Según profundidad ingresada"}
            />
            <SummaryCard title="Tiempo fondo 2" value={formatValue(residual.secondDiveInputBottomTime, "min")} />
            <SummaryCard
              title="Nitrógeno residual"
              value={formatValue(residual.residualNitrogenMinutes, "min")}
              detail="Tiempo equivalente según Tabla III; no medición directa en sangre"
            />
            <SummaryCard title="Límite ajustado" value={formatValue(residual.adjustedNoDecompressionLimitMinutes, "min")} />
            <SummaryCard title="Tiempo equivalente total" value={formatValue(residual.totalEquivalentBottomTimeMinutes, "min")} />
            <SummaryCard
              title="Estado repetitiva"
              value={getRepetitiveStatusLabel(result)}
              detail={result.repetitiveDiveAnalysis.message}
            />
          </div>
        </div>
      )}

      {result.warnings.length > 0 && (
        <div className="content-card">
          <h2>Advertencias</h2>
          <ul className="clean-list">
            {result.warnings.map((warning) => (
              <li key={warning.message}>• {warning.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="dual-actions">
        <button className="secondary-button" type="button" onClick={onDetail}>Ver Detalle del cálculo</button>
        <button className="secondary-button" type="button" onClick={onValidate}>Validación manual</button>
      </div>

      <PrimaryActionBar secondaryLabel="Editar datos" primaryLabel="Nuevo plan" onSecondary={onBack} onPrimary={onNewPlan} />
    </section>
  );
}
