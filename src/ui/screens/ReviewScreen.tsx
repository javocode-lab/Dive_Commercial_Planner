import { MESSAGES } from "../../config/messages";
import type { DivePlanInput, ValidationIssue } from "../../domain/types";
import { formatMeters, formatMinutes } from "../../domain/units";
import { AppButton } from "../components/AppButton";
import { InfoBox } from "../components/InfoBox";

interface ReviewScreenProps {
  validation: {
    input: DivePlanInput | null;
    issues: ValidationIssue[];
  };
  onBack: () => void;
  onCalculate: () => void;
}

export function ReviewScreen({
  validation,
  onBack,
  onCalculate
}: ReviewScreenProps) {
  const hasErrors = validation.issues.some(
    (issue) => issue.severity === "error"
  );

  return (
    <section className="screen">
      <h1>Revisión</h1>

      {validation.input ? (
        <div className="card">
          <p>Escenario: {validation.input.scenario}</p>
          <p>Profundidad: {formatMeters(validation.input.depthMeters)}</p>
          <p>
            Tiempo de fondo: {formatMinutes(validation.input.plannedBottomTimeMinutes)}
          </p>
          <p>
            Altitud:{" "}
            {validation.input.altitudeMeters === null
              ? "No aplica"
              : formatMeters(validation.input.altitudeMeters)}
          </p>
          <p>Gas: {validation.input.gas}</p>
        </div>
      ) : (
        <InfoBox
          tone="critical"
          title="Plan incompleto"
          message={MESSAGES.reviewBlocked}
        />
      )}

      {validation.issues.map((issue, index) => (
        <InfoBox
          key={`${issue.field}_${index}`}
          tone={issue.severity === "error" ? "critical" : "warning"}
          message={issue.message}
        />
      ))}

      <div className="actions">
        <AppButton label="Volver y corregir" variant="secondary" onClick={onBack} />
        <AppButton label="Calcular" disabled={hasErrors} onClick={onCalculate} />
      </div>
    </section>
  );
}
