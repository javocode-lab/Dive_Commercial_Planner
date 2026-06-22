import type { CalculationResult } from "../../domain/types";
import { formatMeters, formatMinutes } from "../../domain/units";
import { AppButton } from "../components/AppButton";
import { InfoBox } from "../components/InfoBox";

interface ResultScreenProps {
  result: CalculationResult;
  onNewPlan: () => void;
  onBackToForm: () => void;
  onOpenHistory: () => void;
}

export function ResultScreen({
  result,
  onNewPlan,
  onBackToForm,
  onOpenHistory
}: ResultScreenProps) {
  return (
    <section className="screen">
      <h1>Resultado</h1>

      <InfoBox
        tone={result.status === "blocked" ? "critical" : "warning"}
        title={`Estado: ${result.status}`}
        message="Resultado técnico preliminar. No usar para buceo real."
      />

      <div className="card">
        <p>Tabla: {result.tableLabel}</p>
        <p>
          Profundidad seleccionada:{" "}
          {result.matchedDepthMeters === null
            ? "Sin coincidencia"
            : formatMeters(result.matchedDepthMeters)}
        </p>
        <p>
          Límite de referencia mock:{" "}
          {result.referenceLimitMinutes === null
            ? "No calculado"
            : formatMinutes(result.referenceLimitMinutes)}
        </p>
        <p>
          Tiempo planificado:{" "}
          {result.plannedBottomTimeMinutes === null
            ? "No calculado"
            : formatMinutes(result.plannedBottomTimeMinutes)}
        </p>
        <p>
          Margen preliminar:{" "}
          {result.remainingMarginMinutes === null
            ? "No calculado"
            : formatMinutes(result.remainingMarginMinutes)}
        </p>
      </div>

      <h2>Alertas</h2>
      {result.alerts.map((alert, index) => (
        <InfoBox
          key={`${alert.level}_${index}`}
          tone={
            alert.level === "critical"
              ? "critical"
              : alert.level === "warning"
                ? "warning"
                : "info"
          }
          message={alert.message}
        />
      ))}

      <h2>Procedimiento trazable</h2>
      {result.steps.map((step, index) => (
        <div key={`${step.title}_${index}`} className="step">
          <strong>
            {index + 1}. {step.title}
          </strong>
          <p>{step.detail}</p>
        </div>
      ))}

      <div className="actions">
        <AppButton label="Nuevo plan" onClick={onNewPlan} />
        <AppButton label="Editar plan" variant="secondary" onClick={onBackToForm} />
        <AppButton label="Ver historial" variant="secondary" onClick={onOpenHistory} />
      </div>
    </section>
  );
}
