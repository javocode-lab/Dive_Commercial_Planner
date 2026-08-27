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

function getPressureGroupValue(result: RecreationalAirDiveResult): string {
  if (result.finalPressureGroup.status === "available" && result.finalPressureGroup.group) {
    return result.finalPressureGroup.group;
  }

  if (result.finalPressureGroup.status === "pending_dataset") {
    return "Pendiente";
  }

  return "No aplica";
}

function getPressureGroupDetail(result: RecreationalAirDiveResult): string {
  if (result.finalPressureGroup.status === "pending_dataset") {
    return "Estructura preparada para repetitivas";
  }

  if (result.finalPressureGroup.status === "available") {
    return "Asignado por Tabla I";
  }

  return "Sin cálculo de grupo";
}

export function RecreationalResultScreen({ result, onBack, onDetail, onValidate, onNewPlan }: Props) {
  const inputDepthUnit = result.input.unitSystem === "metric" ? "m" : "ft";

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
        <SummaryCard title="Profundidad planificada" value={`${result.input.depth} ${inputDepthUnit}`} />
        <SummaryCard title="Tiempo de fondo" value={`${result.input.bottomTime} min`} />
        <SummaryCard title="Gas" value="Aire" />
        <SummaryCard
          title="Profundidad efectiva"
          value={result.effectiveDepth ? `${result.effectiveDepth.meters} m / ${result.effectiveDepth.feet} ft` : "No aplica"}
          detail={result.rounding.depthRounded ? "Redondeada hacia arriba" : "Sin redondeo de profundidad"}
        />
        <SummaryCard title="Límite Tabla I" value={formatValue(result.limit, "min")} />
        <SummaryCard
          title="Tiempo restante"
          value={formatValue(result.remainingTime, "min")}
          detail={result.remainingTime !== null && result.remainingTime < 0 ? "Excede el límite" : undefined}
        />
        <SummaryCard
          title="Grupo de presión final"
          value={getPressureGroupValue(result)}
          detail={getPressureGroupDetail(result)}
        />
      </div>

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
